import type { ImageMetadata } from 'astro';

/** 测速图与解锁实测图按文件名静态引入，交给 astro:assets 优化 */
const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/airports/*.jpg', {
  eager: true,
});

const bySlug = new Map<string, ImageMetadata>();
const unlockBySlug = new Map<string, ImageMetadata[]>();
const extraTestBySlug = new Map<string, ImageMetadata[]>();

for (const [path, mod] of Object.entries(modules)) {
  const speedMatch = path.match(/\/([a-z0-9]+)-speedtest\.jpg$/);
  if (speedMatch?.[1]) {
    bySlug.set(speedMatch[1], mod.default);
    continue;
  }
  const unlockMatch = path.match(/\/([a-z0-9]+)-unlock-(\d+)\.jpg$/);
  if (unlockMatch?.[1]) {
    const list = unlockBySlug.get(unlockMatch[1]) ?? [];
    list.push(mod.default);
    unlockBySlug.set(unlockMatch[1], list);
    continue;
  }
  const extraSpeedMatch = path.match(/\/([a-z0-9]+)-speedtest-(\d+)\.jpg$/);
  if (extraSpeedMatch?.[1]) {
    const list = extraTestBySlug.get(extraSpeedMatch[1]) ?? [];
    list.push(mod.default);
    extraTestBySlug.set(extraSpeedMatch[1], list);
  }
}

export function speedTestImage(slug: string): ImageMetadata | undefined {
  return bySlug.get(slug);
}

export function brandUnlockImages(slug: string): ImageMetadata[] {
  return unlockBySlug.get(slug) ?? [];
}

export function brandExtraTestImages(slug: string): ImageMetadata[] {
  return extraTestBySlug.get(slug) ?? [];
}
