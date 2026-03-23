# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static blog site ("Tech Journal") built with Next.js 16 and React 19. Posts are markdown files stored in `src/content/posts/`, parsed with gray-matter for frontmatter metadata, and converted to HTML using unified/remark/rehype. The site is deployed as a static export to GitHub Pages.

## Common Commands

- **`npm run dev`** — Start development server at http://localhost:3000 with hot reload
- **`npm run build`** — Build static export to `/out` (required before deploying to GitHub Pages)
- **`npm run lint`** — Run ESLint with Next.js rules; uses flat config in `eslint.config.mjs`
- **`npm start`** — Start production server (rarely used; this is a static site)

## Architecture & Data Flow

### Markdown Blog System

**Post Files**: Located in `src/content/posts/`, each `.md` file contains YAML frontmatter and markdown content:
```yaml
---
title: "Post Title"
date: "2026-03-23"
tags: ["tag1", "tag2"]
summary: "Optional summary"
---
Markdown content here...
```

**Metadata Parsing** (`src/lib/posts.ts`):
- `getAllPostsMeta()` — Reads all posts, extracts frontmatter, sorts newest-first by date
- `getPostBySlug(slug)` — Reads a single post by filename (slug)
- `markdownToHtml(markdown)` — Converts markdown to HTML using unified pipeline (remark-parse → remark-gfm → remark-rehype → rehype-stringify)
- `getAllTags()` — Extracts and counts all tags across posts
- `getPostsByTag(tag)` — Filters posts by tag (case-insensitive)

### Site Structure

- **Root layout** (`src/app/layout.tsx`) — Sets up fonts (Geist), global CSS, base metadata
- **Site layout** (`src/app/(site)/layout.tsx`) — Route group with header, footer, max-width container (760px); includes site metadata
- **Home page** (`src/app/(site)/page.tsx`) — Lists tags (with counts) and latest posts in reverse chronological order
- **Post detail page** (`src/app/(site)/posts/[slug]/page.tsx`) — Renders individual post with:
  - `generateStaticParams()` for static generation of all post pages
  - `generateMetadata()` for per-post SEO metadata
  - HTML sanitized via `dangerouslySetInnerHTML` (safe because content comes from trusted markdown files)
- **Tag page** (`src/app/(site)/tags/[tag]/page.tsx`) — Lists posts with a specific tag

### SEO & Metadata

`src/lib/seo.ts` centralizes metadata generation:
- `baseMetadata()` — Site-level OpenGraph, Twitter card, RSS alternates
- `postMetadata()` — Per-post OpenGraph/Twitter metadata with canonical URLs
- Update `site.url` in `seo.ts` when deploying to a custom domain

## Build & Deployment

**Static Export**: `next.config.ts` sets `output: "export"` and `images: { unoptimized: true }`. This outputs static HTML/CSS/JS to `/out` for GitHub Pages deployment. There is no Node.js backend.

**URL Path Aliases**: `tsconfig.json` defines `@/*` → `src/*` for cleaner imports.

## Writing Posts

1. Create a new `.md` file in `src/content/posts/` (e.g., `my-post.md`)
2. Add YAML frontmatter with `title`, `date` (ISO format), `tags`, and optional `summary`
3. Write markdown below the closing `---`
4. Run `npm run build` to regenerate static pages; `npm run dev` during authoring
5. Post slug is derived from filename (strips `.md`); link as `/posts/my-post`

## Styling

- **CSS-in-JS**: Inline `style` objects in React components (no CSS modules)
- **Tailwind CSS 4**: Available via `tailwindcss` (PostCSS integration in `postcss.config.mjs`), but currently not heavily used
- **Global styles**: `src/app/globals.css` imported in root layout
- **Post content**: `.post-content` div receives sanitized HTML; style with class selectors in `globals.css` if needed

## TypeScript & Linting

- **Strict mode enabled**: `tsconfig.json` has `strict: true`
- **ESLint flat config**: `eslint.config.mjs` uses flat config format with Next.js core-web-vitals and TypeScript rules
- **No explicit build errors**: `tsconfig.json` has `noEmit: true` (type checking only; esbuild/Next.js does compilation)
