import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { LORE_ARTICLES } from "@/content/lore";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} — Idle RPG on ${SITE.domain}`,
  },
  description: SITE.tagline,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <section className="relative overflow-hidden rounded-2xl border border-amber-900/40 bg-[radial-gradient(ellipse_at_top,_#292524_0%,_#0c0a09_70%)] px-5 py-14 sm:px-8 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60 L30 0 L60 60' fill='none' stroke='%233f3a32' stroke-width='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative space-y-5">
          <p className="text-sm font-medium tracking-[0.2em] text-amber-200/80 uppercase">
            {SITE.name}
          </p>
          <h1 className="max-w-xl text-3xl leading-tight font-semibold text-stone-50 sm:text-4xl">
            Idle through a drought-struck countryside — and earn the rain back.
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-stone-300">
            {SITE.tagline} Travel the map, wait out timed quests and fights, buy
            tavern rumors, and keep progress in the cloud.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/play"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Play free
            </Link>
            <Link
              href="/lore"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/70 bg-background/40 px-5 text-sm font-medium text-foreground transition hover:bg-muted/50"
            >
              Read the lore
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold text-amber-100">How Orwen plays</h2>
        <p className="leading-relaxed text-muted-foreground">
          The Land of Orwen is a browser idle RPG. You travel between named
          places on a countryside map, start quests or threats, and let real
          time pass while your hero works. Success depends on Strength,
          Dexterity, Intelligence, and the quieter attributes — Constitution,
          Wisdom, and Charisma — raised by gear, gems, and streaks.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Map & travel</strong> — unlock
            roads through quests or tavern leads; secret places stay hidden
            until rumors pan out.
          </li>
          <li>
            <strong className="text-foreground">Idle combat</strong> — paced
            rounds with hit and miss chance, stances versus enemy weakness, and
            health that persists between battles.
          </li>
          <li>
            <strong className="text-foreground">Taverns</strong> — spend gold to
            listen for secret locations, early routes, and journal intel — or
            rest to recover HP.
          </li>
          <li>
            <strong className="text-foreground">Cloud saves</strong> — create an
            account, then progress syncs to Cloudflare-backed storage with a
            local cache.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold text-amber-100">
          Why the land is thirsty
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Orwen&apos;s drought is sudden and complete. Irrigation ditches hold
          memory instead of mud. Traders smash gauges for coin. Somewhere behind
          a sealed shrine, a gate remembers rain — if you can learn the order of
          its symbols and carry a ring that does the same.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The game is original fiction inspired by the pacing of classic idle
          RPGs. It is free to play at {SITE.domain}. No download is required.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-amber-100">From the journal</h2>
        <ul className="space-y-4">
          {LORE_ARTICLES.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/lore/${article.slug}`}
                className="block rounded-xl border border-border/60 p-4 transition hover:border-amber-800/60 hover:bg-muted/20"
              >
                <p className="text-xs text-muted-foreground">{article.date}</p>
                <p className="mt-1 font-medium text-amber-100">{article.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/lore" className="text-sm text-amber-200/90 hover:underline">
          All lore entries →
        </Link>
      </section>

      <section className="mt-12 rounded-xl border border-border/60 bg-muted/20 p-5">
        <h2 className="text-lg font-semibold text-amber-100">Ready to wander?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a free account, name your hero, and begin at Merrick&apos;s
          Orchard. Settings include Swift pace for shorter waits while you learn
          the map.
        </p>
        <Link
          href="/play"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Enter the game
        </Link>
      </section>
    </SiteShell>
  );
}
