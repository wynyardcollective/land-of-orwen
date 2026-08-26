import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { LORE_ARTICLES } from "@/content/lore";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Lore & Journal — ${SITE.name}`,
  description: `Stories and design notes from the drought-struck land of Orwen.`,
  alternates: { canonical: "/lore" },
};

export default function LoreIndexPage() {
  return (
    <SiteShell currentPath="/lore">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-amber-100">Lore & journal</h1>
        <p className="leading-relaxed text-muted-foreground">
          Short readings from Orwen — drought origins, tavern trade, combat, and
          the Rainward Gate. These pages are free to read without an account.
        </p>
      </header>
      <ul className="mt-8 space-y-4">
        {LORE_ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/lore/${article.slug}`}
              className="block rounded-xl border border-border/60 p-4 transition hover:border-amber-800/60 hover:bg-muted/20"
            >
              <p className="text-xs text-muted-foreground">{article.date}</p>
              <h2 className="mt-1 text-lg font-medium text-amber-100">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {article.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
