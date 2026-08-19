"use client";

import { site } from "@/data/site";
import { AnimatedRule, Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";

const SPEC = [
  { key: "ROLE", values: ["AI / FULLSTACK / CREATIVE DEV"] },
  {
    key: "STACK",
    values: ["TYPESCRIPT", "REACT", "NEXT.JS", "LARAVEL", "PYTHON", "AI"],
  },
  { key: "FOCUS", values: ["PRODUCT", "AUTOMATION", "INTERACTION", "SYSTEMS"] },
] as const;

export function About() {
  return (
    <SectionShell id="about" index="002" label="ABOUT" meta="WHO / WHAT / HOW">
      {/* Asymmetric editorial grid: statement spans 8, spec sits in 4, offset. */}
      <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vw,4rem)] md:gap-x-[var(--gutter)]">
        <div className="col-span-12 md:col-span-8">
          <Reveal selector="[data-line-wrap]" stagger={0.09} y={0}>
            <h3 className="display text-[clamp(2rem,7.5vw,6.5rem)]">
              {site.statement.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <span
                    data-line-wrap
                    className="block will-change-transform"
                    style={{ marginLeft: i === 1 ? "clamp(0px,4vw,5rem)" : undefined }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h3>
          </Reveal>
        </div>

        {/* Deliberately pushed down and right — breaks the tidy row. */}
        <div className="col-span-12 md:col-span-3 md:col-start-10 md:mt-[8rem]">
          <Reveal y={28}>
            <p className="label mb-4">FIG. 02 — OPERATOR</p>
            <div
              aria-hidden="true"
              className="relative aspect-[3/4] w-full border-2 border-[var(--border)] bg-[var(--background-alt)]"
            >
              {/* CSS-only portrait placeholder: diagonal hatch + initials. */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 9px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="display text-[clamp(2.5rem,6vw,4rem)] text-[var(--foreground)] opacity-70">
                  MF
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-[var(--border)] bg-[var(--background)] px-2 py-1">
                <span className="label">ID 001</span>
                <span className="label">IDN</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="col-span-12">
          <AnimatedRule />
        </div>

        {/* Bio in a narrow measure, offset right — magazine column. */}
        <div className="col-span-12 md:col-span-5 md:col-start-4">
          <Reveal selector="p" stagger={0.1} y={26}>
            {site.bio.map((para) => (
              <p key={para.slice(0, 24)} className="mb-5 max-w-[46ch] text-[15px] leading-[1.55]">
                {para}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Technical specification block */}
        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <Reveal selector="[data-spec]" stagger={0.08} y={22}>
            <dl className="border-t-2 border-[var(--border)]">
              {SPEC.map((row) => (
                <div
                  key={row.key}
                  data-spec
                  className="grid grid-cols-[5rem_1fr] gap-4 border-b border-[var(--border)] py-3"
                >
                  <dt className="label-strong">{row.key}</dt>
                  <dd className="flex flex-col gap-1">
                    {row.values.map((v) => (
                      <span key={v} className="label-strong text-[11px]">
                        {v}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
