import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

// pedaily.cn 没有公开 RSS。news.pedaily.cn 首页直接渲染：每个锚点的 text 就是标题，
// href 形如 https://news.pedaily.cn/202605/563502.shtml，URL 末段数字单调递增可作为 id。
export default defineSource(async () => {
  const html: any = await myFetch("https://news.pedaily.cn/")
  const $ = cheerio.load(html)
  const seen = new Set<string>()
  const news: NewsItem[] = []
  $("a[href*=\".shtml\"]").each((_, el) => {
    const $el = $(el)
    const url = $el.attr("href")
    const title = $el.text().trim()
    // 过滤导航入口（"APP" / "地图" 等无意义短词）和分页/sitemap
    if (!url || !title || title.length < 6 || /sitemap|app-download/.test(url)) return
    // URL 末段数字作 id；避免同一篇文章被重复登记
    const m = url.match(/\/(\d+)\.shtml(?:$|\?)/)
    const id = m?.[1] ?? url
    if (seen.has(id)) return
    seen.add(id)
    news.push({
      id,
      title,
      url: url.startsWith("//") ? `https:${url}` : url,
    })
  })
  if (!news.length) throw new Error("Cannot fetch pedaily news")
  return news.slice(0, 30)
})
