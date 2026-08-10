/**
 * 站内死链检查：扫描 dist/ 下全部 HTML 的内部链接，验证目标文件存在。
 * 同时检查 href="" 与 href="#" 空链接。
 * 用法：pnpm check:links（需先 pnpm build）
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');

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

function targetExists(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return true;
  const rel = clean.replace(/^\//, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel.replace(/\/$/, '')}.html`),
  ];
  return candidates.some((c) => existsSync(c));
}

if (!existsSync(DIST)) {
  console.error('dist/ 不存在，请先运行 pnpm build');
  process.exit(1);
}

const files = await walk(DIST);
const errors = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf-8');
  const page = path.relative(DIST, file).replaceAll('\\', '/');
  for (const match of html.matchAll(/(?:href|src)=("|')([^"']*)\1/g)) {
    const href = match[2];
    if (href === '' || href === '#') {
      errors.push(`${page}: 空链接 (${match[0]})`);
      continue;
    }
    if (
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('#') ||
      href.startsWith('data:')
    )
      continue;
    checked += 1;
    if (!targetExists(href)) {
      errors.push(`${page}: 死链 ${href}`);
    }
  }
}

console.log(`已扫描 ${files.length} 个页面，检查 ${checked} 个内部链接`);
if (errors.length > 0) {
  console.error(`\n发现 ${errors.length} 个问题：`);
  for (const err of errors) console.error(`  ✗ ${err}`);
  process.exit(1);
}
console.log('✓ 未发现死链或空链接');
