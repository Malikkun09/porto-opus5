"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projectArt } from "@/lib/placeholder";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useReducedMotion } from "@/hooks/useEnvironment";
import type { Project } from "@/types";

/**
 * Full-screen project detail.
 *
 * Framer Motion owns this: it is component enter/exit plus a shared-layout
 * transition from the list row. GSAP never touches these nodes.
 */
export function ProjectOverlay({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const { lock } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Scroll lock + focus management + escape, all tied to the open project.
  useEffect(() => {
    if (!project) return;

    const release = lock();
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Focus trap: the overlay is modal, so Tab must not escape it.
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      release();
      previouslyFocused?.focus?.();
    };
  }, [project, lock, onClose]);

  const duration = reduced ? 0 : 0.62;

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.slug}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — project detail`}
          className="fixed inset-0 z-[150] overflow-y-auto overscroll-contain bg-[var(--background)]"
          initial={{ clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", opacity: reduced ? 0 : 1 }}
          transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
        >
          <div ref={panelRef}>
            {/* Sticky overlay chrome */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-[var(--border)] bg-[var(--background)] px-[var(--gutter)] py-3">
              <span className="label-strong tabular">
                PROJECT {String(project.id).padStart(2, "0")}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="btn-brutal !py-2"
                aria-label="Close project detail"
              >
                CLOSE <X size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.22 }}
              className="px-[var(--gutter)] pb-[clamp(3rem,8vw,7rem)] pt-[clamp(2rem,5vw,4rem)]"
            >
              {/* Title block */}
              <header className="mb-[clamp(2rem,5vw,4rem)]">
                <h2 className="display text-[clamp(2.5rem,11vw,9rem)]">{project.title}</h2>
                <p className="label-strong mt-3">{project.category}</p>
              </header>

              {/* Fact strip */}
              <dl className="mb-[clamp(2rem,5vw,4rem)] grid grid-cols-2 border-t-2 border-[var(--border)] md:grid-cols-4">
                {[
                  { k: "YEAR", v: String(project.year) },
                  { k: "ROLE", v: project.role },
                  { k: "STATUS", v: project.status },
                  { k: "STACK", v: project.technologies.join(" / ") },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="border-b border-r border-[var(--border)] p-4 last:border-r-0"
                  >
                    <dt className="label mb-2">{row.k}</dt>
                    <dd className="label-strong text-[11px] leading-relaxed">{row.v}</dd>
                  </div>
                ))}
              </dl>

              {/* Editorial two-column body */}
              <div className="grid grid-cols-12 gap-y-10 md:gap-x-[var(--gutter)]">
                <div className="col-span-12 md:col-span-7">
                  <Block title="OVERVIEW" body={project.detail.overview} />
                  <Block title="PROBLEM" body={project.detail.problem} />
                  <Block title="SOLUTION" body={project.detail.solution} />

                  <h3 className="label-strong mb-3 mt-10">ARCHITECTURE</h3>
                  <ol className="border-t border-[var(--border)]">
                    {project.detail.architecture.map((item, i) => (
                      <li
                        key={item}
                        className="flex gap-4 border-b border-[var(--border)] py-3 text-[14px]"
                      >
                        <span className="label tabular shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="col-span-12 md:col-span-4 md:col-start-9">
                  <h3 className="label-strong mb-3">CHALLENGES</h3>
                  <ul className="mb-10 border-t border-[var(--border)]">
                    {project.detail.challenges.map((item) => (
                      <li key={item} className="border-b border-[var(--border)] py-3 text-[13px]">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h3 className="label-strong mb-3">RESULTS</h3>
                  <ul className="border-t-2 border-[var(--border)]">
                    {project.detail.results.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 border-b border-[var(--border)] py-3 text-[13px]"
                      >
                        <span aria-hidden="true" className="text-[var(--accent)]">
                          →
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Screens */}
              <h3 className="label-strong mb-4 mt-[clamp(2.5rem,6vw,5rem)]">SCREENS</h3>
              <div className="grid grid-cols-1 gap-[var(--gutter)] sm:grid-cols-3">
                {project.detail.shots.map((shot, i) => {
                  const art = projectArt(project.slug + i);
                  return (
                    <figure key={shot.label} className="border-2 border-[var(--border)]">
                      <div
                        className="relative aspect-[4/3]"
                        style={{ background: art.background }}
                        role="img"
                        aria-label={`${project.title} — ${shot.label}: ${shot.caption}`}
                      >
                        {art.layers.map((layer, j) => (
                          <div key={j} className={layer.className} style={layer.style} />
                        ))}
                        <span className="label-strong absolute bottom-3 left-3">{shot.label}</span>
                      </div>
                      <figcaption className="border-t-2 border-[var(--border)] px-3 py-2">
                        <span className="label">{shot.caption}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              {/* Links */}
              <div className="mt-[clamp(2.5rem,6vw,5rem)] flex flex-wrap gap-4">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brutal"
                  >
                    SOURCE CODE
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </a>
                ) : null}
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brutal"
                  >
                    LIVE DEMO
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </a>
                ) : null}
                {!project.github && !project.demo ? (
                  <p className="label">PRIVATE ENGAGEMENT — NO PUBLIC LINKS</p>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-8">
      <h3 className="label-strong mb-3">{title}</h3>
      <p className="max-w-[62ch] text-[15px] leading-[1.6]">{body}</p>
    </div>
  );
}
