import type { ImageMetadata } from 'astro';

/** 测速图按 slug 静态引入，交给 astro:assets 优化 */
const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/airports/*.jpg', {
  eager: true,
});

const bySlug = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  const match = path.match(/\/([a-z0-9]+)-speedtest\.jpg$/);
  if (match?.[1]) bySlug.set(match[1], mod.default);
}

export function speedTestImage(slug: string): ImageMetadata | undefined {
  return bySlug.get(slug);
}
