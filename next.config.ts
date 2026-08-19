import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The generated AGENTS.md/CLAUDE.md files are noise in a portfolio repo.
  agentRules: false,
  // Type errors must fail the build, not be deferred to review.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
