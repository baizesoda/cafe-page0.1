import Image from "next/image";

// unoptimized 的 next/image 不给 src 补 basePath，GitHub Pages 上会 404，
// 所以这里自己拼。本地开发这个变量是空的。
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  /** public/ 下的图片路径，例如 plates/plate-01-yemen.jpg */
  file: string;
  /** 图版号，渲染成等宽的 PLATE I */
  numeral: string;
  /** 图注前缀：卷首图版用 PLATE，事件插图用 FIG. */
  label?: string;
  /** 图注中文说明 */
  caption: string;
  /** 无障碍描述；给纯装饰图版传空串会连带加上 aria-hidden */
  alt: string;
  /** 首屏图版不做懒加载 */
  priority?: boolean;
};

/**
 * 摄影图版（design-spec.md 5.6）。
 * 1px 描边 + 8px 纸色内边距，把连续色调的照片钉成"贴在册页上的一张图版"，
 * 而不是一张浮在暖纸底上的网页配图。永远在内容区宽度之内，不做全出血。
 */
export default function Plate({ file, numeral, label = "PLATE", caption, alt, priority }: Props) {
  const decorative = alt === "";
  return (
    <figure
      aria-hidden={decorative || undefined}
      className="rounded-[10px] border border-rule bg-plane p-2 shadow-[var(--shadow-card)]"
    >
      {/* 3:2 横向。宽高写成 1536×1024 只为给出比例，实际由 w-full 决定尺寸。 */}
      <Image
        src={`${BASE}/${file}`}
        alt={alt}
        width={1536}
        height={1024}
        priority={priority}
        className="aspect-[3/2] w-full rounded-[4px] object-cover"
      />
      <figcaption className="lab-label mt-2 border-t border-rule pt-2">
        <span className="en">
          {label} {numeral}
        </span>{" "}
        · <span className="zh">{caption}</span>{" "}
        {/* 所有图版都是 AI 生成的场景复原，不是史料照片。这句必须跟着每一张图，
            不能只放在页脚——图会被单独看到、单独截图。 */}
        · <span className="zh">AI 生成</span>
      </figcaption>
    </figure>
  );
}
