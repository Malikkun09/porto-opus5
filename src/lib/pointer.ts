"use client";

/**
 * ONE pointer listener for the whole app.
 *
 * Every cursor-driven effect (custom cursor, magnetic buttons, project image
 * follower, lab grid) subscribes here instead of attaching its own mousemove.
 * Notifications are batched into a single rAF tick, so N subscribers cost one
 * listener and one frame of work.
 */

type PointerState = {
  x: number;
  y: number;
  /** Normalised to viewport, -1..1 from centre. */
  nx: number;
  ny: number;
  down: boolean;
};

type Subscriber = (state: PointerState) => void;

const state: PointerState = { x: 0, y: 0, nx: 0, ny: 0, down: false };
const subscribers = new Set<Subscriber>();

let listening = false;
let frame = 0;
let dirty = false;

function flush() {
  frame = 0;
  if (!dirty) return;
  dirty = false;
  for (const fn of subscribers) fn(state);
}

function schedule() {
  dirty = true;
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function onMove(e: PointerEvent) {
  state.x = e.clientX;
  state.y = e.clientY;
  state.nx = (e.clientX / window.innerWidth) * 2 - 1;
  state.ny = (e.clientY / window.innerHeight) * 2 - 1;
  schedule();
}

function onDown() {
  state.down = true;
  schedule();
}

function onUp() {
  state.down = false;
  schedule();
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerdown", onDown);
  window.removeEventListener("pointerup", onUp);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/** Subscribe to pointer updates. Returns an unsubscribe function. */
export function subscribePointer(fn: Subscriber): () => void {
  subscribers.add(fn);
  start();
  fn(state);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stop();
  };
}

export function getPointer(): Readonly<PointerState> {
  return state;
}

export type { PointerState };
