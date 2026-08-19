/**
 * Runnable self-check for the non-trivial pure logic. No framework.
 *
 *   npm run check
 */

import assert from "node:assert/strict";
import { contributionLevel, getGithubStats } from "../src/lib/github.ts";
import { projectArt } from "../src/lib/placeholder.ts";
import { projects, getProjectBySlug } from "../src/data/projects.ts";
import { sections, navLinks } from "../src/data/site.ts";
import { stack, techCategories } from "../src/data/stack.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function main() {
  // --- contribution buckets ---------------------------------------------
  assert.equal(contributionLevel(0), 0);
  assert.equal(contributionLevel(1), 1);
  assert.equal(contributionLevel(2), 1);
  assert.equal(contributionLevel(3), 2);
  assert.equal(contributionLevel(5), 2);
  assert.equal(contributionLevel(6), 3);
  assert.equal(contributionLevel(8), 3);
  assert.equal(contributionLevel(9), 4);
  assert.equal(contributionLevel(999), 4);

  // --- github data shape + determinism ---------------------------------
  const a = await getGithubStats();
  const b = await getGithubStats();

  assert.equal(a.contributions.length, 364, "heatmap must be exactly 52 weeks");
  assert.equal(a.contributions.length % 7, 0, "must divide into whole weeks");
  assert.deepEqual(
    a.contributions.map((d) => d.count),
    b.contributions.map((d) => d.count),
    "contribution data must be deterministic — otherwise SSR and client disagree",
  );
  assert.equal(
    a.commits,
    a.contributions.reduce((s, d) => s + d.count, 0),
    "commit total must equal the sum of the heatmap",
  );
  assert.ok(
    a.contributions.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)),
    "every day needs an ISO date",
  );
  assert.ok(a.contributions.every((d) => d.count >= 0));

  const langTotal = a.languages.reduce((s, l) => s + l.percent, 0);
  assert.ok(Math.abs(langTotal - 100) < 0.5, `language percents should total ~100, got ${langTotal}`);
  assert.ok(a.languages.every((l) => l.percent >= 0 && l.percent <= 100));

  // --- project data integrity ------------------------------------------
  assert.ok(projects.length >= 5 && projects.length <= 7, "brief asks for 5–7 projects");

  const slugs = new Set(projects.map((p) => p.slug));
  assert.equal(slugs.size, projects.length, "slugs must be unique");

  const ids = new Set(projects.map((p) => p.id));
  assert.equal(ids.size, projects.length, "ids must be unique");

  for (const p of projects) {
    assert.ok(p.title.length > 0, `${p.slug}: title`);
    assert.ok(p.technologies.length > 0, `${p.slug}: stack`);
    assert.ok(p.detail.architecture.length >= 3, `${p.slug}: architecture needs detail`);
    assert.ok(p.detail.challenges.length >= 2, `${p.slug}: challenges`);
    assert.ok(p.detail.results.length >= 2, `${p.slug}: results`);
    assert.ok(p.detail.shots.length >= 1, `${p.slug}: at least one screen`);
    assert.equal(p.slug, p.slug.toLowerCase(), `${p.slug}: slug must be lowercase`);
    if (p.github) assert.ok(p.github.startsWith("https://"), `${p.slug}: github must be https`);
    if (p.demo) assert.ok(p.demo.startsWith("https://"), `${p.slug}: demo must be https`);
  }

  assert.equal(getProjectBySlug("kerjain")?.title, "KERJAIN");
  assert.equal(getProjectBySlug("does-not-exist"), undefined);

  // --- placeholder art is deterministic per slug ------------------------
  for (const p of projects) {
    const first = projectArt(p.slug);
    const second = projectArt(p.slug);
    assert.deepEqual(first, second, `${p.slug}: art must be stable across renders`);
    assert.ok(first.layers.length > 0);
  }
  assert.notDeepEqual(
    projectArt("kerjain"),
    projectArt("sentra"),
    "different projects should look different",
  );

  // --- nav wiring -------------------------------------------------------
  const sectionIds = new Set(sections.map((s) => s.id));
  assert.equal(sectionIds.size, sections.length, "section ids must be unique");
  assert.ok(
    navLinks.every((l) => sectionIds.has(l.id)),
    "every nav link must target a real section",
  );
  assert.ok(
    sections.every((s) => /^\d{3}$/.test(s.index)),
    "section indices are zero-padded three digits",
  );

  // --- stack -------------------------------------------------------------
  assert.equal(new Set(stack.map((t) => t.name)).size, stack.length, "tech names must be unique");
  assert.ok(
    stack.every((t) => techCategories.includes(t.category)),
    "every tech must sit in a declared category",
  );
  assert.ok(
    techCategories.every((c) => stack.some((t) => t.category === c)),
    "no empty categories — an empty filter tab is a dead end",
  );

  // --- the contact form validator (mirrors Contact.tsx) -----------------
  assert.ok(EMAIL_RE.test("hello@malikfajar.dev"));
  assert.ok(!EMAIL_RE.test("nope"));
  assert.ok(!EMAIL_RE.test("no@domain"));
  assert.ok(!EMAIL_RE.test("two spaces@x.dev"));
  assert.ok(!EMAIL_RE.test(""));

  console.log("✓ all checks passed");
}

main().catch((err) => {
  console.error("✗ check failed\n", err);
  process.exit(1);
});
