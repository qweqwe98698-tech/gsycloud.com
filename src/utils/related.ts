import { getEntry } from 'astro:content';
import type { CollectionKey } from 'astro:content';
import { postUrl, normalizePath } from './url';
import { BRAND_TOPICS } from '@data/airports/topics';

const CONTENT_COLLECTIONS = [
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
] as const;

/** 非 Markdown 的可链接目标（数据驱动的专题页与索引页） */
const STATIC_TARGETS: Record<string, { title: string; description: string }> = {
  brands: {
    title: '机场品牌库',
    description: '16 家机场品牌的结构化资料：套餐、线路、协议、解锁能力、优惠码与测速图。',
  },
  ...Object.fromEntries(
    BRAND_TOPICS.map((topic) => [
      `airport/${topic.slug}`,
      { title: topic.h1, description: topic.description },
    ]),
  ),
};

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

/**
 * 解析 relatedSlugs 为标题 + URL。
 * 支持两类目标：内容集合条目（如 network/what-is-iplc）与数据驱动页面（如 airport/ranking、brands）。
 * 找不到的条目在构建日志中警告并跳过，避免产生死链。
 */
export async function resolveRelated(relatedSlugs: string[]): Promise<RelatedLink[]> {
  const links: RelatedLink[] = [];
  for (const related of relatedSlugs) {
    const staticTarget = STATIC_TARGETS[related];
    if (staticTarget) {
      links.push({ ...staticTarget, href: normalizePath(`/${related}`) });
      continue;
    }

    const [collection, ...rest] = related.split('/');
    const id = rest.join('/');
    if (!collection || !id || !CONTENT_COLLECTIONS.includes(collection as never)) {
      console.warn(`[related] 无效的 relatedSlug: ${related}`);
      continue;
    }
    const entry = await getEntry(collection as CollectionKey, id);
    if (!entry) {
      console.warn(`[related] 找不到 relatedSlug 对应内容: ${related}`);
      continue;
    }
    const data = entry.data as { title: string; description: string };
    links.push({
      title: data.title,
      description: data.description,
      href: postUrl(collection, id),
    });
  }
  return links;
}
