"use client";

/**
 * Cursor state store. Any component can request a cursor mode without the
 * cursor component knowing those components exist.
 */

export type CursorMode = "default" | "link" | "image" | "drag" | "text" | "hidden";

export type CursorState = {
  mode: CursorMode;
  label: string;
};

type Listener = (s: CursorState) => void;

const state: CursorState = { mode: "default", label: "" };
const listeners = new Set<Listener>();

/** Stack of claims so nested hovers restore the outer state on exit. */
const claims: { id: number; next: CursorState }[] = [];
let nextId = 1;

function emit() {
  const top = claims[claims.length - 1];
  state.mode = top ? top.next.mode : "default";
  state.label = top ? top.next.label : "";
  for (const fn of listeners) fn(state);
}

export function claimCursor(mode: CursorMode, label = ""): () => void {
  const id = nextId++;
  claims.push({ id, next: { mode, label } });
  emit();
  return () => {
    const i = claims.findIndex((c) => c.id === id);
    if (i !== -1) claims.splice(i, 1);
    emit();
  };
}

export function subscribeCursor(fn: Listener): () => void {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}
