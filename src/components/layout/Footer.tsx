"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { Marquee } from "@/components/shared/Marquee";

export function Footer() {
  const [uptime, setUptime] = useState(0);

  // Session uptime counter — a small sign of life, one interval, cleaned up.
  useEffect(() => {
    const id = window.setInterval(() => setUptime((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = String(Math.floor(uptime / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <footer className="border-t-2 border-[var(--border)]">
      <Marquee items={site.marquee} speed={30} textClass="display text-[clamp(1.75rem,7vw,6rem)]" />

      <div className="grid grid-cols-12 gap-y-8 px-[var(--gutter)] py-[clamp(2rem,5vw,4rem)]">
        <div className="col-span-12 md:col-span-6">
          <p className="display text-[clamp(2rem,8vw,6rem)]">{site.name}</p>
          <p className="label mt-2">© {site.year} — ALL SYSTEMS ORIGINAL</p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="label mb-3">DESIGNED + BUILT WITH</p>
          <ul className="flex flex-col gap-1">
            {["REACT", "NEXT.JS", "GSAP", "FRAMER MOTION", "TAILWIND"].map((t) => (
              <li key={t} className="label-strong text-[11px]">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="label mb-3">CHANNELS</p>
          <ul className="flex flex-col gap-1">
            <li>
              <a href={`mailto:${site.email}`} className="link-sweep label-strong text-[11px]">
                EMAIL
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep label-strong text-[11px]"
              >
                GITHUB
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep label-strong text-[11px]"
              >
                LINKEDIN
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-[var(--gutter)] py-3">
        <span className="label-strong flex items-center gap-2">
          <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 bg-[var(--accent)]" />
          STATUS: ONLINE
        </span>
        <span className="label">SYSTEM: OPERATIONAL</span>
        <span className="label tabular">
          SESSION {mm}:{ss}
        </span>
        <span className="label">END OF DOCUMENT</span>
      </div>
    </footer>
  );
}
