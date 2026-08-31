import type { Person } from "@/lib/types";

/** 卷末的人物墙。人物按 source.page 落在哪一卷分组，见 Longform 里的 peopleByVolume。 */
export default function PeopleWall({ people, volumeTitle }: { people: Person[]; volumeTitle: string }) {
  if (!people.length) return null;
  return (
    <section className="reveal border-t border-rule py-12">
      <h3 className="lab-label">
        <span className="en">PEOPLE</span> · <span className="zh">这一卷里的人 · {volumeTitle}</span>
      </h3>
      {/* 三列铺满内容区，gap 24px */}
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <li
            key={p.id}
            className="regmarks relative border border-rule bg-surface p-8 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-[19px] font-semibold text-ink">{p.name}</span>
              {p.originalName && (
                <span className="text-[12px] text-ink-muted">{p.originalName}</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[12px] text-ink-muted">
              <span>{p.role}</span>
              {p.life && <span>· {p.life}</span>}
              <span className="data-num">· P.{p.source.page}</span>
            </div>
            <p className="mt-2 text-[15px] leading-[1.85] text-ink">{p.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
