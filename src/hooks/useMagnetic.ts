"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { subscribePointer } from "@/lib/pointer";
import { usePointerFine, useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Magnetic pull toward the pointer. GSAP owns the transform; nothing else may
 * animate x/y on this element.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 120) {
  const ref = useRef<T | null>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "expo.out" });

    // Cached box, invalidated on resize/scroll rather than measured per frame.
    let box = el.getBoundingClientRect();
    const remeasure = () => {
      box = el.getBoundingClientRect();
    };

    const unsubscribe = subscribePointer(({ x, y }) => {
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(box.width, box.height) / 2 + radius;

      if (dist > reach) {
        xTo(0);
        yTo(0);
        return;
      }
      const falloff = 1 - dist / reach;
      xTo(dx * strength * falloff);
      yTo(dy * strength * falloff);
    });

    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [fine, reduced, strength, radius]);

  return ref;
}
