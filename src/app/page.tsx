import { getGithubStats } from "@/lib/github";
import { PageShell } from "@/components/layout/PageShell";

/**
 * Server component. Data is fetched here so the mock→API swap in lib/github
 * never touches the client bundle.
 */
export default async function Home() {
  const stats = await getGithubStats();
  return <PageShell stats={stats} />;
}
