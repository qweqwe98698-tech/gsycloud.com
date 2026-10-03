---
title: "sing-box 客户端配置与分流规则完整教程：从入门到进阶"
description: "sing-box 新一代通用代理客户端入门到进阶教程：全面解析 JSON 配置结构、入站与出站设置、Rule-Set 分流规则与 TUN 虚拟网卡配置，提供兼顾速度与隐私的生产级配置模板与排错指引。"
pubDate: 2026-10-03
updatedDate: 2026-10-03
category: "客户端教程"
tags: ["sing-box配置", "sing-box分流规则", "sing-box客户端使用"]
author: "gsycloud-network"
primaryKeyword: "sing-box教程"
secondaryKeywords: ["sing-box配置", "sing-box分流规则", "sing-box客户端使用"]
searchIntent: "informational"
pillar: "sing-box"
relatedSlugs:
  - "ai/chatgpt/network-guide"
  - "ai/claude/network-guide"
  - "airport/2026"
  - "airport/beginners"
faq:
  - question: "sing-box 与传统 Clash 相比在配置结构上有何本质不同？"
    answer: "Clash 采用 proxies、proxy-groups、rules 三段式扁平结构，规则匹配依赖 group 引用；sing-box 则把入站（inbounds）、出站（outbounds）、路由（route）拆成三个顶层对象，规则直接引用 outbound tag，且原生支持 Rule-Set 远程规则集与逻辑规则（logical rule）。本质区别在于 sing-box 用路由表思维替代了代理组思维，分流能力更强但配置心智负担更高。"
  - question: "如何正确配置 Rule-Set 远程规则集与本地直接分流？"
    answer: "在 route.rule_set 中声明 type 为 remote 的规则集，指定 url、format（source/binary）与 update_interval，然后在 rules 中用 rule_set 字段引用其 tag。本地直连通过 outbound 为 direct 的规则实现，建议把 geosite-cn、geoip-cn 放在代理规则之前，同时为直连域名单独指定国内 DNS，避免解析污染导致误判。"
  - question: "开启 TUN 模式接管系统全局流量时有哪些 DNS 劫持与路由冲突陷阱？"
    answer: "常见陷阱有三类：一是 TUN 与系统原有 VPN 或 Docker 网桥争抢路由表导致默认路由被覆盖；二是 DNS 未设置 strict_route 与 hijack-dns 导致解析请求绕过 sing-box 造成泄漏；三是 auto_route 开启后未排除局域网网段，使内网访问被强制代理。建议显式配置 route_exclude_address 与 dns.rules，并在 Linux 下检查 ip rule 优先级。"
  - question: "遇到节点连接超时或特定域名直连失败时应如何排查？"
    answer: "先分层定位：用 sing-box check 校验配置语法，再开启 log.level=debug 观察出站握手与 DNS 解析日志。节点超时多为握手失败或 SNI 不匹配，可切换 multiplex 与 tls 参数验证；域名直连失败通常是 DNS 污染或规则顺序错误，检查该域名是否被 geosite 规则误命中代理，或直连 DNS 是否被 TUN 劫持。"
sources: []
contentType: "tutorial"
dataStatus: "reference"
featured: false
draft: false
---

sing-box 的配置本质是一张声明式的路由表：所有流量从 `inbounds` 进入，经过 `route.rules` 逐条匹配，最终交给某个 `outbounds` 出口。它和 Clash 最大的区别在于——Clash 让你先定义"代理组"，再用规则指向组；sing-box 让你直接定义"出口"，规则直接指向出口 tag。理解了这一点，剩下的 JSON 结构就只是语法问题。本文从最小可用配置讲起，逐步推进到 Rule-Set 远程规则集、TUN 全局接管与 DNS 分流，最后给出一份可直接落地生产环境的完整模板与排错清单。

## 核心要点

