import type { NextConfig } from "next";

// GitHub Pages 的项目站点挂在 /<仓库名>/ 下，所有绝对路径都得带这个前缀，
// 否则 _next 和 /plates 全 404。本地开发不设这个变量，前缀为空。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // 整页内容都来自构建期读入的 JSON，没有 API 路由、没有运行时取数，
  // 所以直接静态导出成 out/，服务器上只要 Nginx 发静态文件，不用常驻 Node。
  output: "export",
  // 静态导出没有服务端重定向。加末尾斜杠后每条路由都落成 目录/index.html，
  // Nginx 不用额外配 try_files 去猜 .html 后缀。
  trailingSlash: true,
  // 静态导出没有图片优化服务端，next/image 必须关掉优化，否则 build 直接报错。
  // 图版已经在生成时压过 JPEG（6 张共 2.5MB），不需要运行时再缩。
  images: { unoptimized: true },
  basePath,
  // unoptimized 的 next/image 不会自动补 basePath，靠这个前缀把 /plates、/gallery 顶上去
  assetPrefix: basePath || undefined,
};

export default nextConfig;
