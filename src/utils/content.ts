/**
 * 在有序列表中取当前条目的前后邻居，用于"上一篇/下一篇"导航。
 * 找不到当前 id（理论上不应发生）时返回 { prev: null, next: null }，
 * 调用方据此不渲染导航块，不产生死链。
 * 纯函数、不依赖 astro:content，可在 Vitest 中直接测试。
 */
export function getAdjacent<T>(
  list: T[],
  currentId: string,
  idOf: (item: T) => string,
): { prev: T | null; next: T | null } {
  const index = list.findIndex((item) => idOf(item) === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (list[index - 1] ?? null) : null,
    next: index < list.length - 1 ? (list[index + 1] ?? null) : null,
  };
}

/** 阅读时间估算：中文按字数（400 字/分钟），英文按词数（200 词/分钟） */
export function readingTime(text: string): number {
  const cjk = (text.match(/[一-鿿㐀-䶿]/g) ?? []).length;
  const words = text
    .replace(/[一-鿿㐀-䶿]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = cjk / 400 + words / 200;
  return Math.max(1, Math.round(minutes));
}

/** 日期格式化（中文），保持与 zh-CN locale 一致 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y} 年 ${m} 月 ${d} 日`;
}

/** ISO 日期（供 <time datetime> 与 Schema 使用） */
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

export type ContentType = 'official' | 'editorial' | 'review' | 'tutorial' | 'news';
export type DataStatus = 'verified' | 'reference' | 'example' | 'mixed';

/** contentType → 前台自然标签 */
export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  official: 'GSY Cloud 官方',
  editorial: '知识指南',
  review: '编辑评测',
  tutorial: '教程',
  news: '行业资讯',
};

/** dataStatus → 前台自然标签（不把示例数据描述为实测） */
export const DATA_STATUS_LABEL: Record<DataStatus, string> = {
  verified: '实测核实',
  reference: '参考资料',
  example: '示例说明',
  mixed: '混合来源',
};
