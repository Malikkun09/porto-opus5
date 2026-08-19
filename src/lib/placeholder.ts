/**
 * Deterministic CSS-only visual per project. No image assets, no broken images,
 * no network cost — the preview is generated from the slug.
 *
 * ponytail: swap `layers` for a real <Image> when art exists; the consumer only
 * reads `background` / `layers`, so nothing else changes.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

export type PlaceholderArt = {
  background: string;
  layers: { className: string; style: React.CSSProperties }[];
};

export function projectArt(slug: string): PlaceholderArt {
  const a = hash(slug);
  const b = hash(slug + "::b");
  const kind = Math.floor(a * 4);

  const angle = Math.round(20 + b * 110);
  const size = Math.round(8 + a * 22);

  const patterns: Record<number, React.CSSProperties> = {
    0: {
      backgroundImage: `repeating-linear-gradient(${angle}deg, var(--border) 0 2px, transparent 2px ${size}px)`,
      opacity: 0.35,
    },
    1: {
      backgroundImage:
        "linear-gradient(to right, var(--border) 0 1px, transparent 1px 100%), linear-gradient(to bottom, var(--border) 0 1px, transparent 1px 100%)",
      backgroundSize: `${size + 14}px ${size + 14}px`,
      opacity: 0.4,
    },
    2: {
      backgroundImage: `radial-gradient(circle at ${Math.round(b * 100)}% ${Math.round(
        a * 100,
      )}%, var(--accent) 0 2px, transparent 2px)`,
      backgroundSize: `${size + 6}px ${size + 6}px`,
      opacity: 0.55,
    },
    3: {
      backgroundImage: `repeating-conic-gradient(from ${angle}deg, var(--border) 0% 12%, transparent 12% 25%)`,
      backgroundSize: `${size * 3}px ${size * 3}px`,
      opacity: 0.28,
    },
  };

  return {
    background: "var(--background-alt)",
    layers: [
      { className: "absolute inset-0", style: patterns[kind] },
      {
        className: "absolute inset-0",
        style: {
          backgroundImage: `linear-gradient(${angle + 90}deg, transparent 40%, var(--accent) 40.2%, var(--accent) 41%, transparent 41.2%)`,
          opacity: 0.9,
        },
      },
    ],
  };
}
