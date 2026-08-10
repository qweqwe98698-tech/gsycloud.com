# GSY Cloud 关键词映射表

**用途**：新建页面前必须先查此表。若新内容与已有 URL 的 Search Intent 高度重合，
应当更新原页面而不是创建第二个页面（防止关键词互抢 / Cannibalization）。

**维护规则**
- 一个页面 = 1 个 Primary Keyword + 3–5 个 Secondary + 10–20 个自然长尾词
- Primary Keyword 全站唯一，不得重复分配
- 年份词（2026）每年更新标题、描述、正文与 updatedDate，不新建 URL
- 状态：`live` 已上线 / `planned` 计划中 / `merged` 已合并到其他页面

---

## P0 首页核心词

> 2026-08-10 调整：首页定位从"机场推荐/排行榜"改为"品牌内容站 + 机场评测 + 线路选择 + 网络工具知识"。
> `2026机场推荐`、`稳定机场排行榜` 不再作为首页核心词，转由 `/airport/ranking/`（机场对比页）自然承接，
> 不新建/删除 URL，仅调整首页自身的 Title/H1/文案/Schema 名称。

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| GSY Cloud | navigational | `/` | — | live |
| 机场评测 | commercial | `/`（+ `/reviews/` 承接品牌逐一评测） | — | live |
| 机场选择 / 机场线路 | informational/commercial | `/`（+ `/airport/` 承接选购方法） | — | live |
| 机场套餐 | commercial | `/`（+ `/brands/` 承接套餐结构对比） | — | live |
| 网络工具 | informational | `/`（+ `/tutorials/`、`/troubleshooting/`、`/network/` 承接具体内容） | — | live |

> 首页只承接以上核心词，具体执行分散到各专题页。Clash 机场推荐、ChatGPT 机场推荐、机场优惠码等**不在首页主攻**，交给专题页。
> `/airport/ranking/` 页面自身的标题/定位本轮未改动，仍保留"排行榜"相关表述——如需同步调整，作为独立事项处理。

## P1 排行榜与选购方法

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| 2026机场排行榜 / 机场天梯榜 / 机场排名 | commercial | `/airport/ranking/` | airport | live |
| 2026机场推荐指南 / 值得购买的机场 | commercial | `/airport/2026/` | airport | live |
| 新手机场推荐 / 新手怎么选机场 / 第一次买机场 | commercial | `/airport/beginners/` | airport | live |
| 机场月付 / 年付机场 / 付费周期怎么选 | commercial | `/airport/monthly/` | airport | live |
| 高性价比机场 / 性价比高的机场 | commercial | `/airport/value/` | airport | live |
| 机场品牌库 / 机场导航 / 机场大全 | commercial | `/brands/` | airport | live |

## P2 价格、套餐与优惠

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| 便宜机场推荐 / 低价机场 / 平价机场 / 学生党机场 | commercial | `/airport/budget/` | airport | live |
| 按量计费机场 / 不限时机场 / 流量包机场 | commercial | `/airport/unlimited/` | airport | live |
| 机场优惠码 / 机场折扣码 / 机场优惠活动 | transactional | `/airport/coupon/` | airport | live |
| 免费试用机场 / 一元试用机场 | commercial | — | airport | planned |

> `便宜机场推荐` 与 `高性价比机场` 意图相近但角度不同：前者是**品牌筛选页**（带档位列表），
> 后者是**方法论文章**（讲成本逻辑）。两页互相内链，不得互换定位。

## P3 客户端绑定词

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| Clash机场推荐 / Clash订阅推荐 / 支持Clash的机场 | commercial | `/airport/clash/` | airport | live |
| Shadowrocket机场推荐 / 小火箭机场 / iOS机场推荐 | commercial | `/airport/shadowrocket/` | airport | live |
| v2rayN机场推荐 / Windows机场推荐 | commercial | — | airport | planned |
| Clash教程 / Clash怎么用 / Clash导入订阅 | informational | `/tutorials/clash/getting-started/` | clash | live |
| Shadowrocket教程 / 小火箭教程 | informational | `/tutorials/shadowrocket/getting-started/` | shadowrocket | live |
| v2rayN教程 / v2rayN导入订阅 | informational | `/tutorials/v2rayn/getting-started/` | v2rayn | live |

> **关键分工**：`Clash机场推荐`（买什么）→ `/airport/clash/`；`Clash教程`（怎么用）→ `/tutorials/clash/`。
> 两者搜索意图不同，禁止合并。

## P4 使用场景词

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| ChatGPT机场推荐 / AI机场推荐 / AI解锁机场 | commercial | `/airport/chatgpt/` | airport | live |
| 流媒体解锁机场 / Netflix机场推荐 / 奈飞机场 | commercial | `/airport/streaming/` | airport | live |
| ChatGPT网络环境 / ChatGPT地区不支持 | informational | `/ai/chatgpt/network-guide/` | chatgpt | live |
| Claude网络环境 / Claude节点 | informational | `/ai/claude/network-guide/` | claude | live |
| Netflix代理错误 / Netflix提示代理 | informational | `/streaming/netflix-region-and-nodes/` | — | live |
| TikTok机场推荐 / 游戏机场推荐 / 低延迟机场 | commercial | — | airport | planned |

> **关键分工**：`ChatGPT机场推荐`（买什么）→ `/airport/chatgpt/`；`ChatGPT无法访问`（怎么修）→ `/ai/chatgpt/network-guide/`。

