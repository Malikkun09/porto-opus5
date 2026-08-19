"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Infinite marquee.
 *
 * CSS animation, not JS — one compositor-only transform, zero main-thread cost.
 * The track is duplicated once and translated -50%, which loops seamlessly.
 * The duplicate is aria-hidden so the content is announced exactly once.
 */
export function Marquee({
  items,
  separator = "×",
  speed = 28,
  reverse = false,
  className = "",
  textClass = "display text-[clamp(2rem,6vw,5rem)]",
}: {
  items: readonly string[];
  separator?: string;
  /** Seconds per full loop. Higher = slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  textClass?: string;
}) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const sequence = (
    <>
      {items.map((item) => (
        <span key={item} className="inline-flex shrink-0 items-center gap-[0.5em] px-[0.35em]">
          <span>{item}</span>
          <span aria-hidden="true" className="text-[var(--accent)]">
            {separator}
          </span>
        </span>
      ))}
    </>
  );

  if (reduced) {
    // Static, readable fallback. Still editorial, no motion.
    return (
      <div className={`overflow-hidden border-y border-[var(--border)] ${className}`}>
        <div className={`flex flex-wrap items-center py-3 ${textClass}`}>{sequence}</div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden border-y border-[var(--border)] ${className}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className={`flex w-max items-center py-3 ${textClass}`}
        style={{
          animationName: "marquee-x",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {sequence}
        <span aria-hidden="true" className="flex items-center">
          {sequence}
        </span>
      </div>
    </div>
  );
}

/**
 * Text that scrambles into place once visible. Used sparingly for section
 * openers and status readouts.
 */
export function ScrambleOnView({
  text,
  as: Tag = "span",
  className = "",
  duration = 620,
}: {
  text: string;
  as?: "span" | "div" | "p";
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let stop: (() => void) | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          // Imported lazily so the scramble helper is not in the critical path.
          import("@/animations/text").then(({ scrambleText }) => {
            stop = scrambleText(el as HTMLElement, text, { duration });
          });
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      stop?.();
    };
  }, [text, duration, reduced]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement & HTMLParagraphElement>}
      className={className}
    >
      {text}
    </Tag>
  );
}
