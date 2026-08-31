import type { Series } from "@/lib/types";
import LineChart from "@/components/viz/LineChart";

/**
 * 全书唯一一处能画成图的可靠数字。书是叙事史，硬数据很少：
 * 凑不出可信的数就不画，不放"看起来像"的曲线。
 */
export default function DataPanel({ series }: { series: Series[] }) {
  if (!series.length) return null;
  return (
    <section className="reveal border-t border-rule py-12">
      <h3 className="text-xs tracking-widest text-ink-muted">书里为数不多的硬数字</h3>
      <div className="mt-5 space-y-10">
        {series.map((s) => (
          <div key={s.id}>
            <h4 className="mb-3 font-medium text-ink">{s.label}</h4>
            <LineChart series={s} />
          </div>
        ))}
      </div>
    </section>
  );
}
