import { createFileRoute } from "@tanstack/react-router"
import { focusSourcesAtom } from "~/atoms"
import { Column } from "~/components/column"

export const Route = createFileRoute("/")({
  component: IndexComponent,
  head: () => ({
    meta: [
      { title: "即刻News - 实时新闻聚合阅读器" },
      { name: "description", content: "汇集全球热点新闻，按实时 / 最热 / 国内 / 国际 / 科技 / 财经分类聚合，提供优雅的阅读体验。" },
    ],
    links: [{ rel: "canonical", href: "https://jike.news/" }],
  }),
})

function IndexComponent() {
  const focusSources = useAtomValue(focusSourcesAtom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const id = useMemo(() => focusSources.length ? "focus" : "hottest", [])
  return <Column id={id} />
}
