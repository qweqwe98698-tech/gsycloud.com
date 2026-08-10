/**
 * 机场品牌库 —— 全站唯一数据源。
 *
 * 品牌库、品牌评测页、排行榜、专题页、对比表、首页推荐卡片共享此处数据，
 * 修改一处即可全站同步。
 *
 * 数据纪律（重要）：
 * - 价格、流量、优惠码、推广链接、主打卖点均来自品牌方提供的资料，属 reference（参考资料）；
 * - 未提供的信息（如开业时间、节点数量）一律置为 null，前台显示「暂未核实」，禁止虚构；
 * - 测速图为测速面板导出图，原始数据未修改，测试时间已隐去，仅供参考；
 * - `house: true` 表示本站自有品牌，前台必须明确标识，不得伪装成第三方中立评测。
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

const brands: Omit<AirportBrand, 'pricePerGb'>[] = [
  {
    slug: 'gsycloud',
    name: '光速云',
    tagline: '六年老牌企业级内网专线，AI 与流媒体双全解锁',
    house: true,
    affiliateUrl: 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y',
    couponCode: 'AMM',
    couponNote: '使用优惠码 AMM 享受下单优惠',
    minPrice: 17,
    minTraffic: 110,
    minPriceCycle: '月付',
    established: '六年老牌（品牌方提供）',
    lines: ['IEPL', '企业级内网专线'],
    protocols: ['VLESS'],
    networkFeatures: ['企业级内网专线传输', 'IEPL 跨境直连', 'VLESS 协议为主'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['长期稳定使用者', 'AI 工具重度用户', '流媒体用户', '希望一次配置长期省心的用户'],
    advantages: [
      '六年运营历史，是本清单中运营时间最长的品牌之一',
      'IEPL 企业级内网专线，晚高峰时段受公网拥塞影响较小',
      'AI 工具与流媒体均为全解锁定位',
      '提供自研客户端，同时支持订阅导入主流第三方客户端',
    ],
    cautions: [
      '专线成本较高，套餐流量相对按量计费类机场更需要规划',
      '订阅导入第三方客户端需联系在线客服获取对应格式',
    ],
    tags: ['veteran', 'iepl', 'ai', 'streaming', 'value', 'beginner'],
  },
  {
    slug: 'xingdaomeng',
    name: '星岛梦',
    tagline: '年付低至 8 元起，套餐种类最丰富的老牌选择',
    house: false,
    affiliateUrl: 'https://guangs.xingdaomeng.com/#/?code=1TynBYnR',
    couponCode: 'nmw888',
    couponNote: '新人注册 9 折',
    minPrice: 8,
    minTraffic: 60,
    minPriceCycle: '年付',
    established: '六年老牌（品牌方提供）',
    lines: ['企业级内网专线'],
    protocols: [],
    networkFeatures: ['企业级内网专线', '套餐档位覆盖广', '提供不限时套餐'],
    aiSupport: 'unverified',
    streamingSupport: 'full',
    clients: ['Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: false,
    subscriptionImport: true,
    payAsYouGo: true,
    targetUsers: ['预算敏感用户', '学生党', '使用频率不固定的用户', '想先低成本试水的新手'],
    advantages: [
      '年付折算后月均 8 元起，是本清单中入门门槛最低的档位之一',
      '套餐种类多，从小流量到大流量都有对应档位',
      '提供不限时套餐，适合用量不规律的用户',
      '六年运营历史，属于老牌阵营',
    ],
    cautions: [
      '最低价格为年付折算价，需一次性支付全年费用，请评估跑路风险后再决定',
      '协议类型与 AI 解锁情况品牌方未明确说明，购买前建议先咨询客服',
    ],
    tags: ['budget', 'veteran', 'unlimited', 'value', 'beginner'],
  },
  {
    slug: 'civetnet',
    name: '灵猫网络',
    tagline: '月付 19 元 150G，月付党的大流量选择',
    house: false,
    affiliateUrl: 'https://vip01.civetnet.com/#/?code=8MIAyxak',
    couponCode: 'lmao888',
    couponNote: '新人注册 9 折',
    minPrice: 19,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['企业级内网专线'],
    protocols: [],
    networkFeatures: ['企业级内网专线', '套餐种类多', '提供不限时套餐'],
    aiSupport: 'unverified',
    streamingSupport: 'full',
    clients: ['Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: false,
    subscriptionImport: true,
    payAsYouGo: true,
    targetUsers: ['坚持月付控制风险的用户', '每月流量需求 100G 以上的用户', '多设备家庭用户'],
    advantages: [
      '月付档位即可获得 150G 流量，单价折算在月付阵营中较低',
      '不需要年付即可拿到大流量，付费周期风险可控',
      '提供不限时套餐，用量波动大的用户可以灵活搭配',
      '解锁能力覆盖主流流媒体平台',
    ],
    cautions: [
      '开业时间品牌方未提供，历史运营记录暂未核实，建议先月付观察',
      'AI 工具解锁情况未明确说明，有 AI 需求请购买前确认',
    ],
    tags: ['value', 'large-traffic', 'unlimited', 'streaming'],
  },
  {
    slug: 'flycat',
    name: '飞猫云',
    tagline: '年付 7 元 50G 起，IEPL 专线小包性价比之选',
    house: false,
    affiliateUrl: 'https://guangs.flycataff.com/#/?code=6uq0Xe9y',
    couponCode: 'flycat888',
    couponNote: '新用户季付以上 8 折',
    minPrice: 7,
    minTraffic: 50,
    minPriceCycle: '年付',
    established: '2023 年',
    lines: ['IEPL'],
    protocols: [],
    networkFeatures: ['IEPL 专线', '主打性价比小流量包'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['轻度使用者', '学生党', '每月流量 50G 以内的用户', '想用专线但预算有限的用户'],
    advantages: [
      '年付折算月均 7 元，是本清单中价格最低的 IEPL 专线档位',
      '小流量包定位清晰，轻度用户不必为用不完的流量付费',
      'AI 与流媒体均为全解锁定位',
      '有自研客户端，新手上手成本低',
    ],
    cautions: [
      '2023 年开业，运营时间短于老牌品牌，建议先短周期试用',
      '50G 小包对高清视频用户偏紧，重度用户需选更高档位',
    ],
    tags: ['budget', 'iepl', 'small-package', 'ai', 'streaming', 'value'],
  },
  {
    slug: 'weituyun',
    name: '唯兔云',
    tagline: '节点覆盖 60+，三网优化与智能负载均衡',
    house: false,
    affiliateUrl: 'https://guangs.v2yunvipaff.com/#/?code=xIutqOBA',
    couponCode: 'rabbit',
    couponNote: '新用户 9 折',
    minPrice: 14.9,
    minTraffic: 100,
    minPriceCycle: '月付',
    established: '2020 年',
    lines: ['中转'],
    protocols: ['VLESS'],
    networkFeatures: ['节点覆盖 60+', '三网优化入口', '智能负载均衡'],
    aiSupport: 'unverified',
    streamingSupport: 'unverified',
    clients: ['Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: false,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['移动/联通/电信线路体验差异明显的用户', '需要多地区节点的用户', '在意入口质量的用户'],
    advantages: [
      '2020 年开业，运营时间较长',
      '节点覆盖 60+，地区选择面在同价位中较宽',
      '三网优化入口，不同运营商用户都能找到合适入口',
      '智能负载均衡可在节点拥堵时自动分流',
    ],
    cautions: [
      '品牌方主打三网优化与负载均衡，未标注 IEPL/IPLC 专线，线路层级与专线机场不同',
      'AI 与流媒体解锁情况未明确说明，有硬性需求请先咨询',
    ],
    tags: ['value', 'beginner'],
  },
  {
    slug: 'yuzoucloud',
    name: '宇宙云',
    tagline: '14.9 元 100G，VLESS + IEPL 的低价专线组合',
    house: false,
    affiliateUrl: 'https://guangs.yuzoucloud.cc/#/register?code=yrThwMP1',
    couponCode: 'YUZHOU553',
    couponNote: '使用优惠码 YUZHOU553 下单享优惠',
    minPrice: 14.9,
    minTraffic: 100,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比小流量包'],
    aiSupport: 'unverified',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['想以较低价格用上专线的用户', '流媒体用户', '中等流量需求用户'],
    advantages: [
      '14.9 元即可进入 IEPL 专线档位，价格门槛在专线阵营中偏低',
      'VLESS 协议搭配专线，配置负担小',
      '流媒体全解锁定位',
      '提供自研客户端，也支持订阅导入',
    ],
    cautions: [
      '开业时间未提供，运营历史暂未核实',
      'AI 工具解锁未明确说明，AI 重度用户建议先确认',
    ],
    tags: ['value', 'iepl', 'streaming', 'small-package'],
  },
  {
    slug: 'u1s1',
    name: 'U1S1',
    tagline: '20 元 120G，VLESS 专线流媒体全解锁',
    house: false,
    affiliateUrl: 'https://guangs.vipaff.cc/#/?code=xhX5X22f',
    couponCode: 'akaka',
    couponNote: '使用优惠码 akaka 下单享优惠',
    minPrice: 20,
    minTraffic: 120,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议'],
    aiSupport: 'unverified',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['以看剧为主的流媒体用户', '中等流量需求用户', '希望专线体验的用户'],
    advantages: [
      'IEPL 专线搭配 VLESS 协议，配置结构简洁',
      '流媒体全解锁定位，适合以观影为主的场景',
      '自研客户端降低新手上手门槛',
      '120G 流量对多数非重度用户够用',
    ],
    cautions: ['开业时间未提供，运营历史暂未核实', 'AI 解锁情况未明确说明'],
    tags: ['streaming', 'iepl', 'value'],
  },
  {
    slug: 'jilianyun',
    name: '极连云',
    tagline: '18 元 100G，IEPL 专线 AI 全解锁',
    house: false,
    affiliateUrl: 'https://guangs.jlyvipaff.com/#/?code=VM1rKGUu',
    couponCode: 'ji8888',
    couponNote: '使用优惠码 ji8888 下单享优惠',
    minPrice: 18,
    minTraffic: 100,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: [],
    networkFeatures: ['IEPL 专线', 'AI 场景优化'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['ChatGPT / Claude 等 AI 工具用户', 'AI 编程工具用户', '需要长会话稳定性的用户'],
    advantages: [
      'AI 与流媒体均为全解锁定位，AI 场景是其主打方向',
      'IEPL 专线对 AI 长会话的连接稳定性更友好',
      '18 元 100G 的档位在专线阵营中价格适中',
      '自研客户端 + 订阅导入双通道',
    ],
    cautions: ['开业时间未提供，运营历史暂未核实', '协议类型品牌方未明确标注'],
    tags: ['ai', 'iepl', 'value'],
  },
  {
    slug: 'quanqiuyun',
    name: '全球云',
    tagline: '20 元 120G，VLESS 专线 AI 与流媒体兼顾',
    house: false,
    affiliateUrl: 'https://guangs.gcvipaff.com/#/?code=Ov2nvU9C',
    couponCode: 'qqy7777',
    couponNote: '使用优惠码 qqy7777 下单享优惠',
    minPrice: 20,
    minTraffic: 120,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比小流量包'],
    aiSupport: 'full',
    streamingSupport: 'partial',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['AI 与流媒体都要用的综合用户', '中等流量需求用户'],
    advantages: [
      'AI 全解锁定位，同时覆盖流媒体解锁需求',
      'VLESS + IEPL 的常见高性价比组合',
      '自研客户端，配置流程简化',
      '120G 流量覆盖日常使用与偶尔观影',
    ],
    cautions: [
      '品牌方对流媒体表述为「流媒解锁」，具体平台覆盖范围建议购买前确认',
      '开业时间未提供，运营历史暂未核实',
    ],
    tags: ['ai', 'iepl', 'value', 'small-package'],
  },
  {
    slug: 'guangnianti',
    name: '光年梯',
    tagline: '18 元 110G，AI 与流媒体双解锁的均衡档位',
    house: false,
    affiliateUrl: 'https://guangs.gntaff.com/#/?code=X1FoxjGE',
    couponCode: 'gnt6666',
    couponNote: '使用优惠码 gnt6666 下单享优惠',
    minPrice: 18,
    minTraffic: 110,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比小流量包'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['需求均衡的日常用户', 'AI 与观影都要兼顾的用户', '预算 20 元以内的用户'],
    advantages: [
      '18 元 110G，价格与流量的比例在同档位中较为均衡',
      'AI 与流媒体均为全解锁定位，不必为单一场景另买服务',
      'VLESS + IEPL 专线组合',
      '自研客户端与订阅导入均支持',
    ],
    cautions: ['开业时间未提供，运营历史暂未核实', '订阅导入第三方客户端需联系在线客服'],
    tags: ['value', 'iepl', 'ai', 'streaming'],
  },
  {
    slug: 'yifanyun',
    name: '一翻云',
    tagline: '20 元 150G，大流量与专线兼得',
    house: false,
    affiliateUrl: 'https://guangs.1flyunaff.cc/#/register?code=Yr7FhB7r',
    couponCode: 'yfy6666',
    couponNote: '使用优惠码 yfy6666 下单享优惠',
    minPrice: 20,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比流量包'],
    aiSupport: 'full',
    streamingSupport: 'partial',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['每月流量需求较大的用户', '多设备用户', '经常看视频的用户'],
    advantages: [
      '20 元即可获得 150G，是 20 元档位中流量最高的选项之一',
      'IEPL 专线，晚高峰稳定性优于普通中转',
      'AI 全解锁定位',
      '流量充足，多设备共享压力更小',
    ],
    cautions: [
      '流媒体表述为「流媒解锁」，具体平台请购买前确认',
      '开业时间未提供，运营历史暂未核实',
    ],
    tags: ['large-traffic', 'iepl', 'ai', 'value'],
  },
  {
    slug: 'ermaoyun',
    name: '二猫云',
    tagline: '20 元 130G，专线小包中的中量选择',
    house: false,
    affiliateUrl: 'https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW',
    couponCode: 'ermao5555',
    couponNote: '使用优惠码 ermao5555 下单享优惠',
    minPrice: 20,
    minTraffic: 130,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比流量包'],
    aiSupport: 'full',
    streamingSupport: 'partial',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['流量需求介于 100G 与 150G 之间的用户', 'AI 工具用户', '日常综合使用者'],
    advantages: [
      '130G 流量处于常用区间，不易出现买多浪费或买少不够',
      'IEPL 专线 + VLESS 协议组合',
      'AI 全解锁定位',
      '自研客户端与订阅导入并存',
    ],
    cautions: ['流媒体覆盖范围建议购买前确认', '开业时间未提供，运营历史暂未核实'],
    tags: ['value', 'iepl', 'ai'],
  },
  {
    slug: 'sogoyun',
    name: 'SOGO 云',
    tagline: '25 元 150G，AI 与流媒体全解锁的中高端档',
    house: false,
    affiliateUrl: 'https://guangs.sogoyunaff.cc/#/En04H5u9',
    couponCode: 'sss777',
    couponNote: '使用优惠码 sss777 下单享优惠',
    minPrice: 25,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比流量包'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['预算 25 元档位的综合用户', 'AI 与流媒体都要全解锁的用户'],
    advantages: [
      'AI 与流媒体均为全解锁定位，场景覆盖完整',
      '25 元 150G 在中高端档位中流量充足',
      'IEPL 专线 + VLESS 协议',
      '自研客户端配套完善',
    ],
    cautions: ['开业时间未提供，运营历史暂未核实', '价格高于入门档，轻度用户可考虑低价档位'],
    tags: ['premium', 'iepl', 'ai', 'streaming', 'large-traffic'],
  },
  {
    slug: 'kexinyun',
    name: '可信云',
    tagline: '25 元 150G，专注流媒体全解锁的稳定档',
    house: false,
    affiliateUrl: 'https://guangs.kosingaff.com/#/register?code=UYDtNlCY',
    couponCode: 'kkk333',
    couponNote: '使用优惠码 kkk333 下单享优惠',
    minPrice: 25,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比流量包'],
    aiSupport: 'unverified',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['以观影为核心需求的用户', '家庭多设备观影场景', '需要稳定专线的用户'],
    advantages: [
      '流媒体全解锁定位，观影是其主打场景',
      'IEPL 专线，高清播放时的稳定性更有保障',
      '150G 流量支撑较高强度的视频观看',
      '自研客户端与订阅导入均可用',
    ],
    cautions: [
      'AI 工具解锁未明确说明，AI 重度用户建议另行确认或选择 AI 定位品牌',
      '开业时间未提供，运营历史暂未核实',
    ],
    tags: ['streaming', 'premium', 'iepl', 'large-traffic'],
  },
  {
    slug: 'sujie',
    name: '速界',
    tagline: '25 元 150G，AI 全解锁的专线档位',
    house: false,
    affiliateUrl: 'https://guangs.speedworldaff.cc/#/register?code=xgXzEfZB',
    couponCode: 'sss1111',
    couponNote: '使用优惠码 sss1111 下单享优惠',
    minPrice: 25,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议', '性价比流量包'],
    aiSupport: 'full',
    streamingSupport: 'unverified',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['AI 工具重度用户', 'AI 编程与长任务用户', '对连接稳定性要求高的用户'],
    advantages: [
      'AI 全解锁是其明确主打方向',
      'IEPL 专线对 AI 长连接更友好',
      '150G 流量满足高强度使用',
      '自研客户端 + 多客户端订阅导入',
    ],
    cautions: [
      '品牌方主打 AI，未强调流媒体解锁，观影需求为主的用户建议选流媒体定位品牌',
      '开业时间未提供，运营历史暂未核实',
    ],
    tags: ['ai', 'premium', 'iepl', 'large-traffic'],
  },
  {
    slug: 'kuaili',
    name: '快狸',
    tagline: '25 元 150G，AI 与流媒体全能型高端档',
    house: false,
    affiliateUrl: 'https://guangs.kuailicloud.cc/#/register?code=AiqyM8oG',
    couponCode: 'kkk2222',
    couponNote: '使用优惠码 kkk2222 下单享优惠',
    minPrice: 25,
    minTraffic: 150,
    minPriceCycle: '月付',
    established: null,
    lines: ['IEPL'],
    protocols: ['VLESS'],
    networkFeatures: ['IEPL 专线', 'VLESS 协议'],
    aiSupport: 'full',
    streamingSupport: 'full',
    clients: ['自研客户端', 'Clash', 'Shadowrocket', 'v2rayN', 'sing-box'],
    ownClient: true,
    subscriptionImport: true,
    payAsYouGo: false,
    targetUsers: ['需求全面的重度用户', '同时使用 AI 与流媒体的用户', '多设备家庭用户'],
    advantages: [
      'AI 与流媒体双全解锁，场景覆盖没有明显短板',
      'IEPL 专线 + VLESS 协议',
      '150G 流量支撑多设备与高强度使用',
      '自研客户端体验完整',
    ],
    cautions: ['开业时间未提供，运营历史暂未核实', '25 元档位对轻度用户偏高，按需选择即可'],
    tags: ['premium', 'iepl', 'ai', 'streaming', 'large-traffic'],
  },
];

/** 派生每 GB 单价并冻结数据 */
export const AIRPORT_BRANDS: AirportBrand[] = brands.map((b) => ({
  ...b,
  pricePerGb: Number((b.minPrice / b.minTraffic).toFixed(4)),
}));

