import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: 1,
    slug: "kerjain",
    title: "KERJAIN",
    category: "SKILL-MATCH PLATFORM",
    year: 2026,
    description:
      "A digital platform connecting students with practical work opportunities, matched by demonstrated skill instead of résumé keywords.",
    technologies: ["REACT", "LARAVEL", "MYSQL", "AI"],
    role: "LEAD ENGINEER / SYSTEM DESIGN",
    status: "IN DEVELOPMENT",
    github: "https://github.com/malikfajar/kerjain",
    demo: "https://kerjain.dev",
    detail: {
      overview:
        "Kerjain is a two-sided marketplace where students prove capability through short practical tasks and businesses hire against that evidence. The matching layer reads task output, not job titles.",
      problem:
        "Entry-level hiring in Indonesia filters on credentials students do not have yet. Employers get noisy applicant piles; students get silence. Both sides lose to a keyword parser.",
      solution:
        "A skill graph built from completed micro-tasks. Every submission produces structured signals — correctness, turnaround, review score — that feed an embedding-based matcher ranking candidates per posting.",
      architecture: [
        "Laravel API — auth, postings, submissions, review workflow",
        "MySQL with a normalised skill-graph schema, materialised match views",
        "Python matcher service — embeddings + weighted rerank, queue-driven",
        "React SPA — employer console and student workspace",
        "Redis queue for submission scoring, idempotent job handlers",
      ],
      challenges: [
        "Cold start: no submissions means no signal. Solved with seeded calibration tasks per skill track.",
        "Score gaming. Reviewer sampling plus variance checks on turnaround flag anomalies.",
        "Match explainability — employers reject a black box, so every rank ships with its top three contributing signals.",
      ],
      results: [
        "Match acceptance rate 3.1× the keyword baseline in internal evaluation",
        "Median time-to-first-response cut from 9 days to 32 hours",
        "1.2k calibration submissions processed during closed beta",
      ],
      shots: [
        { label: "EMPLOYER CONSOLE", caption: "Ranked candidates with signal breakdown" },
        { label: "SKILL GRAPH", caption: "Derived competency map per student" },
        { label: "SUBMISSION REVIEW", caption: "Structured scoring workflow" },
      ],
    },
  },
  {
    id: 2,
    slug: "sentra",
    title: "SENTRA",
    category: "AGENT ORCHESTRATION RUNTIME",
    year: 2026,
    description:
      "A runtime for long-running LLM agents with durable state, deterministic replay, and hard cost ceilings per run.",
    technologies: ["TYPESCRIPT", "NEXT.JS", "POSTGRES", "REDIS", "LLM"],
    role: "ARCHITECT / FULLSTACK",
    status: "R&D",
    github: "https://github.com/malikfajar/sentra",
    detail: {
      overview:
        "Sentra treats an agent run as an append-only event log. Every tool call, model response, and retry is a persisted event, so any run can be replayed, forked, or audited after the fact.",
      problem:
        "Agent frameworks lose state on crash, cannot explain what happened three steps ago, and let token spend run unbounded. Debugging becomes archaeology through stdout.",
      solution:
        "Event-sourced execution. The scheduler hydrates agent state from the log, enforces a per-run token budget before each model call, and writes every transition back before proceeding.",
      architecture: [
        "Postgres event store — append-only, one stream per run",
        "Redis-backed scheduler with lease-based worker claims",
        "Deterministic replay engine: same log + same seed = same trajectory",
        "Budget interceptor rejecting calls that would exceed the run ceiling",
        "Next.js inspector UI — timeline, diff between forked runs",
      ],
      challenges: [
        "Non-determinism from model sampling. Recorded responses are replayed verbatim; only new steps hit the provider.",
        "Tool side effects are not replayable, so tools declare purity and impure ones are stubbed on replay.",
        "Backpressure when a run fans out into dozens of parallel tool calls.",
      ],
      results: [
        "Zero lost runs across 40k simulated crash injections",
        "Replay of a 200-step run in 1.8s from cold",
        "Cost overruns eliminated by pre-flight budget checks",
      ],
      shots: [
        { label: "RUN TIMELINE", caption: "Event-by-event execution trace" },
        { label: "FORK DIFF", caption: "Two trajectories from a shared prefix" },
        { label: "BUDGET PANEL", caption: "Live token and cost ceiling" },
      ],
    },
  },
  {
    id: 3,
    slug: "atlas-vision",
    title: "ATLAS VISION",
    category: "DOCUMENT INTELLIGENCE",
    year: 2025,
    description:
      "Vision pipeline turning scanned Indonesian government forms into validated structured records, offline-capable.",
    technologies: ["PYTHON", "FASTAPI", "ONNX", "OPENCV", "POSTGRES"],
    role: "ML ENGINEER",
    status: "SHIPPED",
    github: "https://github.com/malikfajar/atlas-vision",
    detail: {
      overview:
        "A layout-aware extraction pipeline for high-volume paper intake. Runs entirely on-premise because the documents cannot leave the building.",
      problem:
        "Thousands of scanned forms per week, inconsistent layouts, stamps over fields, and a legal requirement that nothing touches a third-party API.",
      solution:
        "Deskew and denoise, detect layout regions, OCR per region with a fine-tuned recogniser, then validate against per-form schemas. Anything below confidence threshold routes to human review.",
      architecture: [
        "OpenCV preprocessing — deskew, adaptive threshold, stamp suppression",
        "ONNX-exported layout detector, CPU-quantised for on-prem hardware",
        "Per-form JSON schema validation with field-level confidence",
        "FastAPI batch endpoints, background workers, retry with jitter",
        "Review queue surfacing only low-confidence extractions",
      ],
      challenges: [
        "Red official stamps overlapping text — channel separation recovered most glyphs.",
        "No GPU on target hardware. Quantisation plus batching hit the throughput target on 8 cores.",
        "Schema drift as forms are revised; versioned schemas with automatic fallback.",
      ],
      results: [
        "94.2% field-level accuracy on the held-out set",
        "Manual review reduced to 11% of documents",
        "Throughput 1,400 pages/hour on commodity CPU hardware",
      ],
      shots: [
        { label: "PIPELINE VIEW", caption: "Stage-by-stage document transform" },
        { label: "CONFIDENCE MAP", caption: "Field-level extraction certainty" },
        { label: "REVIEW QUEUE", caption: "Human-in-the-loop correction" },
      ],
    },
  },
  {
    id: 4,
    slug: "voidgrid",
    title: "VOIDGRID",
    category: "CREATIVE CODING ENGINE",
    year: 2025,
    description:
      "A WebGL generative typography engine. Feed it text, get a deterministic poster driven by a seed.",
    technologies: ["TYPESCRIPT", "WEBGL", "GLSL", "CANVAS"],
    role: "CREATIVE TECHNOLOGIST",
    status: "MAINTAINED",
    github: "https://github.com/malikfajar/voidgrid",
    demo: "https://voidgrid.art",
    detail: {
      overview:
        "Voidgrid renders type as a displacement field. Same seed, same output, forever — which makes generative work reproducible enough to print.",
      problem:
        "Generative design tools are fun and unrepeatable. You lose the good one and cannot get it back.",
      solution:
        "A seeded PRNG drives every parameter. The seed is encoded in the URL, so any composition is a shareable, reproducible artifact renderable at print resolution.",
      architecture: [
        "Custom GLSL displacement and chromatic-offset shaders",
        "SDF text atlas generated at runtime from live font metrics",
        "Seeded xoshiro128** PRNG threaded through every parameter",
        "Offscreen render path for 300 DPI export",
        "Zero-dependency core, ~14kb gzipped",
      ],
      challenges: [
        "Font rasterisation quality at extreme scale — moved to SDF atlases.",
        "Shader precision differences across GPU vendors broke determinism; pinned to highp with integer-domain math.",
        "Keeping export memory bounded when rendering poster sizes.",
      ],
      results: [
        "60fps at 4K on integrated graphics",
        "Used for three printed exhibition series",
        "Deterministic output verified across 5 GPU vendors",
      ],
      shots: [
        { label: "DISPLACEMENT", caption: "Type deformed by noise field" },
        { label: "SEED EXPLORER", caption: "Parameter space navigation" },
        { label: "PRINT EXPORT", caption: "300 DPI offscreen render" },
      ],
    },
  },
  {
    id: 5,
    slug: "warungos",
    title: "WARUNGOS",
    category: "OFFLINE-FIRST POS",
    year: 2025,
    description:
      "Point-of-sale for small Indonesian shops. Fully operational with no connectivity, syncs without conflicts when the network returns.",
    technologies: ["REACT", "LARAVEL", "SQLITE", "PWA"],
    role: "FULLSTACK DEVELOPER",
    status: "SHIPPED",
    github: "https://github.com/malikfajar/warungos",
    detail: {
      overview:
        "A PWA that assumes the network is broken. Sales, stock, and receipts all work offline; sync is a background detail the shop owner never sees.",
      problem:
        "Existing POS software assumes stable internet. In practice connectivity drops for hours, and a POS that stops selling is worse than a paper ledger.",
      solution:
        "Local SQLite via WASM is the source of truth for the device. Mutations queue as an operation log and replay server-side with per-entity CRDT resolution.",
      architecture: [
        "SQLite WASM with OPFS persistence in the browser",
        "Operation log with Lamport clocks per device",
        "Server-side merge: last-writer-wins on scalars, counter CRDT on stock",
        "Laravel sync endpoint, batched and idempotent",
        "Thermal printer support over Web Bluetooth",
      ],
      challenges: [
        "Concurrent stock edits across two devices — additive counters instead of absolute writes.",
        "OPFS quota on low-end Android; ring-buffer archival of old transactions.",
        "Clock skew between devices resolved with logical rather than wall clocks.",
      ],
      results: [
        "Deployed to 40+ shops",
        "Zero sales lost to connectivity in 8 months of operation",
        "Cold start to first sale under 1.2s on a mid-range Android device",
      ],
      shots: [
        { label: "SALES VIEW", caption: "Offline transaction entry" },
        { label: "SYNC STATE", caption: "Pending operation log" },
        { label: "STOCK LEDGER", caption: "CRDT-merged inventory" },
      ],
    },
  },
  {
    id: 6,
    slug: "monolith",
    title: "MONOLITH",
    category: "DESIGN SYSTEM",
    year: 2024,
    description:
      "A brutalist component system built on hard borders and typographic scale. No shadows, no radii, no apologies.",
    technologies: ["TYPESCRIPT", "REACT", "TAILWIND", "RADIX"],
    role: "DESIGN ENGINEER",
    status: "MAINTAINED",
    github: "https://github.com/malikfajar/monolith",
    detail: {
      overview:
        "Forty-one components sharing one rule system. Every spacing value, border weight, and type step derives from tokens, so a theme change is a token change.",
      problem:
        "Design systems drift. Six months in, there are nine button variants and four blues nobody can trace to a decision.",
      solution:
        "Tokens are the only source of truth, enforced by lint rules that reject raw hex and arbitrary spacing. Variants are a closed set, checked at the type level.",
      architecture: [
        "CSS custom properties as the single token layer",
        "Radix primitives for behaviour, zero opinion on visuals",
        "ESLint rule banning literal colours and off-scale spacing",
        "Type-level variant contracts — invalid combinations fail compilation",
        "Visual regression snapshots per component per theme",
      ],
      challenges: [
        "Contrast compliance with an aggressive accent colour required a computed-luminance token pass.",
        "Keeping focus states visible on high-contrast borders.",
        "Preventing token sprawl — additions require a written rationale.",
      ],
      results: [
        "41 components, 100% token coverage",
        "All interactive states meet WCAG AA contrast",
        "Bundle 22kb gzipped for the full set",
      ],
      shots: [
        { label: "TOKEN MAP", caption: "Full design token surface" },
        { label: "COMPONENT GRID", caption: "41 components, both themes" },
        { label: "CONTRAST AUDIT", caption: "Computed WCAG results" },
      ],
    },
  },
  {
    id: 7,
    slug: "signalpath",
    title: "SIGNALPATH",
    category: "OBSERVABILITY TOOLING",
    year: 2024,
    description:
      "Trace-driven latency attribution. Answers which span actually caused the p99, not which one looks slow.",
    technologies: ["GO", "CLICKHOUSE", "NEXT.JS", "OTEL"],
    role: "BACKEND / TOOLING",
    status: "ARCHIVED",
    github: "https://github.com/malikfajar/signalpath",
    detail: {
      overview:
        "Signalpath ingests OpenTelemetry traces and attributes tail latency to the span that caused it, using critical-path analysis rather than raw duration ranking.",
      problem:
        "Dashboards show that p99 got worse. They do not show why. Engineers guess, and the widest bar is usually not the culprit.",
      solution:
        "Reconstruct each trace's critical path, then aggregate contribution per span across the slow tail. The output is a ranked list of causes, not a wall of charts.",
      architecture: [
        "Go ingest service speaking OTLP, batched writes",
        "ClickHouse columnar store, materialised views per service",
        "Critical-path solver over the span DAG",
        "Next.js query UI with saved comparisons",
        "Sampling controller keeping ingest cost bounded",
      ],
      challenges: [
        "Incomplete traces from dropped spans — gap interpolation with confidence marking.",
        "ClickHouse query cost at high cardinality, tamed by pre-aggregation.",
        "Clock skew across services distorting the DAG.",
      ],
      results: [
        "Root-cause identification time down from hours to minutes",
        "Ingest of 80k spans/sec on a 3-node cluster",
        "Archived after the team adopted a vendor platform",
      ],
      shots: [
        { label: "CRITICAL PATH", caption: "Span DAG with causal path marked" },
        { label: "ATTRIBUTION", caption: "Ranked latency contributors" },
        { label: "COMPARISON", caption: "Before/after deploy diff" },
      ],
    },
  },
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
