"use client";

import { useCallback, useState } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { Preloader } from "@/components/layout/Preloader";
import { EdgeReadout } from "@/components/layout/EdgeReadout";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/shared/Cursor";
import { Marquee } from "@/components/shared/Marquee";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Stack } from "@/components/skills/Stack";
import { Projects } from "@/components/projects/Projects";
import { Experience } from "@/components/experience/Experience";
import { Activity } from "@/components/github/Activity";
import { Lab } from "@/components/lab/Lab";
import { Contact } from "@/components/contact/Contact";
import { site } from "@/data/site";
import type { GithubStats } from "@/types";

/**
 * Client shell. Holds only the preloader→hero handoff; everything else is a
 * self-contained section, so a change to one never re-renders the others.
 */
export function PageShell({ stats }: { stats: GithubStats }) {
  const [entered, setEntered] = useState(false);
  const onDone = useCallback(() => setEntered(true), []);

  return (
    <>
      <Preloader onDone={onDone} />
      <Cursor />
      <Navigation />
      <EdgeReadout />

      <main id="main">
        <Hero start={entered} />
        <Marquee items={site.marquee} speed={32} textClass="display text-[clamp(1.5rem,5vw,4rem)]" />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Activity stats={stats} />
        <Lab />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
