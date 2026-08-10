# GSY Cloud — gsycloud.com

GSY Cloud（光速云网络指南）品牌官网 + 机场选择参考 + 代理网络知识库。
基于 **Astro（static）+ Tailwind CSS 4 + Content Layer + Pagefind** 构建，部署于 **Cloudflare Pages**。

## 环境要求

- Node.js ≥ 20（当前开发环境 Node 24）
- pnpm ≥ 9（当前 pnpm 11，`packageManager` 字段已锁定）

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地开发（http://localhost:4321；站内搜索需构建后才可用）
pnpm build          # 构建 dist/ 并生成 Pagefind 搜索索引
pnpm preview        # 本地预览构建产物（搜索可用）
pnpm test           # Vitest 单元测试（utils）
pnpm lint           # ESLint
pnpm format         # Prettier 格式化
pnpm check          # astro check（TS 类型检查）
pnpm check:links    # 死链 / 空链接检查（需先 build）
pnpm audit:seo      # SEO/GEO 程序化审计（需先 build）
```

## 目录结构

```text
src/
├── components/       # SEO、Header、Footer、卡片、TOC、FAQ 等组件
├── content/          # 内容集合（Markdown）+ authors.json
│   ├── airport/        机场选择指南（URL: /airport/<slug>/）
│   ├── reviews/        机场评测
│   ├── nodes/          节点知识
│   ├── tutorials/      客户端教程（子目录 = pillar，如 clash/xxx.md）
│   ├── troubleshooting/故障排查
│   ├── protocols/      协议知识
│   ├── network/        线路与网络知识
│   ├── ai/             AI 网络（子目录 = 平台 pillar，如 chatgpt/xxx.md）
│   ├── streaming/      流媒体
│   ├── risk/           风险预警
│   └── news/           官方公告 + 行业资讯
├── data/
│   ├── airports/
│   │   ├── brands.ts   机场品牌库（16 家）—— 全站唯一数据源，见下方「品牌库」
│   │   └── topics.ts   商业专题页数据（榜单/便宜/专线/AI/流媒体/Clash…）
│   ├── gsycloud/       品牌服务数据层（services.ts —— 不要把服务信息写死进文章）
│   └── pillars.ts      教程 / AI 专题（pillar）定义
├── layouts/          # BaseLayout / ArticleLayout / ArchiveLayout / PageLayout
├── pages/            # 路由（collection 名 = URL 前缀）
├── styles/           # global.css（Tailwind v4 CSS-first 设计令牌）
└── utils/            # site / url / content / schema / collections / related
scripts/              # generate-og / check-links / audit-seo
tests/                # Vitest 单元测试
```

## 新建文章

1. 在对应集合目录创建 `src/content/<collection>/<slug>.md`（slug 全小写英文连字符，上线后不要改）；
   教程与 AI 文章放入 pillar 子目录：`tutorials/clash/xxx.md`、`ai/chatgpt/xxx.md`，并在 frontmatter 设置 `pillar: clash`。
2. Frontmatter 必填字段：`title、description、pubDate、updatedDate、category、tags、author、primaryKeyword、searchIntent、contentType、draft`；
   可选：`secondaryKeywords、pillar、relatedSlugs、faq、sources、cover、dataStatus、featured`。
   Schema 定义见 `src/content.config.ts`（description 最少 40 字符，必须独立撰写）。
3. 正文遵循 GEO 模板：开头直接回答 → `## 核心要点` → 问题式 H2 → 表格/步骤 → `## 总结`。
   不写 H1（布局渲染）；FAQ 只放 frontmatter（布局自动渲染并输出 FAQPage Schema）。
4. `relatedSlugs` 使用 `collection/slug` 形式（如 `network/what-is-iplc`），构建时自动解析为相关阅读卡片；找不到的条目会在构建日志警告。
5. 内链使用绝对路径且以 `/` 结尾：`[锚文本](/network/what-is-iplc/)`。
6. 只有正文实际变化时才更新 `updatedDate`。

### 新建专题（Pillar）

在 `src/data/pillars.ts` 中添加条目（tutorials 或 ai section），构建时自动生成
`/tutorials/<slug>/` 或 `/ai/<slug>/` 专题枢纽页，并聚合 `pillar` 字段匹配的文章。

### 新建公告 / 资讯

放入 `src/content/news/`；官方公告设 `contentType: official`（前台自动进入公告区并带官方标识），
行业资讯用 `contentType: news`。

## 机场品牌库（重要）

`src/data/airports/brands.ts` 是 **16 家机场品牌的全站唯一数据源**。以下页面全部由它驱动，
改一处即可全站同步，不要在别处硬编码价格或优惠码：

