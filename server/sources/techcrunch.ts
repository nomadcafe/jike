export default defineSource(async () => {
  const data = await rss2json("https://techcrunch.com/feed/")
  if (!data?.items.length) throw new Error("Cannot fetch techcrunch feed")
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
