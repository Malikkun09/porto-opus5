"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { claimCursor } from "@/lib/cursorState";
import { projects } from "@/data/projects";
import { projectArt } from "@/lib/placeholder";
import { SectionShell } from "@/components/shared/SectionShell";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectOverlay } from "./ProjectOverlay";
import { usePointerFine, useReducedMotion } from "@/hooks/useEnvironment";
import type { Project } from "@/types";

/**
 * Editorial project list. Rows are buttons — the whole interaction works from
 * the keyboard, and hover is pure enhancement.
 *
 * Animation ownership:
 *   GSAP  — row reveal, title displacement, cursor-following preview
 *   Framer— the detail overlay (mount/unmount)
 */
export function Projects() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const listRef = useRef<HTMLUListElement | null>(null);
  const releaseCursor = useRef<(() => void) | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<Project | null>(null);

  // Row reveal on scroll.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const rows = el.querySelectorAll("[data-project-row]");

    if (reduced) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 46 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 82%" },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  const enter = useCallback(
    (project: Project, row: HTMLElement) => {
      setActive(project.slug);
      releaseCursor.current?.();
      releaseCursor.current = claimCursor("image", "VIEW PROJECT");

      if (reduced) return;
      // Title shifts right, metadata fades up. Non-hovered rows recede.
      gsap.to(row.querySelector("[data-project-title]"), {
        x: 26,
        color: "var(--accent)",
        duration: 0.5,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(row.querySelector("[data-project-meta]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(row.querySelector("[data-project-num]"), {
        color: "var(--accent)",
        duration: 0.3,
        overwrite: "auto",
      });
    },
    [reduced],
  );

  const leave = useCallback(
    (row: HTMLElement) => {
      setActive(null);
      releaseCursor.current?.();
      releaseCursor.current = null;

      if (reduced) return;
      gsap.to(row.querySelector("[data-project-title]"), {
        x: 0,
        color: "var(--foreground)",
        duration: 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(row.querySelector("[data-project-meta]"), {
        autoAlpha: 0,
        y: 8,
        duration: 0.35,
        overwrite: "auto",
      });
      gsap.to(row.querySelector("[data-project-num]"), {
        color: "var(--muted)",
        duration: 0.3,
        overwrite: "auto",
      });
    },
    [reduced],
  );

  useEffect(() => () => releaseCursor.current?.(), []);

  return (
    <>
      <SectionShell
        id="work"
        index="004"
        label="FEATURED WORK"
        meta={`${projects.length} SELECTED PROJECTS`}
      >
        <ul ref={listRef} className="border-t-2 border-[var(--border)]">
          {projects.map((project) => (
            <li key={project.slug} data-project-row className="border-b border-[var(--border)]">
              <button
                type="button"
                onClick={() => setOpen(project)}
                onPointerEnter={(e) => enter(project, e.currentTarget)}
                onPointerLeave={(e) => leave(e.currentTarget)}
                onFocus={(e) => enter(project, e.currentTarget)}
                onBlur={(e) => leave(e.currentTarget)}
                aria-label={`Open ${project.title} — ${project.category}, ${project.year}`}
                className="group w-full py-[clamp(1.1rem,2.4vw,2rem)] text-left"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 sm:flex-nowrap sm:items-center">
                  <span
                    data-project-num
                    className="label tabular w-[2.5rem] shrink-0 text-[12px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {String(project.id).padStart(2, "0")}
                  </span>

                  <span
                    data-project-title
                    className="display text-[clamp(1.75rem,7vw,5.5rem)] leading-[0.85] will-change-transform"
                  >
                    {project.title}
                  </span>

                  <span className="label ml-auto hidden shrink-0 lg:block">{project.category}</span>
                  <span className="label tabular shrink-0">{project.year}</span>
                </div>

                {/* Metadata row: hidden on desktop until hover, always visible on
                    touch where there is no hover to reveal it. */}
                <div
                  data-project-meta
                  className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 pl-0 sm:pl-[2.5rem]"
                  style={fine && !reduced ? { opacity: 0, transform: "translateY(8px)" } : undefined}
                >
                  <span className="label-strong text-[10px]">{project.status}</span>
                  <span className="label">{project.technologies.join(" / ")}</span>
                  <span className="label hidden max-w-[48ch] md:block">{project.description}</span>
                </div>

                {/* Mobile preview: no cursor to follow, so show art inline. */}
                <div className="mt-4 md:hidden">
                  <MobileArt project={project} />
                </div>
              </button>
            </li>
          ))}
        </ul>

        <p className="label mt-5">SELECT A PROJECT TO OPEN THE FULL CASE FILE.</p>
      </SectionShell>

      {fine && !reduced ? <ProjectPreview projects={projects} activeSlug={active} /> : null}
      <ProjectOverlay project={open} onClose={() => setOpen(null)} />
    </>
  );
}

function MobileArt({ project }: { project: Project }) {
  const art = projectArt(project.slug);
  return (
    <div
      aria-hidden="true"
      className="relative h-28 w-full overflow-hidden border border-[var(--border)]"
      style={{ background: art.background }}
    >
      {art.layers.map((layer, i) => (
        <div key={i} className={layer.className} style={layer.style} />
      ))}
    </div>
  );
}
