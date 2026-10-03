---
title: "v2rayN 路由分流与 DNS 防泄漏配置指南：Windows 代理环境调优"
description: "Windows 平台经典代理客户端 v2rayN 路由分流与 DNS 深度优化教程：详解绕过大陆局域网规则、自定义路由集、TUN 模式配置与 DNS 防泄漏策略，解决国内直连减速与境外访问缓慢问题。"
pubDate: 2026-10-03
updatedDate: 2026-10-03
category: "客户端教程"
tags: ["v2rayN教程", "v2rayN分流规则", "v2rayN DNS防泄漏"]
author: "gsycloud-editorial"
primaryKeyword: "v2rayN路由设置"
secondaryKeywords: ["v2rayN教程", "v2rayN分流规则", "v2rayN DNS防泄漏"]
searchIntent: "informational"
pillar: "v2rayn"
relatedSlugs:
  - ai/chatgpt/network-guide
  - ai/claude/network-guide
  - airport/2026
  - airport/beginners
faq:
  - question: "v2rayN 预设的几种路由模式（绕过大陆/全局/直连）底层匹配逻辑是什么？"
    answer: "v2rayN 的路由模式本质是 Xray/V2Ray 内核 routing.rules 的预设模板。绕过大陆模式加载 geosite:cn 与 geoip:cn 规则集，命中域名或 IP 归属中国大陆则走 direct，其余走 proxy；全局模式仅保留一条 proxy 兜底规则，所有流量强制走代理；直连模式则相反，全部走 direct。匹配顺序自上而下，首条命中即生效，因此自定义规则必须放在预设规则之前。"
  - question: "如何添加自定义域名与 IP 路由规则，避免国内应用误走代理消耗流量？"
    answer: "在 v2rayN 的「路由设置」中新增规则，domain 字段支持 domain:、full:、keyword:、regexp: 四种匹配方式，IP 字段支持 geoip: 与 CIDR。将国内应用域名写入 domain 并指定 outboundTag 为 direct，把需要强制代理的境外域名指定为 proxy。规则顺序决定优先级，务必把精确规则置于 geosite:cn 之前，否则会被宽泛规则抢先命中。"
  - question: "Windows 系统代理与 TUN 模式的区别是什么，分别适用于什么软件？"
    answer: "系统代理通过修改 WinINET/注册表 ProxyServer 生效，仅对遵循系统代理设置的软件有效（浏览器、部分 Electron 应用），UWP 应用需开启 loopback 豁免；TUN 模式创建虚拟网卡接管全部 IP 层流量，对不读系统代理的程序（如命令行工具、游戏、部分 P2P 软件）同样生效。日常办公用系统代理即可，涉及全流量接管场景才启用 TUN。"
  - question: "如何配置远程 DNS 与直连 DNS，防止本地 DNS 污染同时避免境外解析泄漏？"
    answer: "在 DNS 设置中启用「使用 DNS 服务器」并配置分流：国内域名走 223.5.5.5 / 119.29.29.29 等直连 DNS，境外域名走 https://1.1.1.1/dns-query 或 https://dns.google/dns-query 等 DoH 远程 DNS。同时开启「DNS 防泄漏」与 sniffing，让内核按域名分流解析，避免本地 ISP DNS 污染，也防止境外域名被国内 DNS 解析导致 CDN 就近失效。"
sources: []
contentType: "tutorial"
dataStatus: "reference"
featured: false
draft: false
---

v2rayN 在 Windows 上的路由分流与 DNS 配置，核心结论只有一句话：**分流靠 routing.rules 的匹配顺序，防泄漏靠 DNS 分流与 sniffing 的配合**。绝大多数用户遇到的“国内网站变慢”“ChatGPT 打不开”“DNS 污染导致解析到错误 IP”，根因都不在节点本身，而在路由规则顺序错乱、DNS 未分流、或系统代理与 TUN 模式选错。本文基于 Xray 内核的 routing 与 DNS 模块行为，从匹配逻辑、规则编写、模式选择到防泄漏逐层拆解，给出可直接落地的配置方案。

