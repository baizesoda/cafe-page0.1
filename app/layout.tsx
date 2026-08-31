import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全球上瘾 · 咖啡如何搅动人类历史",
  description:
    "《全球上瘾：咖啡如何搅动人类历史》（海因里希·爱德华·雅各布）的个人阅读长卷：一条时间线 + 一张传播地图。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      {/* 不要在 body 上用 flex：flex 子项遇到 mx-auto 会退化成 shrink-to-fit，
          各 section 的 max-w 就失效了，左边距会一节一节地跳。 */}
      <body className="min-h-full">{children}</body>
    </html>
  );
}
