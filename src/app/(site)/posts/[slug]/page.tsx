import { getAllPostsMeta, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { postMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getAllPostsMeta();
  const meta = all.find((p) => p.slug === slug);
  if (!meta) return {};
  return postMetadata({ title: meta.title, description: meta.summary, slug: meta.slug, date: meta.date });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getAllPostsMeta();
  if (!all.some((p) => p.slug === slug)) notFound();

  const { meta, content } = getPostBySlug(slug);
  const html = await markdownToHtml(content);

  return (
    <article className="post">
      <h1 className="post-title">{meta.title}</h1>
      <div className="post-meta" style={{ opacity: 0.7, marginBottom: 16 }}>
        {meta.date} · {meta.tags.map((t) => (
          <a key={t} href={`/tags/${encodeURIComponent(t)}`} style={{ marginRight: 8 }}>{t}</a>
        ))}
      </div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