## 核心要点

- **路由规则自上而下首条命中即生效**，自定义规则必须放在 geosite:cn / geoip:cn 之前，否则会被宽泛规则抢先匹配。
- **绕过大陆模式 = geosite:cn + geoip:cn 走 direct，其余走 proxy**；全局模式仅保留 proxy 兜底；直连模式全部 direct。三者本质是同一套 routing.rules 的不同预设。
- **系统代理只对遵循 WinINET 的程序生效**，命令行、游戏、部分 P2P 需 TUN 模式接管 IP 层流量，但 TUN 会带来更高的兼容性成本。
- **DNS 防泄漏的关键是分流解析**：国内域名走直连 DNS，境外域名走 DoH/DoT 远程 DNS，并开启 sniffing 让内核按域名而非 IP 分流。
- **domain 匹配支持 domain / full / keyword / regexp 四种方式**，精确度与性能依次递减，能用 full 就不用 regexp。

## v2rayN 的三种路由模式，底层到底在匹配什么？

很多教程把“绕过大陆”“全局”“直连”讲成三个独立功能，实际上在 Xray 内核里它们只是同一份 `routing.rules` 数组的不同预设。理解这一点，后面所有自定义规则才有落脚点。

Xray 的 routing 模块工作流程是这样的：一条连接进来，内核依次遍历 `rules` 数组，对每条规则的 `domain`、`ip`、`port`、`sourceIP`、`inboundTag` 等条件做匹配，**第一条全部条件命中的规则决定这条连接的 `outboundTag`**，后续规则不再参与。如果所有规则都没命中，则走 `routing.domainStrategy` 之外的默认出站（通常是第一条 outbound，即代理）。

三种预设的差异就体现在规则数组的内容上：

- **绕过大陆（Bypass Mainland）**：数组里通常有两条核心规则——`geosite:cn` 与 `geoip:cn` 指向 `direct`，最后一条空条件规则指向 `proxy` 兜底。命中中国大陆域名或 IP 的走直连，其余走代理。
- **全局（Global）**：数组里只有一条空条件规则指向 `proxy`，所有流量无条件走代理，连国内网站也不例外。
- **直连（Direct）**：数组里只有一条空条件规则指向 `direct`，所有流量不走代理，等价于关闭代理但保留内核运行。

这里有个容易被忽略的工程细节：`geosite:cn` 和 `geoip:cn` 是两个不同的数据集。前者是域名列表（由社区维护的 domain-list-community 项目生成），后者是 IP 段列表（由 MaxMind 等数据源生成）。**域名匹配发生在 DNS 解析之前，IP 匹配发生在解析之后**。这意味着如果一条连接先被 `geosite:cn` 命中，内核根本不会去解析它的 IP；只有域名没命中时，才会解析 IP 再交给 `geoip:cn` 判断。这个顺序直接决定了 DNS 配置该怎么写。

| 模式 | 核心规则 | 命中 direct 的条件 | 兜底出站 | 典型适用场景 |
| --- | --- | --- | --- | --- |
| 绕过大陆 | geosite:cn → direct；geoip:cn → direct；空条件 → proxy | 域名或 IP 属中国大陆 | proxy | 日常办公、国内应用为主 |
| 全局 | 空条件 → proxy | 无 | proxy | 临时访问大量境外资源、调试节点 |
| 直连 | 空条件 → direct | 全部 | direct | 排查节点问题、临时关闭代理 |

理解这张表之后，你会发现“绕过大陆模式为什么国内网站还是走了代理”这类问题，答案往往不是模式选错了，而是某条自定义规则或某个应用的域名不在 geosite:cn 数据集里。

## 自定义域名与 IP 路由规则：怎么写才不误伤？

预设规则覆盖的是主流域名，但现实里总有漏网之鱼：某个国内小众 SaaS 的域名没进 geosite:cn，某个境外服务被错误归类，或者你希望某个特定域名强制走代理。这时候就需要手写规则。

在 v2rayN 里，路由规则的入口是「路由设置」→「路由规则」，底层对应 Xray 的 `routing.rules`。一条规则的结构大致如下（这是 Xray 内核配置的形态，v2rayN 的 GUI 会把它翻译成表单）：

