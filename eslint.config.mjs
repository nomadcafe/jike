import { ourongxing, react } from "@ourongxing/eslint-config"

// `@ourongxing/eslint-config@3.2.3-beta.6` 还在引用 `@eslint-react/*` 系列里被重命名/移除的旧规则名；
// 不在本地剔除的话，任何 src/** 文件被 lint 都会抛 "Could not find rule"。
// `react/no-implicit-key` 需要类型信息，所以给 react preset 传 `tsconfigPath` 启用 typed-linting。
export default ourongxing({
  type: "app",
  // 貌似不能 ./ 开头，
  ignores: ["src/routeTree.gen.ts", "imports.app.d.ts", "public/", ".vscode", "**/*.json", "**/*.md"],
})
  .append(react({
    files: ["src/**"],
    tsconfigPath: "./tsconfig.app.json",
  }))
  .removeRules(
    "react-dom/no-children-in-void-dom-elements",
    "react/ensure-forward-ref-using-ref",
    "react/no-comment-textnodes",
    "react/no-nested-components",
    "react/prefer-shorthand-boolean",
    "react/prefer-shorthand-fragment",
  )
