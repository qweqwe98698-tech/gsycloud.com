/** Pillar（专题）定义：教程客户端 / 设备 / AI 平台 专题枢纽页共享数据 */

export interface Pillar {
  slug: string;
  section: 'tutorials' | 'ai';
  name: string;
  title: string;
  description: string;
  /** 专题引导语（枢纽页首屏） */
  intro: string;
  keywords: string[];
}

export const TUTORIAL_PILLARS: Pillar[] = [
  {
    slug: 'clash',
    section: 'tutorials',
    name: 'Clash',
    title: 'Clash 教程',
    description: 'Clash / Clash Verge 下载安装、订阅导入、节点切换、系统代理、TUN、DNS 与故障排查完整教程。',
    intro:
      'Clash 是最常用的代理客户端体系之一。本专题覆盖从下载安装到订阅导入、规则模式、TUN 模式与常见故障的完整使用路径。',
    keywords: ['Clash教程', 'Clash使用', 'Clash订阅'],
  },
  {
    slug: 'mihomo',
    section: 'tutorials',
    name: 'Mihomo',
    title: 'Mihomo 教程',
    description: 'Mihomo（Clash Meta 内核）安装配置、订阅使用与进阶功能教程。',
    intro:
      'Mihomo 是 Clash Meta 的延续内核，支持更多协议与规则能力。本专题整理 Mihomo 及其常用外壳客户端的使用方法。',
    keywords: ['Mihomo教程', 'Clash Meta'],
  },
  {
    slug: 'shadowrocket',
    section: 'tutorials',
    name: 'Shadowrocket',
    title: 'Shadowrocket 教程',
    description: 'iOS 客户端 Shadowrocket（小火箭）购买安装、订阅导入、节点使用与故障排查教程。',
    intro:
      'Shadowrocket（小火箭）是 iOS 上最流行的代理客户端。本专题覆盖购买、安装、订阅导入与常见问题。',
    keywords: ['Shadowrocket教程', '小火箭教程'],
  },
  {
    slug: 'v2rayn',
    section: 'tutorials',
    name: 'v2rayN',
    title: 'v2rayN 教程',
    description: 'Windows 客户端 v2rayN 下载安装、订阅导入、路由设置与故障排查教程。',
    intro:
      'v2rayN 是 Windows 上的经典代理客户端，支持多种协议内核。本专题整理 v2rayN 的完整使用路径。',
    keywords: ['v2rayN教程', 'v2rayN使用'],
  },
  {
    slug: 'sing-box',
    section: 'tutorials',
    name: 'sing-box',
    title: 'sing-box 教程',
    description: 'sing-box 多平台安装、配置结构、订阅使用与进阶功能教程。',
    intro:
      'sing-box 是新一代通用代理平台，配置能力强、协议覆盖广。本专题从入门角度整理 sing-box 的使用方法。',
    keywords: ['sing-box教程'],
  },
  {
    slug: 'windows',
    section: 'tutorials',
    name: 'Windows',
    title: 'Windows 代理教程',
    description: 'Windows 平台代理客户端选择、系统代理设置与常见问题整理。',
    intro: '本专题按 Windows 平台整理客户端选择、系统代理机制与平台特有问题。',
    keywords: ['Windows代理', 'Windows机场客户端'],
  },
  {
    slug: 'macos',
    section: 'tutorials',
    name: 'macOS',
    title: 'macOS 代理教程',
    description: 'macOS 平台代理客户端选择、系统代理设置与常见问题整理。',
    intro: '本专题按 macOS 平台整理客户端选择、系统代理机制与平台特有问题。',
    keywords: ['macOS代理', 'Mac机场客户端'],
  },
  {
    slug: 'android',
    section: 'tutorials',
    name: 'Android',
    title: 'Android 代理教程',
    description: 'Android 平台代理客户端选择、VPN 模式说明与常见问题整理。',
    intro: '本专题按 Android 平台整理客户端选择、VPN 服务机制与平台特有问题。',
    keywords: ['Android代理', '安卓机场客户端'],
  },
  {
    slug: 'ios',
    section: 'tutorials',
    name: 'iOS',
    title: 'iOS 代理教程',
    description: 'iOS 平台代理客户端选择、安装限制说明与常见问题整理。',
    intro: '本专题按 iOS 平台整理客户端获取方式、网络扩展机制与平台特有问题。',
    keywords: ['iOS代理', '苹果机场客户端'],
  },
];

export const AI_PILLARS: Pillar[] = [
  {
    slug: 'chatgpt',
    section: 'ai',
    name: 'ChatGPT',
    title: 'ChatGPT 网络环境',
    description: 'ChatGPT 地区限制、IP 环境要求、节点选择、登录异常与网络故障排查指南。',
    intro:
      'ChatGPT 对访问地区与 IP 环境有较严格的要求。本专题整理 ChatGPT 的网络环境要求、节点选择思路与常见错误的排查方法。',
    keywords: ['ChatGPT网络', 'ChatGPT节点'],
  },
  {
    slug: 'claude',
    section: 'ai',
    name: 'Claude',
    title: 'Claude 网络环境',
    description: 'Claude 地区支持、IP 环境要求、节点选择与常见访问问题排查指南。',
    intro:
      'Claude 的地区与 IP 风控策略与 ChatGPT 并不完全相同。本专题整理 Claude 的网络环境要求与常见问题。',
    keywords: ['Claude网络', 'Claude节点'],
  },
  {
    slug: 'gemini',
    section: 'ai',
    name: 'Gemini',
    title: 'Gemini 网络环境',
    description: 'Google Gemini 地区限制、账号环境、节点选择与访问问题整理。',
    intro:
      'Gemini 依托 Google 账号体系，网络环境要求与其他 AI 工具有差异。本专题整理 Gemini 的访问要点。',
    keywords: ['Gemini网络'],
  },
  {
    slug: 'grok',
    section: 'ai',
    name: 'Grok',
    title: 'Grok 网络环境',
    description: 'Grok 访问要求、地区支持与网络问题整理。',
    intro: '本专题整理 Grok 的地区支持情况与访问网络要求。',
    keywords: ['Grok网络'],
  },
  {
    slug: 'perplexity',
    section: 'ai',
    name: 'Perplexity',
    title: 'Perplexity 网络环境',
    description: 'Perplexity 访问要求、地区支持与网络问题整理。',
    intro: '本专题整理 Perplexity 的访问网络要求与常见问题。',
    keywords: ['Perplexity网络'],
  },
];

export const ALL_PILLARS: Pillar[] = [...TUTORIAL_PILLARS, ...AI_PILLARS];

export function getPillar(section: string, slug: string): Pillar | undefined {
  return ALL_PILLARS.find((p) => p.section === section && p.slug === slug);
}
