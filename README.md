# Datapack Sandbox documentation

This repository owns the English and Chinese VitePress pages for [Datapack Sandbox](https://github.com/Alumopper/DatapackSandbox). The existing site URL remains under the main repository's GitHub Pages deployment.

Use Node 24 and Java 25:

```bash
npm ci
npm run docs:build
```

The build fetches a pinned, SHA-256 verified manifest schema from the runtime release and uses the published `@datapack-sandbox/vitepress-playground` package. Edit English `*.md` and Chinese `*.zh-CN.md` pages together. The main repository's Pages workflow checks out this repository and deploys the resulting site.
