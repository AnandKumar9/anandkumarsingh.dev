import { getAllTags, getPostsByTag } from "@/lib/posts";
import { site } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const title = `Tag: ${tag}`;
  const url = `${site.url}/tags/${encodeURIComponent(tag)}`;
  return { title, alternates: { canonical: url }, description: `Posts tagged "${tag}".` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);

  return (
    <div>
      <h1>Tag: {tag}</h1>
      <ul style={{ paddingLeft: 16 }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ marginBottom: 10 }}>
            <a href={`/posts/${p.slug}`}>{p.title}</a>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{p.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
