"use client";

/**
 * Reusable text animation utilities.
 *
 * Splitting is DOM surgery, so each helper is idempotent (marks the element)
 * and returns a teardown that restores the original markup. Only ever applied
 * to short display strings — never to paragraphs.
 */

import { gsap } from "./gsap";

const SPLIT_FLAG = "data-split";

type Teardown = () => void;

function alreadySplit(el: HTMLElement) {
  return el.getAttribute(SPLIT_FLAG) === "true";
}

function markSplit(el: HTMLElement, original: string): Teardown {
  el.setAttribute(SPLIT_FLAG, "true");
  return () => {
    el.innerHTML = original;
    el.removeAttribute(SPLIT_FLAG);
  };
}

/**
 * Wrap each character in a span. The visible text is unchanged for screen
 * readers because we keep it as real text nodes inside spans, but we still
 * expose an aria-label to avoid per-character announcement in some readers.
 */
export function splitChars(el: HTMLElement): { chars: HTMLElement[]; teardown: Teardown } {
  if (alreadySplit(el)) {
    return {
      chars: Array.from(el.querySelectorAll<HTMLElement>(".char")),
      teardown: () => {},
    };
  }

  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.innerHTML = "";

  const chars: HTMLElement[] = [];
  for (const ch of Array.from(text)) {
    const span = document.createElement("span");
    span.className = "char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = ch === " " ? " " : ch;
    el.appendChild(span);
    if (ch !== " ") chars.push(span);
  }

  return { chars, teardown: markSplit(el, original) };
}

/** Wrap each word in an overflow-clipped mask for slide-up reveals. */
export function splitWords(el: HTMLElement): { words: HTMLElement[]; teardown: Teardown } {
  if (alreadySplit(el)) {
    return {
      words: Array.from(el.querySelectorAll<HTMLElement>(".split-line > span")),
      teardown: () => {},
    };
  }

  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.innerHTML = "";

  const words: HTMLElement[] = [];
  for (const word of text.split(/(\s+)/)) {
    if (!word.trim()) {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const mask = document.createElement("span");
    mask.className = "split-line";
    mask.style.display = "inline-block";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.textContent = word;
    mask.appendChild(inner);
    el.appendChild(mask);
    words.push(inner);
  }

  return { words, teardown: markSplit(el, original) };
}

/**
 * Treat each direct child as a line. Cheaper and more reliable than measuring
 * wrapped text, and our display type is authored line-by-line anyway.
 */
export function collectLines(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>("[data-line]"));
}

export function charStagger(
  el: HTMLElement,
  opts: { delay?: number; stagger?: number; from?: "start" | "center" | "random" } = {},
) {
  const { chars, teardown } = splitChars(el);
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  tl.fromTo(
    chars,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.85,
      ease: "expo.out",
      stagger: { each: opts.stagger ?? 0.022, from: opts.from ?? "start" },
    },
  );
  return { timeline: tl, teardown };
}

export function wordReveal(el: HTMLElement, opts: { delay?: number; stagger?: number } = {}) {
  const { words, teardown } = splitWords(el);
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  tl.fromTo(
    words,
    { yPercent: 105 },
    {
      yPercent: 0,
      duration: 1,
      ease: "expo.out",
      stagger: opts.stagger ?? 0.06,
    },
  );
  return { timeline: tl, teardown };
}

/** Lines are pre-marked in JSX with data-line, so no splitting is needed. */
export function lineReveal(
  lines: HTMLElement[],
  opts: { delay?: number; stagger?: number } = {},
) {
  return gsap.fromTo(
    lines,
    { yPercent: 108, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: "expo.out",
      delay: opts.delay ?? 0,
      stagger: opts.stagger ?? 0.08,
    },
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}*#%$@!?+=-_";

/**
 * Scramble a string toward its target. Returns a stop function; the caller owns
 * cancellation so it can never outlive its component.
 */
export function scrambleText(
  el: HTMLElement,
  target: string,
  opts: { duration?: number; onDone?: () => void } = {},
): () => void {
  const duration = opts.duration ?? 700;
  const start = performance.now();
  const chars = Array.from(target);
  let raf = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    const settled = Math.floor(t * chars.length);

    let out = "";
    for (let i = 0; i < chars.length; i++) {
      if (i < settled || chars[i] === " ") {
        out += chars[i];
      } else {
        out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
    }
    el.textContent = out;

    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      opts.onDone?.();
    }
  };

  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    el.textContent = target;
  };
}
