# GSY Cloud 全站 SEO / GEO / 索引与质量验收报告

验收日期：2026-08-10
验收范围：gsycloud.com 全部 180 个构建页面（Astro 5 静态站点）

---

## 一、已检查范围

- 全部 180 个静态页面（首页、11 个内容栏目及其文章页、9 个机场选购专题页、16 篇品牌评测、
  16 家品牌品牌库页、93 个标签页、作者页、静态信息页、404、搜索、HTML 网站地图）
- 全部组件、布局、内容数据文件（`brands.ts`/`topics.ts`/`pillars.ts`/`services.ts`）
- `robots.txt`、`sitemap-index.xml`/`sitemap-0.xml`、`rss.xml`、IndexNow 密钥文件
- 全部 JSON-LD 结构化数据、Open Graph、Twitter Card、canonical
- 全部内部链接（11336 条）、点击深度、孤立页面
- 移动端响应式、深色模式对比度、键盘可达性、`prefers-reduced-motion`
- 图片格式/尺寸/懒加载、JS/CSS 体积、字体加载策略

验证方式：**实际运行构建与测试命令**，未仅凭代码阅读判断可用性（详见第十四节命令记录）。

---

## 二、已发现并修复的问题

| # | 问题 | 严重程度 | 修复方式 |
|---|---|---|---|
| 1 | Sitemap 包含 93 个标签页中的 86 个 noindex 稀疏标签页，与页面本身的 noindex 设置矛盾 | 高 | 新增 `scripts/fix-sitemap.mjs`，构建后二次过滤，移除全部 noindex 页面 |
| 2 | Sitemap 缺少 `<lastmod>`，更新时间未与页面正文同步 | 中 | 同一脚本从页面 `article:modified_time` meta 回填 lastmod，38 篇文章全部补齐 |
| 3 | `WebSite` 结构化数据缺少 `SearchAction`，且站内搜索页原本不支持 URL 深链接 | 中 | 先给 `/search/` 加 `?q=` 参数支持（实测可用，非摆设），再补 `SearchAction` 指向该真实功能 |
| 4 | 文章 `author` 字段是匿名内联 Person 对象，无稳定 `@id`，作者页也无 Person 结构化数据 | 中 | 新增 `personSchema()`，文章页与作者主页共用同一 `@id`，避免抓取单页时引用悬空 |
| 5 | `/about/`、`/contact/` 使用通用页面结构，未声明 `AboutPage`/`ContactPage` 语义类型 | 低 | 新增 `webPageSchema()` 并接入两个页面 |
| 6 | **93 个标签页中 7 个符合索引条件的页面完全没有内部入链（孤岛）**：文章 frontmatter 的 `tags` 字段从未被渲染成可点击链接 | 高 | 新建 `TagList.astro` 组件，接入全部文章与评测页；重新构建后 7 个可索引标签页深度从"不可达"变为深度 2，`/tags/` 索引页通过面包屑深度 3 可达 |
| 7 | `personSchema()` 调用存在 `{ id: x, ...data }` 冗余键，TypeScript 严格模式报错（`ts(2783)`） | 低（构建阻断级） | `authors.json` 的 schema 本身含 `id` 字段，spread 已提供，删除冗余显式键，3 处修复后 `pnpm check` 归零错误 |
| 8 | 品牌测速图未显式声明输出格式 | 低 | `SpeedTestFigure`/品牌库缩略图显式声明 `format="webp" quality={80}`（实测响应式各档位已是 WebP，此项为显式化，非功能性修复） |

修复后复核：`pnpm lint && pnpm check && pnpm test && pnpm build && pnpm check:links && pnpm audit:seo` 全部通过，0 错误 0 警告。

---

## 三、SEO 配置完成情况

| 项目 | 状态 |
|---|---|
| 每页唯一 Title / Description / H1 / Canonical | ✅ 程序化审计强制校验（重复即构建失败） |
| Open Graph / Twitter Card（含绝对 URL 图片） | ✅ 全站统一由 `SEO.astro` 生成，审计校验 og:image 必须为绝对地址 |
| robots.txt | ✅ 存在、格式正确，仅禁止 `/search/`，未误屏蔽静态资源 |
| Sitemap（域名、HTTPS、trailingSlash、noindex 过滤、lastmod） | ✅ 见第二节修复 #1 #2 |
| HTML 网站地图 | ✅ 新增 `/sitemap/`，按栏目分组列出全部可索引页面 |
| RSS Feed | ✅ `/rss.xml`，收录最近 50 篇文章 |
| 404 自定义页面 | ✅ 提供搜索入口与热门栏目引导 |
| 点击深度 | ✅ 全站最大深度 3（179 个非首页页面），核心转化页（品牌库/排行榜/评测）深度 1 |
| 孤立页面 | ✅ 实测 0（含此前隐藏的标签页孤岛问题，已修复） |
| Canonical 一致性 / 重复检测 | ✅ 程序化审计逐页校验 |
| noindex 误配置检测 | ✅ 新增检查：非预期页面被 noindex 会导致构建失败 |
| 关键词矩阵 / 防内耗映射 | ✅ 见 `docs/keyword-matrix.md`，含 6 组已识别互抢风险点及处理方式 |

