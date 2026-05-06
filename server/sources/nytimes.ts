import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const nytimes = defineSource(async () => {
  const baseURL = "https://cn.nytimes.com"
  // 使用「中国」栏目页：结构稳定，标题/链接一一对应，避免首页编辑头条与文章原标题不一致的问题。
  const html: any = await myFetch(`${baseURL}/china/`)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []
  const seen = new Set<string>()

  $(".regularSummaryHeadline").each((_, el) => {
    const linkEl = $(el).find("a").first()
    const url = linkEl.attr("href")
    const title = (linkEl.attr("title") || linkEl.text()).trim().replace(/\s+/g, " ")

    if (!title || !url) return
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

    const $li = $(el).closest("li")
    const timeText = $li.find(".time").first().text().trim()

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
