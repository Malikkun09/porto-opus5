import type { Tech, TechCategory } from "@/types";

export const techCategories: TechCategory[] = [
  "FRONTEND",
  "BACKEND",
  "AI",
  "DEVOPS",
  "DESIGN",
  "TOOLS",
];

export const stack: Tech[] = [
  { name: "TYPESCRIPT", category: "FRONTEND", level: "PRIMARY", since: 2021, note: "TYPE-FIRST" },
  { name: "REACT", category: "FRONTEND", level: "PRIMARY", since: 2021, note: "COMPOSITION" },
  { name: "NEXT.JS", category: "FRONTEND", level: "PRIMARY", since: 2022, note: "APP ROUTER" },
  { name: "TAILWIND", category: "FRONTEND", level: "STRONG", since: 2022, note: "TOKENS" },
  { name: "GSAP", category: "FRONTEND", level: "STRONG", since: 2023, note: "SCROLL SYSTEMS" },
  { name: "WEBGL / GLSL", category: "FRONTEND", level: "WORKING", since: 2024, note: "SHADERS" },

  { name: "LARAVEL", category: "BACKEND", level: "PRIMARY", since: 2021, note: "PRODUCT APIS" },
  { name: "NODE", category: "BACKEND", level: "STRONG", since: 2021, note: "SERVICES" },
  { name: "POSTGRES", category: "BACKEND", level: "STRONG", since: 2022, note: "MODELLING" },
  { name: "MYSQL", category: "BACKEND", level: "STRONG", since: 2021, note: "OLTP" },
  { name: "REDIS", category: "BACKEND", level: "WORKING", since: 2023, note: "QUEUES" },
  { name: "GO", category: "BACKEND", level: "WORKING", since: 2024, note: "INGEST PATHS" },

  { name: "PYTHON", category: "AI", level: "PRIMARY", since: 2022, note: "PIPELINES" },
  { name: "PYTORCH", category: "AI", level: "STRONG", since: 2023, note: "FINE-TUNING" },
  { name: "LLM SYSTEMS", category: "AI", level: "PRIMARY", since: 2023, note: "AGENTS / RAG" },
  { name: "ONNX", category: "AI", level: "WORKING", since: 2024, note: "EDGE INFERENCE" },
  { name: "OPENCV", category: "AI", level: "WORKING", since: 2024, note: "VISION PREP" },
  { name: "VECTOR DB", category: "AI", level: "WORKING", since: 2024, note: "RETRIEVAL" },

  { name: "DOCKER", category: "DEVOPS", level: "STRONG", since: 2022, note: "REPRODUCIBLE" },
  { name: "GITHUB ACTIONS", category: "DEVOPS", level: "STRONG", since: 2022, note: "CI" },
  { name: "LINUX", category: "DEVOPS", level: "STRONG", since: 2020, note: "DAILY DRIVER" },
  { name: "VERCEL", category: "DEVOPS", level: "STRONG", since: 2022, note: "EDGE DEPLOY" },
  { name: "NGINX", category: "DEVOPS", level: "WORKING", since: 2023, note: "ON-PREM" },
  { name: "OBSERVABILITY", category: "DEVOPS", level: "EXPLORING", since: 2024, note: "OTEL" },

  { name: "TYPE SYSTEMS", category: "DESIGN", level: "PRIMARY", since: 2022, note: "HIERARCHY" },
  { name: "MOTION DESIGN", category: "DESIGN", level: "STRONG", since: 2023, note: "CHOREOGRAPHY" },
  { name: "FIGMA", category: "DESIGN", level: "STRONG", since: 2021, note: "SPEC" },
  { name: "DESIGN TOKENS", category: "DESIGN", level: "PRIMARY", since: 2023, note: "SYSTEMS" },
  { name: "ACCESSIBILITY", category: "DESIGN", level: "STRONG", since: 2022, note: "WCAG AA" },
  { name: "EDITORIAL LAYOUT", category: "DESIGN", level: "WORKING", since: 2024, note: "GRIDS" },

  { name: "GIT", category: "TOOLS", level: "PRIMARY", since: 2020, note: "ATOMIC COMMITS" },
  { name: "NEOVIM", category: "TOOLS", level: "PRIMARY", since: 2021, note: "MUSCLE MEMORY" },
  { name: "PLAYWRIGHT", category: "TOOLS", level: "STRONG", since: 2023, note: "E2E" },
  { name: "VITEST", category: "TOOLS", level: "STRONG", since: 2023, note: "UNIT" },
  { name: "CLICKHOUSE", category: "TOOLS", level: "WORKING", since: 2024, note: "ANALYTICS" },
  { name: "FFMPEG", category: "TOOLS", level: "EXPLORING", since: 2025, note: "MEDIA" },
];
