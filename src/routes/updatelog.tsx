import { createFileRoute } from "@tanstack/react-router"
import { type UpdateType, updatelog } from "~/data/updatelog"

export const Route = createFileRoute("/updatelog")({
  component: UpdatelogPage,
})

const typeLabel: Record<UpdateType, string> = {
  source: "新闻源",
  fix: "修复",
  feat: "新增",
  chore: "维护",
}

const typeClass: Record<UpdateType, string> = {
  source: "bg-amber-500/15 color-amber-700 dark:color-amber-300",
  fix: "bg-blue-500/15 color-blue-700 dark:color-blue-300",
  feat: "bg-emerald-500/15 color-emerald-700 dark:color-emerald-300",
  chore: "bg-neutral-500/15 color-neutral-600 dark:color-neutral-400",
}

function UpdatelogPage() {
  return (
    <div className={$([
      "mx-auto max-w-3xl px-4 py-4 color-base",
      "md:(px-6)",
    ])}
    >
      <h1 className="text-2xl font-bold mb-1">更新日志</h1>
      <p className="text-sm op-60 mb-8">站点近期改动与修复记录。</p>
      <ol className="space-y-10">
        {updatelog.map(group => (
          <li key={group.date}>
            <h2 className="text-base font-mono font-semibold op-80 mb-4">
              {group.date}
            </h2>
            <ul className="space-y-5 pl-1">
              {group.entries.map(entry => (
                <li key={`${entry.scope}-${entry.title}`} className="flex gap-3 items-start">
                  <span className={$([
                    "shrink-0 px-2 py-0.5 rounded-md text-xs font-medium select-none",
                    typeClass[entry.type],
                  ])}
                  >
                    {typeLabel[entry.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-medium">{entry.title}</span>
                      <span className="text-xs op-50 font-mono">{entry.scope}</span>
                    </div>
                    {entry.description && (
                      <p className="text-sm op-70 mt-1 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
