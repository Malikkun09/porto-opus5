import type { ReactNode } from "react";

/**
 * Section shell. Owns the exposed-grid chrome: giant number, rules, and edge
 * metadata. Every section reuses this so rhythm is structural, not repeated.
 */
export function SectionShell({
  id,
  index,
  label,
  meta,
  children,
  className = "",
  bleed = false,
}: {
  id: string;
  index: string;
  label: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative border-t-2 border-[var(--border)] ${className}`}
    >
      <header className="flex items-stretch justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3 px-[var(--gutter)] py-3 sm:gap-6">
          <span className="label-strong tabular">{index}</span>
          <h2 id={`${id}-heading`} className="label-strong">
            {label}
          </h2>
        </div>
        {meta ? (
          <div className="hidden items-center border-l border-[var(--border)] px-[var(--gutter)] py-3 sm:flex">
            <span className="label">{meta}</span>
          </div>
        ) : null}
      </header>
      <div className={bleed ? "" : "px-[var(--gutter)] py-[clamp(2.5rem,6vw,6rem)]"}>
        {children}
      </div>
    </section>
  );
}

/** Oversized watermark numeral. Decorative only. */
export function SectionNumeral({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`num-giant pointer-events-none select-none text-[var(--border)] opacity-[0.09] ${className}`}
    >
      {value}
    </span>
  );
}

/** Small technical readout used along section edges. */
export function Readout({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {items.map((item) => (
        <li key={item} className="label">
          {item}
        </li>
      ))}
    </ul>
  );
}
