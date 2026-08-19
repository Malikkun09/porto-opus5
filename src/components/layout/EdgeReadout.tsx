"use client";

import { sections } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";

/**
 * Fixed technical readout down the right edge. Decorative — the same
 * information is available in the nav, so it is aria-hidden.
 */
export function EdgeReadout() {
  const active = useActiveSection();
  const index = Math.max(0, sections.findIndex((s) => s.id === active));
  const current = sections[index] ?? sections[0];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-1/2 z-[90] hidden -translate-y-1/2 lg:block"
    >
      <div
        className="flex items-center gap-4 border-y-2 border-l-2 border-[var(--border)] bg-[var(--background)] px-3 py-2"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="label-strong tabular">
          {current.index} / 008 — {current.label}
        </span>
        <span className="label">SYSTEM ONLINE</span>
      </div>
    </div>
  );
}
