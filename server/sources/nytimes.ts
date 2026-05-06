// 直接走官方 RSS：含分钟级 pubDate，覆盖中国/国际/美国/健康等多个栏目，比单独抓栏目页更新更快也更稳定。
export default defineSource({
  "nytimes-cn": defineRSSSource("https://cn.nytimes.com/rss.html"),
})
