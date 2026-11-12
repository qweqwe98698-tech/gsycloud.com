/** 站点全局常量 —— 上线后不要随意修改 */
export const SITE = {
  url: 'https://gsycloud.com',
  name: 'GSY Cloud',
  nameZh: '光速云',
  title: 'GSY Cloud｜机场评测、线路选择与网络工具知识平台',
  description:
    'GSY Cloud（光速云）是专业的机场评测、线路选择与网络工具知识平台：收录 42 家精选机场品牌的结构化评测，覆盖专线线路、协议演进与套餐对比，并提供全平台客户端教程、故障排查与网络工具指南，帮助你理解机场服务背后的技术差异，选出真正适合自己的高性价比稳定线路。',
  slogan: '让代理网络更容易理解、选择和使用。',
  locale: 'zh-CN',
  twitter: '@gsycloud',
} as const;

/** 一级导航（控制数量，不堆关键词；按转化路径排序） */
export const NAV_ITEMS = [
  { label: '机场排行榜', href: '/airport/ranking/' },
  { label: '品牌库', href: '/brands/' },
  { label: '机场评测', href: '/reviews/' },
  { label: '选购指南', href: '/airport/' },
  { label: '客户端教程', href: '/tutorials/' },
  { label: '网络知识', href: '/network/' },
  { label: '故障排查', href: '/troubleshooting/' },
  { label: '关于我们', href: '/about/' },
] as const;

/** 内容栏目（collection 名 = URL 前缀） */
export const SECTIONS: Record<string, { name: string; description: string }> = {
  airport: {
    name: '机场推荐',
    description: '汇集按稳定性、晚高峰表现、价格梯度与实际使用场景系统整理的机场选购指南与避坑建议。',
  },
  reviews: {
    name: '机场评测',
    description: '基于统一测评框架与真实测速数据的 42 家精选机场独立长文评测，详尽拆解线路、协议与套餐。',
  },
  nodes: {
    name: '节点知识',
    description: '全面梳理代理节点分类、免费节点安全风险、订阅链接防盗刷机制与节点真连接延迟测速基础知识。',
  },
  tutorials: {
    name: '客户端教程',
    description: '覆盖 Windows、macOS、iOS、Android 全平台的 Clash Verge、Mihomo、Shadowrocket 与 v2rayN 深度配置指引。',
  },
  troubleshooting: {
    name: '故障排查',
    description: '针对节点全部超时、Clash 订阅更新失败、延迟突增与分流失效等常见异常的标准化逐步排查与修复方案。',
  },
  protocols: {
    name: '协议知识',
    description: '深入剖析 Shadowsocks、Trojan、VLESS、Hysteria2 及 TUIC 等主流代理协议的加密特性与传输表现差异。',
  },
  network: {
    name: '线路与网络',
    description: '系统解析 IPLC 专线、IEPL 企业内网、BGP 智能中转、原生 IP 与 DNS 泄漏等跨境底层传输网络知识。',
  },
  ai: {
    name: 'AI 网络',
    description: '针对 ChatGPT、Claude、Google Gemini 等主流大语言模型整理的地区支持、IP 纯净度与节点选购要点。',
  },
  streaming: {
    name: '流媒体',
    description: '全面解析 Netflix、Disney+、YouTube 4K 与 TikTok 跨区播放的原生 IP 判定规则与稳定解锁技巧。',
  },
  risk: {
    name: '风险预警',
    description: '揭秘机场跑路前兆特征、钓鱼山寨官网防范、长期预付陷阱与订阅信息泄漏自查应对策略。',
  },
  news: {
    name: '资讯',
    description: 'GSY Cloud 官方公告、测评数据更新说明与跨境网络协议前沿动态资讯。',
  },
};
