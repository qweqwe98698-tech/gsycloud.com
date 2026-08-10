/**
 * SEO / GEO 程序化审计：扫描 dist/ 下全部 HTML。
 *
 * 检查范围：
 * - Title / Description / Canonical 唯一性与合法性
 * - H1 数量、标题重复、lang 属性、viewport
 * - JSON-LD 语法合法性 + 按类型的必填字段
 * - 图片 alt、width/height（CLS 风险）
 * - 推广链接合规（rel="sponsored"、noopener、披露块）
 * - noindex 清单 + 误配置检测（正常内容页被意外 noindex）
 * - 孤立页面 + 首页点击深度（BFS）
 * - 开发环境残留（localhost / example.com / TODO 等）
 *
 * 用法：pnpm audit:seo（需先 pnpm build）
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const SITE_DOMAIN = 'https://gsycloud.com';

/** 允许 noindex 的页面模式（其余页面若被 noindex 判定为误配置） */
const EXPECTED_NOINDEX = [
  /^\/404\/$/,
  /^\/search\/$/,
  /^\/tags\/$/,
  /^\/tags\/[^/]+\/$/, // 具体标签页是否应 noindex 由内容量决定，这里放行、不重复校验阈值逻辑
];

/** JSON-LD 类型 → 必填字段（缺失即视为结构化数据与页面内容不完整） */
const REQUIRED_FIELDS_BY_TYPE = {
  Organization: ['name', 'url', 'logo'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  BlogPosting: ['headline', 'datePublished', 'dateModified', 'author', 'mainEntityOfPage'],
  FAQPage: ['mainEntity'],
  CollectionPage: ['name', 'url'],
  Person: ['name', 'url'],
  AboutPage: ['name', 'url'],
  ContactPage: ['name', 'url'],
};

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

if (!existsSync(DIST)) {
  console.error('dist/ 不存在，请先运行 pnpm build');
  process.exit(1);
}

const files = await walk(DIST);
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const h1Texts = new Map();
const noindexPages = new Set();
const inboundLinks = new Map();
/** page → Set(outbound internal page hrefs)，供点击深度 BFS 使用 */
const outboundLinks = new Map();

const pageUrl = (file) => {
  let rel = path.relative(DIST, file).replaceAll('\\', '/');
  if (rel.endsWith('index.html')) rel = rel.slice(0, -'index.html'.length);
  else if (rel.endsWith('.html')) rel = rel.slice(0, -'.html'.length) + '/';
  return `/${rel}`;
};

for (const file of files) {
  const html = await readFile(file, 'utf-8');
  const page = pageUrl(file);

  // Title
  const titleMatches = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
  if (titleMatches.length !== 1) errors.push(`${page}: title 数量 ${titleMatches.length}`);
  const title = titleMatches[0]?.[1]?.trim() ?? '';
  if (!title) errors.push(`${page}: title 为空`);
  else {
    if (title.length > 70) warnings.push(`${page}: title 过长（${title.length} 字符）: ${title}`);
    if (titles.has(title)) errors.push(`${page}: title 与 ${titles.get(title)} 重复`);
    titles.set(title, page);
  }

  // Description
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (!descMatch || !descMatch[1]?.trim()) errors.push(`${page}: 缺少 meta description`);
  else {
    const desc = descMatch[1].trim();
    if (descriptions.has(desc)) errors.push(`${page}: description 与 ${descriptions.get(desc)} 重复`);
    descriptions.set(desc, page);
  }

  // Canonical
  const canonicalMatches = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
  if (canonicalMatches.length !== 1) {
    errors.push(`${page}: canonical 数量 ${canonicalMatches.length}`);
  } else {
    const canonical = canonicalMatches[0][1];
    if (!canonical.startsWith(`${SITE_DOMAIN}/`))
      errors.push(`${page}: canonical 非绝对 URL 或域名错误: ${canonical}`);
    if (canonicals.has(canonical) && canonicals.get(canonical) !== page)
      errors.push(`${page}: canonical 与 ${canonicals.get(canonical)} 重复: ${canonical}`);
    canonicals.set(canonical, page);
  }

  // H1（排除 SVG 内部误报——按标签直接计数）
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) errors.push(`${page}: h1 数量 ${h1Count}`);
  else {
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1Match) {
      const h1Text = h1Match[1].replace(/<[^>]+>/g, '').trim();
      if (h1Text && h1Texts.has(h1Text) && h1Texts.get(h1Text) !== page) {
        warnings.push(`${page}: H1 文本与 ${h1Texts.get(h1Text)} 完全相同: "${h1Text}"`);
      }
      h1Texts.set(h1Text, page);
    }
  }

  // lang / viewport（移动端与国际化基础项）
  if (!/<html lang="zh-CN"/.test(html)) errors.push(`${page}: 缺少 lang="zh-CN"`);
  if (!/<meta name="viewport" content="width=device-width/.test(html))
    errors.push(`${page}: 缺少响应式 viewport meta`);

  // Open Graph 绝对地址（social 分享卡片要求绝对 URL）
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
  if (!ogImageMatch) errors.push(`${page}: 缺少 og:image`);
  else if (!ogImageMatch[1].startsWith('http'))
    errors.push(`${page}: og:image 不是绝对 URL: ${ogImageMatch[1]}`);
  if (!html.includes('<meta property="og:title"')) errors.push(`${page}: 缺少 og:title`);
  if (!html.includes('<meta name="twitter:card"')) errors.push(`${page}: 缺少 twitter:card`);

  // JSON-LD 合法性 + 按类型必填字段
  for (const ld of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(ld[1]);
    } catch {
      errors.push(`${page}: JSON-LD 解析失败`);
      continue;
    }
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const node of nodes) {
      const type = node['@type'];
      const required = REQUIRED_FIELDS_BY_TYPE[type];
      if (!required) continue;
      for (const field of required) {
        if (node[field] === undefined || node[field] === null || node[field] === '') {
          errors.push(`${page}: JSON-LD ${type} 缺少必填字段 "${field}"`);
        }
      }
      // 禁止出现虚假评分类结构化数据
      if (type === 'AggregateRating' || type === 'Review') {
        errors.push(`${page}: 出现未经核实的 ${type} 结构化数据，禁止虚构评分`);
      }
    }
  }

  // 图片 alt 与尺寸（缺尺寸是 CLS 的常见来源）
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(img[0])) errors.push(`${page}: img 缺少 alt`);
    if (!/\bwidth=/.test(img[0]) || !/\bheight=/.test(img[0])) {
      warnings.push(`${page}: img 缺少明确的 width/height（可能引起布局偏移）`);
    }
  }

  // 开发环境残留 / 占位内容（walk() 只收集 .html 页面，第三方 JS bundle 不在扫描范围内）
  if (/\blocalhost\b|\b127\.0\.0\.1\b|\bexample\.com\b/.test(html)) {
    errors.push(`${page}: 页面中出现 localhost / 127.0.0.1 / example.com 等开发环境地址`);
  }
  if (/(^|[^a-zA-Z])TODO([^a-zA-Z]|$)/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) {
    warnings.push(`${page}: 正文中可能残留 TODO 标记，请人工确认`);
  }

  // 推广链接合规：外部推广链接必须带 rel="sponsored"，且所在页面必须有披露块
  const affiliateLinks = [...html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"[^>]*>/g)].filter(
    (m) => /data-cta-brand=/.test(m[0]),
  );
  if (affiliateLinks.length > 0) {
    for (const link of affiliateLinks) {
      if (!/rel="[^"]*sponsored/.test(link[0])) {
        errors.push(`${page}: 推广链接缺少 rel="sponsored" → ${link[1]}`);
      }
      if (!/rel="[^"]*noopener/.test(link[0])) {
        errors.push(`${page}: 外部链接缺少 rel="noopener" → ${link[1]}`);
      }
      if (!/target="_blank"/.test(link[0])) {
        warnings.push(`${page}: 推广链接未使用 target="_blank" → ${link[1]}`);
      }
    }
    if (!html.includes('推广关系')) {
      errors.push(`${page}: 含 ${affiliateLinks.length} 个推广链接但缺少推广关系披露`);
    }
  }

  // noindex 清单 + 误配置检测
  if (/<meta name="robots" content="noindex/.test(html)) {
    noindexPages.add(page);
    const isExpected = EXPECTED_NOINDEX.some((re) => re.test(page));
    if (!isExpected) {
      errors.push(`${page}: 正常内容页面被设置为 noindex，请确认是否为误配置`);
    }
  }

  // 内链图（供孤立页面 + 点击深度检测复用）
  const outSet = outboundLinks.get(page) ?? new Set();
  for (const link of html.matchAll(/href=("|')(\/[^"']*)\1/g)) {
    const href = link[2].split('#')[0].split('?')[0];
    if (!href || href.match(/\.[a-z0-9]+$/i)) continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (normalized === page) continue;
    inboundLinks.set(normalized, (inboundLinks.get(normalized) ?? 0) + 1);
    outSet.add(normalized);
  }
  outboundLinks.set(page, outSet);
}

// 孤立页面：无任何入链的可索引页面
for (const file of files) {
  const page = pageUrl(file);
  if (page === '/404/' || page.startsWith('/tags/')) continue;
  if (noindexPages.has(page)) continue;
  if (!inboundLinks.has(page)) warnings.push(`孤立页面（无入链）: ${page}`);
}

// 首页点击深度 BFS：重要内容建议 ≤3 次点击可达
const depth = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length > 0) {
  const current = queue.shift();
  const currentDepth = depth.get(current);
  for (const next of outboundLinks.get(current) ?? []) {
    if (depth.has(next)) continue;
    depth.set(next, currentDepth + 1);
    queue.push(next);
  }
}
const deepPages = [];
for (const file of files) {
  const page = pageUrl(file);
  if (noindexPages.has(page) || page === '/404/') continue;
  const d = depth.get(page);
  if (d === undefined) continue; // 已计入孤立页面警告，不重复报告
  if (d > 3) deepPages.push([page, d]);
}
if (deepPages.length > 0) {
  warnings.push(
    `${deepPages.length} 个页面点击深度超过 3 层（前 10 个）: ` +
      deepPages
        .slice(0, 10)
        .map(([p, d]) => `${p}(${d})`)
        .join('、'),
  );
}

console.log(`已审计 ${files.length} 个页面`);
console.log(`noindex 页面（请确认均为有意设置）:`);
for (const p of [...noindexPages].sort()) console.log(`  · ${p}`);

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} 个警告：`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}
if (errors.length > 0) {
  console.error(`\n${errors.length} 个错误：`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n✓ SEO 审计通过');
