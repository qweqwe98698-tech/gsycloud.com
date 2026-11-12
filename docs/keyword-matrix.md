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
| 低调机场 / 小众稳定机场 / 低调机场推荐 | commercial | `/airport/quiet-airports-guide/` | airport | live |

## P2 价格、套餐与优惠

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| 便宜机场推荐 / 低价机场 / 平价机场 / 学生党机场 | commercial | `/airport/budget/` | airport | live |
| 按量计费机场 / 不限时机场 / 流量包机场 | commercial | `/airport/unlimited/` | airport | live |
| 机场优惠码 / 机场折扣码 / 机场优惠活动 | transactional | `/airport/coupon/` | airport | live |
| 免费试用机场 / 一元试用机场 | commercial | /airport/free-trial-airport-guide/ | airport  | live |

> `便宜机场推荐` 与 `高性价比机场` 意图相近但角度不同：前者是**品牌筛选页**（带档位列表），
> 后者是**方法论文章**（讲成本逻辑）。两页互相内链，不得互换定位。

## P3 客户端绑定词

| Keyword | Intent | Target URL | Pillar | Status |
| --- | --- | --- | --- | --- |
| Clash Verge订阅 / Clash机场推荐 / Clash订阅链接购买 / 支持Clash Verge的机场 | commercial | `/airport/clash/` | airport | live |
| Shadowrocket机场推荐 / 小火箭机场 / iOS机场推荐 | commercial | `/airport/shadowrocket/` | airport | live |
| v2rayN机场推荐 / Windows机场推荐 | commercial | — | airport | planned |
| Clash教程 / Clash Verge教程 / Clash导入订阅 | informational | `/tutorials/clash/getting-started/` | clash | live |
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
| 专线机场推荐 / 专线机场 / IEPL机场推荐 / IPLC机场推荐 | commercial | `/airport/iepl/` | airport | live |
| IPLC是什么 / IPLC专线 / 国际流量站iplc / iplc国际流量 | informational | `/network/what-is-iplc/` | — | live |
| IPLC和IEPL区别 | informational | `/network/iplc-vs-iepl/` | — | live |
| 原生IP / 原生IP和广播IP区别 / 原生ip是什么 | informational | `/network/native-ip/` | — | live |
| VLESS和VMess区别 / VLESS是什么意思 / vless / 机场协议怎么选 | informational | `/protocols/vless-vs-vmess/` | — | live |
| 原生IP机场推荐 / 家宽IP机场 | commercial | — | airport | planned |

> **关键分工**：`IEPL机场推荐`（买什么）→ `/airport/iepl/`；`IEPL是什么`（知识）→ `/network/`。

## P6 品牌词（42 家精选，全覆盖承接）

每个品牌页承接：品牌名 + 品牌名机场 + 品牌名官网 + 品牌名怎么样 + 品牌名评测
+ 品牌名套餐 + 品牌名优惠码 + 品牌名好用吗 + 品牌名跑路了吗

