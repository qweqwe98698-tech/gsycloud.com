import { SITE } from './site';
import { canonicalUrl } from './url';

/** Organization 实体（全站） */
export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.nameZh,
    url: `${SITE.url}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/logo.svg`,
    },
    description: SITE.description,
  };
}

/**
 * WebSite 实体（全站）。
 * potentialAction 指向 /search/?q= —— 该查询参数由 search.astro 实际读取并
 * 驱动 Pagefind 搜索框，因此这里的 SearchAction 对应真实功能，不是摆设。
 */
export function webSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    inLanguage: SITE.locale,
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** 作者/编辑实体（带稳定 @id，供文章 author 字段与作者主页共用同一身份） */
export function personSchema(input: { id: string; name: string; role: string; bio: string }) {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/authors/${input.id}/#person`,
    name: input.name,
    url: canonicalUrl(`/authors/${input.id}/`),
    jobTitle: input.role,
    description: input.bio,
    worksFor: { '@id': `${SITE.url}/#organization` },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  pubDate: Date;
  updatedDate: Date;
  authorName: string;
  /** 作者在 authors 集合中的 id；提供时 author 引用其 Person 实体的稳定 @id */
  authorId?: string;
  image?: string;
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: canonicalUrl(input.path),
    datePublished: input.pubDate.toISOString(),
    dateModified: input.updatedDate.toISOString(),
    inLanguage: SITE.locale,
    author: input.authorId
      ? { '@id': `${SITE.url}/authors/${input.authorId}/#person` }
      : { '@type': 'Person', name: input.authorName },
    publisher: { '@id': `${SITE.url}/#organization` },
    ...(input.image ? { image: canonicalUrl(input.image) } : {}),
  };
}

/** 页面存在可见 FAQ 时才输出 FAQPage */
export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * 通用 WebPage 子类型（AboutPage / ContactPage 等）。
 * 只在页面语义明确对应该 schema.org 类型时使用，不滥用以换取富媒体结果。
 */
export function webPageSchema(
  type: 'AboutPage' | 'ContactPage',
  input: { name: string; description: string; path: string },
) {
  return {
    '@type': type,
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.path),
    inLanguage: SITE.locale,
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.path),
    inLanguage: SITE.locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: input.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: canonicalUrl(item.path),
      })),
    },
  };
}

/** 将多个 schema 节点合并为一个 @graph JSON-LD 字符串 */
export function jsonLdGraph(nodes: object[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
