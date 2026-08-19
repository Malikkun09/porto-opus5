import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/lib/constants";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { site } from "@/data/site";
import "./globals.css";

/**
 * Archivo (variable grotesk) for display, JetBrains Mono for everything else.
 * next/font self-hosts and preloads — no render-blocking third-party request,
 * and `display: swap` keeps first paint from waiting on the face.
 */
const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — AI ENGINEER / FULLSTACK / CREATIVE TECHNOLOGIST`,
  description:
    "I build software, interfaces, and systems that refuse to stay boring. Selected work in AI systems, offline-first products, and creative engineering.",
  metadataBase: new URL("https://malikfajar.dev"),
  openGraph: {
    title: `${site.name} — DEVELOPER PORTFOLIO`,
    description: "AI systems, fullstack products, and creative engineering.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a09" },
  ],
};

/**
 * Theme is resolved before first paint by this blocking script, so there is no
 * flash and the server never guesses — it always renders data-theme="light" and
 * the script corrects it before the browser paints.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${mono.variable}`}>
        <a href="#main" className="skip-link">
          SKIP TO CONTENT
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
