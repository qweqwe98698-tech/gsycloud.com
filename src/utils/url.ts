import { SITE } from './site';

/** 规范化路径：保证以 / 开头、以 / 结尾（与 trailingSlash: 'always' 一致） */
export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  let p = path.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  // 文件类路径（.xml、.txt 等）不加尾部斜杠
  if (/\.[a-z0-9]+$/i.test(p)) return p;
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

/** 生成绝对 canonical URL */
export function canonicalUrl(path: string): string {
  return new URL(normalizePath(path), SITE.url).href;
}

/** 内容条目 URL：collection 名即 URL 前缀 */
export function postUrl(collection: string, id: string): string {
  return normalizePath(`/${collection}/${id}`);
}

/** relatedSlugs 形如 "network/what-is-iplc" → URL */
export function relatedUrl(related: string): string {
  return normalizePath(`/${related}`);
}

/** slug 化：小写、连字符、去除非法字符（用于 tag 等） */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Script=Han}a-z0-9-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
