import type { Metadata } from "next";

export const site = {
  name: "Tech Journal",
  url: "https://example.com",
  description: "A personal tech journal: notes, experiments, and learnings.",
  author: "Anand",
};

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s · ${site.name}` },
    description: site.description,
    alternates: { types: { "application/rss+xml": `${site.url}/rss.xml` } },
    openGraph: {
      type: "website",
      url: site.url,
      title: site.name,
      description: site.description,
      siteName: site.name,
    },
    twitter: { card: "summary_large_image", title: site.name, description: site.description },
  };
}

export function postMetadata(opts: { title: string; description?: string; slug: string; date?: string }): Metadata {
  const url = `${site.url}/posts/${opts.slug}`;
  return {
    title: opts.title,
    description: opts.description ?? site.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: opts.title, description: opts.description ?? site.description },
  };
}
