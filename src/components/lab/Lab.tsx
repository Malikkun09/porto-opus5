"use client";

import { SectionShell } from "@/components/shared/SectionShell";
import { Marquee } from "@/components/shared/Marquee";
import {
  ExperimentDisplace,
  ExperimentGrid,
  ExperimentMagnetic,
  ExperimentNoise,
  ExperimentScramble,
} from "./Experiments";

export function Lab() {
  return (
    <SectionShell id="lab" index="007" label="LAB" meta="05 EXPERIMENTS / NO PRODUCTION CLAIMS">
      <p className="label mb-6 max-w-[56ch]">
        SMALL INTERACTION STUDIES. EACH ONE EXISTS TO ANSWER A QUESTION, NOT TO DECORATE.
      </p>

      <div className="grid grid-cols-1 gap-[var(--gutter)] md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <ExperimentGrid />
        </div>
        <ExperimentScramble />
        <ExperimentDisplace />
        <ExperimentMagnetic />
        <ExperimentNoise />
      </div>

      <div className="mt-[clamp(2rem,5vw,3.5rem)]">
        <Marquee
          items={["EXPERIMENT", "MEASURE", "DELETE", "SHIP"]}
          speed={34}
          reverse
          textClass="display text-[clamp(1.5rem,4vw,3rem)]"
        />
      </div>
    </SectionShell>
  );
}
