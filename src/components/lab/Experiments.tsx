"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { subscribePointer } from "@/lib/pointer";
import { scrambleText } from "@/animations/text";
import { useMagnetic } from "@/hooks/useMagnetic";
import { usePointerFine, useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Experiment 01 — interactive grid.
 * Cells nearest the pointer scale and take the accent. One pointer subscription,
 * cell transforms written directly (no React state per frame).
 */
export function ExperimentGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const COLS = 14;
  const ROWS = 6;

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const cells = Array.from(el.querySelectorAll<HTMLElement>("[data-cell]"));
    let box = el.getBoundingClientRect();
    const remeasure = () => {
      box = el.getBoundingClientRect();
    };

    const unsubscribe = subscribePointer(({ x, y }) => {
      // Cheap early-out when the pointer is nowhere near the grid.
      if (x < box.left - 80 || x > box.right + 80 || y < box.top - 80 || y > box.bottom + 80) {
        for (const cell of cells) cell.style.transform = "scale(1)";
        return;
      }
      const cw = box.width / COLS;
      const ch = box.height / ROWS;

      cells.forEach((cell, i) => {
        const cx = box.left + (i % COLS) * cw + cw / 2;
        const cy = box.top + Math.floor(i / COLS) * ch + ch / 2;
        const d = Math.hypot(x - cx, y - cy);
        const t = Math.max(0, 1 - d / 170);
        cell.style.transform = `scale(${1 - t * 0.55})`;
        cell.style.background = t > 0.45 ? "var(--accent)" : "var(--border)";
        cell.style.opacity = String(0.12 + t * 0.88);
      });
    });

    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
    };
  }, [fine, reduced]);

  return (
    <LabCard title="INTERACTIVE GRID" note="POINTER FIELD" index="01">
      <div
        ref={ref}
        aria-hidden="true"
        className="grid h-full w-full gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <span
            key={i}
            data-cell
            className="block h-full w-full will-change-transform"
            style={{ background: "var(--border)", opacity: 0.12 }}
          />
        ))}
      </div>
    </LabCard>
  );
}

/** Experiment 02 — text scramble on demand. */
export function ExperimentScramble() {
  const outRef = useRef<HTMLSpanElement | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const WORDS = ["ENTROPY", "SIGNAL", "LATENCY", "GRADIENT", "PAYLOAD"];

  useEffect(() => () => stopRef.current?.(), []);

  const run = () => {
    const el = outRef.current;
    if (!el) return;
    const next = (i + 1) % WORDS.length;
    setI(next);
    if (reduced) {
      el.textContent = WORDS[next];
      return;
    }
    stopRef.current?.();
    stopRef.current = scrambleText(el, WORDS[next], { duration: 620 });
  };

  return (
    <LabCard title="TEXT SCRAMBLE" note="GLYPH DECAY" index="02">
      <div className="flex h-full flex-col justify-between">
        <span
          ref={outRef}
          className="display text-[clamp(1.75rem,4.5vw,3rem)] text-[var(--accent)]"
        >
          {WORDS[i]}
        </span>
        <button type="button" onClick={run} className="btn-brutal self-start !py-2">
          SCRAMBLE
        </button>
      </div>
    </LabCard>
  );
}

/** Experiment 03 — magnetic button. */
export function ExperimentMagnetic() {
  const btnRef = useMagnetic<HTMLButtonElement>(0.4, 90);
  const [count, setCount] = useState(0);

  return (
    <LabCard title="MAGNETIC BUTTON" note="POINTER ATTRACTION" index="03">
      <div className="flex h-full flex-col items-start justify-between">
        <span className="label tabular">PULLS: {String(count).padStart(3, "0")}</span>
        <button
          ref={btnRef}
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="btn-brutal"
        >
          PULL ME
        </button>
      </div>
    </LabCard>
  );
}

/** Experiment 04 — animated noise field, canvas, rAF-bounded. */
export function ExperimentNoise() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Low internal resolution, upscaled by CSS — noise does not need detail.
    const W = 90;
    const H = 50;
    canvas.width = W;
    canvas.height = H;

    const image = ctx.createImageData(W, H);
    let raf = 0;
    let running = true;
    let last = 0;

    const draw = (now: number) => {
      if (!running) return;
      // Throttled to ~18fps: this is texture, not motion.
      if (now - last > 55) {
        last = now;
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 42;
        }
        ctx.putImageData(image, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };

    // Only animate while visible — offscreen canvases must not burn frames.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced) {
          if (!raf) raf = requestAnimationFrame(draw);
        } else {
          running = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          running = true;
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(canvas);

    return () => {
      running = false;
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <LabCard title="DYNAMIC NOISE" note="CANVAS / 18FPS" index="04">
      <div className="relative h-full w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="display absolute bottom-0 left-0 text-[clamp(1.5rem,4vw,2.5rem)]">
          GRAIN
        </span>
      </div>
    </LabCard>
  );
}

/** Experiment 05 — hover displacement on typography. */
export function ExperimentDisplace() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"));
    const enter = () => {
      gsap.to(layers[0], { x: -7, y: -4, duration: 0.35, ease: "expo.out", overwrite: "auto" });
      gsap.to(layers[2], { x: 7, y: 4, duration: 0.35, ease: "expo.out", overwrite: "auto" });
    };
    const leave = () => {
      gsap.to([layers[0], layers[2]], { x: 0, y: 0, duration: 0.5, ease: "expo.out", overwrite: "auto" });
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(layers);
    };
  }, [reduced]);

  return (
    <LabCard title="CHROMATIC SPLIT" note="HOVER DISPLACEMENT" index="05">
      <div ref={ref} className="relative flex h-full items-center justify-center">
        {["#ff2d55", "transparent", "#00e5ff"].map((color, i) => (
          <span
            key={i}
            data-layer
            aria-hidden={i !== 1}
            className="display absolute text-[clamp(1.75rem,5vw,3.25rem)] will-change-transform"
            style={{
              color: i === 1 ? "var(--foreground)" : color,
              mixBlendMode: i === 1 ? "normal" : "multiply",
            }}
          >
            ABERRATION
          </span>
        ))}
      </div>
    </LabCard>
  );
}

function LabCard({
  title,
  note,
  index,
  children,
}: {
  title: string;
  note: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border-2 border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
        <span className="label-strong">
          <span className="tabular mr-2">{index}</span>
          {title}
        </span>
        <span className="label hidden sm:block">{note}</span>
      </div>
      <div className="h-[clamp(10rem,22vw,14rem)] p-3">{children}</div>
    </div>
  );
}