- `/brands/` 品牌库（含筛选、测速图、全字段展示）
- `/airport/<topic>/` 9 个商业专题页（榜单、便宜、专线、AI、流媒体、Clash、Shadowrocket、不限时、优惠码）
- `/reviews/<slug>/` 16 篇品牌评测的资料卡、CTA、测速图、优势与注意事项
- 首页精选卡片与横向对比表、`/services/` 自有品牌 CTA

### 数据纪律（必须遵守）

- 品牌方未提供的字段一律为 `null` 或 `'unverified'`，前台显示「暂未核实」——**禁止推测填充**
- `house: true` 仅用于自有品牌光速云，前台必须显示「本站自有品牌」标识
- 测速图为测速面板导出结果，原始数据未修改、测试时间已隐去，仅作参考，不得据此做跨品牌排名
- Markdown 评测正文**只写分析**，不重复价格参数（布局已从数据层渲染），避免正文数字过期

### 新增或修改品牌

1. 在 `brands.ts` 中增删条目（`slug` 必须为小写英数，且与测速图文件名一致）
2. 测速图放入 `src/assets/airports/<slug>-speedtest.jpg`；批量导入用
   `node scripts/import-speedtest-images.mjs --src "<源目录>"`
3. 在 `src/content/reviews/<slug>.md` 写评测正文（无对应文件时品牌仍会出现在品牌库与对比表中）
4. 运行 `pnpm test` —— 品牌库测试会校验 slug 唯一性、单价派生、tagline 不重复、专题引用有效性

## 推广链接合规（不要绕过）

所有推广链接必须通过 `BrandCta.astro` / `BrandTable.astro` 输出，它们会自动加上
`rel="sponsored nofollow noopener"` 与 `target="_blank"`；含推广链接的页面必须放置
`<AffiliateDisclosure />`。`pnpm audit:seo` 会强制检查这两点，缺失即构建失败。

这不是可选项：Google 要求 Affiliate 内容标注 sponsored 并做出披露，否则整站有被判定为
纯 Affiliate 站的风险，反而损害排名。

## 关键词矩阵

`docs/keyword-matrix.md` 记录 Keyword → Intent → Target URL → Pillar → Status 的完整映射，
以及已知的关键词互抢风险点。**新建页面前必须先查此表**：若 Primary Keyword 已被分配，
应更新原页面而不是新建 URL。

## 修改 GSY Cloud 服务信息

统一修改 `src/data/gsycloud/services.ts`（能力、套餐结构、地区、协议、客户端、FAQ）。
服务页 `/services/`、首页品牌区共享该数据。套餐字段带 `dataStatus`，
`example` 状态的数据前台会自动注明“以官方页面为准”，不要把示例数据描述成实时数据。

## 数据状态（dataStatus）

- `verified` 实测核实 · `reference` 参考资料 · `example` 示例说明 · `mixed` 混合来源
- 前台在文章头部展示对应徽标；`example` 会额外显示提示框。

## 图片

- 站点资源（favicon、logo、OG 图）在 `public/`；重新生成 OG 图：`node scripts/generate-og.mjs`。
- 文章封面通过 frontmatter `cover`（src/alt/width/height）配置；正文图片建议放
  `src/assets/` 并用 `astro:assets` 引用以获得自动优化。

## SEO / 搜索

- `site` 与 `trailingSlash: 'always'` 已在 `astro.config.mjs` 固定，**上线后不要修改**。
- Sitemap：`@astrojs/sitemap` 自动生成（已在 robots.txt 声明）；RSS：`/rss.xml`。
- 每页独立 Title/Description/Canonical/H1 由布局保证；JSON-LD（Organization、WebSite、
  BreadcrumbList、BlogPosting、CollectionPage、FAQPage）由 `src/utils/schema.ts` 统一输出。
- 标签页少于 3 篇内容自动 `noindex,follow`（阈值在 `src/pages/tags/[tag].astro`）。
- 构建后必跑：`pnpm check:links` 与 `pnpm audit:seo`。

## 站内搜索（Pagefind）

`pnpm build` 时自动在 `dist/pagefind/` 生成索引；仅文章正文（`data-pagefind-body`）参与索引。
开发模式下 `/search/` 页面加载不到索引属正常现象，用 `pnpm preview` 验证。

## Cloudflare Pages 部署

| 配置项 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| 环境变量 | 无必需项（可设 `NODE_VERSION=22` 固定 Node 版本） |

自定义域名绑定 `gsycloud.com` 后即可上线；纯静态输出，无需 Functions。
未来如需实时能力（服务状态、账户等），单独评估 Server Islands / Functions，不要整体改为 SSR。

## 发布前检查清单

```bash
pnpm lint
pnpm test
pnpm build
pnpm check:links
pnpm audit:seo
```

全部通过后再部署。
