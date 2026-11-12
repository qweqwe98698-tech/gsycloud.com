/**
 * 机场品牌库 —— 全站唯一数据源（收录 42 家精选机场品牌）。
 *
 * 品牌库、品牌评测页、排行榜、专题页、对比表、首页推荐卡片共享此处数据，
 * 修改一处即可全站同步。
 *
 * 数据纪律（重要）：
 * - 价格、流量、优惠码、推广链接、主打卖点均来自品牌方提供的资料，属 reference（参考资料）；
 * - 未提供的信息（如开业时间、节点数量）一律置为 null，前台显示「暂未核实」，禁止虚构；
 * - 测速图为测速面板导出图，原始数据未修改，测试时间已隐去，仅供参考；
 * - `house: true` 表示本站自有品牌，前台必须明确标识，不得伪装成第三方中立评测；
 * - `featuredRank` 用于实现指定的推荐权重排序，数值越小越靠前。
 */

export type LineType = 'IEPL' | 'IPLC' | '企业级内网专线' | '中转' | '直连';
export type UnlockLevel = 'full' | 'partial' | 'unverified';

export interface AirportBrand {
  /** URL slug，对应 /reviews/<slug>/ 与测速图文件名 */
  slug: string;
  /** 中文品牌名 */
  name: string;
  /** 一句话定位（用于卡片副标题，各品牌必须不同） */
  tagline: string;
  /** 是否为本站自有品牌 */
  house: boolean;
  /** 推荐排序顺位（可选，指定前十等核心推荐权重） */
  featuredRank?: number;
  /** 推广/注册链接 */
  affiliateUrl: string;
  /** 优惠码 */
  couponCode: string | null;
  /** 优惠说明 */
  couponNote: string | null;
  /** 最低月均价格（元），用于排序与筛选 */
  minPrice: number;
  /** 最低价套餐的流量（GB/月） */
  minTraffic: number;
  /** 最低价套餐的付费周期 */
  minPriceCycle: '月付' | '季付' | '年付';
  /** 每 GB 单价（元），由 minPrice / minTraffic 派生，用于性价比排序 */
  pricePerGb: number;
  /** 开业时间说明，未核实为 null */
  established: string | null;
  /** 线路类型 */
  lines: LineType[];
  /** 协议 */
  protocols: string[];
  /** 节点/网络特点（各品牌不同） */
  networkFeatures: string[];
  /** AI 工具支持 */
  aiSupport: UnlockLevel;
  /** 流媒体支持 */
  streamingSupport: UnlockLevel;
  /** 客户端支持 */
  clients: string[];
  /** 是否有自研客户端 */
  ownClient: boolean;
  /** 是否支持订阅导入第三方客户端 */
  subscriptionImport: boolean;
  /** 是否提供不限时/按量套餐 */
  payAsYouGo: boolean;
  /** 适合人群 */
  targetUsers: string[];
  /** 主要优势 */
  advantages: string[];
  /** 使用注意事项（必须真实、克制，不编造负面信息） */
  cautions: string[];
  /** 推荐标签，用于专题页筛选 */
  tags: BrandTag[];
}

export type BrandTag =
  | 'budget' // 便宜/低价
  | 'value' // 高性价比
  | 'premium' // 高端
  | 'veteran' // 老牌
  | 'iepl' // 专线
  | 'ai' // AI 场景
  | 'streaming' // 流媒体场景
  | 'beginner' // 新手友好
  | 'unlimited' // 不限时/按量
  | 'large-traffic' // 大流量
  | 'small-package'; // 小流量包

export const BRAND_TAG_LABEL: Record<BrandTag, string> = {
  budget: '低价入门',
  value: '高性价比',
  premium: '中高端',
  veteran: '老牌运营',
  iepl: '专线线路',
  ai: 'AI 场景',
  streaming: '流媒体',
  beginner: '新手友好',
  unlimited: '不限时套餐',
  'large-traffic': '大流量',
  'small-package': '小流量包',
};

export const UNLOCK_LABEL: Record<UnlockLevel, string> = {
  full: '支持',
  partial: '部分支持',
  unverified: '暂未核实',
};

