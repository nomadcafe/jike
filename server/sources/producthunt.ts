import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // 没配 token 时返回空列表而不是 throw，避免前端控制台一直 500 报错噪音。
  // 自部署只要往 .env.server 加 PRODUCTHUNT_API_TOKEN 就会自动恢复。
  const apiToken = process.env.PRODUCTHUNT_API_TOKEN
  if (!apiToken) return []
  const token = `Bearer ${apiToken}`
  const query = `
    query {
      posts(first: 30, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            votesCount
            url
            slug
          }
        }
      }
    }
  `

  const response: any = await myFetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query }),
  })

  const news: NewsItem[] = []
  const posts = response?.data?.posts?.edges || []

  for (const edge of posts) {
    const post = edge.node
    if (post.id && post.name) {
      news.push({
        id: post.id,
        title: post.name,
        url: post.url || `https://www.producthunt.com/posts/${post.slug}`,
        extra: {
          info: ` △︎ ${post.votesCount || 0}`,
          hover: post.tagline,
        },
      })
    }
  }

  return news
})
