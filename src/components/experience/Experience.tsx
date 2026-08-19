"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { timeline } from "@/data/timeline";
import { SectionShell } from "@/components/shared/SectionShell";
import { useMediaQuery, useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Brutalist timeline.
 *
 * Desktop: each entry pins briefly while its content slides in horizontally.
 * Mobile / reduced motion: pinning is disabled entirely — pinned scenes on
 * short viewports produce jumpy layouts and cost more than they communicate.
 */
export function Experience() {
  const reduced = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-tl-row]"));

    if (reduced || !desktop) {
      // Static, fully legible. Only the marker line still fills, via CSS-free set.
      gsap.set(root.querySelectorAll("[data-tl-body], [data-tl-year]"), { opacity: 1, x: 0, y: 0 });
      gsap.set(markerRef.current, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Progressive marker fill across the whole section.
      gsap.fromTo(
        markerRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "bottom 75%",
            scrub: true,
          },
        },
      );

      rows.forEach((row) => {
        const year = row.querySelector("[data-tl-year]");
        const body = row.querySelector("[data-tl-body]");

        // Short pin: hold the year, slide the content, release.
        ScrollTrigger.create({
          trigger: row,
          start: "top 22%",
          end: "+=42%",
          pin: year,
          pinSpacing: false,
          anticipatePin: 1,
        });

        gsap.fromTo(
          body,
          { x: 90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 78%" },
          },
        );

        gsap.fromTo(
          row.querySelector("[data-tl-rule]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: row, start: "top 85%" },
          },
        );
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced, desktop]);

  return (
    <SectionShell id="experience" index="005" label="TIMELINE" meta="2023 — 2026">
      <div ref={rootRef} className="relative">
        {/* Vertical marker rail */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-full w-[2px] bg-[var(--border)] opacity-20 lg:block"
        >
          <div
            ref={markerRef}
            className="h-full w-full origin-top bg-[var(--accent)]"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        {/* overflow-x-clip, not hidden: the horizontal slide-in starts 90px off
            the right edge, and clip contains it without creating a scroll
            container (which would break the pinned year). */}
        <ol className="overflow-x-clip lg:pl-[var(--gutter)]">
          {timeline.map((entry) => (
            <li
              key={entry.year}
              data-tl-row
              className="relative grid grid-cols-12 gap-y-4 py-[clamp(2rem,5vw,4rem)] lg:gap-x-[var(--gutter)]"
            >
              <div
                data-tl-rule
                aria-hidden="true"
                className="absolute left-0 top-0 h-[1px] w-full origin-left bg-[var(--border)]"
              />

              <div className="col-span-12 lg:col-span-4">
                <div data-tl-year>
                  <span className="num-giant block text-[clamp(3rem,9vw,7.5rem)]">
                    {entry.year}
                  </span>
                  <span className="label mt-2 block">{entry.place}</span>
                </div>
              </div>

              <div data-tl-body className="col-span-12 lg:col-span-7 lg:col-start-6">
                <h3 className="display text-[clamp(1.5rem,4vw,2.75rem)]">
                  {entry.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.55]">{entry.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="label-strong border border-[var(--border)] px-2 py-1 text-[9px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
