"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { stack, techCategories } from "@/data/stack";
import { SectionShell } from "@/components/shared/SectionShell";
import { useReducedMotion } from "@/hooks/useEnvironment";
import type { TechLevel } from "@/types";

const LEVEL_WEIGHT: Record<TechLevel, number> = {
  PRIMARY: 4,
  STRONG: 3,
  WORKING: 2,
  EXPLORING: 1,
};

/** Qualitative indicator — four blocks, filled by level. No fake percentages. */
function LevelIndicator({ level }: { level: TechLevel }) {
  const filled = LEVEL_WEIGHT[level];
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="block h-[9px] w-[5px] border border-[var(--border)]"
          style={{ background: i <= filled ? "var(--accent)" : "transparent" }}
        />
      ))}
    </span>
  );
}

export function Stack() {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const visible = filter === "ALL" ? stack : stack.filter((t) => t.category === filter);

  // Rows reveal on scroll. Re-runs when the filter changes the row set.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const rows = el.querySelectorAll("[data-tech-row]");
    if (rows.length === 0) return;

    if (reduced) {
      gsap.set(rows, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, x: -22 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.028,
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, filter]);

  /**
   * One shared highlight block slides to the hovered row — cheaper than a
   * background transition per row, and it makes the pointer feel tracked.
   */
  const moveHighlight = (row: HTMLElement | null) => {
    const bar = highlightRef.current;
    const container = listRef.current;
    if (!bar || !container) return;

    if (!row) {
      gsap.to(bar, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      return;
    }

    const top = row.offsetTop;
    gsap.to(bar, {
      autoAlpha: 1,
      y: top,
      height: row.offsetHeight,
      duration: reduced ? 0 : 0.34,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  return (
    <SectionShell
      id="stack"
      index="003"
      label="TECHNOLOGY MATRIX"
      meta={`${stack.length} ENTRIES / 6 CATEGORIES`}
    >
      {/* Filter rail — also the keyboard-accessible route to the same info */}
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter technologies">
        {["ALL", ...techCategories].map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(cat)}
              className="label-strong border-2 px-3 py-2 transition-colors duration-150"
              style={{
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--accent-ink)" : "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div
        ref={listRef}
        className="relative border-t-2 border-[var(--border)]"
        onPointerLeave={() => moveHighlight(null)}
      >
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 opacity-0"
          style={{ background: "var(--background-alt)" }}
        />

        <ul>
          {visible.map((tech, i) => (
            <li
              key={tech.name}
              data-tech-row
              onPointerEnter={(e) => moveHighlight(e.currentTarget)}
              className="group relative grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 border-b border-[var(--border)] py-3 transition-transform duration-200 ease-out hover:translate-x-2 focus-within:translate-x-2 sm:grid-cols-[4rem_1fr_7rem_6rem_auto] sm:gap-4"
            >
              <span className="label tabular">{String(i + 1).padStart(2, "0")}</span>

              <span className="display text-[clamp(1.1rem,2.6vw,1.9rem)] leading-none transition-colors duration-200 group-hover:text-[var(--accent)]">
                {tech.name}
              </span>

              <span className="label hidden sm:block">{tech.category}</span>

              <span className="label hidden sm:block">{tech.note}</span>

              <span className="flex items-center gap-3">
                <span className="label-strong hidden text-[9px] md:inline">{tech.level}</span>
                <LevelIndicator level={tech.level} />
                <span className="label tabular hidden lg:inline">/{tech.since}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="label mt-5">
        LEVELS — PRIMARY / STRONG / WORKING / EXPLORING. NO PERCENTAGES; THEY MEAN NOTHING.
      </p>
    </SectionShell>
  );
}
