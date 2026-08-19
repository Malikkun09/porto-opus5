"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerTheme,
  getTheme,
  setTheme,
  subscribeTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/themeStore";

export { THEME_STORAGE_KEY };
export type { Theme };

/**
 * No provider needed — the DOM attribute is the store. Any component can read
 * the theme without being wrapped, and nothing re-renders on mount.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme]);
  return { theme, toggle };
}