| 排序 / 推荐位 | 品牌 | Primary Keyword | Target URL | 线路类型 | Status |
| --- | --- | --- | --- | --- | --- |
| Top 1 (自有主推) | 光速云 | 光速云机场怎么样 | /reviews/gsycloud/ | IEPL/企业级内网专线 | live |
| Top 2 | 暮光加速 | 暮光加速机场怎么样 | /reviews/muguang/ | 企业级内网专线/IEPL | live |
| Top 3 | 飞猫云 | 飞猫云机场怎么样 | /reviews/flycat/ | IEPL | live |
| Top 4 | 微风网络 | 微风网络机场怎么样 | /reviews/weifeng/ | IEPL | live |
| Top 5 | 大佬云 | 大佬云机场怎么样 | /reviews/dalaoyun/ | IEPL | live |
| Top 6 | 星岛梦 | 星岛梦机场怎么样 | /reviews/xingdaomeng/ | 中转 | live |
| Top 7 | 隐形人 | 隐形人机场怎么样 | /reviews/yinxingren/ | IEPL | live |
| Top 8 | 二猫云 | 二猫云机场怎么样 | /reviews/ermaoyun/ | IEPL | live |
| Top 9 | 无忧链接 | 无忧链接机场怎么样 | /reviews/wuyou/ | 中转/IEPL | live |
| Top 10 | 唯兔云 | 唯兔云机场怎么样 | /reviews/weituyun/ | IPLC | live |
| Top 11 | Firefly | Firefly机场怎么样 | /reviews/firefly/ | IPLC | live |
| No. 12 | 闪跃 | 闪跃机场怎么样 | /reviews/shanyue/ | IEPL | live |
| No. 13 | 闪电鼠 | 闪电鼠机场怎么样 | /reviews/shandianshu/ | IEPL | live |
| No. 14 | 云界线 | 云界线机场怎么样 | /reviews/yunjiexian/ | IEPL | live |
| No. 15 | 榴莲云 | 榴莲云机场怎么样 | /reviews/liulianyun/ | IEPL | live |
| No. 16 | 神行加速 | 神行加速机场怎么样 | /reviews/shenxing/ | IEPL | live |
| No. 17 | 环球梯 | 环球梯机场怎么样 | /reviews/huanqiuti/ | IEPL | live |
| No. 18 | 梯子云 | 梯子云机场怎么样 | /reviews/tiziyun/ | IEPL | live |
| No. 19 | CyberGuard | CyberGuard机场怎么样 | /reviews/cyberguard/ | IPLC | live |
| No. 20 | 山水云 | 山水云机场怎么样 | /reviews/shanshuiyun/ | 中转 | live |
| No. 21 | 宇宙云 | 宇宙云机场怎么样 | /reviews/yuzoucloud/ | 中转 | live |
| No. 22 | 灵动云 | 灵动云机场怎么样 | /reviews/lingdongyun/ | IEPL | live |
| No. 23 | 灵猫网络 | 灵猫网络机场怎么样 | /reviews/civetnet/ | 中转 | live |
| No. 24 | 浪网 | 浪网机场怎么样 | /reviews/langwang/ | IEPL | live |
| No. 25 | 一翻云 | 一翻云机场怎么样 | /reviews/yifanyun/ | IEPL | live |
| No. 26 | FATCAT | FATCAT机场怎么样 | /reviews/fatcat/ | IEPL/IPLC | live |
| No. 27 | 青云梯 | 青云梯机场怎么样 | /reviews/qingyunti/ | IPLC | live |
| No. 28 | sslar | sslar机场怎么样 | /reviews/sslar/ | IEPL/企业级内网专线 | live |
| No. 29 | U1S1 | U1S1机场怎么样 | /reviews/u1s1/ | 中转 | live |
| No. 30 | 全球云 | 全球云机场怎么样 | /reviews/quanqiuyun/ | 中转 | live |
| No. 31 | FlyingBird | FlyingBird机场怎么样 | /reviews/flyingbird/ | IPLC | live |
| No. 32 | 龙猫云 | 龙猫云机场怎么样 | /reviews/longmaoyun/ | IPLC | live |
| No. 33 | 速界 | 速界机场怎么样 | /reviews/sujie/ | 中转 | live |
| No. 34 | 光年梯 | 光年梯机场怎么样 | /reviews/guangnianti/ | IEPL | live |
| No. 35 | SOGO 云 | SOGO 云机场怎么样 | /reviews/sogoyun/ | IEPL | live |
| No. 36 | 可信云 | 可信云机场怎么样 | /reviews/kexinyun/ | IEPL | live |
| No. 37 | 快狸 | 快狸机场怎么样 | /reviews/kuaili/ | IEPL | live |
| No. 38 | TNTCloud | TNTCloud机场怎么样 | /reviews/tntcloud/ | IPLC | live |
| No. 39 | 极连云 | 极连云机场怎么样 | /reviews/jilianyun/ | IEPL | live |
| No. 40 | EdgeNova | EdgeNova机场怎么样 | /reviews/edgenova/ | IPLC/直连 | live |
| No. 41 | 白月光 | 白月光机场怎么样 | /reviews/baiyueguang/ | 中转 | live |
| No. 42 | WgetCloud | WgetCloud机场怎么样 | /reviews/wgetcloud/ | 企业级内网专线/中转 | live |

> 自有品牌 光速云 另有品牌实体页 /services/（承接 GSY Cloud官网、光速云官网 等
> navigational 词）。/services/ 与 /reviews/gsycloud/ 意图不同：前者是官方服务说明，
> 后者是评测视角，二者互相内链但不得内容重复。

## P7 故障排查

| Keyword | Intent | Target URL | Status |
| --- | --- | --- | --- |
| 节点全部超时 / 机场节点timeout / 节点全红 | informational | `/troubleshooting/all-nodes-timeout/` | live |
| Clash订阅更新失败 / Clash Verge订阅更新失败 / 订阅链接打不开 / 订阅更新timeout | informational | `/troubleshooting/clash-subscription-update-failed/` | live |
| 节点延迟高 / 网络延迟高怎么办 / 太延迟 / 延迟多少算正常 | informational | `/troubleshooting/high-latency/` | live |
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
