/**
 * Shared constants. NOT a "use client" module — the inline theme script in the
 * document head needs to interpolate this value at build time on the server.
 */
export const THEME_STORAGE_KEY = "sbp-theme";

export type Theme = "light" | "dark";
