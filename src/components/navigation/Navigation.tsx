"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { navLinks, sections, site } from "@/data/site";
import { useTheme } from "@/hooks/useTheme";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useActiveSection, useScrollProgress } from "@/hooks/useActiveSection";
import { useReducedMotion } from "@/hooks/useEnvironment";

/**
 * Sticky brutalist nav + full-screen overlay menu.
 * Framer Motion owns the menu (enter/exit); GSAP owns nothing here.
 */
export function Navigation() {
  const { theme, toggle } = useTheme();
  const { lock, scrollTo } = useSmoothScroll();
  const active = useActiveSection();
  const progress = useScrollProgress();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Scroll lock, escape, and focus return while the menu is open.
  useEffect(() => {
    if (!open) return;

    const release = lock();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      release();
      trigger?.focus();
    };
  }, [open, lock]);

  const go = (id: string) => {
    setOpen(false);
    // Defer so the scroll lock releases before we move.
    requestAnimationFrame(() => scrollTo(`#${id}`));
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[120] border-b-2 border-[var(--border)] bg-[var(--background)]">
        <div className="flex items-stretch justify-between">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("hero");
            }}
            className="display flex items-center px-[var(--gutter)] py-3 text-[clamp(0.95rem,1.6vw,1.15rem)]"
          >
            {site.first}
            <span className="pulse-dot ml-2 inline-block h-[6px] w-[6px] bg-[var(--accent)]" aria-hidden="true" />
          </a>

          <nav aria-label="Primary" className="hidden items-stretch md:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                aria-current={active === link.id ? "true" : undefined}
                className="label-strong flex items-center gap-2 border-l border-[var(--border)] px-4 transition-colors duration-150 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
                style={
                  active === link.id
                    ? { background: "var(--accent)", color: "var(--accent-ink)" }
                    : undefined
                }
              >
                <span className="tabular opacity-60">{link.index}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-stretch">
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="label-strong flex items-center gap-2 border-l border-[var(--border)] px-4 transition-colors duration-150 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              {theme === "dark" ? (
                <Sun size={13} strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <Moon size={13} strokeWidth={2.5} aria-hidden="true" />
              )}
              <span className="hidden lg:inline">{theme === "dark" ? "LIGHT" : "DARK"}</span>
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              className="label-strong flex items-center gap-2 border-l border-[var(--border)] px-4 transition-colors duration-150 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              MENU
              <Menu size={13} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full origin-left bg-[var(--accent)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-overlay"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[160] flex flex-col bg-[var(--background)]"
            initial={{ clipPath: reduced ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: reduced ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", opacity: reduced ? 0 : 1 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between border-b-2 border-[var(--border)] px-[var(--gutter)] py-3">
              <span className="label-strong">NAVIGATION / 008 SECTIONS</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-brutal !py-2"
                aria-label="Close menu"
              >
                CLOSE <X size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="All sections" className="flex flex-1 flex-col justify-center overflow-y-auto">
              <ul>
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.55,
                      delay: reduced ? 0 : 0.18 + i * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-[var(--border)]"
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.id);
                      }}
                      aria-current={active === s.id ? "true" : undefined}
                      className="group flex items-center gap-[var(--gutter)] px-[var(--gutter)] py-[clamp(0.5rem,1.6vw,1.1rem)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
                    >
                      <span className="label tabular w-[3rem] shrink-0 group-hover:text-[var(--accent-ink)]">
                        {s.index}
                      </span>
                      <span className="display text-[clamp(1.75rem,8vw,5.5rem)] leading-[0.9]">
                        {s.label}
                      </span>
                      {active === s.id ? (
                        <span className="label-strong ml-auto hidden sm:block">← CURRENT</span>
                      ) : null}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[var(--border)] px-[var(--gutter)] py-3">
              <span className="label">{site.email}</span>
              <span className="label">STATUS: ONLINE</span>
              <span className="label">© {site.year}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
