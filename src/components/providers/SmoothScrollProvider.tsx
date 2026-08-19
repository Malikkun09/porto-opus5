"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/hooks/useEnvironment";

type ScrollContextValue = {
  /** Freeze scrolling (used by the overlay + menu). Reference-counted. */
  lock: () => () => void;
  scrollTo: (target: string | number, opts?: { immediate?: boolean }) => void;
};

const ScrollContext = createContext<ScrollContextValue>({
  lock: () => () => {},
  scrollTo: () => {},
});

/**
 * Owns Lenis and drives ScrollTrigger from it. Single rAF loop for both, so
 * scroll-driven animation and smoothing never fight over frames.
 *
 * Reduced motion: Lenis is not created at all. Native scrolling stays, and
 * ScrollTrigger reads the real scroll position — animations still fire, they
 * just are not interpolated.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  useEffect(() => {
    registerGsap();

    if (reduced) {
      // No Lenis. ScrollTrigger falls back to native scroll.
      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // No scrollerProxy: Lenis drives window scroll natively, so ScrollTrigger's
    // default scroller is already correct. Proxying it here breaks pinning.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const lock = useCallback(() => {
    lockCount.current += 1;
    if (lockCount.current === 1) {
      lenisRef.current?.stop();
      document.documentElement.classList.add("lenis-stopped");
      document.body.style.overflow = "hidden";
    }
    let released = false;
    return () => {
      if (released) return;
      released = true;
      lockCount.current = Math.max(0, lockCount.current - 1);
      if (lockCount.current === 0) {
        lenisRef.current?.start();
        document.documentElement.classList.remove("lenis-stopped");
        document.body.style.overflow = "";
      }
    };
  }, []);

  const scrollTo = useCallback((target: string | number, opts?: { immediate?: boolean }) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, immediate: opts?.immediate });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
      return;
    }
    document.querySelector(target)?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return <ScrollContext.Provider value={{ lock, scrollTo }}>{children}</ScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollContext);
