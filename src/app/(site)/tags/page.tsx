import { getAllTags } from "@/lib/posts";

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <div>
      <h1>Tags</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map(({ tag, count }) => (
          <a key={tag} href={`/tags/${encodeURIComponent(tag)}`} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 999 }}>
            {tag} <span style={{ opacity: 0.6 }}>({count})</span>
          </a>
        ))}
      </div>
    </div>
  );
}
