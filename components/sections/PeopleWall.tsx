import type { Person } from "@/lib/types";

/** 卷末的人物墙。人物按 source.page 落在哪一卷分组，见 Longform 里的 peopleByVolume。 */
export default function PeopleWall({ people, volumeTitle }: { people: Person[]; volumeTitle: string }) {
  if (!people.length) return null;
  return (
    <section className="reveal border-t border-rule py-12">
      <h3 className="lab-label">PEOPLE · 这一卷里的人 · {volumeTitle}</h3>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {people.map((p) => (
          <li key={p.id} className="rounded-xl border border-rule bg-surface p-4 shadow-[0_1px_2px_var(--ring)] transition-shadow hover:shadow-[0_10px_28px_-16px_var(--ring-strong)]">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium text-ink">{p.name}</span>
              {p.originalName && (
                <span className="text-[11px] text-ink-muted">{p.originalName}</span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[11px] text-ink-muted">
              <span>{p.role}</span>
              {p.life && <span>· {p.life}</span>}
              <span className="data-num">· P.{p.source.page}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
