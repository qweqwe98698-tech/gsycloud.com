import { describe, expect, it } from 'vitest';
import {
  AIRPORT_BRANDS,
  BRAND_STATS,
  BRAND_TAG_LABEL,
  brandsByTag,
  getBrand,
  sortHouseFirstThenValue,
} from '../src/data/airports/brands';
import { BRAND_TOPICS, getTopic } from '../src/data/airports/topics';

describe('品牌库数据完整性', () => {
  it('收录 16 家品牌且 slug 唯一', () => {
    expect(AIRPORT_BRANDS).toHaveLength(16);
    const slugs = new Set(AIRPORT_BRANDS.map((b) => b.slug));
    expect(slugs.size).toBe(16);
  });

  it('slug 均为小写英数，可安全用于 URL 与图片文件名', () => {
    for (const brand of AIRPORT_BRANDS) {
      expect(brand.slug).toMatch(/^[a-z0-9]+$/);
    }
  });

  it('有且仅有一个自有品牌', () => {
    const house = AIRPORT_BRANDS.filter((b) => b.house);
    expect(house).toHaveLength(1);
    expect(house[0]?.slug).toBe('gsycloud');
  });

  it('每 GB 单价由价格与流量正确派生', () => {
    for (const brand of AIRPORT_BRANDS) {
      expect(brand.pricePerGb).toBeCloseTo(brand.minPrice / brand.minTraffic, 4);
    }
  });

  it('推广链接均为 https 绝对地址', () => {
    for (const brand of AIRPORT_BRANDS) {
      expect(brand.affiliateUrl).toMatch(/^https:\/\//);
    }
  });

  it('每个品牌都有独立的 tagline，不得模板化', () => {
    const taglines = new Set(AIRPORT_BRANDS.map((b) => b.tagline));
    expect(taglines.size).toBe(AIRPORT_BRANDS.length);
  });

  it('每个品牌都有优势、注意事项与适合人群', () => {
    for (const brand of AIRPORT_BRANDS) {
      expect(brand.advantages.length).toBeGreaterThan(0);
      expect(brand.cautions.length).toBeGreaterThan(0);
      expect(brand.targetUsers.length).toBeGreaterThan(0);
      expect(brand.tags.length).toBeGreaterThan(0);
    }
  });

  it('标签均在已定义的标签表内', () => {
    const known = new Set(Object.keys(BRAND_TAG_LABEL));
    for (const brand of AIRPORT_BRANDS) {
      for (const tag of brand.tags) expect(known.has(tag)).toBe(true);
    }
  });

  it('开业时间未提供的品牌必须为 null 而不是编造值', () => {
    const unverified = AIRPORT_BRANDS.filter((b) => b.established === null);
    // 品牌方仅提供了 4 家的开业信息
    expect(unverified.length).toBe(AIRPORT_BRANDS.length - 4);
  });
});

describe('排序与筛选', () => {
  it('自有品牌始终排在首位', () => {
    const sorted = [...AIRPORT_BRANDS].sort(sortHouseFirstThenValue);
    expect(sorted[0]?.house).toBe(true);
  });

  it('非自有品牌按每 GB 单价升序', () => {
    const sorted = [...AIRPORT_BRANDS].sort(sortHouseFirstThenValue).slice(1);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i]!.pricePerGb).toBeGreaterThanOrEqual(sorted[i - 1]!.pricePerGb);
    }
  });

  it('按标签筛选返回的品牌都带有该标签', () => {
    for (const brand of brandsByTag('iepl')) {
      expect(brand.tags).toContain('iepl');
    }
  });

  it('getBrand 能按 slug 取回品牌', () => {
    expect(getBrand('gsycloud')?.name).toBe('光速云');
    expect(getBrand('not-exist')).toBeUndefined();
  });
});

describe('统计数据与实际品牌一致', () => {
  it('总数、最低价与各类计数正确', () => {
    expect(BRAND_STATS.total).toBe(AIRPORT_BRANDS.length);
    expect(BRAND_STATS.minPrice).toBe(Math.min(...AIRPORT_BRANDS.map((b) => b.minPrice)));
    expect(BRAND_STATS.aiCount).toBe(AIRPORT_BRANDS.filter((b) => b.aiSupport === 'full').length);
  });
});

describe('专题页数据', () => {
  it('专题 slug 唯一且不与 airport 集合文章冲突', () => {
    const slugs = BRAND_TOPICS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    // airport 集合中已有的 Markdown 文章 slug，不得与专题页重名
    const articleSlugs = ['2026', 'beginners', 'monthly', 'value'];
    for (const slug of slugs) expect(articleSlugs).not.toContain(slug);
  });

  it('每个专题的 Primary Keyword 全站唯一，防止关键词互抢', () => {
    const keywords = BRAND_TOPICS.map((t) => t.primaryKeyword);
    expect(new Set(keywords).size).toBe(keywords.length);
  });

  it('专题引用的品牌 slug 均存在于品牌库', () => {
    for (const topic of BRAND_TOPICS) {
      for (const pick of topic.picks) {
        expect(getBrand(pick.slug), `${topic.slug} 引用了不存在的品牌 ${pick.slug}`).toBeDefined();
      }
    }
  });

  it('推荐理由不得跨专题重复，避免模板化内容', () => {
    const reasons = BRAND_TOPICS.flatMap((t) => t.picks.map((p) => p.reason));
    expect(new Set(reasons).size).toBe(reasons.length);
  });

  it('每个专题都有 GEO 问答与 FAQ', () => {
    for (const topic of BRAND_TOPICS) {
      expect(topic.geoQuestions.length).toBeGreaterThanOrEqual(3);
      expect(topic.faq.length).toBeGreaterThanOrEqual(3);
      expect(topic.criteria.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('getTopic 能按 slug 取回专题', () => {
    expect(getTopic('ranking')?.primaryKeyword).toBe('2026机场排行榜');
    expect(getTopic('not-exist')).toBeUndefined();
  });
});
