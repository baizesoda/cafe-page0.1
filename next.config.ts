import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 整页内容都来自构建期读入的 JSON，没有 API 路由、没有运行时取数，
  // 所以直接静态导出成 out/，服务器上只要 Nginx 发静态文件，不用常驻 Node。
  output: "export",
  // 静态导出没有服务端重定向。加末尾斜杠后每条路由都落成 目录/index.html，
  // Nginx 不用额外配 try_files 去猜 .html 后缀。
  trailingSlash: true,
};

export default nextConfig;
