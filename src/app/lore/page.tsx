import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { LORE_ARTICLES } from "@/content/lore";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Long-form journal entries from the drought country of rough — orchards, taverns, combat on the road, and the Rainward Gate.",
  alternates: { canonical: "/lore" },
};

export default function LoreIndexPage() {
  return (
    <SiteShell currentPath="/lore">
      <header className="site-prose max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-amber-100 sm:text-4xl">
          Journal of rough
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-300">
          Field notes and road prose from the drought — how Merrick&apos;s ledgers
          broke, what taverns sell when ale runs thin, and why the sealed shrine
          still expects rain. These entries are written to be read, not skimmed.
        </p>
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {LORE_ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/lore/${article.slug}`}
              className="wm-surface group block rounded-2xl border border-border/40 p-5 transition hover:border-amber-800/45"
            >
              <p className="text-xs text-muted-foreground">{article.date}</p>
              <h2 className="mt-2 font-heading text-lg font-medium text-amber-100 transition group-hover:text-amber-50">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {article.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
