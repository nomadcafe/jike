import { createFileRoute, redirect } from "@tanstack/react-router"
import { columns } from "@shared/metadata"
import { Column } from "~/components/column"

export const Route = createFileRoute("/c/$column")({
  component: SectionComponent,
  params: {
    parse: (params) => {
      const column = fixedColumnIds.find(x => x === params.column.toLowerCase())
      if (!column) throw new Error(`"${params.column}" is not a valid column.`)
      return {
        column,
      }
    },
    stringify: params => params,
  },
  onError: (error) => {
    if (error?.routerCode === "PARSE_PARAMS") {
      throw redirect({ to: "/" })
    }
  },
  head: ({ params }) => {
    const name = columns[params.column]?.zh ?? params.column
    return {
      meta: [
        { title: `${name} - 即刻News` },
        { name: "description", content: `即刻News「${name}」频道，聚合各家来源的${name}新闻。` },
      ],
      links: [{ rel: "canonical", href: `https://jike.news/c/${params.column}` }],
    }
  },
})

function SectionComponent() {
  const { column } = Route.useParams()
  return <Column id={column} />
}
