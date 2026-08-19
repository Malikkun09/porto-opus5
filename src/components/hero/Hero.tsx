"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { charStagger, lineReveal } from "@/animations/text";
import { subscribePointer } from "@/lib/pointer";
import { site } from "@/data/site";
import { usePointerFine, useReducedMotion } from "@/hooks/useEnvironment";

/** Live clock in the subject's timezone. Renders empty on the server. */
function LocalTime() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: site.timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular">
      LOCAL TIME: {time}
      <span className="blink ml-1" aria-hidden="true">
        _
      </span>
    </span>
  );
}

export function Hero({ start }: { start: boolean }) {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLSpanElement | null>(null);
  const lastRef = useRef<HTMLSpanElement | null>(null);

  // Intro: staged, not simultaneous. Grid → name → roles → meta.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !start) return;

    if (reduced) {
      gsap.set(root.querySelectorAll("[data-hero-anim]"), { opacity: 1, y: 0 });
      gsap.set(gridRef.current, { opacity: 1 });
      return;
    }

    const teardowns: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(gridRef.current, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 1.1 });

      if (firstRef.current) {
        const a = charStagger(firstRef.current, { stagger: 0.028 });
        teardowns.push(a.teardown);
        tl.add(a.timeline, 0.12);
      }
      if (lastRef.current) {
        const b = charStagger(lastRef.current, { stagger: 0.028 });
        teardowns.push(b.teardown);
        tl.add(b.timeline, 0.24);
      }

      const roleLines = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"));
      if (roleLines.length) tl.add(lineReveal(roleLines, { stagger: 0.07 }), 0.5);

      tl.fromTo(
        root.querySelectorAll("[data-hero-meta]"),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 },
        0.7,
      ).fromTo(
        root.querySelectorAll("[data-hero-numeral]"),
        { autoAlpha: 0, x: 40 },
        { autoAlpha: 1, x: 0, duration: 1.2 },
        0.55,
      );
    }, root);

    return () => {
      ctx.revert();
      teardowns.forEach((fn) => fn());
    };
  }, [start, reduced]);

  // Pointer parallax on the grid only — the type stays put so it stays readable.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !fine || reduced) return;

    const xTo = gsap.quickTo(grid, "x", { duration: 1.1, ease: "power3.out" });
    const yTo = gsap.quickTo(grid, "y", { duration: 1.1, ease: "power3.out" });

    return subscribePointer(({ nx, ny }) => {
      xTo(nx * -18);
      yTo(ny * -12);
    });
  }, [fine, reduced]);

  return (
    <section
      id="hero"
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="noise relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[calc(var(--gutter)+3.25rem)]"
    >
      <div
        ref={gridRef}
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-[-10%] opacity-0"
      />

      {/* Top metadata row */}
      <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border)] px-[var(--gutter)] pb-3">
        <span data-hero-meta className="label-strong">
          {site.location}
        </span>
        <span data-hero-meta className="label">
          {site.availability}
        </span>
        <span data-hero-meta className="label">
          <LocalTime />
        </span>
      </div>

      {/* Name — the composition */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-[var(--gutter)] py-8">
        <h1 id="hero-heading" className="display text-[clamp(3.5rem,17vw,15rem)]">
          <span ref={firstRef} className="block">
            {site.first}
          </span>
          <span
            ref={lastRef}
            className="block"
            style={{ marginLeft: "clamp(0px, 6vw, 9rem)" }}
          >
            {site.last}
          </span>
        </h1>

        <div className="mt-[clamp(1.5rem,4vw,3rem)] flex flex-wrap items-end justify-between gap-8">
          <ul className="flex flex-col gap-0">
            {site.roles.map((role) => (
              <li key={role} className="overflow-hidden">
                <span
                  data-line
                  className="label-strong block text-[clamp(11px,1.1vw,13px)] will-change-transform"
                >
                  {role}
                </span>
              </li>
            ))}
          </ul>

          <span
            data-hero-numeral
            aria-hidden="true"
            className="num-giant select-none text-[clamp(4rem,12vw,11rem)] text-[var(--border)] opacity-[0.12]"
          >
            001
          </span>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-[var(--gutter)] py-3">
        <span data-hero-meta className="label-strong flex items-center gap-2">
          <span
            aria-hidden="true"
            className="pulse-dot inline-block h-2 w-2 bg-[var(--accent)]"
          />
          STATUS: {site.status}
        </span>
        <span data-hero-meta className="label">
          SCROLL TO EXPLORE ↓
        </span>
        <span data-hero-meta className="label tabular">
          001 / 008
        </span>
      </div>
    </section>
  );
}
