"use client";

import { useState } from "react";
import { useGame, paceLabel } from "./game-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FontScale, Pace } from "@/lib/game";

export function SettingsDialog() {
  const { state, patchSettings, resetGame, isGuest } = useGame();
  const { user, logout, register, endGuest, error, clearError } = useAuth();
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroName, setHeroName] = useState("");
  const [busy, setBusy] = useState(false);
  const s = state.settings;

  async function onCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    clearError();
    try {
      const ok = await register(
        email,
        password,
        heroName.trim() || state.heroName || "Wanderer",
        { state },
      );
      if (ok) {
        setShowUpgrade(false);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        Settings
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setShowUpgrade(false);
            clearError();
          }
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Accessibility, pace, and journey options for Orwen.
            </DialogDescription>
          </DialogHeader>

          <section className="space-y-4" aria-labelledby="a11y-heading">
            <h3 id="a11y-heading" className="text-sm font-semibold">
              Accessibility
            </h3>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="high-contrast">High contrast</Label>
              <Switch
                id="high-contrast"
                checked={s.highContrast}
                onCheckedChange={(v) => patchSettings({ highContrast: !!v })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tips">Tutorial tips</Label>
              <Switch
                id="tips"
                checked={s.tutorialTips}
                onCheckedChange={(v) => patchSettings({ tutorialTips: !!v })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="motion">Reduce motion</Label>
              <Switch
                id="motion"
                checked={s.reducedMotion}
                onCheckedChange={(v) => patchSettings({ reducedMotion: !!v })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-scale">Font scale</Label>
              <select
                id="font-scale"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={s.fontScale}
                onChange={(e) =>
                  patchSettings({ fontScale: e.target.value as FontScale })
                }
                aria-label="Font scale"
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra large</option>
              </select>
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="play-heading">
            <h3 id="play-heading" className="text-sm font-semibold">
              Play
            </h3>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="sound">Sound cues</Label>
              <Switch
                id="sound"
                checked={s.soundEnabled}
                onCheckedChange={(v) => patchSettings({ soundEnabled: !!v })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pace">Idle pace</Label>
              <select
                id="pace"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={s.pace}
                onChange={(e) =>
                  patchSettings({ pace: e.target.value as Pace })
                }
                aria-label="Idle pace"
              >
                <option value="swift">{paceLabel("swift")}</option>
                <option value="balanced">{paceLabel("balanced")}</option>
                <option value="classic">{paceLabel("classic")}</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Swift shortens waits for demos. Classic matches cozy idle minutes.
              </p>
            </div>
          </section>

          {isGuest && showUpgrade && (
            <form
              onSubmit={onCreateAccount}
              className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3"
              aria-labelledby="upgrade-heading"
            >
              <h3 id="upgrade-heading" className="text-sm font-semibold">
                Create account
              </h3>
              <p className="text-xs text-muted-foreground">
                Keep your current progress and sync it to the cloud.
              </p>
              <div className="space-y-2">
                <Label htmlFor="upgrade-hero">Hero name</Label>
                <Input
                  id="upgrade-hero"
                  maxLength={24}
                  placeholder={state.heroName}
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upgrade-email">Email</Label>
                <Input
                  id="upgrade-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upgrade-password">Password</Label>
                <Input
                  id="upgrade-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Creating account…" : "Save progress to account"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowUpgrade(false);
                    clearError();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {user && (
              <p className="w-full text-left text-xs text-muted-foreground">
                Signed in as {user.email}
              </p>
            )}
            {isGuest && !showUpgrade && (
              <p className="w-full text-left text-xs text-muted-foreground">
                Playing as guest — progress is saved only in this browser.
              </p>
            )}
            <p className="w-full text-left text-xs text-muted-foreground">
              <a href="/" className="hover:text-amber-200 hover:underline">
                Home
              </a>
              {" · "}
              <a href="/about" className="hover:text-amber-200 hover:underline">
                About
              </a>
              {" · "}
              <a href="/privacy" className="hover:text-amber-200 hover:underline">
                Privacy
              </a>
              {" · "}
              <a href="/terms" className="hover:text-amber-200 hover:underline">
                Terms
              </a>
            </p>
            {isGuest && !showUpgrade && (
              <Button
                type="button"
                onClick={() => {
                  clearError();
                  setHeroName(state.heroName);
                  setShowUpgrade(true);
                }}
              >
                Create account to save progress
              </Button>
            )}
            {isGuest ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (
                    confirm(
                      "End guest session? You can continue later from this browser if you keep the local save, or clear it now.",
                    )
                  ) {
                    const wipe = confirm(
                      "Also clear guest progress on this device?",
                    );
                    endGuest(wipe);
                    setOpen(false);
                  }
                }}
              >
                End guest session
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  await logout();
                  setOpen(false);
                }}
              >
                Sign out
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    isGuest
                      ? "Start a new journey? Local progress for this guest will be replaced."
                      : "Start a new journey? Cloud and local progress for this hero will be replaced.",
                  )
                ) {
                  resetGame();
                  setOpen(false);
                }
              }}
            >
              New journey
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
