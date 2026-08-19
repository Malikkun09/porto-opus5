import type { NavSection } from "@/types";

export const site = {
  name: "MALIK FAJAR",
  first: "MALIK",
  last: "FAJAR",
  roles: ["AI ENGINEER", "FULLSTACK DEVELOPER", "CREATIVE TECHNOLOGIST"],
  location: "BASED IN INDONESIA",
  timezone: "Asia/Jakarta",
  availability: "AVAILABLE FOR SELECTED PROJECTS",
  status: "BUILDING",
  email: "hello@malikfajar.dev",
  github: "https://github.com/malikfajar",
  linkedin: "https://linkedin.com/in/malikfajar",
  year: 2026,
  statement: ["I BUILD DIGITAL", "SYSTEMS, INTERFACES,", "AND EXPERIENCES."],
  bio: [
    "I build software, interfaces, and systems that refuse to stay boring. Most of my work sits where machine learning meets an actual product surface — the part where a model has to survive contact with real users, bad networks, and legal constraints.",
    "I care about the layer nobody screenshots: the data model, the failure path, the thing that keeps working when the connection drops. Then I make it look like a decision rather than an accident.",
  ],
  marquee: [
    "AI ENGINEER",
    "SOFTWARE DEVELOPER",
    "DESIGNER",
    "CREATIVE TECHNOLOGIST",
    "SYSTEMS THINKER",
  ],
} as const;

export const sections: NavSection[] = [
  { id: "hero", index: "001", label: "INDEX" },
  { id: "about", index: "002", label: "ABOUT" },
  { id: "stack", index: "003", label: "STACK" },
  { id: "work", index: "004", label: "WORK" },
  { id: "experience", index: "005", label: "TIMELINE" },
  { id: "activity", index: "006", label: "ACTIVITY" },
  { id: "lab", index: "007", label: "LAB" },
  { id: "contact", index: "008", label: "CONTACT" },
];

export const navLinks: NavSection[] = sections.filter((s) =>
  ["about", "work", "lab", "contact"].includes(s.id),
);
