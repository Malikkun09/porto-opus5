import type { ContributionDay, GithubStats } from "@/types";

/**
 * Deterministic contribution data. A seeded PRNG — not Math.random — so the
 * server and client render identical markup (no hydration mismatch).
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKS = 52;
const DAYS = WEEKS * 7;

/** Anchor date is fixed, so the grid is stable across renders and builds. */
const ANCHOR = Date.UTC(2026, 7, 15);

function buildContributions(): ContributionDay[] {
  const rand = mulberry32(0x5eed_1234);
  const out: ContributionDay[] = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const ts = ANCHOR - i * 86_400_000;
    const date = new Date(ts);
    const dow = date.getUTCDay();
    const weekend = dow === 0 || dow === 6;

    // Seasonal intensity so the heatmap reads as a real year of work.
    const wave = 0.55 + 0.45 * Math.sin((i / DAYS) * Math.PI * 2.4);
    const roll = rand();
    let count = 0;

    if (roll < (weekend ? 0.42 : 0.11)) {
      count = 0;
    } else {
      count = Math.max(1, Math.round(rand() * 11 * wave * (weekend ? 0.55 : 1)));
    }

    out.push({ date: date.toISOString().slice(0, 10), count });
  }

  return out;
}

const contributions = buildContributions();

const mockStats: GithubStats = {
  handle: "malikfajar",
  commits: contributions.reduce((sum, d) => sum + d.count, 0),
  repositories: 47,
  projects: 7,
  languagesCount: 9,
  followers: 214,
  languages: [
    { name: "TYPESCRIPT", percent: 38.4 },
    { name: "PYTHON", percent: 21.7 },
    { name: "PHP", percent: 14.2 },
    { name: "GLSL", percent: 8.9 },
    { name: "GO", percent: 7.1 },
    { name: "CSS", percent: 5.3 },
    { name: "OTHER", percent: 4.4 },
  ],
  repos: [
    {
      name: "sentra",
      description: "Event-sourced runtime for long-running LLM agents",
      language: "TYPESCRIPT",
      stars: 412,
      updated: "2026-08-11",
      url: "https://github.com/malikfajar/sentra",
    },
    {
      name: "voidgrid",
      description: "Deterministic WebGL generative typography engine",
      language: "GLSL",
      stars: 289,
      updated: "2026-07-29",
      url: "https://github.com/malikfajar/voidgrid",
    },
    {
      name: "monolith",
      description: "Brutalist component system with enforced design tokens",
      language: "TYPESCRIPT",
      stars: 176,
      updated: "2026-06-18",
      url: "https://github.com/malikfajar/monolith",
    },
    {
      name: "atlas-vision",
      description: "On-premise document extraction pipeline",
      language: "PYTHON",
      stars: 143,
      updated: "2026-05-02",
      url: "https://github.com/malikfajar/atlas-vision",
    },
    {
      name: "warungos",
      description: "Offline-first POS with CRDT stock reconciliation",
      language: "TYPESCRIPT",
      stars: 98,
      updated: "2026-04-21",
      url: "https://github.com/malikfajar/warungos",
    },
    {
      name: "signalpath",
      description: "Critical-path latency attribution over OTEL traces",
      language: "GO",
      stars: 67,
      updated: "2025-11-30",
      url: "https://github.com/malikfajar/signalpath",
    },
  ],
  contributions,
  source: "mock",
};

/**
 * Single seam for GitHub data. Swap the body for a fetch against the GitHub
 * API (or a route handler that holds the token) — callers stay unchanged.
 *
 * ponytail: mock provider only. Add the real fetch when a token exists;
 * keep the same GithubStats shape and set source: "api".
 */
export async function getGithubStats(): Promise<GithubStats> {
  return mockStats;
}

export const contributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
};
