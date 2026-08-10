/**
 * 将品牌测速图导入 src/assets/airports/（语义化英文文件名 + 压缩）。
 * 源目录通过 --src 传入，默认读取解压后的临时目录。
 * 用法：node scripts/import-speedtest-images.mjs --src "<解压目录>"
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SLUG_BY_BRAND = {
  光速云: 'gsycloud',
  飞猫云: 'flycat',
  灵猫网络: 'civetnet',
  星岛梦: 'xingdaomeng',
  唯兔云: 'weituyun',
  速界: 'sujie',
  可信云: 'kexinyun',
  SOGO云: 'sogoyun',
  二猫云: 'ermaoyun',
  一翻云: 'yifanyun',
  光年梯: 'guangnianti',
  极连云: 'jilianyun',
  宇宙云: 'yuzoucloud',
  快狸: 'kuaili',
  全球云: 'quanqiuyun',
  U1S1: 'u1s1',
};

const srcIndex = process.argv.indexOf('--src');
const SRC = srcIndex > -1 ? process.argv[srcIndex + 1] : null;
if (!SRC) {
  console.error('请通过 --src 指定测速图源目录');
  process.exit(1);
}

const OUT = path.resolve(process.cwd(), 'src/assets/airports');
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let done = 0;

for (const file of files) {
  const brand = file.replace(/-节点测速实测\.(jpe?g|png)$/i, '');
  const slug = SLUG_BY_BRAND[brand];
  if (!slug) {
    console.warn(`跳过未映射的文件: ${file}`);
    continue;
  }
  const target = path.join(OUT, `${slug}-speedtest.jpg`);
  const image = sharp(path.join(SRC, file));
  const meta = await image.metadata();
  // 长截图：限制宽度到 900px，保持可读性同时显著减小体积
  await image
    .resize({ width: Math.min(900, meta.width ?? 900), withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  const out = await sharp(target).metadata();
  console.log(`${brand} → ${slug}-speedtest.jpg (${out.width}×${out.height})`);
  done += 1;
}

console.log(`\n完成 ${done}/${Object.keys(SLUG_BY_BRAND).length} 张测速图导入`);