- **配置结构是路由表而非代理组**：sing-box 顶层只有 `log`、`dns`、`inbounds`、`outbounds`、`route`、`experimental` 六个对象，规则直接引用 outbound tag，不再有 Clash 那种 group 嵌套。
- **分流精度取决于规则顺序与 Rule-Set 格式**：规则自上而下匹配，命中即停。远程规则集优先用 `binary` 格式（体积小、解析快），本地自定义域名放最前面。
- **TUN 模式的核心是 DNS 与路由的配合**：`auto_route` 接管默认路由，`strict_route` 防止绕过，`hijack-dns` 拦截 53 端口，三者缺一不可，否则会出现 DNS 泄漏或内网访问异常。
- **排错必须分层**：语法层用 `sing-box check`，连接层看 `log.level=debug` 的出站握手日志，DNS 层单独抓解析结果，不要一上来就改配置。
- **生产环境建议拆分配置文件**：把节点、规则集、DNS 分开维护，用脚本合并生成最终 config.json，避免手改大文件出错。

## sing-box 与 Clash 的配置结构差异到底在哪

很多人从 Clash 迁移到 sing-box 时最大的困惑是："我的 proxy-groups 去哪了？"答案是：sing-box 没有代理组这个概念，取而代之的是 outbounds + route 的组合。

在 Clash 里，一个典型的配置是这样的逻辑：先定义 `proxies`（节点），再定义 `proxy-groups`（把节点分组，比如"自动选择""香港节点"），最后在 `rules` 里写 `DOMAIN-SUFFIX,google.com,PROXY`，这里的 PROXY 指向一个 group。

sing-box 则把这三层压缩成两层：`outbounds` 里每个出口都有唯一 tag，`route.rules` 里直接写 `{"domain_suffix": ["google.com"], "outbound": "proxy"}`。没有中间层。

这个设计带来的直接后果是：

| 维度 | Clash / Clash.Meta | sing-box |
| --- | --- | --- |
| 分流单元 | proxy-group（可嵌套、可测速） | outbound（扁平，无嵌套） |
| 规则引用 | 指向 group 名 | 指向 outbound tag |
| 远程规则集 | rule-providers（behavior 区分） | rule_set（format 区分 source/binary） |
| 逻辑规则 | 有限支持（Meta 有 AND/OR） | 原生 logical rule，支持 and/or |
| 出站协议 | 依赖内核支持列表 | 内置协议更全，含 Hysteria2、Tuic、WireGuard |
| DNS 分流 | 依赖 fake-ip + nameserver-policy | dns.rules 独立规则链，更细 |
| 配置校验 | 启动时报错 | 提供 `sing-box check` 独立校验 |

从工程角度看，sing-box 的路由表模型更接近 nftables 或 iproute2 的思维，适合需要精细控制的人；Clash 的代理组模型更接近"策略路由"，适合快速上手。如果你之前用过 Clash 的 fallback 或 url-test 组，在 sing-box 里需要用 `urltest` 和 `selector` 这两种特殊 outbound 来替代。

## 最小可用配置：从零跑通一个节点

