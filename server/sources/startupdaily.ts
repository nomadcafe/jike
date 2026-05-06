export default defineSource(async () => {
  const data = await rss2json("https://www.startupdaily.net/feed/")
  if (!data?.items.length) throw new Error("Cannot fetch startupdaily feed")
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
