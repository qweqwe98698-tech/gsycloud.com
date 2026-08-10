import { getCollection } from 'astro:content';
import type { CollectionEntry, CollectionKey } from 'astro:content';
import { postUrl } from './url';
import type { ArchiveItem } from '@layouts/ArchiveLayout.astro';

export type ContentCollectionKey = Exclude<CollectionKey, 'authors'>;

/** 取已发布（非 draft）条目，按更新时间倒序 */
export async function getPublished<C extends ContentCollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf(),
  );
}

/** 条目 → 归档卡片数据 */
export function toArchiveItem<C extends ContentCollectionKey>(
  collection: C,
  entry: CollectionEntry<C>,
): ArchiveItem {
  return {
    title: entry.data.title,
    description: entry.data.description,
    href: postUrl(collection, entry.id),
    updatedDate: entry.data.updatedDate,
    contentType: entry.data.contentType,
    dataStatus: entry.data.dataStatus,
    category: entry.data.category,
  };
}

/** 全部内容集合（不含 authors），供标签页 / RSS / 首页聚合使用 */
export const CONTENT_COLLECTIONS = [
  'airport',
  'reviews',
  'nodes',
  'tutorials',
  'troubleshooting',
  'protocols',
  'network',
  'ai',
  'streaming',
  'risk',
  'news',
] as const satisfies readonly ContentCollectionKey[];

export interface FlatEntry {
  collection: ContentCollectionKey;
  entry: CollectionEntry<ContentCollectionKey>;
}

/** 聚合全站文章（按更新时间倒序） */
export async function getAllPublished(): Promise<FlatEntry[]> {
  const nested = await Promise.all(
    CONTENT_COLLECTIONS.map(async (collection) => {
      const entries = await getPublished(collection);
      return entries.map((entry) => ({ collection, entry }) as FlatEntry);
    }),
  );
  return nested
    .flat()
    .sort((a, b) => b.entry.data.updatedDate.valueOf() - a.entry.data.updatedDate.valueOf());
}
