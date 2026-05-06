// freebuf 首页改用 Nuxt 客户端渲染，HTML 抓不到 .article-item，
// 改用官方 RSS（/feed）：含分钟级 pubDate、分类、描述，更稳更新得快。
export default defineSource(async () => {
  const data = await rss2json("https://www.freebuf.com/feed")
  if (!data?.items.length) throw new Error("Cannot fetch freebuf feed")
  return data.items.map(item => ({
    id: item.link,
    title: item.title,
    url: item.link,
    pubDate: item.created ? new Date(item.created).valueOf() : undefined,
    extra: {
      hover: item.description,
    },
  }))
})
