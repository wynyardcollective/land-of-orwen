import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-chrome";
import { RoughHero } from "@/components/site/rough-hero";
import { LORE_ARTICLES } from "@/content/lore";
import { HOME_PILLARS, HOME_WORLD } from "@/content/marketing";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} — ${SITE.subtitle}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <RoughHero />
      <div className="site-ambient border-t border-border/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <section className="grid gap-4 sm:grid-cols-2">
            {HOME_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="wm-surface rounded-2xl border border-border/40 p-6 transition hover:border-amber-800/40"
              >
                <h2 className="font-heading text-lg font-semibold text-amber-100">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </article>
            ))}
          </section>

          <section className="site-prose mt-16 space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-amber-100">
              {HOME_WORLD.title}
            </h2>
            {HOME_WORLD.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>

          <section className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-heading text-2xl font-semibold text-amber-100">
                From the journal
              </h2>
              <Link
                href="/lore"
                className="text-sm text-amber-200/90 hover:underline"
              >
                All entries
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {LORE_ARTICLES.slice(0, 4).map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/lore/${article.slug}`}
                    className="wm-surface group block rounded-2xl border border-border/40 p-5 transition hover:border-amber-800/45"
                  >
                    <p className="text-xs text-muted-foreground">{article.date}</p>
                    <p className="mt-2 font-heading text-lg font-medium text-amber-100 transition group-hover:text-amber-50">
                      {article.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {article.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="wm-surface mt-16 rounded-2xl border border-border/40 p-8">
            <h2 className="font-heading text-xl font-semibold text-amber-100">
              Begin at Merrick&apos;s Orchard
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Guest play needs no signup. Create an account anytime to keep progress
              across devices.
            </p>
            <Link href="/play" className="site-cta-primary mt-6 inline-flex">
              Enter the game
            </Link>
          </section>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
