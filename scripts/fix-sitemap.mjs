/**
 * Sitemap 后处理：@astrojs/sitemap 在构建期无法感知运行时才确定的 noindex
 * 状态（如标签页数量阈值），因此在构建后基于实际产出的 HTML 做二次过滤：
 *
 * 1. 移除所有带 <meta name="robots" content="noindex"> 的页面
 * 2. 为文章类页面注入 <lastmod>，取值为页面 <meta property="article:modified_time">
 *    （与页面可见的“最近更新”时间同一数据源，保证 Sitemap 与正文一致）
 *
 * 用法：astro build 之后、pagefind 索引之前运行。
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const SITEMAP = path.join(DIST, 'sitemap-0.xml');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind') continue;
      out.push(...(await walk(full)));
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const pageUrl = (file) => {
  let rel = path.relative(DIST, file).replaceAll('\\', '/');
  if (rel.endsWith('index.html')) rel = rel.slice(0, -'index.html'.length);
  else if (rel.endsWith('.html')) rel = rel.slice(0, -'.html'.length) + '/';
  return `https://gsycloud.com/${rel}`;
};

if (!existsSync(SITEMAP)) {
  console.error('sitemap-0.xml 不存在，请确认已启用 @astrojs/sitemap 并先运行 astro build');
  process.exit(1);
}

const files = await walk(DIST);
const noindexUrls = new Set();
const lastmodByUrl = new Map();

for (const file of files) {
  const html = await readFile(file, 'utf-8');
  const url = pageUrl(file);
  if (/<meta name="robots" content="noindex/.test(html)) {
    noindexUrls.add(url);
    continue;
  }
  const modMatch = html.match(/<meta property="article:modified_time" content="([^"]+)"/);
  if (modMatch) lastmodByUrl.set(url, modMatch[1]);
}

let sitemap = await readFile(SITEMAP, 'utf-8');
let removed = 0;
let stamped = 0;

sitemap = sitemap.replace(/<url>(?:(?!<\/url>).)*?<\/url>/gs, (block) => {
  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  const loc = locMatch?.[1];
  if (!loc) return block;
  if (noindexUrls.has(loc)) {
    removed += 1;
    return '';
  }
  const lastmod = lastmodByUrl.get(loc);
  if (lastmod && !block.includes('<lastmod>')) {
    stamped += 1;
    return block.replace('</loc>', `</loc><lastmod>${lastmod}</lastmod>`);
  }
  return block;
});

await writeFile(SITEMAP, sitemap, 'utf-8');
console.log(`Sitemap 后处理完成：移除 ${removed} 个 noindex 页面，补充 ${stamped} 个 lastmod`);
