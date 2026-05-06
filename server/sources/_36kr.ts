import type { NewsItem } from "@shared/types"
import { load } from "cheerio"
import dayjs from "dayjs/esm"

const quick = defineSource(async () => {
  const baseURL = "https://www.36kr.com"
  const url = `${baseURL}/newsflashes`
  const response = await myFetch(url) as any
  const $ = load(response)
  const news: NewsItem[] = []
  const $items = $(".newsflash-item")
  $items.each((_, el) => {
    const $el = $(el)
    const $a = $el.find("a.item-title")
    const url = $a.attr("href")
    const title = $a.text()
    const relativeDate = $el.find(".time").text()
    if (url && title && relativeDate) {
      news.push({
        url: `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relativeDate, "Asia/Shanghai").valueOf(),
        },
      })
    }
  })

  return news
})

// /hot-list/renqi/... 已挂在 Cloudflare 反爬墙后，HTML 抓不到内容。
// 改走移动端官方 JSON 接口，返回结构稳定的 hotRankList。
interface RenqiResp {
  code: number
  data?: {
    hotRankList?: Array<{
      itemId: number
      templateMaterial: {
        widgetTitle: string
        authorName: string
        statRead: number
        publishTime: number
      }
    }>
  }
}

const renqi = defineSource(async () => {
  const formatted = dayjs().format("YYYY-MM-DD")
  const resp = await myFetch<RenqiResp>(
    "https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        partner_id: "wap",
        param: {
          hotlistCategory: "renqi",
          hotlistDate: formatted,
          pageSize: 30,
          pageEvent: 1,
          pageCallback: "",
          siteId: 1,
          platformId: 2,
        },
        timestamp: Date.now(),
      },
    },
  )

  const list = resp?.data?.hotRankList ?? []
  return list
    .filter(it => it?.itemId && it?.templateMaterial?.widgetTitle)
    .map((it) => {
      const m = it.templateMaterial
      const read = m.statRead >= 10000
        ? `${(m.statRead / 10000).toFixed(1)}万阅读`
        : `${m.statRead}阅读`
      return {
        id: String(it.itemId),
        title: m.widgetTitle,
        url: `https://36kr.com/p/${it.itemId}`,
        pubDate: m.publishTime,
        extra: {
          info: m.authorName ? `${m.authorName}  |  ${read}` : read,
        },
      }
    })
})

export default defineSource({
  "36kr": quick,
  "36kr-quick": quick,
  "36kr-renqi": renqi,
})
