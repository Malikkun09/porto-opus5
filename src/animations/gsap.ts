"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Register at module scope, not in an effect. Section components create their
 * own ScrollTriggers on mount, and provider effects run *after* child effects —
 * so registering in the provider would be too late for the first mount.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
}

/** Kept for explicitness at the provider boundary; registration is idempotent. */
export function registerGsap() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