先给一份能直接跑起来的最小配置，把结构看清楚。假设你有一个 VLESS + TLS 节点。

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080,
      "sniff": true,
      "sniff_override_destination": false
    }
  ],
  "outbounds": [
    {
      "type": "vless",
      "tag": "proxy",
      "server": "node.example.com",
      "server_port": 443,
      "uuid": "your-uuid-here",
      "flow": "xtls-rprx-vision",
      "tls": {
        "enabled": true,
        "server_name": "node.example.com",
        "utls": {
          "enabled": true,
          "fingerprint": "chrome"
        }
      }
    },
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "rules": [
      {
        "action": "sniff"
      },
      {
        "ip_is_private": true,
        "outbound": "direct"
      }
    ],
    "final": "proxy"
  }
}
```

几个关键点解释：

`inbounds` 里用 `mixed` 类型，同时支持 HTTP 和 SOCKS5，监听本地 2080 端口。`sniff` 开启后 sing-box 会从流量里嗅探域名，这对后续基于域名的分流至关重要——因为浏览器走 SOCKS5 时可能只给 IP 不给域名。

`route.rules` 里第一条 `{"action": "sniff"}` 是 sing-box 1.11 之后的新语法，显式声明嗅探动作。第二条把私有 IP 段直接走直连，避免内网访问被代理。`final` 是兜底出口，所有未匹配的流量走 proxy。

注意 `outbounds` 里必须显式定义 `direct` 出口，否则 `outbound: "direct"` 会报错找不到 tag。

## Rule-Set 远程规则集怎么配才不出错

Rule-Set 是 sing-box 分流的核心。它的作用是：把大量域名或 IP 规则托管到远程文件，本地只引用一个 tag，避免配置文件膨胀到几千行。

声明规则集的标准写法：

```json
{
  "route": {
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "tag": "geoip-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      }
    ],
    "rules": [
      {
        "rule_set": ["geosite-cn", "geoip-cn"],
        "outbound": "direct"
      }
    ]
  }
}
```

这里有三个容易踩的坑：

**第一，`download_detour` 必须指向一个能直连的出口。** 如果你把规则集的下载也走代理，而代理本身又依赖规则集来判断是否走代理，就会形成循环依赖，启动时卡死。所以 `download_detour` 通常设为 `direct`。

**第二，`format` 要匹配 URL 的文件类型。** `.srs` 是 sing-box 的二进制规则集格式，对应 `binary`；`.json` 或纯文本域名列表对应 `source`。用错格式会导致解析失败，日志里会报 `decode rule-set` 错误。

**第三，规则顺序决定一切。** 规则自上而下匹配，命中即停。所以自定义规则要放在通用规则集之前。比如你想让 `chatgpt.com` 走特定节点，而 `geosite-cn` 里恰好没有它，那没问题；但如果某个域名同时被你的自定义规则和 geosite 覆盖，谁在前面谁生效。

一个更贴近实战的规则顺序：

```json
{
  "rules": [
    { "action": "sniff" },
    { "protocol": "dns", "action": "hijack-dns" },
    { "ip_is_private": true, "outbound": "direct" },
    { "domain_suffix": [".cn", ".com.cn"], "outbound": "direct" },
    { "rule_set": ["geosite-cn"], "outbound": "direct" },
    { "rule_set": ["geoip-cn"], "outbound": "direct" },
    { "rule_set": ["geosite-openai"], "outbound": "ai-node" },
    { "rule_set": ["geosite-geolocation-!cn"], "outbound": "proxy" }
  ],
  "final": "proxy"
}
```

这里 `ai-node` 是另一个 outbound，专门给 AI 服务用。如果你需要针对 ChatGPT 或 Claude 做更精细的地区与 IP 选择，可以参考 [ChatGPT 网络环境指南](/ai/chatgpt/network-guide/) 和 [Claude 网络环境指南](/ai/claude/network-guide/) 里的地区判定逻辑，再决定把哪些域名分到哪个出口。

## TUN 模式接管全局流量的正确姿势

TUN 模式让 sing-box 创建一块虚拟网卡，接管系统所有流量，不再依赖应用层配置代理。这是它比 Clash 更适合做"全局透明代理"的地方，但也是坑最多的地方。

一份可用的 TUN 入站配置：

```json
{
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "sing-tun",
      "address": ["172.19.0.1/30"],
      "mtu": 9000,
      "auto_route": true,
      "strict_route": true,
      "stack": "system",
      "sniff": true,
      "sniff_override_destination": true
    }
  ]
}
```

参数逐个说清楚：

`address` 是 TUN 网卡的网关地址，用私有网段即可，不要和现有网段冲突。`mtu` 建议 9000，太小会影响吞吐，太大某些网络会分片。`auto_route` 让 sing-box 自动添加路由表条目，把默认路由指向 TUN。`strict_route` 防止流量绕过 TUN（比如某些应用绑定特定网卡），在 Linux 上尤其重要。`stack` 有 `system`、`gvisor`、`mixed` 三种，`system` 性能最好但依赖内核，`gvisor` 兼容性最好但性能略低，`mixed` 是折中。

### DNS 劫持与路由冲突的三个陷阱

**陷阱一：DNS 请求绕过 sing-box。** 如果系统 DNS 指向 8.8.8.8，而 TUN 没有劫持 53 端口，那么 DNS 解析会直接走物理网卡出去，造成泄漏，同时分流规则拿不到正确的域名。解决方法是配置 `dns` 段并开启 `hijack-dns`：

```json
{
  "dns": {
    "servers": [
      {
        "tag": "dns-direct",
        "address": "223.5.5.5",
        "detour": "direct"
      },
      {
        "tag": "dns-proxy",
        "address": "https://1.1.1.1/dns-query",
        "detour": "proxy"
      }
    ],
    "rules": [
      {
        "rule_set": ["geosite-cn"],
        "server": "dns-direct"
      }
    ],
    "final": "dns-proxy",
    "strategy": "prefer_ipv4"
  }
}
```

配合 route 规则里的 `{"protocol": "dns", "action": "hijack-dns"}`，所有 53 端口请求会被 sing-box 拦截并按 dns.rules 分发。国内域名走阿里 DNS 直连解析，国外域名走加密 DNS 经代理解析。

**陷阱二：局域网访问被强制代理。** `auto_route` 会把默认路由指向 TUN，但不会自动排除局域网。如果你要访问 NAS、打印机或路由器管理页，会发现连不上。需要在 route 里加：

```json
{
  "route": {
    "rules": [
      {
        "ip_cidr": ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"],
        "outbound": "direct"
      }
    ]
  }
}
```

或者用 `route_exclude_address` 在 TUN 层面排除。

**陷阱三：与 Docker、VPN 的路由冲突。** 如果你机器上跑着 Docker，或者已经连了公司 VPN，TUN 的默认路由可能覆盖它们的路由表，导致容器网络或 VPN 内网访问异常。Linux 下用 `ip rule` 和 `ip route show table all` 检查优先级，必要时给 TUN 设置较低的优先级，或手动排除相关网段。

| 现象 | 可能原因 | 排查命令 | 解决方向 |
| --- | --- | --- | --- |
| 所有网站都打不开 | 默认路由被 TUN 覆盖但出口不可用 | `ip route` | 检查 outbound 连通性 |
| 国内网站变慢 | DNS 走了代理解析 | `dig @127.0.0.1` | 配置 dns.rules 分流 |
| 内网设备连不上 | 局域网未排除 | `ping 192.168.x.x` | 加 ip_cidr 直连规则 |
| DNS 泄漏 | 53 端口未劫持 | `tcpdump port 53` | 开启 hijack-dns |
| 部分应用不走代理 | strict_route 未开 | 抓包看源地址 | 开启 strict_route |

## 节点超时与直连失败的排查路径

排错的核心原则是分层，不要一上来就改配置。

**第一层：语法校验。** 运行 `sing-box check -c config.json`，它会告诉你 JSON 结构、字段类型、tag 引用是否有问题。这一步能拦掉 80% 的低级错误，比如 outbound tag 拼错、rule_set 未声明就引用。

**第二层：日志观察。** 把 `log.level` 设为 `debug`，重启后观察输出。节点连接超时的日志通常长这样：

```
outbound/vless: dial tcp node.example.com:443: i/o timeout
```

这说明 TCP 握手都没成功，问题在网络层：可能是节点地址被墙、端口被封、或本地网络限制。如果日志显示 TLS 握手失败：

```
outbound/vless: TLS handshake failed: remote error: tls: unrecognized name
```

那就是 SNI 或证书问题，检查 `server_name` 是否和节点实际域名一致，`utls.fingerprint` 是否被服务端接受。

**第三层：DNS 验证。** 特定域名直连失败，往往是 DNS 解析出了问题。用 `dig` 或 `nslookup` 直接查该域名，看返回的 IP 是否正常。如果返回的是 0.0.0.0 或明显错误的 IP，说明被污染了，需要走加密 DNS。如果解析正常但访问失败，检查该域名是否被规则误命中代理出口。

一个常见的误判场景：某域名在 `geosite-cn` 里，本该直连，但你的规则顺序把 `geosite-geolocation-!cn` 放在了前面，导致它被代理，而代理节点又无法访问该国内服务。解决方法是调整规则顺序，或给该域名单独加一条直连规则放在最前面。

| 排查层 | 工具/命令 | 关注点 |
| --- | --- | --- |
| 语法层 | `sing-box check` | tag 引用、字段类型、格式 |
| 连接层 | `log.level=debug` | 握手、TLS、超时 |
| DNS 层 | `dig`、`tcpdump port 53` | 解析结果、是否泄漏 |
| 路由层 | `ip route`、`ip rule` | 默认路由、优先级 |
| 规则层 | 日志中的 matched rule | 规则命中顺序 |

如果你在选节点阶段就遇到了连通性问题，可能不是配置的锅，而是节点本身的质量问题。可以参考 [2026 年机场推荐指南](/airport/2026/) 里的线路评估方法，以及 [新手如何选择机场](/airport/beginners/) 中关于协议与地区的判断标准，先把节点层的问题排除掉。

## 生产级配置模板

把前面所有内容整合成一份可直接使用的模板。建议拆成三个文件维护：`nodes.json`（节点）、`rules.json`（规则集）、`config.json`（主配置），用脚本合并。

```json
{
  "log": {
    "level": "info",
    "timestamp": true,
    "output": "/var/log/sing-box.log"
  },
  "dns": {
    "servers": [
      { "tag": "dns-direct", "address": "223.5.5.5", "detour": "direct" },
      { "tag": "dns-proxy", "address": "https://1.1.1.1/dns-query", "detour": "proxy" }
    ],
    "rules": [
      { "rule_set": ["geosite-cn"], "server": "dns-direct" }
    ],
    "final": "dns-proxy",
    "strategy": "prefer_ipv4",
    "independent_cache": true
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080,
      "sniff": true
    },
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "sing-tun",
      "address": ["172.19.0.1/30"],
      "mtu": 9000,
      "auto_route": true,
      "strict_route": true,
      "stack": "mixed",
      "sniff": true,
      "sniff_override_destination": true
    }
  ],
  "outbounds": [
    {
      "type": "selector",
      "tag": "proxy",
      "outbounds": ["node-hk", "node-jp", "direct"],
      "default": "node-hk"
    },
    {
      "type": "vless",
      "tag": "node-hk",
      "server": "hk.example.com",
      "server_port": 443,
      "uuid": "uuid-1",
      "flow": "xtls-rprx-vision",
      "tls": {
        "enabled": true,
        "server_name": "hk.example.com",
        "utls": { "enabled": true, "fingerprint": "chrome" }
      }
    },
    {
      "type": "vless",
      "tag": "node-jp",
      "server": "jp.example.com",
      "server_port": 443,
      "uuid": "uuid-2",
      "flow": "xtls-rprx-vision",
      "tls": {
        "enabled": true,
        "server_name": "jp.example.com",
        "utls": { "enabled": true, "fingerprint": "chrome" }
      }
    },
    { "type": "direct", "tag": "direct" }
  ],
  "route": {
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "tag": "geoip-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      }
    ],
    "rules": [
      { "action": "sniff" },
      { "protocol": "dns", "action": "hijack-dns" },
      { "ip_is_private": true, "outbound": "direct" },
      { "ip_cidr": ["192.168.0.0/16", "10.0.0.0/8"], "outbound": "direct" },
      { "rule_set": ["geosite-cn"], "outbound": "direct" },
      { "rule_set": ["geoip-cn"], "outbound": "direct" }
    ],
    "final": "proxy",
    "auto_detect_interface": true
  },
  "experimental": {
    "cache_file": {
      "enabled": true,
      "path": "cache.db"
    },
    "clash_api": {
      "external_controller": "127.0.0.1:9090",
      "default_mode": "rule"
    }
  }
}
```

`experimental.clash_api` 开启后，你可以用 Clash 的 Dashboard 或 yacd 来管理 sing-box，这对习惯 Clash 界面的用户很友好。`cache_file` 用于缓存规则集和选中的节点，避免每次重启都重新下载。

## 总结

sing-box 的学习曲线比 Clash 陡，但换来的是更精确的分流控制和更完整的协议支持。掌握它的关键不在于背 JSON 字段，而在于理解"入站 → 路由规则 → 出站"这条数据流，以及 DNS 和 TUN 如何配合这条数据流工作。

给三条落地建议：

第一，先用 `mixed` 入站跑通基本代理，确认节点可用后再上 TUN。TUN 涉及系统路由和 DNS，出问题时排查面太广。

第二，规则集优先用 `binary` 格式，`download_detour` 指向 `direct`，规则顺序从具体到宽泛，自定义规则永远放最前面。

第三，排错按语法 → 连接 → DNS → 路由 → 规则五层走，每层用对应工具验证，不要凭感觉改配置。开启 `log.level=debug` 是你最好的朋友。

节点质量决定了体验上限，配置只是把上限发挥出来。如果你的节点本身线路不稳，再精细的分流规则也救不了。选节点时优先看线路类型和地区，具体方法在前面的机场指南里已经讲清楚了。