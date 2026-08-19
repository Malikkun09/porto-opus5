"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useMediaQuery, useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Scroll-triggered reveal. GSAP owns entrance animation for scroll-driven
 * content; Framer Motion is reserved for component enter/exit and overlays.
 */
export function Reveal({
  children,
  y = 40,
  delay = 0,
  stagger,
  selector,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  stagger?: number;
  /** Animate matching descendants instead of the wrapper itself. */
  selector?: string;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(selector ? el.querySelectorAll(selector) : el, { opacity: 1, y: 0 });
      return;
    }

    const targets = selector ? Array.from(el.querySelectorAll(selector)) : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, y, delay, stagger, selector, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Divider that draws itself when scrolled into view.
 */
export function AnimatedRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 92%" },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`h-[2px] w-full origin-left bg-[var(--border)] ${className}`}
    />
  );
}

/**
 * Parallax translation driven by scroll. Skipped entirely under reduced motion
 * and on small viewports (where it costs more than it communicates).
 */
export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const enabled = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance * -0.5 },
        {
          y: distance * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced, enabled, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