---

## 四、GEO（生成式引擎优化）配置完成情况

- 全部知识/教程/故障类文章遵循统一结构：**开头直接回答 → 核心要点 → 问题式 H2 → 表格/步骤 → FAQ → 总结**
- 品牌评测明确标注：数据采集来源（品牌方提供）、信息状态（`dataStatus`：实测/参考/示例/混合，前台可见徽标）、
  推广关系（每篇正文顶部 `AffiliateDisclosure` 组件）、最近检查时间
- 未核实信息（12 家品牌开业时间、多家 AI/流媒体解锁状态）统一显示"暂未核实"，不推测填充、不编造数据
- FAQPage 结构化数据仅用于页面真实可见的 FAQ，问答内容与正文一致
- 专题页（9 个）均包含"怎么判断哪一档适合你"的显式判断标准段落，结论前置且给出依据

---

## 五、结构化数据完成情况

| 类型 | 应用页面 | 必填字段校验 |
|---|---|---|
| Organization / WebSite（含 SearchAction） | 全站 | ✅ |
| BreadcrumbList | 全部内容页 | ✅ |
| BlogPosting | 22 篇知识/教程/故障文章 + 16 篇评测 | ✅ |
| Person（带稳定 `@id`） | 文章 author 引用 + 作者主页完整节点 | ✅ |
| FAQPage | 含可见 FAQ 的页面 | ✅ 仅用真实可见问答 |
| CollectionPage / ItemList | 栏目页、专题页、品牌库、作者页 | ✅ |
| AboutPage / ContactPage | `/about/`、`/contact/` | ✅ |

- 审计脚本对每种类型做必填字段校验（缺失即报错），并显式禁止 `AggregateRating`/`Review` 类型出现——
  全站不存在任何虚构评分。
- 未滥用 Schema 类型换取富媒体结果；未虚构评价数量、认证或团队规模。

---

## 六、Sitemap 与 robots.txt 状态

```
robots.txt: https://gsycloud.com/robots.txt
  User-agent: *
  Allow: /
  Disallow: /search/
  Sitemap: https://gsycloud.com/sitemap-index.xml

sitemap-index.xml → sitemap-0.xml：160 个 URL（已排除 20 个 noindex 页面），38 个 lastmod
IndexNow 密钥文件：/eb40d87805194665b7b49042b8e60024.txt（已生成，随构建产物部署）
```

---

## 七、页面性能与移动端状态

| 项目 | 结果 |
|---|---|
| 自定义 JS | **0**（仅内联 vanilla script：主题切换/移动菜单/TOC 高亮/搜索深链接/表格排序） |
| CSS | 单文件 ~50KB（已压缩，Tailwind v4 按实际使用自动裁剪） |
| 字体 | 0 外部字体请求（system-ui 系统字体栈，无 FOUT/FOIT 风险） |
| 第三方脚本 | 0 |
| 图片 | astro:assets 自动 WebP + 响应式 srcset + 显式 width/height（0 张缺失尺寸）+ 懒加载 |
| `prefers-reduced-motion` | ✅ 已支持 |
| 移动端横向溢出 | ✅ 结构审查确认：宽表格均包裹 `overflow-x-auto`，Markdown 正文表格移动端自动可滚动 |
| 深色模式对比度 | 正文 ~11.5:1（超 WCAG AAA），次要文字 ~4.83:1（达 WCAG AA） |
| 移动导航 | ✅ 实测汉堡菜单展开/收起、`aria-expanded` 同步正确 |

**已知但影响可忽略的项目**：`dist/_astro/` 下有 16 个未被任何页面引用的原始 `.jpg` 文件（约 3.9MB），
是 Astro 官方文档推荐的"目录级动态图片导入"模式（`import.meta.glob` + `<Image>`）的固有副作用——
Vite 对被导入的源文件本身也做一份静态拷贝，与 `<Image>` 组件生成的响应式 WebP 变体是两条独立管线。
由于没有任何页面引用这些文件，对 LCP/INP/CLS、爬虫抓取预算均无影响，仅略微增加部署包体积。
消除它需要放弃官方推荐模式、改用更脆弱的手写方案，用维护成本换取一个不影响用户体验的指标，
故保留现状并如实记录。

