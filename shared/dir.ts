import { fileURLToPath } from "node:url"

function resolveProjectDir() {
  return fileURLToPath(new URL("..", import.meta.url))
}

export const projectDir = resolveProjectDir()
