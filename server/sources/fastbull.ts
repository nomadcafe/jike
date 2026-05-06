import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const express = defineSource(async () => {
  const baseURL = "https://www.fastbull.com"
  const html: any = await myFetch(`${baseURL}/cn/express-news`)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []
  // 页面改版后 .title_name 由 <a> 变成了 <span>，URL 不再在标题节点上。
  // 改从 .news-list 上的 data-id 拼接：/cn/fastshort/<data-id>。
  // 同一 data-id 在页面里会渲染两份（移动/桌面双布局），用 Set 去重避免 React key 冲突。
  const seen = new Set<string>()
  $(".news-list").each((_, el) => {
    const $el = $(el)
    const dataId = $el.attr("data-id")
    const date = $el.attr("data-date")
    const titleText = $el.find(".title_name").first().text().trim()
    const title = titleText.match(/【(.+)】/)?.[1] ?? titleText
    if (dataId && date && titleText && !seen.has(dataId)) {
      seen.add(dataId)
      const url = `/cn/fastshort/${dataId}`
      news.push({
        url: baseURL + url,
        title: title.length < 4 ? titleText : title,
        id: url,
        pubDate: Number(date),
      })
    }
  })
  return news
})

const news = defineSource(async () => {
  const baseURL = "https://www.fastbull.com"
  const html: any = await myFetch(`${baseURL}/cn/news`)
  const $ = cheerio.load(html)
  const $main = $(".trending_type")
  const news: NewsItem[] = []
  $main.each((_, el) => {
    const a = $(el)
    const url = a.attr("href")
    const title = a.find(".title").text()
    const date = a.find("[data-date]").attr("data-date")
    if (url && title && date) {
      news.push({
        url: baseURL + url,
        title,
        id: url,
        pubDate: Number(date),
      })
    }
  })
  return news
})

export default defineSource(
  {
    "fastbull": express,
    "fastbull-express": express,
    "fastbull-news": news,
  },
)
