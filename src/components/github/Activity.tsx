"use client";

import { useMemo } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { contributionLevel } from "@/lib/github";
import { SectionShell } from "@/components/shared/SectionShell";
import { Reveal } from "@/components/shared/Reveal";
import type { ContributionDay, GithubStats } from "@/types";

const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

/**
 * Technical dashboard. Data arrives as a prop from a server component, so the
 * mock/API swap happens in one place (lib/github) and this stays presentational.
 */
export function Activity({ stats }: { stats: GithubStats }) {
  // 52 columns × 7 rows. Computed once; the array is stable per render.
  const contributions = stats.contributions;
  const weeks = useMemo(() => {
    const out: ContributionDay[][] = [];
    for (let i = 0; i < contributions.length; i += 7) {
      out.push(contributions.slice(i, i + 7));
    }
    return out;
  }, [contributions]);

  const metrics = [
    { label: "COMMITS", value: stats.commits.toLocaleString("en-US") },
    { label: "REPOSITORIES", value: String(stats.repositories) },
    { label: "PROJECTS", value: String(stats.projects) },
    { label: "LANGUAGES", value: String(stats.languagesCount) },
  ];

  return (
    <SectionShell
      id="activity"
      index="006"
      label="GITHUB ACTIVITY"
      meta={`@${stats.handle} / SOURCE: ${stats.source.toUpperCase()}`}
    >
      {/* Metric strip */}
      <Reveal selector="[data-metric]" stagger={0.07} y={26}>
        <dl className="grid grid-cols-2 border-t-2 border-[var(--border)] md:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              data-metric
              className="border-b border-r border-[var(--border)] p-4 last:border-r-0 md:p-6"
            >
              <dt className="label mb-3">{m.label}</dt>
              <dd className="num-giant tabular text-[clamp(2rem,5vw,3.5rem)]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-[clamp(2rem,5vw,3.5rem)] grid grid-cols-12 gap-y-10 md:gap-x-[var(--gutter)]">
        {/* Heatmap */}
        <div className="col-span-12 md:col-span-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="label-strong">CONTRIBUTION MATRIX — 52 WEEKS</h3>
            <span className="label">{stats.commits.toLocaleString("en-US")} TOTAL</span>
          </div>

          <div className="overflow-x-auto border-2 border-[var(--border)] p-3">
            <div
              className="flex gap-[3px]"
              role="img"
              aria-label={`Contribution heatmap: ${stats.commits} contributions over the last 52 weeks`}
            >
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const level = contributionLevel(day.count);
                    return (
                      <span
                        key={day.date}
                        title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                        className="block h-[9px] w-[9px] shrink-0"
                        style={{
                          background:
                            level === 0 ? "var(--background-alt)" : "var(--accent)",
                          opacity: LEVEL_OPACITY[level],
                          outline: "1px solid var(--border)",
                          outlineOffset: "-1px",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="label">LESS</span>
            {LEVEL_OPACITY.map((o, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="block h-[9px] w-[9px]"
                style={{
                  background: i === 0 ? "var(--background-alt)" : "var(--accent)",
                  opacity: o,
                  outline: "1px solid var(--border)",
                  outlineOffset: "-1px",
                }}
              />
            ))}
            <span className="label">MORE</span>
          </div>
        </div>

        {/* Language stats */}
        <div className="col-span-12 md:col-span-4">
          <h3 className="label-strong mb-3">LANGUAGE DISTRIBUTION</h3>
          <ul className="border-t-2 border-[var(--border)]">
            {stats.languages.map((lang) => (
              <li key={lang.name} className="border-b border-[var(--border)] py-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="label-strong">{lang.name}</span>
                  <span className="label tabular">{lang.percent.toFixed(1)}%</span>
                </div>
                {/* Real measured data, so a bar is honest here. */}
                <div className="h-[6px] w-full border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${lang.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Repos */}
        <div className="col-span-12">
          <h3 className="label-strong mb-3">REPOSITORIES</h3>
          <Reveal selector="[data-repo]" stagger={0.05} y={20}>
            <ul className="border-t-2 border-[var(--border)]">
              {stats.repos.map((repo) => (
                <li key={repo.name} data-repo className="border-b border-[var(--border)]">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 py-3 transition-transform duration-200 hover:translate-x-2 focus-visible:translate-x-2"
                  >
                    <span className="label-strong text-[13px] group-hover:text-[var(--accent)]">
                      {repo.name}
                    </span>
                    <span className="text-[13px] text-[var(--muted)]">{repo.description}</span>
                    <span className="label ml-auto">{repo.language}</span>
                    <span className="label tabular flex items-center gap-1">
                      <Star size={10} strokeWidth={2.5} aria-hidden="true" />
                      {repo.stars}
                    </span>
                    <span className="label tabular">{repo.updated}</span>
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className="opacity-40 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
