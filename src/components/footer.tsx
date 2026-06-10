import { Link } from "@tanstack/react-router"

export function Footer() {
  return (
    <div className="flex items-center gap-3">
      <span>即刻News © 2025</span>
      <span className="op-40">·</span>
      <Link
        to="/updatelog"
        className="op-70 hover:(op-100 color-primary) transition-all"
      >
        更新日志
      </Link>
      <span className="op-40">·</span>
      <a
        href="https://no.money"
        target="_blank"
        rel="noopener noreferrer"
        className="op-70 hover:(op-100 color-primary) transition-all"
      >
        no.money
      </a>
    </div>
  )
}
