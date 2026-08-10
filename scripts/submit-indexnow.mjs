/**
 * 手动触发 IndexNow 提交（Bing / Yandex 等支持该协议的搜索引擎）。
 *
 * 不在 `pnpm build` 中自动执行：IndexNow 提交的是"线上可访问的 URL"，
 * 只有在网站已经部署到生产域名后运行才有意义；构建阶段网站还没上线，
 * 提交了也无法被抓取验证。
 *
 * 用法（部署完成后）：
 *   pnpm build
 *   pnpm submit:indexnow
 *
 * 仅使用 Node 内置 fetch，不引入新依赖。
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const SITEMAP = path.join(DIST, 'sitemap-0.xml');
const SITE_HOST = 'gsycloud.com';
const INDEXNOW_KEY = 'a84ce29f9e457bf845eb5133f76df4d3';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

if (!existsSync(SITEMAP)) {
  console.error('dist/sitemap-0.xml 不存在，请先运行 pnpm build');
  process.exit(1);
}

const xml = await readFile(SITEMAP, 'utf-8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.error('sitemap 中没有找到任何 URL，终止提交');
  process.exit(1);
}

console.log(`准备向 IndexNow 提交 ${urlList.length} 个 URL（host: ${SITE_HOST}）`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

if (res.ok) {
  console.log(`✓ IndexNow 提交成功（HTTP ${res.status}）`);
} else {
  console.error(`✗ IndexNow 提交失败（HTTP ${res.status}）：${await res.text()}`);
  process.exit(1);
}
