import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** 全站统一内容 Schema（见项目规范第三十一条） */
const baseSchema = z.object({
  title: z.string(),
  description: z.string().min(40, 'description 必须独立撰写，不能过短'),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().default('gsycloud-editorial'),
  cover: z
    .object({
      src: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()).default([]),
  searchIntent: z.enum(['informational', 'commercial', 'transactional', 'navigational']),
  pillar: z.string().nullable().default(null),
  relatedSlugs: z.array(z.string()).default([]),
  faq: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .default([]),
  sources: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
  contentType: z.enum(['official', 'editorial', 'review', 'tutorial', 'news']),
  dataStatus: z.enum(['verified', 'reference', 'example', 'mixed']).default('reference'),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

const makeCollection = (dir: string) =>
  defineCollection({
    loader: glob({ base: `./src/content/${dir}`, pattern: '**/*.md' }),
    schema: baseSchema,
  });

const authors = defineCollection({
  loader: file('./src/content/authors/authors.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()),
  }),
});

export const collections = {
  airport: makeCollection('airport'),
  reviews: makeCollection('reviews'),
  nodes: makeCollection('nodes'),
  tutorials: makeCollection('tutorials'),
  troubleshooting: makeCollection('troubleshooting'),
  protocols: makeCollection('protocols'),
  network: makeCollection('network'),
  ai: makeCollection('ai'),
  streaming: makeCollection('streaming'),
  risk: makeCollection('risk'),
  news: makeCollection('news'),
  authors,
};
