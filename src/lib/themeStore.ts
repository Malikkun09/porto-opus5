"use client";

/**
 * Theme store. The DOM attribute is the source of truth (an inline script in
 * the document head sets it before first paint), and React subscribes to it —
 * so there is no duplicated state and no setState-on-mount.
 */

import { THEME_STORAGE_KEY, type Theme } from "./constants";

export { THEME_STORAGE_KEY };
export type { Theme };

const listeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** Server snapshot must match the markup the server emits. */
export const getServerTheme = (): Theme => "light";

export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.colorScheme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable (private mode / blocked). Theme still applies this session.
  }
  for (const fn of listeners) fn();
}
