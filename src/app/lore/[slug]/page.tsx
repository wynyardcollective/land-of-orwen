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
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/lore/${article.slug}` },
  };
}

export default async function LoreArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getLoreArticle(slug);
  if (!article) notFound();

  const related = LORE_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <SiteShell currentPath="/lore">
      <article className="site-prose max-w-3xl">
        <p className="text-xs text-muted-foreground">
          <Link href="/lore" className="hover:text-amber-200 hover:underline">
            Journal
          </Link>
          {" · "}
          {article.date}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-amber-100 sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-300">
          {article.summary}
        </p>
        <div className="mt-8 space-y-5">
          {article.body.map((para) => (
            <p key={para.slice(0, 32)} className="leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14 border-t border-border/50 pt-10">
          <h2 className="font-heading text-lg font-semibold text-amber-100">
            Continue reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/lore/${r.slug}`}
                  className="block rounded-lg border border-border/50 p-3 text-sm transition hover:border-amber-800/50 hover:bg-muted/20"
                >
                  <span className="font-medium text-amber-100">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10">
        <Link href="/play" className="site-cta-primary inline-flex">
          Play {SITE.name}
        </Link>
      </p>
    </SiteShell>
  );
}
