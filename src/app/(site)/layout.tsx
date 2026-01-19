import "../globals.css";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata();

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 760, margin: "48px auto", padding: "0 16px" }}>
      <header style={{ marginBottom: 24 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: "none" }}>Tech Journal</a>
        <nav style={{ marginTop: 8, display: "flex", gap: 12 }}>
          <a href="/">Posts</a>
          <a href="/rss.xml">RSS</a>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>
      </header>
      {children}
      <footer style={{ marginTop: 48, opacity: 0.7, fontSize: 13 }}>
        © {new Date().getFullYear()} · Built with Next.js
      </footer>
    </main>
  );
}