export function getBrand(slug: string): AirportBrand | undefined {
  return AIRPORT_BRANDS.find((b) => b.slug === slug);
}

/** 按标签筛选（本站自有品牌始终排在首位，其余按每 GB 单价升序） */
export function brandsByTag(tag: BrandTag): AirportBrand[] {
  return AIRPORT_BRANDS.filter((b) => b.tags.includes(tag)).sort(sortHouseFirstThenValue);
}

export function sortHouseFirstThenValue(a: AirportBrand, b: AirportBrand): number {
  if (a.house !== b.house) return a.house ? -1 : 1;
  return a.pricePerGb - b.pricePerGb;
}

/** 按价格升序 */
export function brandsByPrice(): AirportBrand[] {
  return [...AIRPORT_BRANDS].sort((a, b) => a.minPrice - b.minPrice);
}

/** 全站统计（用于榜单页与首页文案，避免手写数字过期） */
export const BRAND_STATS = {
  total: AIRPORT_BRANDS.length,
  minPrice: Math.min(...AIRPORT_BRANDS.map((b) => b.minPrice)),
  ieplCount: AIRPORT_BRANDS.filter((b) => b.lines.some((l) => l === 'IEPL' || l === 'IPLC')).length,
  aiCount: AIRPORT_BRANDS.filter((b) => b.aiSupport === 'full').length,
  streamingCount: AIRPORT_BRANDS.filter((b) => b.streamingSupport === 'full').length,
  veteranCount: AIRPORT_BRANDS.filter((b) => b.established !== null).length,
} as const;
