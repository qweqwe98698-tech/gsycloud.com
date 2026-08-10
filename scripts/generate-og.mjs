/**
 * 生成默认 OG 分享图（1200×630 PNG）。
 * 用法：node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect width="1200" height="8" fill="#2563eb"/>
  <g transform="translate(80,150) scale(5)">
    <path d="M23.5 13.6a7.5 7.5 0 0 0-14.6-1.9A6 6 0 0 0 10 23.5h13a5 5 0 0 0 .5-9.9Z" fill="#2563eb"/>
    <path d="M13 17.5l3.5-5 1 3.5h3l-3.5 5-1-3.5h-3Z" fill="#fff"/>
  </g>
  <text x="80" y="360" font-family="Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" font-size="72" font-weight="700" fill="#0f172a">GSY <tspan fill="#2563eb">光速云</tspan></text>
  <text x="80" y="440" font-family="Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" font-size="40" fill="#334155">机场评测、线路选择与网络工具指南</text>
  <text x="80" y="520" font-family="Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" font-size="28" fill="#64748b">gsycloud.com</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og-default.png', import.meta.url), png);
console.log('generated public/og-default.png');