export const AIRPORT_BRANDS: AirportBrand[] = [
  {
    "slug": "gsycloud",
    "name": "光速云",
    "tagline": "六年运营 · IEPL 企业级内网专线 · AI 与流媒体双全解锁",
    "house": true,
    "featuredRank": 1,
    "affiliateUrl": "https://sahude.gsyvipaff.com/#/?code=keqgvT5Y",
    "couponCode": "AMM",
    "couponNote": "新用户立减优惠券，结算输入 AMM 即可生效",
    "minPrice": 8.25,
    "minTraffic": 69,
    "minPriceCycle": "年付",
    "pricePerGb": 0.11956521739130435,
    "established": "2020 年",
    "lines": [
      "IEPL",
      "企业级内网专线"
    ],
    "protocols": [
      "VLESS",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "双线路架构：企业级 IEPL 专线 + 隧道中转备份",
      "节点覆盖香港×20、日本×10、新加坡×10、美国×10、台湾×5、东南亚与欧洲",
      "全节点最高 2.5Gbps 带宽支持，全节点 1 倍率不掺水",
      "7×24 小时全时段运维监控与备用入口冗余"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端（Win/mac/Android）",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "重视晚高峰极致稳定性的长期主力用户",
      "深度使用 ChatGPT、Claude、Gemini 的 AI 开发者",
      "需要 4K/8K 极速加载的流媒体追剧重度用户",
      "希望兼顾自研一键客户端与专业通用客户端的多端用户"
    ],
    "advantages": [
      "六年连续稳定运营历史，无跑路或长时间失联记录",
      "自研客户端内置智能测速与一键连接，极易上手",
      "提供 147 元 247GB 永久不限时套餐，低频备用无需月年月续",
      "香港、日本、新加坡核心近地节点晚高峰稳定在 20–55ms 极低延迟"
    ],
    "cautions": [
      "年付轻量版与不限时特殊商品不支持退款，建议按真实需求选择",
      "小部分边缘小众地区节点可能因上游机房波动临时维护",
      "月付极速版 25 元门槛高于白菜价机场，主打品质与稳定性"
    ],
    "tags": [
      "iepl",
      "ai",
      "streaming",
      "veteran",
      "value",
      "unlimited",
      "beginner"
    ]
  },
  {
    "slug": "muguang",
    "name": "暮光加速",
    "tagline": "BGP 智能调度 · 专线级出口 · 全平台支持与 7×24 真人客服",
    "house": false,
    "featuredRank": 2,
    "affiliateUrl": "https://varnexa.twilightaff.com/#/?code=D1LHglg3",
    "couponCode": "muguang5555",
    "couponNote": "结算输入专属优惠码可享专属折扣",
    "minPrice": 9.08,
    "minTraffic": 70,
    "minPriceCycle": "年付",
    "pricePerGb": 0.12971428571428573,
    "established": "2023 年",
    "lines": [
      "企业级内网专线",
      "IEPL"
    ],
    "protocols": [
      "VLESS",
      "Trojan",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "BGP 智能动态调度，多地入口自动分配最优低延迟路由",
      "核心专线出口：香港、新加坡、日本、台湾、美国主流近地全覆盖",
      "实测香港节点延迟 26ms、新加坡 43ms、下载速率超 500Mbps",
      "支持不限时按量流量包（150G–800G），用量不规律用户首选"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "Windows",
      "macOS",
      "iOS",
      "Android",
      "Linux",
      "Clash Verge",
      "Shadowrocket"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "跨境协同办公、多设备同时在线的团队与个人",
      "经常需要调用 ChatGPT、Claude 等 AI 工具的专业开发者",
      "用量不规律但需要高品质专线备用的用户"
    ],
    "advantages": [
      "多设备同时在线支持友好，全平台客户端覆盖完整",
      "实测 AI 工具与海外流媒体解锁率极高",
      "提供 7×24 小时真人客服与工单支持，响应快速",
      "套餐档位丰富，从月付 120GB 到旗舰 1500GB 覆盖全面"
    ],
    "cautions": [
      "Gemini 工具需选择对应支持节点，部分欧美节点需手动切换",
      "不限时大容量包单次支付总额较高，建议初次先选月付测试"
    ],
    "tags": [
      "iepl",
      "ai",
      "streaming",
      "value",
      "unlimited",
      "beginner"
    ]
  },
  {
    "slug": "flycat",
    "name": "飞猫云",
    "tagline": "专属客户端免配置 · 年付月均 7 元 IEPL 专线 · 新手即开即用",
    "house": false,
    "featuredRank": 3,
    "affiliateUrl": "https://guangs.flycataff.com/#/?code=6uq0Xe9y",
    "couponCode": "flycat888",
    "couponNote": "结算输入 flycat888 享活动折扣",
    "minPrice": 7,
    "minTraffic": 50,
    "minPriceCycle": "年付",
    "pricePerGb": 0.14,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks",
      "VLESS"
    ],
    "networkFeatures": [
      "自研专属客户端，下载登录即用，免除手动导入订阅繁琐步骤",
      "IEPL 专线接入，香港实测 21ms、新加坡 45ms、日本 54ms",
      "覆盖亚太与欧美热门地区核心节点"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "Windows",
      "macOS",
      "Android",
      "iOS（自研与第三方导入双轨）"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "不愿折腾 Clash 复杂配置的新手小白",
      "学生党与轻度科学上网用户",
      "月流量在 50G 以内的低预算用户"
    ],
    "advantages": [
      "门槛极低，年付折合月均仅 7 元即可享受专线品质",
      "专属客户端开箱即用，界面清爽无学习成本",
      "流媒体与 AI 解锁能力完备，日常刷剧查资料无障碍"
    ],
    "cautions": [
      "学生版 50GB 月流量对于 4K 高码率重度观影可能偏紧",
      "追求极致规则策略组自定义的极客用户更建议搭配 Clash Verge 使用"
    ],
    "tags": [
      "budget",
      "value",
      "iepl",
      "beginner",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "weifeng",
    "name": "微风网络",
    "tagline": "IEPL 专线 + VLESS · 多地原生 IP · 7×24 在线与 AI 客服值守",
    "house": false,
    "featuredRank": 4,
    "affiliateUrl": "https://edp01.breezenetaff.com/#/?code=t3huofyI",
    "couponCode": "flat888",
    "couponNote": "结算输入 flat888 可享活动折扣",
    "minPrice": 11.42,
    "minTraffic": 100,
    "minPriceCycle": "年付",
    "pricePerGb": 0.1142,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "纯 IEPL 专线传输，香港节点实测 25ms、新加坡 43ms、下载达 546Mbps",
      "多地部署原生 IP 节点，大幅降低平台风控封禁概率",
      "支持按量不限时信风/长风套餐（200元 270GB 起）"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "重视客服沟通质量与快速反馈的新手用户",
      "追求稳定低延迟的原生 IP 需求者",
      "需要不限时专线流量包的备用用户"
    ],
    "advantages": [
      "性价比突出，年付 137 元即享每月 100GB 纯 IEPL 专线",
      "原生 IP 节点质量上乘，流媒体与 ChatGPT 解锁稳定",
      "夜间有 AI 客服值守，遇到订阅故障能迅速获取排查方向"
    ],
    "cautions": [
      "未提供自研一键客户端，需要用户自行下载第三方客户端导入订阅",
      "月付 27 元略高于纯中转机场，建议预算充裕者优先选择"
    ],
    "tags": [
      "iepl",
      "value",
      "ai",
      "streaming",
      "unlimited"
    ]
  },
  {
    "slug": "dalaoyun",
    "name": "大佬云",
    "tagline": "年付月均 5.6 元极低门槛 · IEPL 专线 · 自研与第三方双支持",
    "house": false,
    "featuredRank": 5,
    "affiliateUrl": "https://qwerty.dalaoyunaff.com/#/?code=jCPLmoWN",
    "couponCode": "dly888",
    "couponNote": "季付及以上结算输入 dly888 享 7 折大额优惠",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "IEPL 专线标准架构，VLESS 协议轻量承载",
      "年付折算仅 5.6 元/月，季付及以上支持 7 折促销",
      "提供自研多端客户端与标准 Clash/Shadowrocket 订阅导入"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "对单价极度敏感、寻求极致性价比的学生党",
      "需要低成本备用专线梯子的日常浏览者"
    ],
    "advantages": [
      "专线阵营中门槛最低的品牌之一，月均仅 5.6 元",
      "自研客户端降低了新手学习成本",
      "提供常见流媒体解锁支持，网页访问流畅"
    ],
    "cautions": [
      "极低价位段超售率相对严格，晚高峰极度高并发时有降速波动",
      "AI 解锁表现视具体节点分配，部分 AI 深度调用需手动测速切换"
    ],
    "tags": [
      "budget",
      "value",
      "iepl",
      "beginner",
      "small-package"
    ]
  },
  {
    "slug": "xingdaomeng",
    "name": "星岛梦",
    "tagline": "老牌运营 · 年付月均 8 元起 · 套餐档位最全且含不限时流量",
    "house": false,
    "featuredRank": 6,
    "affiliateUrl": "https://guangs.xdmyunaff.cc/#/?code=g3Y25k4C",
    "couponCode": "xdm888",
    "couponNote": "结算输入 xdm888 享活动优惠",
    "minPrice": 8,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.13333333333333333,
    "established": "2021 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "成熟三网优化国内中转线路，负载均衡集群调度",
      "实测香港节点延迟 28ms、日本 48ms，节点列表非常丰富",
      "提供长期不限时按量计费包，用完为止"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "用量不稳定、寻求不限时流量包的轻度网民",
      "看重多年运营口碑与套餐丰富度的用户"
    ],
    "advantages": [
      "运营多年，社群活跃度高，信誉记录良好",
      "套餐体系非常完善，从 8 元/月到大流量按量包应有尽有",
      "自研客户端与第三方订阅无缝兼容"
    ],
    "cautions": [
      "线路为国内中转而非全专线，晚高峰极端拥堵时抗抖动弱于纯专线",
      "低价年付小包流量仅 60GB，看高清长视频需注意流量消耗"
    ],
    "tags": [
      "veteran",
      "value",
      "unlimited",
      "beginner",
      "streaming"
    ]
  },
  {
    "slug": "yinxingren",
    "name": "隐形人",
    "tagline": "IEPL 专线 · 年付月均 7 元 · 主打稳定私密抗封锁",
    "house": false,
    "featuredRank": 7,
    "affiliateUrl": "https://guangs.yinxingrenaff.cc/#/?code=G4W0669K",
    "couponCode": "yxr888",
    "couponNote": "结算输入 yxr888 享专属折扣",
    "minPrice": 7,
    "minTraffic": 50,
    "minPriceCycle": "年付",
    "pricePerGb": 0.14,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "IEPL 内网专线直连，不过公网国际出口",
      "节点高防抗封锁优化，保障敏感时期的持续在线率",
      "香港、日本、美国主力节点全天候可用"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "对连接私密性、抗封锁能力要求较高的商务用户",
      "追求低价 IEPL 专线稳定性的日常浏览者"
    ],
    "advantages": [
      "纯 IEPL 专线，晚高峰丢包率极低",
      "年付折算仅 7 元/月，性价比极具竞争力",
      "支持流媒体与主流 AI 工具全面解锁"
    ],
    "cautions": [
      "月付门槛相对年付折算偏高，更推荐直接选年付尝鲜",
      "不提供不限时按量流量包，每月流量月底清零"
    ],
    "tags": [
      "iepl",
      "value",
      "budget",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "ermaoyun",
    "name": "二猫云",
    "tagline": "全线 IEPL 专线 · VLESS 协议 · 不限设备连接数",
    "house": false,
    "featuredRank": 8,
    "affiliateUrl": "https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW",
    "couponCode": "ermao5555",
    "couponNote": "结算输入 ermao5555 享专属优惠",
    "minPrice": 7.42,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.12366666666666666,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "全线部署 IEPL 专线，海外技术团队主理，不打价格战主打稳定",
      "不限制账号设备连接数，支持手机、电脑、软路由同时在线",
      "实测香港节点延迟 22ms、日本 53ms、下载速度达 481Mbps",
      "支持 99 元 100GB 不限时永久套餐"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "独家定制客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "家庭多成员或极客多设备同时联网用户",
      "追求长期不折腾、注重线路品质的专线用户"
    ],
    "advantages": [
      "不限设备数，单账号可同时分配给多台终端使用",
      "实测下行带宽充沛，4K 视频秒开无卡顿",
      "提供年付小包与永久不限时包，方案灵活"
    ],
    "cautions": [
      "Claude 与 Gemini 解锁视具体节点而定，建议先月付验证",
      "节点以香港、日本、美国为主，未配备东南亚冷门小语种节点"
    ],
    "tags": [
      "iepl",
      "value",
      "streaming",
      "unlimited",
      "large-traffic"
    ]
  },
  {
    "slug": "wuyou",
    "name": "无忧链接",
    "tagline": "全线无倍率不限速 · 专属客户端即开即用 · 跨境电商与轻量首选",
    "house": false,
    "featuredRank": 9,
    "affiliateUrl": "https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL",
    "couponCode": "wuyou666",
    "couponNote": "结算输入 wuyou666 享活动折扣",
    "minPrice": 6.58,
    "minTraffic": 40,
    "minPriceCycle": "年付",
    "pricePerGb": 0.1645,
    "established": "2025 年",
    "lines": [
      "中转",
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks",
      "VLESS"
    ],
    "networkFeatures": [
      "全线节点 1.0 倍率、不限速、不限设备数量",
      "专属客户端开箱即用，无需配置复杂的规则分流",
      "香港、日本、新加坡、美国全覆盖，实测香港延迟 23ms，支持 TikTok 跨区直连",
      "提供 100G/300G 永久不限时无忧流量包"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "专属客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "TikTok 跨境电商带货运营与社媒营销人员",
      "零基础小白与寻求便宜备用机场的用户"
    ],
    "advantages": [
      "门槛极低，年付折算月均仅 6.5 元，一次性试错成本极小",
      "全节点 1 倍率，无隐形扣费，流量算得清清楚楚",
      "提供 7×24 小时客服与 AI 智能排查助手"
    ],
    "cautions": [
      "基础版月流量仅 40GB，不适合全天候下载或大文件同步",
      "作为较新的品牌，建议重要业务配置冗余备用方案"
    ],
    "tags": [
      "budget",
      "value",
      "beginner",
      "unlimited",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "weituyun",
    "name": "唯兔云",
    "tagline": "IPLC 纯专线 · 1倍率不限速 · AI 工具与多平台流媒体全解锁",
    "house": false,
    "featuredRank": 10,
    "affiliateUrl": "https://guangs.v2yunvipaff.com/#/?code=xIutqOBA",
    "couponCode": "weitu666",
    "couponNote": "结算输入 weitu666 享新人专属特惠",
    "minPrice": 6.66,
    "minTraffic": 45,
    "minPriceCycle": "年付",
    "pricePerGb": 0.148,
    "established": "2023 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "全线真 IPLC 专线，全节点 1 倍流量，不限速不限设备",
      "实测香港节点延迟 27ms、新加坡 44ms、下载速度达 500Mbps",
      "提供 100G/200G/500G 永久不限时流量包"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "对 IPLC 专线晚高峰稳定性有执着追求的用户",
      "日常重度使用 ChatGPT、Claude、Gemini 的 AI 从业人员"
    ],
    "advantages": [
      "IPLC 专线定价亲民，月付 14.9 元或年付 79.9 元极具性价比",
      "主流 AI 与流媒体全面解锁，节点质量扎实",
      "不限制客户端连接数，家庭多设备共享便捷"
    ],
    "cautions": [
      "特惠限量款 45GB 流量偏小，重度追剧建议选择 150GB 普通版",
      "节假日促销时注册量激增，初次使用建议先测速选定节点"
    ],
    "tags": [
      "iepl",
      "value",
      "budget",
      "ai",
      "streaming",
      "unlimited"
    ]
  },
  {
    "slug": "firefly",
    "name": "Firefly",
    "tagline": "IPLC 专线 + VLESS · 原生 IP 节点 · 不限设备与专属客户端",
    "house": false,
    "featuredRank": 11,
    "affiliateUrl": "https://vip02.fireflyaff.com/#/?code=2n7VURre",
    "couponCode": "firefly",
    "couponNote": "新用户结算输入 firefly 享 8 折优惠（年付版除外）",
    "minPrice": 8,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.13333333333333333,
    "established": "2024 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "IPLC 专线 + VLESS 协议现代化架构，全节点不限速",
      "精选香港、日本、新加坡、美国等多地纯净原生 IP 节点",
      "海外资深运维团队维护，夜间 AI 客服 7×24 小时在线",
      "提供 100 元 100GB 永久不限时流量包"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "专属客户端（免配置一键连接）"
    ],
    "ownClient": true,
    "subscriptionImport": false,
    "payAsYouGo": true,
    "targetUsers": [
      "希望完全免去手动配置订阅麻烦的用户",
      "需要纯净原生 IP 解锁 AI 和社媒的高阶用户"
    ],
    "advantages": [
      "专属客户端下载即用，不用担心订阅链接泄漏或格式错误",
      "IPLC 专线配合原生 IP，出口风控评级极佳",
      "支持主流 AI 工具与流媒体全解锁"
    ],
    "cautions": [
      "主要依靠专属客户端，未向普通用户开放公开订阅链接导入第三方",
      "年付低价版不支持使用优惠码叠加折扣"
    ],
    "tags": [
      "iepl",
      "value",
      "ai",
      "streaming",
      "unlimited",
      "beginner"
    ]
  },
  {
    "slug": "yuzoucloud",
    "name": "宇宙云",
    "tagline": "中转大流量 · 2024 新品牌 · 年付折算 5.8 元",
    "house": false,
    "affiliateUrl": "https://guangs.yzyunaff.cc/#/?code=388R5674",
    "couponCode": "yzyun888",
    "couponNote": "结算输入 yzyun888 享活动折扣",
    "minPrice": 5.83,
    "minTraffic": 50,
    "minPriceCycle": "年付",
    "pricePerGb": 0.1166,
    "established": "2024 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "国内优质 BGP 入口，多线自动中转，支持主流客户端导入"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "低预算轻度浏览者",
      "备用机场需求者"
    ],
    "advantages": [
      "价格极其亲民，年付仅 70 元",
      "自研客户端容易上手"
    ],
    "cautions": [
      "晚高峰可能出现波动，重度办公建议备用专线"
    ],
    "tags": [
      "budget",
      "value",
      "beginner"
    ]
  },
  {
    "slug": "u1s1",
    "name": "U1S1",
    "tagline": "月付 15 元起 · 中转网络 · 流媒体与 AI 解锁兼顾",
    "house": false,
    "affiliateUrl": "https://guangs.u1s1yunaff.com/#/?code=f41vWjWJ",
    "couponCode": "u1s1888",
    "couponNote": "结算输入 u1s1888 享折扣",
    "minPrice": 15,
    "minTraffic": 100,
    "minPriceCycle": "月付",
    "pricePerGb": 0.15,
    "established": "2023 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "均衡中转架构，节点覆盖广泛，支持全平台订阅导入"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "月付尝鲜用户",
      "日常流媒体与网课用户"
    ],
    "advantages": [
      "无需长周期押金，月付 15 元门槛低",
      "流媒体解锁稳定"
    ],
    "cautions": [
      "高峰期单点偶有拥塞，可手动切换冷门节点"
    ],
    "tags": [
      "value",
      "streaming",
      "ai"
    ]
  },
  {
    "slug": "civetnet",
    "name": "灵猫网络",
    "tagline": "月付 18 元 150G · 不押长周期 · 均衡型高口碑中转",
    "house": false,
    "affiliateUrl": "https://guangs.lingmaoyunaff.com/#/?code=W34d8dM2",
    "couponCode": "lm888",
    "couponNote": "结算输入 lm888 享专属折扣",
    "minPrice": 18,
    "minTraffic": 150,
    "minPriceCycle": "月付",
    "pricePerGb": 0.12,
    "established": "2024 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "大流量中转集群，实测 150G 流量包充沛，适合日常主力"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "月流量消耗较大的办公族",
      "不想年付承担跑路风险的用户"
    ],
    "advantages": [
      "月付即可拿到 150G 大流量",
      "全场景流媒体与 AI 支持完备"
    ],
    "cautions": [
      "中转线路在特殊敏感时期偶有切换波动"
    ],
    "tags": [
      "value",
      "large-traffic",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "jilianyun",
    "name": "极连云",
    "tagline": "IEPL 企业专线 · 18 元 100G · 面向 AI 与流媒体深度优化",
    "house": false,
    "affiliateUrl": "https://guangs.jilianyunaff.com/#/?code=dY4615d5",
    "couponCode": "jilian888",
    "couponNote": "结算输入 jilian888 享专属折扣",
    "minPrice": 18,
    "minTraffic": 100,
    "minPriceCycle": "月付",
    "pricePerGb": 0.18,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "内网企业专线，针对 ChatGPT 与海外 AI 工具重点调度"
    ],
    "aiSupport": "full",
    "streamingSupport": "partial",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "AI 创作者与程序员",
      "注重晚高峰稳定连通的用户"
    ],
    "advantages": [
      "IEPL 专线晚高峰极稳",
      "月付 18 元在专线中性价比突出"
    ],
    "cautions": [
      "部分冷门流媒体需选择特定观影节点"
    ],
    "tags": [
      "iepl",
      "ai",
      "value"
    ]
  },
  {
    "slug": "guangnianti",
    "name": "光年梯",
    "tagline": "IEPL 专线 · 18 元 110G · 综合表现均衡无明显短板",
    "house": false,
    "affiliateUrl": "https://guangs.guangniantiaff.com/#/?code=3B7V3x13",
    "couponCode": "gnt888",
    "couponNote": "结算输入 gnt888 享专属折扣",
    "minPrice": 18,
    "minTraffic": 110,
    "minPriceCycle": "月付",
    "pricePerGb": 0.16363636363636364,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "专线延迟低且抖动小，亚太主力地区全覆盖"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "日常综合使用的白领与学生",
      "需要稳定晚高峰体验的追剧党"
    ],
    "advantages": [
      "18 元 110G 专线档位极其均衡",
      "客服响应快，故障处理及时"
    ],
    "cautions": [
      "专线节点倍率需购买前核实"
    ],
    "tags": [
      "iepl",
      "value",
      "streaming",
      "ai"
    ]
  },
  {
    "slug": "yifanyun",
    "name": "一翻云",
    "tagline": "IEPL 专线 · 20 元 150G · 多设备大流量对口之选",
    "house": false,
    "affiliateUrl": "https://guangs.yifanyunaff.com/#/?code=RzJ3Z280",
    "couponCode": "yifan888",
    "couponNote": "结算输入 yifan888 享专属折扣",
    "minPrice": 20,
    "minTraffic": 150,
    "minPriceCycle": "月付",
    "pricePerGb": 0.13333333333333333,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "专线带宽充足，全端分流规则兼容性好"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "多设备同时连接的家庭或个人",
      "大流量视频追剧者"
    ],
    "advantages": [
      "20 元即可拿到 150G 专线流量",
      "支持流媒体与 AI 全解锁"
    ],
    "cautions": [
      "单次大文件下载建议避开高峰期"
    ],
    "tags": [
      "iepl",
      "large-traffic",
      "value",
      "streaming"
    ]
  },
  {
    "slug": "sogoyun",
    "name": "SOGO 云",
    "tagline": "IEPL 专线 · 20 元 120G · 专注晚高峰稳定与极简体验",
    "house": false,
    "affiliateUrl": "https://guangs.sogoyunaff.com/#/?code=2q9y74w1",
    "couponCode": "sogo888",
    "couponNote": "结算输入 sogo888 享活动折扣",
    "minPrice": 20,
    "minTraffic": 120,
    "minPriceCycle": "月付",
    "pricePerGb": 0.16666666666666666,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "精品 IEPL 专线，香港、日本近地延迟极低"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "专注办公与日常浏览的上班族",
      "对晚高峰要求高的用户"
    ],
    "advantages": [
      "专线稳定性过硬，掉线率极低",
      "UI 与教程清爽明了"
    ],
    "cautions": [
      "节点数量相对克制，以精品主力节点为主"
    ],
    "tags": [
      "iepl",
      "value",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "kexinyun",
    "name": "可信云",
    "tagline": "IEPL 专线 · 25 元 150G · 家庭多设备追剧流媒体全解锁",
    "house": false,
    "affiliateUrl": "https://guangs.kexinyunaff.com/#/?code=0Vp71s50",
    "couponCode": "kexin888",
    "couponNote": "结算输入 kexin888 享活动优惠",
    "minPrice": 25,
    "minTraffic": 150,
    "minPriceCycle": "月付",
    "pricePerGb": 0.16666666666666666,
    "established": "2023 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "大带宽专线通道，流媒体解锁库维护频繁"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "家庭流媒体重度观众",
      "追求稳定 4K 播放的用户"
    ],
    "advantages": [
      "Netflix、Disney+ 解锁极为顺畅",
      "专线带宽足，缓冲时间短"
    ],
    "cautions": [
      "月付 25 元门槛在中端水平",
      "AI 某些新平台需切美国节点"
    ],
    "tags": [
      "iepl",
      "streaming",
      "large-traffic"
    ]
  },
  {
    "slug": "sujie",
    "name": "速界",
    "tagline": "中转大带宽 · 25 元 160G · 节点覆盖面宽且延迟低",
    "house": false,
    "affiliateUrl": "https://guangs.sujieaff.com/#/?code=m3dG193v",
    "couponCode": "sujie888",
    "couponNote": "结算输入 sujie888 享活动折扣",
    "minPrice": 25,
    "minTraffic": 160,
    "minPriceCycle": "月付",
    "pricePerGb": 0.15625,
    "established": "2023 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "多入口国内优质中转，节点覆盖全球 15+ 地区"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "需要多个国家和地区节点的用户",
      "大流量跨境游戏或观影者"
    ],
    "advantages": [
      "地区覆盖最全面的品牌之一",
      "全场景解锁表现优异"
    ],
    "cautions": [
      "非全专线，晚高峰极端拥堵时表现略逊专线"
    ],
    "tags": [
      "value",
      "streaming",
      "large-traffic",
      "ai"
    ]
  },
  {
    "slug": "shanyue",
    "name": "闪跃",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 60GB 轻量级入门选择",
    "house": false,
    "affiliateUrl": "https://qwerty.shanyueaff.com/#/?code=d8n2y8y8",
    "couponCode": "shanyue888",
    "couponNote": "季付以上输入 shanyue888 享折扣",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS",
      "Shadowsocks"
    ],
    "networkFeatures": [
      "IEPL 专线直连，VLESS 协议轻量化开销"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "轻度网页浏览者",
      "备用专线梯子需求者"
    ],
    "advantages": [
      "年付折算价格超低",
      "客户端开箱即用"
    ],
    "cautions": [
      "流量偏小，不适合大流量视频长期挂机"
    ],
    "tags": [
      "budget",
      "value",
      "iepl",
      "beginner"
    ]
  },
  {
    "slug": "quanqiuyun",
    "name": "全球云",
    "tagline": "中转大流量 · 30 元 200G · 适合多设备与重度下载",
    "house": false,
    "affiliateUrl": "https://guangs.quanqiuyunaff.com/#/?code=436f56rY",
    "couponCode": "quanqiu888",
    "couponNote": "结算输入 quanqiu888 享专属折扣",
    "minPrice": 30,
    "minTraffic": 200,
    "minPriceCycle": "月付",
    "pricePerGb": 0.15,
    "established": "2024 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "大容量中转集群，200GB 充沛月流量包"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "重度流量消耗者",
      "团队或家庭共享用户"
    ],
    "advantages": [
      "单套餐流量规格大",
      "流媒体与 AI 全功能解锁"
    ],
    "cautions": [
      "基础月付价格高于低价中转机场"
    ],
    "tags": [
      "large-traffic",
      "streaming",
      "ai"
    ]
  },
  {
    "slug": "shandianshu",
    "name": "闪电鼠",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · VLESS 协议轻快架构",
    "house": false,
    "affiliateUrl": "https://qwerty.shandianshuaff.com/#/?code=3n7k2m9p",
    "couponCode": "sds888",
    "couponNote": "结算输入 sds888 享折扣",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "IEPL 专线架构，配合 VLESS 协议保持低握手延迟"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "预算敏感的学生党",
      "日常浏览与社交查资料用户"
    ],
    "advantages": [
      "专线极低单价",
      "自研多端支持"
    ],
    "cautions": [
      "低价位超售控制严格，极端并发有轻微降速"
    ],
    "tags": [
      "budget",
      "value",
      "iepl",
      "beginner"
    ]
  },
  {
    "slug": "yunjiexian",
    "name": "云界线",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 60GB 实用轻量套餐",
    "house": false,
    "affiliateUrl": "https://qwerty.yunjiexianaff.com/#/?code=8x1k5m7p",
    "couponCode": "yjx888",
    "couponNote": "结算输入 yjx888 享折扣",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "专线出口，提供平稳低延迟通道"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "入门用户",
      "备用轻度科学上网用户"
    ],
    "advantages": [
      "门槛极低",
      "日常流媒体支持正常"
    ],
    "cautions": [
      "每月 60GB 流量需合理规划"
    ],
    "tags": [
      "budget",
      "value",
      "iepl"
    ]
  },
  {
    "slug": "liulianyun",
    "name": "榴莲云",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 高性价比专线平价选",
    "house": false,
    "affiliateUrl": "https://qwerty.liulianyunaff.com/#/?code=6p2m9k3n",
    "couponCode": "lly888",
    "couponNote": "结算输入 lly888 享折扣",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "专线直连，亚太地区常见近地节点覆盖"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "低成本翻墙用户",
      "移动端网页浏览者"
    ],
    "advantages": [
      "性价比极高",
      "支持一键导入"
    ],
    "cautions": [
      "小流量包，超量会限速或暂停"
    ],
    "tags": [
      "budget",
      "value",
      "iepl"
    ]
  },
  {
    "slug": "shenxing",
    "name": "神行加速",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 适合日常查资料与社媒",
    "house": false,
    "affiliateUrl": "https://qwerty.shenxingaff.com/#/?code=1k9p3m7n",
    "couponCode": "sx888",
    "couponNote": "结算输入 sx888 享活动优惠",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "低成本 IEPL 专线方案，覆盖主要出海业务入口"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "日常轻度社交媒体用户",
      "学生党"
    ],
    "advantages": [
      "专线单价极具吸引力",
      "配置简易"
    ],
    "cautions": [
      "重度游戏或极客下载不建议主力使用"
    ],
    "tags": [
      "budget",
      "value",
      "iepl"
    ]
  },
  {
    "slug": "huanqiuti",
    "name": "环球梯",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 60GB 亚太欧美节点覆盖",
    "house": false,
    "affiliateUrl": "https://qwerty.huanqiutiaff.com/#/?code=4m7n1k9p",
    "couponCode": "hqt888",
    "couponNote": "结算输入 hqt888 享折扣",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "专线出口，节点网络包括香港、日本、美国等"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "出海查阅资料者",
      "备用节点持有者"
    ],
    "advantages": [
      "价格极其低廉",
      "基础流媒体能正常解锁"
    ],
    "cautions": [
      "流量用完需等次月重置"
    ],
    "tags": [
      "budget",
      "value",
      "iepl"
    ]
  },
  {
    "slug": "tiziyun",
    "name": "梯子云",
    "tagline": "IEPL 专线 · 年付月均 5.6 元 · 轻量 VLESS 协议节点",
    "house": false,
    "affiliateUrl": "https://qwerty.tiziyunaff.com/#/?code=7n1k9p3m",
    "couponCode": "tzy888",
    "couponNote": "结算输入 tzy888 享活动特惠",
    "minPrice": 5.6,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.09333333333333332,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "IEPL 专线传输，保障基础连接低延迟"
    ],
    "aiSupport": "partial",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "低频科学上网者",
      "备用线路"
    ],
    "advantages": [
      "年付投入小，试错成本极低",
      "客户端支持完备"
    ],
    "cautions": [
      "需合理管理月度 60GB 流量"
    ],
    "tags": [
      "budget",
      "value",
      "iepl"
    ]
  },
  {
    "slug": "kuaili",
    "name": "快狸",
    "tagline": "IEPL 专线 · 20 元 120G · VLESS 协议与多策略组支持",
    "house": false,
    "affiliateUrl": "https://guangs.kuailiaff.com/#/?code=4p2r78q9",
    "couponCode": "kuaili888",
    "couponNote": "结算输入 kuaili888 享专属折扣",
    "minPrice": 20,
    "minTraffic": 120,
    "minPriceCycle": "月付",
    "pricePerGb": 0.16666666666666666,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "纯 VLESS 协议专线，实测喵速测试速度优异"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "进阶 Clash 策略组用户",
      "AI 与流媒体重度用户"
    ],
    "advantages": [
      "专线搭配 VLESS 性能开销小",
      "流媒体与 AI 全面解锁"
    ],
    "cautions": [
      "月付 20 元起步，门槛居中"
    ],
    "tags": [
      "iepl",
      "value",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "wgetcloud",
    "name": "WgetCloud",
    "tagline": "高端 BGP 中转/专线 · 华为云多线架构 · 商务高稳定性",
    "house": false,
    "affiliateUrl": "https://aff.wgetcloud.org/#/?code=wgc2026",
    "couponCode": null,
    "couponNote": "以官网结算页面最新活动为准",
    "minPrice": 49,
    "minTraffic": 120,
    "minPriceCycle": "季付",
    "pricePerGb": 0.4083333333333333,
    "established": "2021 年",
    "lines": [
      "企业级内网专线",
      "中转"
    ],
    "protocols": [
      "Shadowsocks",
      "Trojan",
      "VLESS"
    ],
    "networkFeatures": [
      "华为云多线 BGP 入口接入，优质专线跨境，高可用冗余架构"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Surge"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "商务外贸用户",
      "对稳定性要求极高的高预算用户"
    ],
    "advantages": [
      "高端品牌底座扎实，抗风险抗封锁能力强",
      "商务服务工单响应快"
    ],
    "cautions": [
      "季付约 49 元/月，价格门槛高，不适合低预算用户"
    ],
    "tags": [
      "premium",
      "veteran",
      "iepl"
    ]
  },
  {
    "slug": "baiyueguang",
    "name": "白月光",
    "tagline": "季付 66 元起 · 覆盖 70+ 地区名目 · 丰富冷门节点库",
    "house": false,
    "affiliateUrl": "https://sibker.com/register?invite_code=gg6puAId",
    "couponCode": null,
    "couponNote": "以官网结算页面最新活动为准",
    "minPrice": 22,
    "minTraffic": 100,
    "minPriceCycle": "季付",
    "pricePerGb": 0.22,
    "established": "2023 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "节点涵盖香港、日本、新加坡、东南亚多国、欧洲等丰富地区"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "需要测试全球多国 IP 的用户",
      "东南亚小语种节点需求者"
    ],
    "advantages": [
      "地区名目极其丰富，实测香港、马来西亚近端表现较好",
      "季付 66 元一次性门槛适中"
    ],
    "cautions": [
      "部分冷门偏远地区节点偶有速度波动，建议关注近端主力"
    ],
    "tags": [
      "value",
      "streaming"
    ]
  },
  {
    "slug": "flyingbird",
    "name": "FlyingBird",
    "tagline": "IPLC 全专线 · Shadowsocks · 无倍率不限速",
    "house": false,
    "affiliateUrl": "https://flyingbird.org/#/register?code=fb2026",
    "couponCode": "theo",
    "couponNote": "新用户优惠码 theo 可享 9 折",
    "minPrice": 15,
    "minTraffic": 100,
    "minPriceCycle": "月付",
    "pricePerGb": 0.15,
    "established": "2022 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "全专线 IPLC 架构，无倍率不限速，多老牌团队技术背景"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "追求纯净 SS 协议与真 IPLC 专线的老玩家"
    ],
    "advantages": [
      "无倍率扣量，流量透明真实",
      "支持支付宝与 USDT 付款"
    ],
    "cautions": [
      "无官方自研客户端，需自行配置通用客户端导入"
    ],
    "tags": [
      "iepl",
      "value",
      "veteran"
    ]
  },
  {
    "slug": "cyberguard",
    "name": "CyberGuard",
    "tagline": "半年付月均 15.8 元 · 12 国节点覆盖 · 另有不限时流量包",
    "house": false,
    "affiliateUrl": "https://cyberguard.best/#/register?code=AxXNNYng",
    "couponCode": null,
    "couponNote": "以官网结算页面最新价格为准",
    "minPrice": 15.83,
    "minTraffic": 150,
    "minPriceCycle": "半年付",
    "pricePerGb": 0.10553333333333334,
    "established": "2023 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Trojan",
      "VLESS"
    ],
    "networkFeatures": [
      "覆盖日本、美国、澳洲、阿联酋、欧洲等 12 地区，实测下行充沛"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Sing-box"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "需要不限时大流量包的用户",
      "出海欧美多国访问者"
    ],
    "advantages": [
      "提供 220G/840G 不限时流量包",
      "AI 与主流流媒体解锁实测表现优秀"
    ],
    "cautions": [
      "单月购买起步价 32 元略高，更建议半年付或买按量包"
    ],
    "tags": [
      "iepl",
      "unlimited",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "longmaoyun",
    "name": "龙猫云",
    "tagline": "IPLC 全专线 · 最高 2000Mbps · 教程详尽老牌同源",
    "house": false,
    "affiliateUrl": "https://longmaoyun.net/#/register?code=lmy2026",
    "couponCode": null,
    "couponNote": "以官网结算页面最新周期折扣为准",
    "minPrice": 15,
    "minTraffic": 100,
    "minPriceCycle": "月付",
    "pricePerGb": 0.15,
    "established": "2022 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "SS + 全专线 IPLC 架构，高带宽单节点突发支持"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "老牌机场追随者",
      "寻求月付 15 元专线平衡的用户"
    ],
    "advantages": [
      "月付 15 元门槛低",
      "使用文档与配置教程比较完整"
    ],
    "cautions": [
      "需配合第三方客户端使用"
    ],
    "tags": [
      "iepl",
      "value",
      "veteran"
    ]
  },
  {
    "slug": "fatcat",
    "name": "FATCAT",
    "tagline": "企业级 IEPL/IPLC 内网专线 · 抗干扰抗封锁 · 年付 96 元起",
    "house": false,
    "affiliateUrl": "https://fatcataff.com/#/register?code=fc2026",
    "couponCode": null,
    "couponNote": "以官网结算页面最新活动为准",
    "minPrice": 8,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.13333333333333333,
    "established": "2023 年",
    "lines": [
      "IEPL",
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "企业级内网专线架构，强调晚高峰抗干扰与抗出口封锁"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "追求专线稳定抗封锁的用户",
      "轻度年付小包用户"
    ],
    "advantages": [
      "年付 96 元单价低",
      "专线晚高峰防拥塞效果好"
    ],
    "cautions": [
      "月付基础版 20 元，更推荐年付套餐"
    ],
    "tags": [
      "iepl",
      "value",
      "budget"
    ]
  },
  {
    "slug": "tntcloud",
    "name": "TNTCloud",
    "tagline": "IPLC 内网专线 · 季付限量包 30 元起 · 跨境电商与直播定制",
    "house": false,
    "affiliateUrl": "https://tntcloudaff.com/#/register?code=tnt2026",
    "couponCode": "TNT85",
    "couponNote": "常规套餐结算输入 TNT85 享 85 折",
    "minPrice": 10,
    "minTraffic": 60,
    "minPriceCycle": "季付",
    "pricePerGb": 0.16666666666666666,
    "established": "2022 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "IPLC 内网专线通道，支持 TikTok 直播与电商定制线路"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "跨境电商与 TikTok 运营者",
      "季付低门槛专线用户"
    ],
    "advantages": [
      "季付 30 元门槛极低",
      "支持跨境电商专属网络定制"
    ],
    "cautions": [
      "季付限量包不支持优惠码折扣"
    ],
    "tags": [
      "iepl",
      "value",
      "budget"
    ]
  },
  {
    "slug": "qingyunti",
    "name": "青云梯",
    "tagline": "六年运营老牌 · 企业级 IPLC · 三网优化智能负载均衡",
    "house": false,
    "affiliateUrl": "https://qingyuntiaff.com/#/?code=qyt2026",
    "couponCode": "qyt85",
    "couponNote": "常规套餐结算输入 qyt85 享 85 折",
    "minPrice": 8,
    "minTraffic": 60,
    "minPriceCycle": "年付",
    "pricePerGb": 0.13333333333333333,
    "established": "2020 年",
    "lines": [
      "IPLC"
    ],
    "protocols": [
      "Shadowsocks"
    ],
    "networkFeatures": [
      "国内三网优化入口，企业级 IPLC 专线，覆盖 10+ 地区 80+ 节点"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN",
      "Surge"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "看重 6 年老牌运营信誉的用户",
      "对三网均衡有要求的移动/联通/电信宽带用户"
    ],
    "advantages": [
      "六年老牌运营，线路架构成熟",
      "多地域节点负载均衡稳定"
    ],
    "cautions": [
      "年付小包不可使用优惠券"
    ],
    "tags": [
      "veteran",
      "iepl",
      "value"
    ]
  },
  {
    "slug": "shanshuiyun",
    "name": "山水云",
    "tagline": "年付 88 元起 · 12 国节点覆盖 · 美国/日本高下行速率",
    "house": false,
    "affiliateUrl": "https://sldm1.ssyylf.com/#/register?code=YD5iQ888",
    "couponCode": null,
    "couponNote": "以官网结算页面最新活动为准",
    "minPrice": 7.33,
    "minTraffic": 64,
    "minPriceCycle": "年付",
    "pricePerGb": 0.11453125,
    "established": "2023 年",
    "lines": [
      "中转"
    ],
    "protocols": [
      "Shadowsocks",
      "VLESS"
    ],
    "networkFeatures": [
      "三档月付清晰，实测美国节点平均下载超 180Mbps，日本超 160Mbps"
    ],
    "aiSupport": "full",
    "streamingSupport": "full",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "寻求低价年付小包的用户",
      "对欧美节点下载速度有要求的用户"
    ],
    "advantages": [
      "年付 88 元单价低",
      "实测 AI 与常见流媒体支持度好"
    ],
    "cautions": [
      "轻量套餐月流量 64GB 偏小"
    ],
    "tags": [
      "budget",
      "value",
      "ai",
      "streaming"
    ]
  },
  {
    "slug": "lingdongyun",
    "name": "灵动云",
    "tagline": "2025 新秀 · VLESS + IEPL 专线 · OpenAI 全地区解锁亮点",
    "house": false,
    "affiliateUrl": "https://varnexa.lingdongaff.com/#/?code=wZvEhEoI",
    "couponCode": null,
    "couponNote": "以官网结算页面最新价格为准",
    "minPrice": 8.25,
    "minTraffic": 70,
    "minPriceCycle": "年付",
    "pricePerGb": 0.11785714285714285,
    "established": "2025 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "VLESS"
    ],
    "networkFeatures": [
      "IEPL 专线 VLESS 架构，实测 OpenAI 各地区基本全解锁"
    ],
    "aiSupport": "full",
    "streamingSupport": "partial",
    "clients": [
      "自研客户端",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "以 ChatGPT/OpenAI 为核心生产力工具的用户",
      "按量流量包需求者"
    ],
    "advantages": [
      "AI 解锁亮点突出",
      "提供单次不限时流量包与私人定制"
    ],
    "cautions": [
      "新品牌运营时长较短，部分小众流媒体需挑节点"
    ],
    "tags": [
      "iepl",
      "ai",
      "unlimited",
      "value"
    ]
  },
  {
    "slug": "langwang",
    "name": "浪网",
    "tagline": "IEPL 专线 · 入门到商业多层级 · 丰富不限时流量包支持",
    "house": false,
    "affiliateUrl": "https://varnexa.wavenetaff.com/#/?code=xwAM4tTd",
    "couponCode": null,
    "couponNote": "以官网结算页面最新价格为准",
    "minPrice": 9.92,
    "minTraffic": 80,
    "minPriceCycle": "年付",
    "pricePerGb": 0.124,
    "established": "2024 年",
    "lines": [
      "IEPL"
    ],
    "protocols": [
      "Shadowsocks",
      "VLESS"
    ],
    "networkFeatures": [
      "截图标注 IEPL 专线，提供多档周期套餐、年付标准与定制线路"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": true,
    "targetUsers": [
      "寻找不限时备用流量包的用户",
      "中小团队出海定制"
    ],
    "advantages": [
      "套餐选择面广，提供 180G/450G/900G 不限时流量包",
      "专线架构延迟稳定"
    ],
    "cautions": [
      "部分套餐详细字段受限，购买前请在结算页面核实设备数"
    ],
    "tags": [
      "iepl",
      "unlimited",
      "value"
    ]
  },
  {
    "slug": "edgenova",
    "name": "EdgeNova",
    "tagline": "高速直连与 IPLC 混合 · 多线路自动分配 · 提供 8 折特惠码",
    "house": false,
    "affiliateUrl": "https://work.edgenovaaff.cc/#/register?code=cl3iB5YG",
    "couponCode": "TH888",
    "couponNote": "结算输入 TH888 享 8 折特惠",
    "minPrice": 9,
    "minTraffic": 45,
    "minPriceCycle": "年付",
    "pricePerGb": 0.2,
    "established": "2024 年",
    "lines": [
      "IPLC",
      "直连"
    ],
    "protocols": [
      "Shadowsocks",
      "Trojan"
    ],
    "networkFeatures": [
      "多线路自动分配算法，在延迟与带宽之间智能调度最优出口"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": false,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "追求多线路自动调度的用户",
      "需要折扣优惠码的尝鲜者"
    ],
    "advantages": [
      "提供新用户 8 折优惠码",
      "多线路分配机制灵活性强"
    ],
    "cautions": [
      "限时年付流量 45GB 偏小，更建议选标准月付 120GB 档"
    ],
    "tags": [
      "value",
      "budget",
      "iepl"
    ]
  },
  {
    "slug": "sslar",
    "name": "sslar",
    "tagline": "企业级 IEPL + 多线 BGP · SS/VLESS 自适应 · 支持远程协助",
    "house": false,
    "affiliateUrl": "https://sslaraff.com/#/register?code=sslar2026",
    "couponCode": "ko3eTt0w",
    "couponNote": "结算输入 ko3eTt0w 享 8 折优惠",
    "minPrice": 13.58,
    "minTraffic": 100,
    "minPriceCycle": "年付",
    "pricePerGb": 0.1358,
    "established": "2023 年",
    "lines": [
      "IEPL",
      "企业级内网专线"
    ],
    "protocols": [
      "Shadowsocks",
      "VLESS"
    ],
    "networkFeatures": [
      "企业级 IEPL 与多线 BGP，自适应协议切换，支持专属远程协助"
    ],
    "aiSupport": "partial",
    "streamingSupport": "partial",
    "clients": [
      "自研客户端（Win/mac/Android）",
      "Clash Verge",
      "Shadowrocket",
      "v2rayN"
    ],
    "ownClient": true,
    "subscriptionImport": true,
    "payAsYouGo": false,
    "targetUsers": [
      "对配置完全不熟悉、需要客服远程协助的小白用户",
      "商务办公用户"
    ],
    "advantages": [
      "提供自研多平台客户端与远程协助服务",
      "企业级 IEPL 专线抖动小"
    ],
    "cautions": [
      "月付 17 元起步，暂未支持 USDT 等加密付款"
    ],
    "tags": [
      "iepl",
      "beginner",
      "value",
      "veteran"
    ]
  }
];

