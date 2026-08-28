import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { LORE_ARTICLES } from "@/content/lore";
import {
  HOME_HERO,
  HOME_PILLARS,
  HOME_WORLD,
} from "@/content/marketing";
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
    <SiteShell currentPath="/">
      <section className="site-hero relative overflow-hidden rounded-2xl border border-amber-900/35 px-6 py-16 sm:px-10 sm:py-24">
        <div className="relative z-[1] max-w-2xl space-y-6">
          <p className="text-xs font-medium tracking-[0.22em] text-amber-200/75 uppercase">
            {HOME_HERO.eyebrow}
          </p>
          <h1 className="font-heading text-3xl leading-[1.15] font-semibold text-stone-50 sm:text-4xl sm:leading-tight">
            {HOME_HERO.title}
          </h1>
          <p className="text-base leading-relaxed text-stone-300 sm:text-lg">
            {HOME_HERO.lead}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/play" className="site-cta-primary">
              {HOME_HERO.primaryCta}
            </Link>
            <Link href="/lore" className="site-cta-secondary">
              {HOME_HERO.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        {HOME_PILLARS.map((pillar) => (
          <article
            key={pillar.title}
            className="site-card rounded-xl border border-border/50 p-5 sm:p-6"
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
                className="site-card group block rounded-xl border border-border/50 p-5 transition hover:border-amber-800/50"
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

      <section className="site-card mt-16 rounded-2xl border border-border/50 p-6 sm:p-8">
        <h2 className="font-heading text-xl font-semibold text-amber-100">
          Begin at Merrick&apos;s Orchard
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Guest play needs no signup. Create an account anytime to keep progress
          across devices. Swift pace in Settings shortens first journeys while
          you learn the map.
        </p>
        <Link href="/play" className="site-cta-primary mt-6 inline-flex">
          {HOME_HERO.primaryCta}
        </Link>
      </section>
    </SiteShell>
  );
}
