/** 站点全局常量 —— 上线后不要随意修改 */
export const SITE = {
  url: 'https://gsycloud.com',
  name: 'GSY Cloud',
  nameZh: '光速云',
  title: 'GSY Cloud｜机场评测、线路选择与网络工具知识平台',
  description:
    'GSY Cloud（光速云）是机场评测、线路选择与网络工具知识平台：收录 16 家机场品牌的结构化评测，覆盖专线线路、协议与套餐对比，并提供客户端教程、故障排查与网络工具指南，帮助你理解机场服务背后的技术差异，选出真正适合自己的线路。',
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
  airport: { name: '机场推荐', description: '按稳定性、性价比、使用场景系统整理的机场选择参考' },
  reviews: { name: '机场评测', description: '按统一框架整理的机场品牌评测与资料' },
  nodes: { name: '节点知识', description: '代理节点、订阅、测速与节点使用知识' },
  tutorials: { name: '客户端教程', description: 'Clash、Mihomo、Shadowrocket、v2rayN 等客户端完整教程' },
  troubleshooting: { name: '故障排查', description: '连接失败、节点超时、订阅异常等问题的系统排查指南' },
  protocols: { name: '协议知识', description: 'Shadowsocks、Trojan、VLESS、Hysteria2 等代理协议详解' },
  network: { name: '线路与网络', description: 'IPLC、IEPL、原生 IP、DNS 等线路与网络基础知识' },
  ai: { name: 'AI 网络', description: 'ChatGPT、Claude、Gemini 等 AI 工具的网络环境指南' },
  streaming: { name: '流媒体', description: 'Netflix、Disney+、TikTok 等流媒体平台的网络访问知识' },
  risk: { name: '风险预警', description: '机场跑路、钓鱼网站、订阅泄漏等风险提示' },
  news: { name: '资讯', description: 'GSY Cloud 官方公告与行业动态' },
};