export const BRAND_STATS = {
  total: AIRPORT_BRANDS.length,
  minPrice: Math.min(...AIRPORT_BRANDS.map((b) => b.minPrice)),
  maxPrice: Math.max(...AIRPORT_BRANDS.map((b) => b.minPrice)),
  ieplCount: AIRPORT_BRANDS.filter((b) => b.lines.includes('IEPL') || b.lines.includes('IPLC') || b.lines.includes('企业级内网专线')).length,
  aiCount: AIRPORT_BRANDS.filter((b) => b.aiSupport === 'full').length,
  streamingCount: AIRPORT_BRANDS.filter((b) => b.streamingSupport === 'full').length,
};

export function getBrand(slug: string): AirportBrand | undefined {
  return AIRPORT_BRANDS.find((b) => b.slug === slug);
}

export function sortHouseFirstThenValue(a: AirportBrand, b: AirportBrand): number {
  if (a.house && !b.house) return -1;
  if (!a.house && b.house) return 1;
  const rankA = a.featuredRank ?? 999;
  const rankB = b.featuredRank ?? 999;
  if (rankA !== rankB) return rankA - rankB;
  return a.pricePerGb - b.pricePerGb;
}

export function brandsByTag(tag: BrandTag): AirportBrand[] {
  return AIRPORT_BRANDS.filter((b) => b.tags.includes(tag));
}
