import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

// const postsDirectory = path.join(
//   process.cwd(),
//   "src/content/posts"
// );

// export function getAllPosts() {
//   return fs.readdirSync(postsDirectory);
// }

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO-ish
  tags: string[];
  summary?: string;
};

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

function slugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

export function getAllPostsMeta(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const metas = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: slugFromFilename(file),
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: data.summary ? String(data.summary) : undefined,
    } satisfies PostMeta;
  });
  // newest first
  metas.sort((a, b) => (a.date < b.date ? 1 : -1));
  return metas;
}

export function getPostBySlug(slug: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    summary: data.summary ? String(data.summary) : undefined,
  };
  return { meta, content };
}

export async function markdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export function getAllTags() {
  const posts = getAllPostsMeta();
  const map = new Map<string, { tag: string; count: number }>();
  for (const p of posts) {
    for (const t of p.tags) {
      const key = normalizeTag(t);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { tag: t, count: 1 });
      }
    }
  }
  return Array.from(map.entries())
    .map(([, value]) => value)
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string) {
  const key = normalizeTag(tag);
  return getAllPostsMeta().filter((p) => p.tags.some((t) => normalizeTag(t) === key));
}