## P5 线路与协议

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| 专线机场推荐 / IEPL机场推荐 / IPLC机场推荐 | commercial | `/airport/iepl/` | airport | live |
| IPLC是什么 / IPLC专线 | informational | `/network/what-is-iplc/` | — | live |
| IPLC和IEPL区别 | informational | `/network/iplc-vs-iepl/` | — | live |
| 原生IP / 原生IP和广播IP区别 | informational | `/network/native-ip/` | — | live |
| VLESS和VMess区别 / 机场协议怎么选 | informational | `/protocols/vless-vs-vmess/` | — | live |
| 原生IP机场推荐 / 家宽IP机场 | commercial | — | airport | planned |

> **关键分工**：`IEPL机场推荐`（买什么）→ `/airport/iepl/`；`IEPL是什么`（知识）→ `/network/`。

## P6 品牌词（16 家，模板化分配）

每个品牌页承接：`品牌名` + `品牌名机场` + `品牌名官网` + `品牌名怎么样` + `品牌名评测`
+ `品牌名套餐` + `品牌名优惠码` + `品牌名好用吗` + `品牌名跑路了吗`

| 品牌 | Primary Keyword | Target URL | Status |
| --- | --- | --- | --- |
| 光速云（自有） | 光速云机场怎么样 | `/reviews/gsycloud/` | live |
| 星岛梦 | 星岛梦机场怎么样 | `/reviews/xingdaomeng/` | live |
| 灵猫网络 | 灵猫网络机场怎么样 | `/reviews/civetnet/` | live |
| 飞猫云 | 飞猫云机场怎么样 | `/reviews/flycat/` | live |
| 唯兔云 | 唯兔云机场怎么样 | `/reviews/weituyun/` | live |
| 宇宙云 | 宇宙云机场怎么样 | `/reviews/yuzoucloud/` | live |
| U1S1 | U1S1机场怎么样 | `/reviews/u1s1/` | live |
| 极连云 | 极连云机场怎么样 | `/reviews/jilianyun/` | live |
| 全球云 | 全球云机场怎么样 | `/reviews/quanqiuyun/` | live |
| 光年梯 | 光年梯机场怎么样 | `/reviews/guangnianti/` | live |
| 一翻云 | 一翻云机场怎么样 | `/reviews/yifanyun/` | live |
| 二猫云 | 二猫云机场怎么样 | `/reviews/ermaoyun/` | live |
| SOGO 云 | SOGO云机场怎么样 | `/reviews/sogoyun/` | live |
| 可信云 | 可信云机场怎么样 | `/reviews/kexinyun/` | live |
| 速界 | 速界机场怎么样 | `/reviews/sujie/` | live |
| 快狸 | 快狸机场怎么样 | `/reviews/kuaili/` | live |

> 自有品牌 `光速云` 另有品牌实体页 `/services/`（承接 `GSY Cloud官网`、`光速云官网` 等
> navigational 词）。`/services/` 与 `/reviews/gsycloud/` 意图不同：前者是官方服务说明，
> 后者是评测视角，二者互相内链但不得内容重复。

## P7 故障排查

| Keyword | Intent | Target URL | Status |
| --- | --- | --- | --- |
| 节点全部超时 / 机场节点timeout / 节点全红 | informational | `/troubleshooting/all-nodes-timeout/` | live |
| Clash订阅更新失败 / 订阅链接打不开 | informational | `/troubleshooting/clash-subscription-update-failed/` | live |
| 节点延迟高 / 延迟多少算正常 | informational | `/troubleshooting/high-latency/` | live |
| 节点速度慢 / 晚高峰速度慢 | informational | `/troubleshooting/slow-speed-causes/` | live |
| 手机流量无法连接 / Wi-Fi能用流量不能用 | informational | — | planned |
| v2rayN节点超时 / Shadowrocket无法连接 | informational | — | planned |

## P8 安全与风险

| Keyword | Intent | Target URL | Status |
| --- | --- | --- | --- |
| 机场跑路 / 机场跑路前兆 / 机场失联 | informational | `/risk/exit-scam-warning-signs/` | live |
| 免费节点 / 免费节点安全吗 | informational | `/nodes/free-nodes-guide/` | live |
| 什么是代理节点 / 机场节点是什么意思 | informational | `/nodes/what-is-a-proxy-node/` | live |
| 机场避坑指南 / 怎么判断机场靠不靠谱 | informational | `/airport/beginners/` | live |
| 订阅链接泄露 / 机场安全吗 | informational | — | planned |

---

## 已知的互抢风险点（必须持续监控）

| 风险对 | 处理方式 |
| --- | --- |
| `/` 与 `/airport/ranking/` 都含「机场排行榜」 | 首页主攻「机场推荐」，榜单页主攻「机场排行榜」；首页榜单区块只展示 6 条并链向榜单页 |
| `/airport/budget/` 与 `/airport/value/` | 前者=品牌筛选页，后者=方法论文章；标题与 H1 不共用「性价比」+「便宜」组合 |
| `/services/` 与 `/reviews/gsycloud/` | 前者 navigational（官网/服务），后者 commercial（评测/怎么样） |
| `/airport/clash/` 与 `/tutorials/clash/` | 前者「买什么」，后者「怎么用」 |
| `/airport/chatgpt/` 与 `/ai/chatgpt/network-guide/` | 前者「买什么」，后者「怎么修」 |
| `/airport/iepl/` 与 `/network/what-is-iplc/` | 前者商业专题，后者知识文章 |

## 新建页面检查清单

1. 该 Primary Keyword 是否已在本表中被分配？→ 是则更新原页面
2. 与哪个已有页面的 Search Intent 最接近？差异能否用一句话说清？→ 不能则合并
3. 新页面能否从 Pillar 页获得入链？→ 不能则先补内链结构
4. 是否需要加入「已知互抢风险点」表持续监控？