```json
{
  "type": "field",
  "domain": [
    "full:example.cn",
    "domain:internal-corp.com",
    "keyword:analytics",
    "regexp:^.*\\.test\\.example\\.com$"
  ],
  "ip": [
    "geoip:cn",
    "192.168.0.0/16",
    "10.0.0.0/8"
  ],
  "port": "0-65535",
  "outboundTag": "direct"
}
```

`domain` 字段的四种匹配方式，精度和性能差异很大，选错了要么误伤要么漏匹配：

- `full:` 精确匹配整个域名，性能最好，适合写死的单个域名，如 `full:api.example.cn`。
- `domain:` 匹配域名及其所有子域，`domain:example.cn` 会命中 `a.example.cn` 和 `b.example.cn`，日常最常用。
- `keyword:` 只要域名里包含该字符串就命中，`keyword:google` 会命中 `google.com`、`googleapis.com`、`mygoogle.xyz`，容易误伤，慎用。
- `regexp:` 正则匹配，最灵活也最慢，仅在前面三种都表达不了时才用。

**规则顺序是这里最容易踩的坑**。因为首条命中即生效，如果你把 `domain:example.cn → direct` 写在 `geosite:cn → direct` 之后，那这条规则永远不会被触发（因为 geosite:cn 已经先命中了）。同理，如果你想让某个域名强制走代理，而它恰好属于 geosite:cn，就必须把 `domain:that-domain.com → proxy` 放在 geosite:cn 规则**之前**。

一个经过实战验证的规则排列顺序建议：

1. 私有网络与局域网直连（`geoip:private`、`192.168.0.0/16`、`10.0.0.0/8`）→ direct
2. 需要强制走代理的境外域名（如 `domain:openai.com`、`domain:anthropic.com`）→ proxy
3. 需要强制直连的国内域名（geosite:cn 未覆盖的）→ direct
4. `geosite:cn` → direct
5. `geoip:cn` → direct
6. 空条件兜底 → proxy

第 2 步和第 3 步的顺序可以根据你的实际需求互换，但**它们必须都在 geosite:cn 之前**。这一点在 v2rayN 的 GUI 里表现为规则列表的上下拖动，很多人拖错了顺序却不自知，最后表现为“规则写了但没生效”。

关于境外 AI 服务的分流，如果你的主要诉求是稳定访问特定 AI 平台，可以参考 [ChatGPT 网络环境指南](/ai/chatgpt/network-guide/) 里关于地区与 IP 归属的判断方法，把对应域名精确写入 proxy 规则，避免被 geosite 数据集误判。

## 系统代理 vs TUN 模式：Windows 上到底该用哪个？

这是 Windows 平台最常被混淆的一对概念。两者不是“新旧替代”关系，而是作用于不同网络层的两种接管方式。

**系统代理（System Proxy）** 的工作方式是修改 Windows 的 WinINET 配置（注册表 `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings` 下的 `ProxyEnable` 与 `ProxyServer`）。任何遵循系统代理设置的软件——Edge、Chrome、大部分基于 Electron 的应用、部分下载工具——会自动读取这个配置并把 HTTP/HTTPS 请求发往代理端口。但它的局限也很明显：

- 不读系统代理的程序（命令行工具、游戏、部分 P2P、部分 Java 应用）完全绕过代理。
- UWP 应用默认运行在 AppContainer 沙箱里，无法访问本地回环地址（Loopback），需要手动执行 `CheckNetIsolation LoopbackExempt` 命令做豁免，否则连不上代理。
- 只接管 HTTP/HTTPS，对 SOCKS 之外的协议无能为力。

**TUN 模式** 则是在系统里创建一块虚拟网卡，把路由表里符合条件的流量全部导向这块网卡，由内核在 IP 层接管。它对应用完全透明，不管程序读不读系统代理，只要流量经过路由表就会被接管。代价是：

