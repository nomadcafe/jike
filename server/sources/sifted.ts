// 注意：sifted.eu/feed/ （带尾斜杠）会被 Cloudflare 挑战拦掉返 403；/feed（不带）反而直接通过。
// 不要轻易加斜杠。
export default defineSource(async () => {
  const data = await rss2json("https://sifted.eu/feed")
  if (!data?.items.length) throw new Error("Cannot fetch sifted feed")
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
