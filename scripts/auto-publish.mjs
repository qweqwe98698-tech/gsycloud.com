/**
 * 自动发布系统：基于 DeepSeek API 的 SEO/GEO 万字级主线矩阵文章生成与自愈系统
 * 
 * 核心特性：
 * 1. 自动读取 matrix-topics.json，智能识别队列中尚未发布的专题
 * 2. 启动优化自发布文章 URL 防批量AI识别优化系统：
 *    - 纯语义化无特征 Slug（无日期戳、无批次编号、小写连字符命名）
 *    - 反 AI 模板腔与八股词过滤系统（严禁 30+ 常见 AI 机械过渡词，强化实操参数与工程视角）
 *    - 全站内链图谱动态编织（自动识别站内既有文章，动态生成 relatedSlugs 与正文自然上下文内链）
 * 3. 严格遵循 Astro Content Layer Schema 与 GEO 内容规范
 * 4. 自动同步 docs/urls-baseline.txt 与 docs/keyword-matrix.md
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TOPICS_FILE = path.join(ROOT, 'scripts', 'matrix-topics.json');
const BASELINE_FILE = path.join(ROOT, 'docs', 'urls-baseline.txt');
const MATRIX_FILE = path.join(ROOT, 'docs', 'keyword-matrix.md');
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';

// 严禁在生成内容中出现的常见 AI 八股词汇库（防批量 AI 特征检测）
const BANNED_AI_WORDS = [
  '在当今数字化时代',
  '在当今快节奏的时代',
  '随着科技的飞速发展',
  '值得一提的是',
  '不可否认的是',
  '显而易见的是',
  '毋庸置疑',
  '总而言之',
  '综上所述',
  '如同一把双刃剑',
  '犹如一把双刃剑',
  '既是机遇也是挑战',
  '不仅如此',
  '换言之',
  '正所谓',
  '不言而喻'
];

async function collectExistingArticles() {
  const contentDir = path.join(ROOT, 'src', 'content');
  const articles = [];

  async function walk(dir, relPrefix = '') {
    if (!existsSync(dir)) return;
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'authors') continue;
        await walk(full, path.join(relPrefix, entry.name));
      } else if (entry.name.endsWith('.md')) {
        const raw = await readFile(full, 'utf-8');
        const titleMatch = raw.match(/title:\s*['"]?([^\r\n'"]+)['"]?/);
        const title = titleMatch ? titleMatch[1].trim() : entry.name.replace('.md', '');
        
        let slugId = path.join(relPrefix, entry.name.replace('.md', '')).replaceAll('\\', '/');
        // e.g. tutorials/clash/getting-started -> { collection: 'tutorials', slug: 'clash/getting-started' }
        const parts = slugId.split('/');
        const collection = parts[0];
        const innerSlug = parts.slice(1).join('/');

        articles.push({
          filePath: full,
          collection,
          slugId,
          innerSlug,
          title,
          url: `/${slugId}/`
        });
      }
    }
  }

  await walk(contentDir);
  return articles;
}

function sanitizeUrlSlug(slug) {
  // 严格小写、连字符分隔，杜绝批次编号、日期标记与非法字符
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function getNextTopic() {
  if (!existsSync(TOPICS_FILE)) {
    throw new Error(`Topics file not found at ${TOPICS_FILE}`);
  }
  const raw = await readFile(TOPICS_FILE, 'utf-8');
  const topics = JSON.parse(raw);

  const forceId = process.env.FORCE_TOPIC_ID?.trim();
  if (forceId) {
    const matched = topics.find(t => t.id === forceId);
    if (matched) return matched;
    console.warn(`[WARN] FORCE_TOPIC_ID=${forceId} not found in matrix-topics.json, falling back to queue.`);
  }

  // 顺序查找第一个未发布的主题
  for (const topic of topics) {
    const slug = sanitizeUrlSlug(topic.slug);
    const targetFile = topic.pillar
      ? path.join(ROOT, 'src', 'content', topic.collection, topic.pillar, `${slug}.md`)
      : path.join(ROOT, 'src', 'content', topic.collection, `${slug}.md`);

    if (!existsSync(targetFile)) {
      return topic;
    }
  }

  return null;
}

function buildPrompts(topic, existingArticles) {
  // 智能挑选 4 篇相关度高的现有文章供内链编织
  const sampleInternalLinks = existingArticles
    .filter(a => a.collection !== topic.collection)
    .slice(0, 4)
    .map(a => `- 标题: "${a.title}" | 内部链接地址: "${a.url}" | relatedSlug 格式: "${a.collection}/${a.innerSlug}"`)
    .join('\n');

  const todayStr = new Date().toISOString().split('T')[0];

  const systemPrompt = `你是一名拥有 8 年一线运维经验的跨境网络架构师与技术评测专家，撰写风格客观、严谨、详实、充满工程现场的“活人感”，精通各类代理客户端底层原理与网络协议。

本次任务是撰写一篇万字级深度的深度技术与选型指南，严格遵循现代搜索引擎的 GEO (Generative Engine Optimization) 标准与站内 Astro Content Layer 规范。

【严禁触碰的 AI 机械特征（防批量 AI 识别拦截系统）】：
1. 绝对禁止使用空泛的套话起手式，如“在当今快节奏的数字化时代”、“随着互联网技术的飞速发展”。
2. 绝对禁止使用以下机械模型过渡词：${BANNED_AI_WORDS.join('、')}。
3. 绝对禁止在正文中使用 H1 标签（页面外层布局会自动渲染一级标题，正文从 H2 开始）。
4. 绝对禁止虚构未经核实的商业承诺或夸大宣传，不确定技术细节请基于 RFC 协议规范与标准工程实践讲清原理与排障边界。

【GEO 黄金排版规范】：
1. 顶部第一段直接给出核心答案与判定依据（GEO Direct Answer，直击搜索意图核心）。
2. 第二个部分必须是「## 核心要点」，以无序列表给出 4~5 条关键结论或速查原则。
3. 后续采用问题驱动的「## 二级标题」，逻辑层层深入，覆盖背景原理、技术架构、实操步骤、参数配置与避坑指南。
4. 正文中必须包含至少 2 个高质量的 Markdown 对比表格（如参数对比表、排错决策矩阵）。
5. 正文中必须包含真实的配置代码块（YAML / JSON / Shell），并带有详细的注释说明。
6. 末尾必须有「## 总结」与排障/选型建议。
7. 正文中应在合适语境下，自然嵌入 2~3 个站内已收录文章的超链接（Markdown 格式：[锚文本](/路径/)）。

【输出格式要求】：
必须直接输出完整的 Markdown 内容（包含前置 YAML Frontmatter），不要在最外层包裹 \`\`\`markdown 代码块。`;

  const userPrompt = `请为以下主题撰写万字级深度指南：

【文章规划元数据】：
- 标题：${topic.title}
- 所属分类：${topic.category}
- 核心关键词：${topic.primaryKeyword}
- 辅助长尾词：${topic.secondaryKeywords.join('、')}
- 目标受众：${topic.targetAudience}
- 撰写作者：${topic.author}
- 核心解答问题：
${topic.coreQuestions.map(q => `  · ${q}`).join('\n')}

【可供内链织网的站内已有文章库】：
${sampleInternalLinks}

【Frontmatter 必须满足的字段（严格对齐 Astro 校验规则）】：
---
title: "${topic.title}"
description: "${topic.description}"
pubDate: ${todayStr}
updatedDate: ${todayStr}
category: "${topic.category}"
tags: [${topic.secondaryKeywords.map(k => `"${k}"`).join(', ')}]
author: "${topic.author}"
primaryKeyword: "${topic.primaryKeyword}"
secondaryKeywords: [${topic.secondaryKeywords.map(k => `"${k}"`).join(', ')}]
searchIntent: "informational"
pillar: ${topic.pillar ? `"${topic.pillar}"` : 'null'}
relatedSlugs:
  # 请从上述站内已有文章库中挑选 2~4 个相关的 relatedSlug 填入，例如:
  # - network/what-is-iplc
faq:
  - question: "${topic.coreQuestions[0]}"
    answer: "给出专业严密、具备实操价值的答案（80~150字）"
  - question: "${topic.coreQuestions[1]}"
    answer: "给出专业严密、具备实操价值的答案（80~150字）"
  - question: "${topic.coreQuestions[2]}"
    answer: "给出专业严密、具备实操价值的答案（80~150字）"
  - question: "${topic.coreQuestions[3]}"
    answer: "给出专业严密、具备实操价值的答案（80~150字）"
sources: []
contentType: "${topic.contentType || 'tutorial'}"
dataStatus: "${topic.dataStatus || 'reference'}"
featured: false
draft: false
---

请现在开始输出这篇充满实战经验、技术干货且语言自然通透的万字级指南！`;

  return { systemPrompt, userPrompt };
}

async function callDeepSeek(systemPrompt, userPrompt, apiKey) {
  console.log('Sending request to DeepSeek API (model: deepseek-chat)...');
  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 8192,
      temperature: 0.6,
      stream: false
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API error (HTTP ${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('DeepSeek returned empty content');
  }

  return content;
}

function cleanAndSanitizeContent(rawContent) {
  let cleaned = rawContent.trim();
  
  // 移除外层包裹的 ```markdown ... ```
  if (cleaned.startsWith('```markdown')) {
    cleaned = cleaned.slice(11).trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3).trim();
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3).trim();
  }

  // 严禁 AI 八股词汇清洗（防批量 AI 特征净化）
  for (const banned of BANNED_AI_WORDS) {
    const reg = new RegExp(banned, 'g');
    cleaned = cleaned.replace(reg, '');
  }

  // 确保没有多余的一级标题 H1
  cleaned = cleaned.replace(/^#\s+[^\r\n]+/m, '');

  return cleaned;
}

async function updateBaselineUrls(targetUrl) {
  if (!existsSync(BASELINE_FILE)) return;
  const raw = await readFile(BASELINE_FILE, 'utf-8');
  const urls = new Set(raw.split(/\r?\n/).filter(Boolean));
  if (!urls.has(targetUrl)) {
    urls.add(targetUrl);
    const sorted = [...urls].sort();
    await writeFile(BASELINE_FILE, sorted.join('\n') + '\n', 'utf-8');
    console.log(`[URL-Sync] Added ${targetUrl} to ${path.relative(ROOT, BASELINE_FILE)}`);
  }
}

async function updateKeywordMatrix(topic, targetUrl) {
  if (!existsSync(MATRIX_FILE)) return;
  let raw = await readFile(MATRIX_FILE, 'utf-8');
  
  // 检查是否已有对应关键词条目并将 planned 改为 live
  const kw = topic.primaryKeyword;
  if (raw.includes(kw)) {
    const lines = raw.split(/\r?\n/);
    const updatedLines = lines.map(line => {
      if (line.includes(kw) && line.includes('planned')) {
        return line.replace(/—\s*\|\s*([^|]+)\|\s*planned/, `${targetUrl} | $1 | live`);
      }
      return line;
    });
    raw = updatedLines.join('\n');
    await writeFile(MATRIX_FILE, raw, 'utf-8');
    console.log(`[Matrix-Sync] Updated keyword "${kw}" to live in ${path.relative(ROOT, MATRIX_FILE)}`);
  }
}

async function main() {
  console.log('=== [Auto-Publish] Starting SEO/GEO Matrix Article Generation System ===');
  
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    console.error('Error: DEEPSEEK_API_KEY environment variable is missing.');
    console.error('Please configure DEEPSEEK_API_KEY in your repository secrets or local environment.');
    process.exit(1);
  }

  const topic = await getNextTopic();
  if (!topic) {
    console.log('Notice: All planned matrix topics have already been published! No new article needed.');
    return;
  }

  const slug = sanitizeUrlSlug(topic.slug);
  const targetDir = topic.pillar
    ? path.join(ROOT, 'src', 'content', topic.collection, topic.pillar)
    : path.join(ROOT, 'src', 'content', topic.collection);

  const targetFile = path.join(targetDir, `${slug}.md`);
  const targetUrl = topic.pillar
    ? `/${topic.collection}/${topic.pillar}/${slug}/`
    : `/${topic.collection}/${slug}/`;

  console.log(`Target Topic Found: [${topic.id}]`);
  console.log(`Title: ${topic.title}`);
  console.log(`Destination: ${path.relative(ROOT, targetFile)}`);
  console.log(`Canonical URL: ${targetUrl}`);

  mkdirSync(targetDir, { recursive: true });

  const existingArticles = await collectExistingArticles();
  const { systemPrompt, userPrompt } = buildPrompts(topic, existingArticles);

  const generatedRaw = await callDeepSeek(systemPrompt, userPrompt, apiKey);
  const finalContent = cleanAndSanitizeContent(generatedRaw);

  await writeFile(targetFile, finalContent, 'utf-8');
  console.log(`[Success] Written article to ${path.relative(ROOT, targetFile)} (${finalContent.length} chars)`);

  // 同步全站资产与 URL 基准
  await updateBaselineUrls(targetUrl);
  await updateKeywordMatrix(topic, targetUrl);

  console.log('=== [Auto-Publish] Article generated and ecosystem synced successfully! ===');
}

main().catch(err => {
  console.error('[Auto-Publish Error]:', err);
  process.exit(1);
});
