import { describe, expect, it } from 'vitest';
import {
  breadcrumbSchema,
  articleSchema,
  faqSchema,
  organizationSchema,
  webSiteSchema,
  collectionPageSchema,
  personSchema,
  webPageSchema,
  jsonLdGraph,
} from '../src/utils/schema';

describe('breadcrumbSchema', () => {
  it('生成有序 ListItem 且 URL 绝对化', () => {
    const schema = breadcrumbSchema([
      { name: '首页', path: '/' },
      { name: '线路与网络', path: '/network/' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]?.position).toBe(1);
    expect(schema.itemListElement[1]?.item).toBe('https://gsycloud.com/network/');
  });
});

describe('articleSchema', () => {
  it('包含发布与修改时间', () => {
    const pub = new Date('2026-08-01T00:00:00Z');
    const mod = new Date('2026-08-10T00:00:00Z');
    const schema = articleSchema({
      title: 'T',
      description: 'D',
      path: '/network/what-is-iplc/',
      pubDate: pub,
      updatedDate: mod,
      authorName: 'GSY Cloud 技术组',
    });
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.datePublished).toBe(pub.toISOString());
    expect(schema.dateModified).toBe(mod.toISOString());
    expect(schema.mainEntityOfPage).toBe('https://gsycloud.com/network/what-is-iplc/');
  });
});

describe('faqSchema', () => {
  it('每个 FAQ 生成 Question 节点', () => {
    const schema = faqSchema([{ question: 'Q1', answer: 'A1' }]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]?.acceptedAnswer.text).toBe('A1');
  });
});

describe('全局实体', () => {
  it('Organization 与 WebSite 使用稳定 @id', () => {
    expect(organizationSchema()['@id']).toBe('https://gsycloud.com/#organization');
    expect(webSiteSchema()['@id']).toBe('https://gsycloud.com/#website');
  });

  it('WebSite 的 SearchAction 指向真实可用的 /search/?q= 接口', () => {
    const action = webSiteSchema().potentialAction;
    expect(action['@type']).toBe('SearchAction');
    expect(action.target.urlTemplate).toBe('https://gsycloud.com/search/?q={search_term_string}');
    expect(action['query-input']).toBe('required name=search_term_string');
  });
});

describe('personSchema', () => {
  it('生成带稳定 @id 的 Person 节点，指向作者主页', () => {
    const person = personSchema({
      id: 'gsycloud-editorial',
      name: 'GSY Cloud 编辑部',
      role: '内容团队',
      bio: '负责内容撰写',
    });
    expect(person['@id']).toBe('https://gsycloud.com/authors/gsycloud-editorial/#person');
    expect(person.url).toBe('https://gsycloud.com/authors/gsycloud-editorial/');
    expect(person.worksFor).toEqual({ '@id': 'https://gsycloud.com/#organization' });
  });
});

describe('articleSchema 的作者引用', () => {
  const base = {
    title: 'T',
    description: 'D',
    path: '/network/what-is-iplc/',
    pubDate: new Date('2026-08-01T00:00:00Z'),
    updatedDate: new Date('2026-08-10T00:00:00Z'),
    authorName: 'GSY Cloud 技术组',
  };

  it('提供 authorId 时通过 @id 引用 Person 实体，而不是内联匿名对象', () => {
    const schema = articleSchema({ ...base, authorId: 'gsycloud-network' });
    expect(schema.author).toEqual({ '@id': 'https://gsycloud.com/authors/gsycloud-network/#person' });
  });

  it('未提供 authorId 时回退为内联 Person', () => {
    const schema = articleSchema(base);
    expect(schema.author).toEqual({ '@type': 'Person', name: 'GSY Cloud 技术组' });
  });
});

describe('webPageSchema', () => {
  it('AboutPage / ContactPage 类型正确且不滥用', () => {
    const about = webPageSchema('AboutPage', { name: 'N', description: 'D', path: '/about/' });
    expect(about['@type']).toBe('AboutPage');
    expect(about.isPartOf).toEqual({ '@id': 'https://gsycloud.com/#website' });
  });
});

describe('collectionPageSchema', () => {
  it('生成 ItemList', () => {
    const schema = collectionPageSchema({
      name: 'N',
      description: 'D',
      path: '/network/',
      items: [{ name: 'A', path: '/network/a/' }],
    });
    expect(schema.mainEntity.itemListElement).toHaveLength(1);
  });
});

describe('jsonLdGraph', () => {
  it('输出合法 JSON 且包含 @context 与 @graph', () => {
    const raw = jsonLdGraph([organizationSchema()]);
    const parsed = JSON.parse(raw);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);
  });
});
