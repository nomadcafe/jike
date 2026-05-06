import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const nytimes = defineSource(async () => {
  const baseURL = "https://cn.nytimes.com"
  const html: any = await myFetch(baseURL)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  const seen = new Set<string>()
  // .story 区块的第一个 <a> 是栏目链接（如 /health/），文章链接在 h3/h2/h1 标题里。
  // .headlineOnlyList li 内只有标题链接。统一用标题里的 <a> 抓文章 URL。
  $(".headlineOnlyList li, .story").each((_, el) => {
    const $el = $(el)
    const linkEl = $el.find("h3 a, h2 a, h1 a").first()
    const url = linkEl.attr("href")
    const title = (linkEl.attr("title") || linkEl.text()).trim().replace(/\s+/g, " ")

    if (!title || !url) return
    // 过滤栏目页链接，例如 /health/、/china/
    if (!/\/\d{8}\//.test(url)) return
    if (seen.has(url)) return
    seen.add(url)

    const fullUrl = url.startsWith("/") ? baseURL + url : url

    let pubDate = Date.now()
    const dateMatch = url.match(/\/(\d{4})(\d{2})(\d{2})\//)
    if (dateMatch) {
      const [, year, month, day] = dateMatch
      pubDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)).getTime()
    }

    const timeText = $el.find("time, .timestamp, .date").text().trim()

    news.push({
      id: url,
      title,
      url: fullUrl,
      pubDate,
      extra: {
        info: timeText || "纽约时报中文网",
      },
    })
  })

  return news.slice(0, 30)
})

export default defineSource({
  "nytimes-cn": nytimes,
})
