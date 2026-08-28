"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  Footprints,
  Sparkles,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import {
  PlayEntrance,
  PlayWaypointTrail,
} from "./play-entrance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadLocalSave } from "@/lib/game/save";
import {
  PLAY_FLAVOR_LINES,
  PLAY_LOADING_LINES,
} from "@/content/play";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

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

function useRotatingLine(lines: readonly string[], intervalMs = 4200) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || lines.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [lines, intervalMs, reduced]);

  return lines[index];
}

function PlayLoading() {
  const line = useRotatingLine(PLAY_LOADING_LINES, 2200);
  const reduced = usePrefersReducedMotion();

  return (
    <PlayEntrance>
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.div
          className="flex gap-2"
          initial={false}
          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={
            reduced ? undefined : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
          }
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-amber-300/90 shadow-[0_0_10px_oklch(0.82_0.12_85/_0.45)]"
            />
          ))}
        </motion.div>
        <p role="status" className="text-sm text-muted-foreground">{line}</p>
      </div>
    </PlayEntrance>
  );
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function AuthScreen() {
  const { login, register, startGuest, error, clearError, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroName, setHeroName] = useState("");
  const [busy, setBusy] = useState(false);
  const [localHero, setLocalHero] = useState("Wanderer");
  const [hasLocalSave, setHasLocalSave] = useState(false);
  const flavorLine = useRotatingLine(PLAY_FLAVOR_LINES);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const local = loadLocalSave();
    setHasLocalSave(!!local);
    if (local?.heroName?.trim()) setLocalHero(local.heroName.trim());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const local = loadLocalSave();
        await register(
          email,
          password,
          heroName || local?.heroName || "Wanderer",
          { state: local },
        );
      }
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    clearError();
    setMode(next);
  }

  if (loading) {
    return <PlayLoading />;
  }

  const motionProps = reduced
    ? { initial: false, animate: "visible", variants: stagger }
    : { initial: "hidden", animate: "visible", variants: stagger };

  return (
    <PlayEntrance>
      <motion.div
        className="w-full max-w-md"
        {...motionProps}
      >
        <motion.header variants={rise} className="mb-6 text-center sm:mb-8">
          <p className="font-heading text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
            Enter Orwen
          </p>
          <div className="relative mt-3 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={flavorLine}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-sm text-stone-300 sm:text-base"
              >
                {flavorLine}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-5">
            <PlayWaypointTrail />
          </div>
        </motion.header>

        <motion.div variants={rise} className="mb-5">
          <button
            type="button"
            onClick={() => {
              clearError();
              startGuest();
            }}
            className="group wm-surface relative w-full overflow-hidden rounded-2xl border border-amber-700/35 p-5 text-left transition hover:border-amber-500/50 hover:shadow-[0_0_40px_oklch(0.82_0.12_85/_0.12)] sm:p-6"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
              aria-hidden
            />
            <div className="relative flex items-start gap-4">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-amber-400/25"
              >
                <Footprints className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-heading text-lg font-semibold text-amber-50">
                  {hasLocalSave ? "Continue your journey" : "Walk as guest"}
                  <Sparkles className="size-4 text-amber-300/80" aria-hidden />
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {hasLocalSave
                    ? "Your road is saved in this browser. Step back onto it now — account optional."
                    : "No signup. Start at Merrick's Orchard and keep progress on this device."}
                </p>
              </div>
              <ArrowRight
                className="mt-1 size-5 shrink-0 text-amber-200/70 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </div>
          </button>
        </motion.div>

        <motion.div variants={rise} className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            or sync across devices
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </motion.div>

        <motion.div
          variants={rise}
          className="wm-surface rounded-2xl border border-border/40 p-5 sm:p-6"
        >
          <div
            className="relative mb-5 grid grid-cols-2 gap-1 rounded-full bg-muted/40 p-1"
            role="tablist"
            aria-label="Account mode"
          >
            {(["login", "register"] as Mode[]).map((tab) => {
              const active = mode === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchMode(tab)}
                  className={cn(
                    "relative z-10 rounded-full py-2 text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab === "login" ? "Sign in" : "Create account"}
                  {active && !reduced && (
                    <motion.span
                      layoutId="playAuthTab"
                      className="absolute inset-0 -z-10 rounded-full bg-card shadow-[0_0_0_1px_oklch(1_0_0/_0.06),0_4px_12px_rgba(0,0,0,0.15)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {active && reduced && (
                    <span
                      className="absolute inset-0 -z-10 rounded-full bg-card shadow-[0_0_0_1px_oklch(1_0_0/_0.06)]"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={onSubmit}
              initial={reduced ? false : { opacity: 0, x: mode === "login" ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: mode === "login" ? 12 : -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-4"
              aria-labelledby="auth-heading"
            >
              <h1 id="auth-heading" className="text-base font-semibold text-amber-100/95">
                {mode === "login"
                  ? "Welcome back, wanderer"
                  : "Name your hero and save the road"}
              </h1>

              {mode === "register" && (
                <>
                  {hasLocalSave && (
                    <p className="rounded-xl border border-amber-800/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100/90">
                      Guest progress on this device will move to your new account.
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="hero-name">Hero name</Label>
                    <Input
                      id="hero-name"
                      name="heroName"
                      autoComplete="nickname"
                      maxLength={24}
                      placeholder={localHero}
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      className="h-10 rounded-xl bg-background/40"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl bg-background/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-xl bg-background/40"
                />
                {mode === "register" && (
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                )}
              </div>

              {error && (
                <motion.p
                  role="alert"
                  initial={reduced ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.2)]"
                disabled={busy}
              >
                {busy
                  ? mode === "login"
                    ? "Signing in…"
                    : "Creating account…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        <motion.p
          variants={rise}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <Link href="/about" className="hover:text-amber-200 hover:underline">
            About
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-amber-200 hover:underline">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-amber-200 hover:underline">
            Terms
          </Link>
        </motion.p>
      </motion.div>
    </PlayEntrance>
  );
}
