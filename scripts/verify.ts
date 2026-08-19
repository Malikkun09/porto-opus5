/**
 * Browser verification. Not part of the shipped app — a one-shot check that the
 * page renders, has no console errors, and behaves at every breakpoint.
 *
 *   node --experimental-strip-types scripts/verify.ts [baseUrl]
 */

import { chromium, type ConsoleMessage } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3001";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "480", width: 480, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "320", width: 320, height: 640 },
];

const failures: string[] = [];

function note(ok: boolean, label: string) {
  console.log(`${ok ? "  PASS" : "  FAIL"}  ${label}`);
  if (!ok) failures.push(label);
}

async function main() {
  const browser = await chromium.launch();

  // ---- render + overflow + console hygiene at every breakpoint ----------
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();
    const problems: string[] = [];

    page.on("console", (m: ConsoleMessage) => {
      if (m.type() === "error" || m.type() === "warning") {
        problems.push(`${m.type()}: ${m.text()}`);
      }
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForTimeout(2200);

    console.log(`\n[${vp.name}px]`);
    note(
      problems.length === 0,
      `console clean${problems.length ? ` — ${problems.slice(0, 3).join(" | ")}` : ""}`,
    );

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    note(overflow <= 1, `no horizontal overflow (${overflow}px)`);

    note((await page.locator("h1").count()) === 1, "exactly one h1");
    note(await page.locator("#hero h1").isVisible(), "hero visible after preloader");

    // Scroll to the bottom and confirm the last section rendered.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    note(await page.locator("footer").isVisible(), "footer reachable");

    await context.close();
  }

  // ---- interaction, desktop --------------------------------------------
  console.log("\n[interaction @1440]");
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(2200);

  // Theme toggle
  const themeBefore = await page.getAttribute("html", "data-theme");
  await page.getByRole("button", { name: /switch to .* theme/i }).click();
  await page.waitForTimeout(500);
  const themeAfter = await page.getAttribute("html", "data-theme");
  note(themeBefore !== themeAfter, `theme toggles (${themeBefore} → ${themeAfter})`);
  await page.getByRole("button", { name: /switch to .* theme/i }).click();
  await page.waitForTimeout(300);

  // Menu overlay open/close via keyboard escape
  await page.getByRole("button", { name: /^MENU$/ }).click();
  await page.waitForTimeout(700);
  note(await page.locator("#menu-overlay").isVisible(), "menu overlay opens");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  note((await page.locator("#menu-overlay").count()) === 0, "menu closes on Escape");

  // Project overlay
  await page.locator('[data-project-row] button').first().click();
  await page.waitForTimeout(900);
  note(await page.getByRole("dialog").isVisible(), "project overlay opens");
  const dialogLabel = await page.getByRole("dialog").getAttribute("aria-label");
  note(Boolean(dialogLabel), `overlay is labelled (${dialogLabel})`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  note((await page.getByRole("dialog").count()) === 0, "project overlay closes on Escape");

  // Stack filter
  await page.getByRole("button", { name: "^AI$" }).count().catch(() => 0);
  const aiFilter = page.getByRole("button", { name: "AI", exact: true });
  if ((await aiFilter.count()) > 0) {
    await aiFilter.first().click();
    await page.waitForTimeout(600);
    const rows = await page.locator("[data-tech-row]").count();
    note(rows > 0 && rows < 20, `stack filter narrows rows (${rows})`);
  }

  // Form validation — invalid submit must NOT use alert(), must show errors
  let alertFired = false;
  page.on("dialog", async (d) => {
    alertFired = true;
    await d.dismiss();
  });
  await page.locator("#contact-name").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /SEND MESSAGE/i }).click();
  await page.waitForTimeout(500);
  note(!alertFired, "no browser alert() used");
  note((await page.locator('[role="alert"]').count()) >= 3, "inline validation errors shown");
  note(
    (await page.getAttribute("#contact-name", "aria-invalid")) === "true",
    "invalid field marked aria-invalid",
  );

  // Valid submit
  await page.fill("#contact-name", "Reviewer");
  await page.fill("#contact-email", "reviewer@example.com");
  await page.fill("#contact-message", "This is a sufficiently long message.");
  await page.getByRole("button", { name: /SEND MESSAGE/i }).click();
  await page.waitForTimeout(1600);
  note(
    (await page.getByText(/MESSAGE QUEUED/i).count()) > 0,
    "success state shown after valid submit",
  );

  // Keyboard: skip link is the first tab stop. Reload first — Chromium keeps a
  // sequential-focus starting point, so blur() alone does not reset Tab order.
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(2200);
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");
  note(/SKIP TO CONTENT/i.test(focused), `skip link focusable first (got "${focused}")`);

  note(errors.length === 0, `no runtime errors${errors.length ? ` — ${errors[0]}` : ""}`);
  await ctx.close();

  // ---- reduced motion --------------------------------------------------
  console.log("\n[reduced motion @1440]");
  const rmCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmCtx.newPage();
  const rmErrors: string[] = [];
  rmPage.on("pageerror", (e) => rmErrors.push(e.message));
  await rmPage.goto(BASE, { waitUntil: "load" });
  await rmPage.waitForTimeout(1500);

  note(await rmPage.locator("#hero h1").isVisible(), "hero visible with no preloader");
  const heroOpacity = await rmPage
    .locator("#about h3")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  note(Number(heroOpacity) > 0.9, `content not stuck at opacity 0 (${heroOpacity})`);
  note(rmErrors.length === 0, "no errors under reduced motion");
  await rmCtx.close();

  // ---- touch / no-hover ------------------------------------------------
  console.log("\n[touch @390]");
  const tCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const tPage = await tCtx.newPage();
  await tPage.goto(BASE, { waitUntil: "load" });
  await tPage.waitForTimeout(2200);
  note(
    !(await tPage.evaluate(() => document.documentElement.classList.contains("cursor-none"))),
    "custom cursor disabled on touch",
  );
  await tCtx.close();

  await browser.close();

  console.log(
    failures.length === 0
      ? "\nALL CHECKS PASSED"
      : `\n${failures.length} FAILURE(S):\n${failures.map((f) => ` - ${f}`).join("\n")}`,
  );
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
