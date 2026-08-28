"use client";

import Link from "next/link";
import { Hero2, type NavLink } from "@/components/ui/hero-2";
import { HOME_HERO } from "@/content/marketing";
import { SITE } from "@/content/site";

const NAV: NavLink[] = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/lore" },
  { label: "Play", href: "/play" },
];

export function OrwenHero() {
  return (
    <Hero2
      className="min-h-[88vh] md:min-h-[92vh] bg-background selection:bg-amber-200/30 selection:text-amber-50"
      brand={SITE.name}
      navLinks={NAV}
      headline={
        <>
          Walk Orwen until
          <br />
          the sky{" "}
          <span className="font-serif italic text-amber-200/95">remembers rain.</span>
        </>
      }
      description={HOME_HERO.lead}
      primaryCtaLabel={HOME_HERO.primaryCta}
      primaryCtaHref="/play"
      secondaryCtaLabel={HOME_HERO.secondaryCta}
      secondaryCtaHref="/lore"
      signInLabel="Play"
      signInHref="/play"
      socialLinks={[
        { label: "Journal", href: "/lore" },
        { label: "About", href: "/about" },
        { label: "Privacy", href: "/privacy" },
      ]}
    />
  );
}

/** Watermelon-style top nav for inner pages */
export function OrwenSiteNav({ currentPath }: { currentPath?: string }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/lore", label: "Journal" },
    { href: "/play", label: "Play" },
  ];

  return (
    <header className="border-b border-border/50 bg-card/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="group min-w-0">
          <p className="truncate font-heading text-base font-semibold tracking-tight text-amber-100/95 transition group-hover:text-amber-50">
            {SITE.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{SITE.subtitle}</p>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-1">
          {links.map((item) => {
            const active = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-amber-300/80"
                    aria-hidden
                  />
                )}
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/play"
            className="ml-1 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.18)] transition hover:brightness-110"
          >
            Play
          </Link>
        </nav>
      </div>
    </header>
  );
}
