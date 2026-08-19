export type ProjectStatus = "SHIPPED" | "IN DEVELOPMENT" | "MAINTAINED" | "ARCHIVED" | "R&D";

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: number;
  description: string;
  technologies: string[];
  role: string;
  status: ProjectStatus;
  accent?: string;
  github?: string;
  demo?: string;
  detail: {
    overview: string;
    problem: string;
    solution: string;
    architecture: string[];
    challenges: string[];
    results: string[];
    shots: { label: string; caption: string }[];
  };
};

export type TechCategory = "FRONTEND" | "BACKEND" | "AI" | "DEVOPS" | "DESIGN" | "TOOLS";

export type TechLevel = "PRIMARY" | "STRONG" | "WORKING" | "EXPLORING";

export type Tech = {
  name: string;
  category: TechCategory;
  level: TechLevel;
  since: number;
  note: string;
};

export type TimelineEntry = {
  year: string;
  title: string[];
  body: string;
  tags: string[];
  place: string;
};

export type Repo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  updated: string;
  url: string;
};

export type LanguageStat = { name: string; percent: number };

export type ContributionDay = { date: string; count: number };

export type GithubStats = {
  handle: string;
  commits: number;
  repositories: number;
  projects: number;
  languagesCount: number;
  followers: number;
  languages: LanguageStat[];
  repos: Repo[];
  contributions: ContributionDay[];
  source: "mock" | "api";
};

export type NavSection = {
  id: string;
  index: string;
  label: string;
};
