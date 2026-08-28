"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { SITE } from "@/content/site";
import { PLAY_WAYPOINTS } from "@/content/play";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function PlayEntranceNav() {
  return (
    <header className="relative z-20 border-b border-border/40 bg-background/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3 sm:max-w-md">
        <Link href="/" className="group min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-amber-100/95 transition group-hover:text-amber-50">
            {SITE.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{SITE.subtitle}</p>
        </Link>
        <nav className="flex items-center gap-2 text-xs sm:text-sm">
          <Link
            href="/lore"
            className="rounded-full px-2.5 py-1 text-muted-foreground transition hover:text-foreground"
          >
            Journal
          </Link>
          <Link
            href="/"
            className="rounded-full px-2.5 py-1 text-muted-foreground transition hover:text-foreground"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PlayWaypointTrail() {
  const reduced = usePrefersReducedMotion();

  return (
    <ol
      className="flex items-center justify-center gap-1 sm:gap-2"
      aria-label="Journey ahead"
    >
      {PLAY_WAYPOINTS.map((point, i) => (
        <li key={point.label} className="flex items-center gap-1 sm:gap-2">
          <span className="flex flex-col items-center gap-1">
            <motion.span
              className={cn(
                "relative flex size-2.5 rounded-full sm:size-3",
                point.active
                  ? "bg-amber-300 shadow-[0_0_12px_oklch(0.82_0.12_85/_0.55)]"
                  : "bg-muted-foreground/35",
              )}
              animate={
                reduced || !point.active
                  ? undefined
                  : { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }
              }
              transition={
                reduced || !point.active
                  ? undefined
                  : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
              }
            />
            <span
              className={cn(
                "text-[10px] uppercase tracking-wide sm:text-[11px]",
                point.active ? "text-amber-200/90" : "text-muted-foreground/70",
              )}
            >
              {point.label}
            </span>
          </span>
          {i < PLAY_WAYPOINTS.length - 1 && (
            <span
              className="mb-4 h-px w-6 bg-gradient-to-r from-amber-800/50 to-transparent sm:w-8"
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}

export function PlayEntrance({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <img
          src="https://assets.watermelon.sh/hero-2.avif"
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center opacity-35",
            !reduced && "play-bg-pan",
          )}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,oklch(0.38_0.06_85/_0.4),transparent_55%),linear-gradient(180deg,oklch(0.12_0.02_70/_0.15),oklch(0.14_0.02_70/_0.94))]"
        />
        <div
          className={cn(
            "auth-drift absolute -left-20 top-32 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl",
            reduced && "opacity-60",
          )}
        />
        <div
          className={cn(
            "auth-drift-slow absolute -right-16 bottom-24 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl",
            reduced && "opacity-60",
          )}
        />
      </div>

      <PlayEntranceNav />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
