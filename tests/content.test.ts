import { describe, expect, it } from 'vitest';
import {
  readingTime,
  formatDate,
  isoDate,
  getAdjacent,
  CONTENT_TYPE_LABEL,
  DATA_STATUS_LABEL,
} from '../src/utils/content';

describe('readingTime', () => {
  it('中文按 400 字/分钟估算', () => {
    const text = '字'.repeat(800);
    expect(readingTime(text)).toBe(2);
  });

  it('英文按 200 词/分钟估算', () => {
    const text = Array(400).fill('word').join(' ');
    expect(readingTime(text)).toBe(2);
  });

  it('最少 1 分钟', () => {
    expect(readingTime('很短')).toBe(1);
    expect(readingTime('')).toBe(1);
  });

  it('中英混排累加', () => {
    const text = '字'.repeat(400) + ' ' + Array(200).fill('word').join(' ');
    expect(readingTime(text)).toBe(2);
  });
});

describe('日期格式化', () => {
  const date = new Date('2026-08-10T00:00:00Z');

  it('formatDate 输出中文日期', () => {
    expect(formatDate(date)).toBe('2026 年 8 月 10 日');
  });

  it('isoDate 输出 ISO 日期', () => {
    expect(isoDate(date)).toBe('2026-08-10');
  });
});

describe('getAdjacent', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const idOf = (item: { id: string }) => item.id;

  it('中间条目同时有 prev 与 next', () => {
    const { prev, next } = getAdjacent(list, 'b', idOf);
    expect(prev?.id).toBe('a');
    expect(next?.id).toBe('c');
  });

  it('首条目没有 prev，末条目没有 next', () => {
    expect(getAdjacent(list, 'a', idOf).prev).toBeNull();
    expect(getAdjacent(list, 'c', idOf).next).toBeNull();
  });

  it('找不到当前 id 时返回全 null，不产生死链', () => {
    const { prev, next } = getAdjacent(list, 'not-exist', idOf);
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });

  it('单元素列表 prev 与 next 均为 null', () => {
    const { prev, next } = getAdjacent([{ id: 'only' }], 'only', idOf);
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});

describe('标签映射', () => {
  it('contentType 标签完整', () => {
    expect(CONTENT_TYPE_LABEL.official).toBe('GSY Cloud 官方');
    expect(Object.keys(CONTENT_TYPE_LABEL)).toHaveLength(5);
  });

  it('dataStatus 标签完整且不夸大', () => {
    expect(DATA_STATUS_LABEL.example).toBe('示例说明');
    expect(Object.keys(DATA_STATUS_LABEL)).toHaveLength(4);
  });
});
