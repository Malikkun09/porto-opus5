"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { subscribePointer } from "@/lib/pointer";
import { subscribeCursor, type CursorState } from "@/lib/cursorState";
import { usePointerFine, useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Custom cursor: dot + ring + contextual label.
 *
 * - Desktop only (hover + fine pointer), never on touch.
 * - Disabled entirely under reduced motion — the native cursor is left alone.
 * - Reads the shared pointer stream; no listener of its own.
 * - GSAP owns every transform here.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CursorState>({ mode: "default", label: "" });

  useEffect(() => subscribeCursor(setState), []);

  // Only the real cursor is hidden, and only while ours is active.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Dot tracks tightly, ring trails — that lag is the whole feel.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let shown = false;

    const unsubscribe = subscribePointer(({ x, y, down }) => {
      if (!shown && (x !== 0 || y !== 0)) {
        shown = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
      gsap.to(ring, { scale: down ? 0.72 : 1, duration: 0.2, overwrite: "auto" });
    });

    return () => {
      unsubscribe();
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  // Mode changes are discrete states, so they get their own tween.
  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    const dot = dotRef.current;
    if (!ring || !label || !dot) return;

    const hasLabel = state.label.length > 0;
    const size =
      state.mode === "image" || hasLabel ? 84 : state.mode === "link" ? 56 : state.mode === "text" ? 8 : 32;

    gsap.to(ring, {
      width: size,
      height: size,
      borderWidth: state.mode === "image" || hasLabel ? 0 : 1.5,
      backgroundColor: hasLabel ? "var(--accent)" : "transparent",
      duration: 0.42,
      ease: "expo.out",
      overwrite: "auto",
    });

    gsap.to(dot, {
      autoAlpha: hasLabel ? 0 : 1,
      scale: state.mode === "text" ? 2.4 : 1,
      duration: 0.3,
      overwrite: "auto",
    });

    gsap.to(label, { autoAlpha: hasLabel ? 1 : 0, duration: 0.28, overwrite: "auto" });
  }, [enabled, state]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border-[1.5px] border-[var(--foreground)] opacity-0 will-change-transform"
        style={{ width: 32, height: 32, marginLeft: -16, marginTop: -16 }}
      >
        <div
          ref={labelRef}
          className="label-strong absolute whitespace-nowrap text-center text-[9px] leading-tight opacity-0"
          style={{ color: "var(--accent-ink)" }}
        >
          {state.label}
        </div>
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-[var(--accent)] opacity-0 will-change-transform"
        style={{ marginLeft: -2.5, marginTop: -2.5 }}
      />
    </div>
  );
}
