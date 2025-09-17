# QuantWiki

简洁的量化、经济、金融与 Web3 术语百科，静态站点用于 GitHub Pages 部署。

本仓库将 `docs/` 目录作为 GitHub Pages 的站点根目录。

本地预览（在项目根目录下运行）：

使用 Node 的 `http-server`（需要先安装 Node.js / npm）：

```pwsh
# 安装（仅需一次）
npm i -g http-server
# 运行
http-server ./docs -p 8080
```

使用 Python 的内置静态服务器（无需额外安装）：

```pwsh
# Python 3.x
python -m http.server 8080 --directory ./docs
```

部署到 GitHub Pages：

1. 推送到你想发布的分支（例如 `main`）。
2. 在 GitHub 仓库页面，进入 Settings -> Pages。选择 "Deploy from a branch"，然后选择分支（例如 `main`）和文件夹为 `/docs`。
3. 保存设置，几分钟后网站将可在 pages 的 URL 访问（形如 https://<你的用户名>.github.io/<仓库名>/）。

注意：已添加 `docs/.nojekyll` 文件以避免 GitHub 的 Jekyll 处理静态资源；如果需要自定义域名，可在 Pages 设置中配置 CNAME 或在 `docs/CNAME` 文件中添加。
