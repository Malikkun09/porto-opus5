"use client";

import { useSyncExternalStore } from "react";

/**
 * Media queries as external stores.
 *
 * useSyncExternalStore instead of useState + useEffect: the browser IS the
 * store, so there is no setState-in-effect, no cascading render on mount, and
 * no chance of the value drifting from the environment.
 */

type Entry = {
  mql: MediaQueryList;
  listeners: Set<() => void>;
  cleanup: () => void;
};

const registry = new Map<string, Entry>();

function getEntry(query: string): Entry {
  let entry = registry.get(query);
  if (entry) return entry;

  const mql = window.matchMedia(query);
  const listeners = new Set<() => void>();
  const onChange = () => {
    for (const fn of listeners) fn();
  };
  mql.addEventListener("change", onChange);

  entry = {
    mql,
    listeners,
    cleanup: () => mql.removeEventListener("change", onChange),
  };
  registry.set(query, entry);
  return entry;
}

function subscribe(query: string) {
  return (onStoreChange: () => void) => {
    const entry = getEntry(query);
    entry.listeners.add(onStoreChange);
    return () => {
      entry.listeners.delete(onStoreChange);
      if (entry.listeners.size === 0) {
        entry.cleanup();
        registry.delete(query);
      }
    };
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    // Server snapshot: assume the conservative branch. Motion and pointer
    // effects are additive, so "off" is always the safe default to hydrate to.
    () => false,
  );
}

/** Single source of truth for motion preference across every animation system. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** True only for devices with a real hover-capable pointer. */
export const usePointerFine = () => useMediaQuery("(hover: hover) and (pointer: fine)");