---

## 八、内部链接与孤立页面状态

- 全站 11336 条内部链接，**0 死链、0 空链接**
- 修复前发现的孤岛问题：7 个符合索引条件的标签页无入链 → 已通过 `TagList` 组件在全部文章/评测页
  渲染可点击标签修复，修复后实测深度均为 2
- 关键词矩阵内链分工见 `docs/keyword-matrix.md`：区分"买什么"（专题页）与"怎么用/怎么修"
  （教程/知识页），避免同质页面互抢

---

## 九、仍需站长手动完成的事项

以下事项无法在代码库中验证或不应由代码自动完成，需部署上线后由站长操作：

1. **Cloudflare Pages 实际部署**：Build command `pnpm build`，Output directory `dist`，
   建议设置 `NODE_VERSION=22`。
2. **HTTPS 强制跳转 / www 与不带 www 域名统一**：由 Cloudflare Pages 平台层保证（Pages 项目
   默认强制 HTTPS），www/apex 的收敛策略需在 Cloudflare DNS 或 Pages 自定义域名设置中配置，
   本地代码库无法验证实际生效情况。
3. **Google Search Console**：添加资源并完成验证；代码已预留 `GOOGLE_SITE_VERIFICATION`
   环境变量注入验证 meta 标签的机制（见 `.env.example`），验证码需站长自行在 GSC 获取后
   配置到 Cloudflare Pages 环境变量。提交 `sitemap-index.xml`。
4. **Bing Webmaster Tools**：同上，环境变量为 `BING_SITE_VERIFICATION`。提交 sitemap 后，
   部署完成可运行 `pnpm submit:indexnow` 主动推送全部 URL（该脚本刻意未接入构建流程，
   因为网站上线前推送没有意义）。
5. **`support@gsycloud.com` 邮箱**：联系页面已使用该地址，需确认该邮箱已实际配置并有人处理。
6. **实际收录与排名效果**：搜索引擎抓取、索引、排名的时间与结果完全由搜索引擎决定，
   本次工作只能提升被正确抓取、理解、索引与引用的概率，**不构成任何收录时间或排名承诺**。

---

## 十、提交建议

- **Google Search Console**：验证资源后提交 `https://gsycloud.com/sitemap-index.xml`；
  对首批 20 篇标杆文章可使用"网址检查"工具逐一请求编入索引，加快首轮抓取。
- **Bing Webmaster Tools**：同样提交 sitemap；Bing 支持从 GSC 一键导入设置，可优先操作。
- **IndexNow**：部署后运行 `pnpm submit:indexnow` 一次性提交全部 160 个 URL；后续内容更新
  建议扩展该脚本按增量提交（当前版本每次提交全量，量级尚小可接受）。

---

## 十一、后续内容与维护建议

- 品牌信息（价格/流量/优惠码）建议每月核对一次官网实际信息，`brands.ts` 改一处全站同步
- 待建设的 `planned` 专题页见 `docs/keyword-matrix.md`：免费试用机场、v2rayN 机场推荐、
  原生 IP 机场推荐、TikTok/游戏/低延迟机场
- `reviews` 集合外的其余内容按 90 天计划的 Cluster 扩展阶段推进（教程子专题、更多故障词、
  协议对比页）
- 每次新增内容后建议跑一遍本次建立的验收链：
  ```bash
  pnpm lint && pnpm check && pnpm test && pnpm build && pnpm check:links && pnpm audit:seo
  ```

---

## 十二、命令执行记录（本次验收实际运行，非仅阅读代码）

```
pnpm lint          → 0 errors
pnpm check         → 0 errors, 0 warnings, 0 hints（86 files）
pnpm test          → 4 test files, 49 tests, all passed
pnpm build         → 180 pages built, Pagefind indexed 38 pages
pnpm check:links   → 180 pages scanned, 11336 internal links, 0 dead/empty links
pnpm audit:seo     → 180 pages audited, 0 errors, 0 warnings
```

---

## 十三、明确声明

- 本报告不承诺任何关键词排名结果，不承诺固定时间内获得收录或流量。
- 所有已修复项目均已通过实际构建与自动化脚本验证，而非仅凭代码审查判断。
- 结构化数据、页面内容与可见信息保持一致，未虚构评分、评价数量、运营数据或团队规模。
