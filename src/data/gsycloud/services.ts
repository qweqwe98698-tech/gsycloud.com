/**
 * GSY Cloud 品牌服务数据层。
 * 品牌页、服务卡片、FAQ 与相关文章共享此处数据，不要把服务信息散落写死在 Markdown 中。
 * dataStatus 为 'example' 的字段属于结构示例，前台展示时必须以自然方式说明，
 * 不得描述为真实实时数据。
 */

export type DataStatus = 'verified' | 'reference' | 'example' | 'mixed';

export interface ServiceCapability {
  title: string;
  description: string;
  icon: 'globe' | 'route' | 'devices' | 'ai' | 'play' | 'support';
}

export const SERVICE_CAPABILITIES: ServiceCapability[] = [
  {
    title: '多地区节点覆盖',
    description: '覆盖香港、台湾、日本、新加坡、美国等常用地区，满足日常访问与场景化需求。',
    icon: 'globe',
  },
  {
    title: '多种线路类型',
    description: '按需求提供中转与专线等不同线路层级，兼顾日常性价比与高峰期稳定性。',
    icon: 'route',
  },
  {
    title: '全平台客户端支持',
    description: '支持 Windows、macOS、Android、iOS 主流客户端，一份订阅多端同步使用。',
    icon: 'devices',
  },
  {
    title: 'AI 工具使用场景',
    description: '针对 ChatGPT、Claude、Gemini 等 AI 工具的访问需求提供节点选择建议。',
    icon: 'ai',
  },
  {
    title: '流媒体使用场景',
    description: '针对 Netflix、YouTube、TikTok 等流媒体平台的访问需求提供使用指引。',
    icon: 'play',
  },
  {
    title: '完整使用支持',
    description: '配套客户端教程、订阅导入指引与故障排查中心，遇到问题可以按步骤自助解决。',
    icon: 'support',
  },
];

export interface ServicePlan {
  name: string;
  cycle: string;
  traffic: string;
  devices: string;
  highlight: string;
  dataStatus: DataStatus;
}

/**
 * 套餐信息结构（dataStatus: example）。
 * 前台展示时必须注明“具体套餐与价格以官方购买页面为准”。
 */
export const SERVICE_PLANS: ServicePlan[] = [
  {
    name: '轻量套餐',
    cycle: '月付',
    traffic: '适合轻度浏览与日常访问',
    devices: '常用设备数量内不限客户端',
    highlight: '入门首选，按月灵活续费',
    dataStatus: 'example',
  },
  {
    name: '标准套餐',
    cycle: '月付 / 季付',
    traffic: '适合日常使用 + AI 工具 + 高清流媒体',
    devices: '常用设备数量内不限客户端',
    highlight: '大多数用户的均衡选择',
    dataStatus: 'example',
  },
  {
    name: '专业套餐',
    cycle: '月付 / 季付',
    traffic: '适合重度使用与多设备家庭场景',
    devices: '常用设备数量内不限客户端',
    highlight: '更高流量与优先线路资源',
    dataStatus: 'example',
  },
];

export const SUPPORTED_PROTOCOLS = [
  'Shadowsocks',
  'Trojan',
  'VLESS',
  'VMess',
  'Hysteria2',
] as const;

export const SUPPORTED_CLIENTS = [
  { name: 'Clash / Clash Verge', platform: 'Windows / macOS', tutorial: '/tutorials/clash/' },
  { name: 'Mihomo', platform: 'Windows / macOS / Linux', tutorial: '/tutorials/mihomo/' },
  { name: 'Shadowrocket', platform: 'iOS', tutorial: '/tutorials/shadowrocket/' },
  { name: 'v2rayN', platform: 'Windows', tutorial: '/tutorials/v2rayn/' },
  { name: 'sing-box', platform: '多平台', tutorial: '/tutorials/sing-box/' },
] as const;

export const SERVICE_REGIONS = [
  '香港',
  '台湾',
  '日本',
  '新加坡',
  '美国',
  '韩国',
  '英国',
  '德国',
] as const;

export interface ServiceFaq {
  question: string;
  answer: string;
}

export const SERVICE_FAQ: ServiceFaq[] = [
  {
    question: 'GSY Cloud 是什么？',
    answer:
      'GSY Cloud（光速云）是面向中文用户的代理网络服务与知识平台，提供机场服务说明、机场选择参考、客户端教程、协议与线路知识以及故障排查支持。',
  },
  {
    question: '支持哪些客户端？',
    answer:
      '支持 Clash、Mihomo、Shadowrocket、v2rayN、sing-box 等主流客户端，覆盖 Windows、macOS、Android、iOS 平台，均有配套教程。',
  },
  {
    question: '可以用于 ChatGPT、Claude 等 AI 工具吗？',
    answer:
      '可以。AI 工具对 IP 环境与地区有一定要求，建议按照 AI 网络环境指南选择合适的节点地区，遇到问题可参考故障排查中心。',
  },
  {
    question: '如何开始使用？',
    answer:
      '按“选择套餐 → 获取订阅 → 安装客户端 → 导入订阅 → 选择节点”的流程即可开始使用，每一步都有对应的图文教程。',
  },
  {
    question: '遇到连接问题怎么办？',
    answer:
      '优先查看故障排查中心的对应文章，如节点全部超时、订阅更新失败、延迟高等，按步骤逐项排查；仍无法解决可通过联系页面获取支持。',
  },
];
