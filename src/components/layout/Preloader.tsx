"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useEnvironment";

const LINES = ["INITIALIZING...", "LOADING PORTFOLIO...", "SYSTEM READY"];

/**
 * Cinematic entry. Total budget ~1.2s; reduced motion skips straight to done.
 *
 * The preloader owns the intro; the hero waits for `onDone` before running its
 * own timeline so the two never overlap.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      // Nothing to play — hand off immediately.
      onDone();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => setGone(true),
      });

      tl.set(root, { autoAlpha: 1 })
        .fromTo(lineRef.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 })
        .to(
          counter,
          {
            value: 100,
            duration: 0.85,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(counter.value);
              if (pctRef.current) pctRef.current.textContent = String(v).padStart(3, "0");
              if (lineRef.current) {
                lineRef.current.textContent = v < 45 ? LINES[0] : v < 96 ? LINES[1] : LINES[2];
              }
            },
          },
          0.1,
        )
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.1)
        .fromTo(
          gridRef.current,
          { autoAlpha: 0, scale: 1.06 },
          { autoAlpha: 1, scale: 1, duration: 0.7 },
          0.25,
        )
        .fromTo(
          wordRef.current?.querySelectorAll("[data-pl-word]") ?? [],
          { yPercent: 110, skewY: 6 },
          { yPercent: 0, skewY: 0, duration: 0.7, stagger: 0.07 },
          0.35,
        )
        // Glitch beat: two fast horizontal displacements, not a loop.
        .to(wordRef.current, { x: -9, duration: 0.05, ease: "none" }, 0.92)
        .to(wordRef.current, { x: 6, duration: 0.05, ease: "none" }, 0.97)
        .to(wordRef.current, { x: 0, duration: 0.08, ease: "none" }, 1.02)
        // Hero intro starts as the curtain lifts, not after — the two sequences
        // overlap by design so the entry reads as one continuous motion.
        .to(
          root,
          { yPercent: -100, duration: 0.7, ease: "expo.inOut", onStart: onDone },
          1.12,
        );
    }, root);

    return () => ctx.revert();
  }, [reduced, onDone]);

  // Reduced motion: no entry sequence at all, so nothing is rendered.
  if (reduced || gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[300] flex flex-col justify-between overflow-hidden bg-[var(--background)] opacity-0 px-[var(--gutter)] py-[var(--gutter)]"
    >
      <div ref={gridRef} className="grid-lines pointer-events-none absolute inset-0 opacity-0" />

      <div className="relative flex items-start justify-between">
        <span className="label-strong">MALIK FAJAR — PORTFOLIO</span>
        <span className="label-strong tabular">
          <span ref={pctRef}>000</span>%
        </span>
      </div>

      <div ref={wordRef} className="relative">
        {["BUILD", "THINGS", "THAT", "MATTER."].map((word) => (
          <div key={word} className="overflow-hidden">
            <div
              data-pl-word
              className="display text-[clamp(2.75rem,13vw,11rem)] will-change-transform"
            >
              {word}
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col gap-3">
        <div className="h-[2px] w-full bg-[var(--border)] opacity-25">
          <div ref={barRef} className="h-full w-full origin-left bg-[var(--accent)]" />
        </div>
        <span ref={lineRef} className="label-strong">
          {LINES[0]}
        </span>
      </div>
    </div>
  );
}
