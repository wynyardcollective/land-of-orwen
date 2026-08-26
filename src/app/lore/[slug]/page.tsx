import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-chrome";
import { getLoreArticle, LORE_ARTICLES } from "@/content/lore";
import { SITE } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LORE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getLoreArticle(slug);
  if (!article) return { title: "Not found" };
  return {
    title: `${article.title} — ${SITE.name}`,
    description: article.summary,
    alternates: { canonical: `/lore/${article.slug}` },
  };
}

export default async function LoreArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getLoreArticle(slug);
  if (!article) notFound();

  return (
    <SiteShell currentPath="/lore">
      <article className="space-y-5">
        <p className="text-xs text-muted-foreground">
          <Link href="/lore" className="hover:text-amber-200 hover:underline">
            Lore
          </Link>{" "}
          · {article.date}
        </p>
        <h1 className="text-3xl font-semibold text-amber-100">{article.title}</h1>
        <p className="text-base text-stone-300">{article.summary}</p>
        <div className="space-y-4 leading-relaxed text-muted-foreground">
          {article.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
        <p className="pt-4 text-sm">
          <Link href="/play" className="text-amber-200 hover:underline">
            Play {SITE.name} →
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
