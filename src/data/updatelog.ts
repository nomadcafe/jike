export type UpdateType = "source" | "fix" | "feat" | "chore"

export interface UpdateEntry {
  type: UpdateType
  scope: string
  title: string
  description?: string
}

export interface UpdateGroup {
  date: string
  entries: UpdateEntry[]
}

export const updatelog: UpdateGroup[] = [
  {
    date: "2026-05-06",
    entries: [
      {
        type: "source",
        scope: "EU-Startups",
        title: "新增「科技」列源",
        description: "聚合 eu-startups.com 官方 RSS，10 条最新欧洲创业公司动态、融资和产品发布。在科技列查看。",
      },
      {
        type: "fix",
        scope: "RSS 抓取",
        title: "兼容 application/rss+xml 类 MIME",
        description: "之前只有 text/xml 这种 Content-Type 的源能正常解析；像 EU-Startups 这种返回 application/rss+xml 的，ofetch 不当字符串处理，XMLParser 拿到空对象、整源挂掉。强制按 text 收响应，所有 RSS 源都更稳了。",
      },
      {
        type: "fix",
        scope: "登录探测",
        title: "修复 506 错误",
      },
      {
        type: "source",
        scope: "纽约时报中文网",
        title: "修复实时更新相关问题",
        description: "改用官方 RSS 源拿最新内容，并从「实时」列调整到「国际」列。",
      },
      {
        type: "source",
        scope: "36氪",
        title: "人气榜改用官方 JSON 接口",
        description: "/hot-list/renqi 已挂在 Cloudflare 反爬墙后，HTML 抓不到条目。改走 gateway.36kr.com 移动端接口，结构稳定，附带分钟级时间和阅读量。",
      },
      {
        type: "source",
        scope: "FreeBuf",
        title: "改用官方 RSS",
        description: "首页改成 Nuxt 客户端渲染后，服务端拿到的 HTML 里 .article-item 都是空的。换成 freebuf.com/feed，20 条带分钟级 pubDate。",
      },
      {
        type: "source",
        scope: "FastBull",
        title: "财经快讯链接修复",
        description: "页面改版后 .title_name 从 <a> 变成 <span>，没了 href 导致列表为空。改从 .news-list 节点的 data-id 拼出文章链接。",
      },
      {
        type: "source",
        scope: "百度贴吧",
        title: "热议榜链接修复",
        description: "接口返回的 topic_url 含字面量 HTML 实体 &amp;，浏览器把 amp;topic_name 当作参数名处理，参数错位。已解码回 &。",
      },
      {
        type: "fix",
        scope: "用户表",
        title: "GitHub email 现在能正常更新",
        description: "addUser 的判断条件之前用了 &&，因 type 字段恒为 \"github\"，第二个条件永远不成立，email 永远不写入。改为 ||。",
      },
      {
        type: "fix",
        scope: "时间解析",
        title: "修正相对时间解析的越界崩溃",
        description: "toDurations 内层循环 p <= patternSize 会在尾部访问 patterns[7]（undefined），对无任何 pattern 命中的字符串抛 TypeError。",
      },
      {
        type: "fix",
        scope: "GitHub OAuth",
        title: "JWT_SECRET 缺失时显式抛错",
        description: "之前直接用非空断言，env 没配会让 jose 报含义不明的错。现在 handler 入口检查一次，缺失就明确抛错。",
      },
      {
        type: "fix",
        scope: "favicon 脚本",
        title: "去掉重复的 fetch",
        description: "downloadImage 之前每个图标会请求两次（首次只看 status 然后丢弃响应）。改成复用首次响应的 arrayBuffer。",
      },
    ],
  },
  {
    date: "2025-10-25",
    entries: [
      {
        type: "source",
        scope: "纽约时报中文网",
        title: "新增源",
      },
    ],
  },
]