- 需要管理员权限，部分安全软件会拦截虚拟网卡驱动。
- 与某些 VPN、虚拟机网络、Docker 网段可能冲突。
- 配置不当容易造成路由环路或 DNS 泄漏。

| 维度 | 系统代理 | TUN 模式 |
| --- | --- | --- |
| 作用层 | 应用层（WinINET） | 网络层（虚拟网卡 + 路由表） |
| 生效范围 | 仅遵循系统代理的程序 | 全部 IP 流量 |
| 权限要求 | 普通用户 | 管理员 |
| UWP 应用 | 需 loopback 豁免 | 天然支持 |
| 命令行/游戏 | 通常不生效 | 生效 |
| 冲突风险 | 低 | 与 VPN/虚拟机可能冲突 |
| 适用场景 | 浏览器为主、日常办公 | 全流量接管、非浏览器程序 |

选择逻辑很直接：**日常办公、浏览器为主，用系统代理就够了，稳定且冲突少；一旦涉及命令行工具、游戏、需要全流量接管的场景，再启用 TUN**。不建议无脑开 TUN，因为虚拟网卡带来的兼容性问题是实打实的排障成本。

如果你在选节点或机场时对稳定性有较高要求，可以参考 [2026 年机场推荐指南](/airport/2026/) 里关于线路类型与延迟的对比，因为 TUN 模式下所有流量都走代理，节点质量对整体体验的影响会被放大。

## DNS 防泄漏：远程 DNS 与直连 DNS 怎么配？

DNS 是分流体系里最容易被忽视、也最容易出问题的一环。它同时承担两个目标：**防止本地 DNS 污染**（让境外域名解析到正确 IP）和**避免境外解析泄漏**（让国内域名用国内 DNS 解析，保证 CDN 就近）。

先讲清楚污染是怎么发生的。默认情况下，Windows 用 ISP 下发的 DNS 服务器解析所有域名。当解析一个被污染的境外域名时，ISP DNS 可能返回一个错误 IP（通常是黑洞地址或跳转页），导致你连不上或连到错误的地方。解决思路是：**境外域名用加密的远程 DNS（DoH/DoT）解析，国内域名用国内 DNS 解析**，两边分流。

在 v2rayN 的「DNS 设置」里，核心是配置 `dns.servers` 数组，并按域名分流：

```json
{
  "dns": {
    "hosts": {
      "domain:example.cn": "223.5.5.5"
    },
    "servers": [
      {
        "address": "https://dns.google/dns-query",
        "domains": [
          "geosite:geolocation-!cn"
        ]
      },
      {
        "address": "223.5.5.5",
        "domains": [
          "geosite:cn"
        ],
        "expectIPs": [
          "geoip:cn"
        ]
      },
      "1.1.1.1",
      "8.8.8.8"
    ]
  }
}
```

这段配置的逻辑是：

- 第一条：`geosite:geolocation-!cn`（非中国大陆域名）走 `https://dns.google/dns-query`，即 DoH 远程解析，绕过本地污染。
- 第二条：`geosite:cn` 走 `223.5.5.5`（阿里 DNS），并加 `expectIPs: geoip:cn` 做校验，确保解析结果确实落在国内 IP 段。
- 最后两条是兜底 DNS。

配套还需要开启两个开关：

- **sniffing（流量嗅探）**：让内核从 TLS SNI 或 HTTP Host 里提取真实域名，而不是依赖 IP 反查。这是域名分流能生效的前提，务必开启。
- **DNS 防泄漏（DNS Leak Protection）**：阻止未经内核处理的 DNS 请求直接发往本地 DNS，防止应用绕过内核自行解析。

一个常见的误区是把所有 DNS 都设成 `8.8.8.8`。这样虽然能避开污染，但国内域名也会被解析到境外 IP，导致访问国内网站绕远路、CDN 就近失效，反而更慢。**DNS 分流的本质和路由分流是一样的：按域名归属决定用哪套 DNS**。

如果你同时使用多个 AI 平台，不同平台对 DNS 解析的地区敏感度不同，可以参考 [Claude 网络环境指南](/ai/claude/network-guide/) 里关于地区解析的说明，把对应域名纳入远程 DNS 分流。

