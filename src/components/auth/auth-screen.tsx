"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

export function AuthScreen() {
  const { login, register, error, clearError, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroName, setHeroName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, heroName || "Wanderer");
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
    return (
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6 text-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.35_0.04_70)_0%,_transparent_55%),linear-gradient(180deg,_oklch(0.16_0.02_70),_oklch(0.2_0.03_85))]"
        />
        <p role="status" className="relative">
          Checking your account…
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,_oklch(0.42_0.06_85/_0.45)_0%,_transparent_50%),radial-gradient(ellipse_at_80%_90%,_oklch(0.28_0.04_50/_0.5)_0%,_transparent_45%),linear-gradient(165deg,_oklch(0.15_0.02_70),_oklch(0.22_0.03_80))]"
      />
      <div
        aria-hidden
        className="auth-drift pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-amber-200/10 blur-3xl"
      />
      <div
        aria-hidden
        className="auth-drift-slow pointer-events-none absolute -right-10 bottom-16 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="font-heading text-4xl font-bold tracking-tight text-amber-100 sm:text-5xl">
            The Land of Orwen
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {mode === "login"
              ? "Sign in to continue your journey."
              : "Create an account to begin wandering Orwen."}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur sm:p-6"
          aria-labelledby="auth-heading"
        >
          <h1 id="auth-heading" className="text-lg font-semibold">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="hero-name">Hero name</Label>
              <Input
                id="hero-name"
                name="heroName"
                autoComplete="nickname"
                maxLength={24}
                placeholder="Wanderer"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
              />
            </div>
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
            />
            {mode === "register" && (
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="h-11 w-full" disabled={busy}>
            {busy
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New to Orwen?{" "}
                <button
                  type="button"
                  className="font-medium text-amber-200 underline-offset-4 hover:underline"
                  onClick={() => switchMode("register")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already wandering?{" "}
                <button
                  type="button"
                  className="font-medium text-amber-200 underline-offset-4 hover:underline"
                  onClick={() => switchMode("login")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
