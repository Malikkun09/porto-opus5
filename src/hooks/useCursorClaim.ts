"use client";

import { useEffect, useRef } from "react";
import { claimCursor, type CursorMode } from "@/lib/cursorState";

/**
 * Declarative cursor claim. Attaches pointer enter/leave to the wrapped
 * element via ref — no extra DOM node, no per-element mousemove listener.
 */
export function useCursorClaim<T extends HTMLElement>(mode: CursorMode, label = "") {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let release: (() => void) | null = null;

    const enter = () => {
      release?.();
      release = claimCursor(mode, label);
    };
    const leave = () => {
      release?.();
      release = null;
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    // Keyboard users get the same state signal without needing hover.
    el.addEventListener("focus", enter);
    el.addEventListener("blur", leave);

    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focus", enter);
      el.removeEventListener("blur", leave);
      release?.();
    };
  }, [mode, label]);

  return ref;
}
