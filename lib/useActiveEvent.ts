"use client";

import { useEffect, useState } from "react";

/**
 * 谁是"当前"事件：在视口 40% 处放一条细带，命中细带的元素即为 active。
 * 细带很窄，正常滚动时同一时刻基本只有一个元素命中。
 */
export function useActiveId(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (!ids.length) return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit?.target.id) setActiveId(hit.target.id);
      },
      { rootMargin: "-40% 0px -59% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return activeId;
}

/** 首次进入视口时给元素打上 data-shown，配合 .reveal 做淡入。 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/**
 * j / k 在时间轴事件之间跳转（不劫持方向键，避免破坏正常滚动）。
 *
 * `ids` 是文档顺序的全部可观察元素，`stops` 只有时间轴事件：旁注是卷首并排的两张卡，
 * 同一行上有两个落点，按下去页面不动，连按就卡在那儿出不来，所以旁注不当落点。
 */
export function useEventKeys(ids: string[], activeId: string | null, stops: string[]) {
  useEffect(() => {
    const order = new Map(ids.map((id, i) => [id, i]));
    const stopIdx = stops.map((s) => order.get(s) ?? -1).filter((i) => i >= 0);

    function onKey(ev: KeyboardEvent) {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const target = ev.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (ev.key !== "j" && ev.key !== "k") return;

      const i = activeId ? (order.get(activeId) ?? -1) : -1;
      const next =
        ev.key === "j"
          ? stopIdx.find((n) => n > i)
          : [...stopIdx].reverse().find((n) => n < i);
      const el = next === undefined ? null : document.getElementById(ids[next]);
      if (el) {
        ev.preventDefault();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ids, activeId, stops]);
}
