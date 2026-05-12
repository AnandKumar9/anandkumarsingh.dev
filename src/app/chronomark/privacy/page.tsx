import { getPageContent, markdownToHtml } from "@/lib/posts";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Privacy Policy",
  description: "Chronomark privacy policy",
};

export default async function PrivacyPage() {
  try {
    const content = getPageContent("privacy");
    const html = await markdownToHtml(content);

    return (
      <article className="post">
        <h1 className="post-title">Privacy Policy</h1>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    );
  } catch {
    notFound();
  }
}
