"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { subscribePointer } from "@/lib/pointer";
import { projectArt } from "@/lib/placeholder";
import type { Project } from "@/types";

/**
 * Cursor-following preview panel, owned entirely by GSAP.
 *
 * ONE panel for the whole list — the active project just swaps its content.
 * Rendering seven followers and toggling visibility would cost seven layers.
 */
export function ProjectPreview({
  projects,
  activeSlug,
}: {
  projects: Project[];
  activeSlug: string | null;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Trails behind the pointer; skew is driven by velocity for weight.
    const xTo = gsap.quickTo(wrap, "x", { duration: 0.62, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.62, ease: "power3.out" });
    const skewTo = gsap.quickTo(wrap, "skewX", { duration: 0.5, ease: "power2.out" });

    let prevX = 0;
    return subscribePointer(({ x, y }) => {
      xTo(x);
      yTo(y);
      const vx = x - prevX;
      prevX = x;
      skewTo(gsap.utils.clamp(-9, 9, vx * 0.32));
    });
  }, []);

  // Show/hide + content swap. Discrete state change, its own tween.
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    gsap.to(wrap, {
      autoAlpha: activeSlug ? 1 : 0,
      scale: activeSlug ? 1 : 0.88,
      duration: 0.45,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [activeSlug]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden opacity-0 will-change-transform md:block"
      style={{ marginLeft: "-16rem", marginTop: "-11rem" }}
    >
      <div
        ref={innerRef}
        className="relative h-[22rem] w-[32rem] overflow-hidden border-2 border-[var(--border)]"
        style={{ background: "var(--background-alt)" }}
      >
        {projects.map((project) => {
          const art = projectArt(project.slug);
          const isActive = project.slug === activeSlug;
          return (
            <div
              key={project.slug}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : 0, background: art.background }}
            >
              {art.layers.map((layer, i) => (
                <div key={i} className={layer.className} style={layer.style} />
              ))}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <span className="label-strong tabular">
                    {String(project.id).padStart(2, "0")}
                  </span>
                  <span className="label-strong">{project.year}</span>
                </div>
                <div>
                  <p className="display text-[2.5rem] leading-none">{project.title}</p>
                  <p className="label mt-2">{project.category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
