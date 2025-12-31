import { getAllPostsMeta, getAllTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPostsMeta();
  const tags = getAllTags();

  return (
    <div>
      <h1 style={{ margin: "0 0 12px" }}>Notes</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>Short, dated entries. Tags for retrieval.</p>

      <section style={{ margin: "24px 0" }}>
        <h2 style={{ fontSize: 16 }}>Tags</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map(({ tag, count }) => (
            <a key={tag} href={`/tags/${encodeURIComponent(tag)}`} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 999 }}>
              {tag} <span style={{ opacity: 0.6 }}>({count})</span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 16 }}>Latest</h2>
        <ul style={{ paddingLeft: 16 }}>
          {posts.map((p) => (
            <li key={p.slug} style={{ marginBottom: 10 }}>
              <a href={`/posts/${p.slug}`}>{p.title}</a>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {p.date} · {p.tags.join(", ")}
              </div>
              {p.summary ? <div style={{ opacity: 0.85 }}>{p.summary}</div> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