## 完整配置示例与实操步骤

下面给出一份可直接参考的 v2rayN 路由 + DNS 组合配置（对应 Xray 内核 JSON 形态），并在注释里标注每一段的用途：

```json
{
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "domain": [
          "domain:openai.com",
          "domain:anthropic.com",
          "domain:claude.ai"
        ],
        "outboundTag": "proxy"
      },
      {
        "type": "field",
        "domain": ["geosite:cn"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": ["geoip:cn"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "network": "tcp,udp",
        "outboundTag": "proxy"
      }
    ]
  }
}
```

这段配置的执行顺序是：私有 IP 直连 → 指定境外域名走代理 → 国内域名直连 → 国内 IP 直连 → 其余全部走代理。`domainStrategy` 设为 `IPIfNonMatch` 表示域名没命中时才解析 IP 再判断，兼顾性能与准确度。

配套的 DNS 配置在上面已经给出，两者需要一起生效。实操步骤：

1. 打开 v2rayN，「路由设置」中确认模式为「绕过大陆」，然后逐条添加自定义规则，注意拖动顺序。
2. 「DNS 设置」中填入上面的 servers 数组，勾选「DNS 防泄漏」与「sniffing」。
3. 保存后重启内核（不是重启 GUI），让配置重新加载。
4. 用 `nslookup` 或在线 DNS 泄漏检测站点验证国内域名解析到国内 IP、境外域名解析到境外 IP。
5. 用 `curl -v` 或浏览器开发者工具确认目标域名的连接确实走了代理端口。

如果你在选机场阶段就希望减少后续调优成本，[新手如何选择机场](/airport/beginners/) 里关于节点协议与线路的说明值得先读一遍，因为协议类型会影响 sniffing 与 DNS 分流的实际效果。

## 常见故障排查决策矩阵

| 现象 | 可能原因 | 排查动作 | 修复方向 |
| --- | --- | --- | --- |
| 国内网站变慢 | 被 geosite:cn 漏判，走了代理 | 查该域名是否在 geosite:cn 数据集内 | 手动加 `domain:xxx.cn → direct` 并置于 geosite:cn 之前 |
| 境外域名解析到错误 IP | 本地 DNS 污染，未走远程 DNS | 用 nslookup 对比直连与代理解析结果 | 配置 DoH 远程 DNS 并开启 sniffing |
| 规则写了不生效 | 规则顺序在 geosite:cn 之后 | 检查路由规则列表顺序 | 把精确规则拖到宽泛规则之前 |
| 命令行工具不走代理 | 系统代理不接管非 WinINET 程序 | 确认程序是否读系统代理 | 启用 TUN 模式 |
| UWP 应用连不上 | AppContainer 无法访问回环 | 检查是否做过 loopback 豁免 | 执行 CheckNetIsolation 命令 |
| TUN 开启后断网 | 与 VPN/虚拟机路由冲突 | 查看路由表与虚拟网卡状态 | 关闭冲突软件或调整 TUN 路由范围 |
| DNS 泄漏检测失败 | DNS 防泄漏未开启 | 检查 DNS 设置开关 | 开启防泄漏并重启内核 |

## 总结

v2rayN 在 Windows 上的路由分流与 DNS 防泄漏，本质是两件事：**规则顺序决定分流是否准确，DNS 分流决定解析是否干净**。绕过大陆模式只是预设模板，真正决定体验的是你在它之上叠加的自定义规则顺序，以及 DNS 是否按域名归属做了分流。系统代理与 TUN 模式的选择则取决于你要接管哪些程序的流量，日常浏览器场景用系统代理足够，全流量接管才需要 TUN。

排障时的优先级建议：先确认规则顺序，再确认 DNS 分流，最后才怀疑节点。绝大多数“分流不准”“访问缓慢”的问题，根因都在前两步。选型上，如果你希望减少手动调优的工作量，优先选择线路质量稳定、协议支持完善的节点服务，再配合本文的路由与 DNS 配置，才能把 v2rayN 的分流能力发挥到位。