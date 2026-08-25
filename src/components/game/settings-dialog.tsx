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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FontScale, Pace } from "@/lib/game";

export function SettingsDialog() {
  const { state, patchSettings, resetGame } = useGame();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const s = state.settings;

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
      <Dialog open={open} onOpenChange={setOpen}>
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

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {user && (
              <p className="w-full text-left text-xs text-muted-foreground">
                Signed in as {user.email}
              </p>
            )}
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
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    "Start a new journey? Cloud and local progress for this hero will be replaced.",
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
