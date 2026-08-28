"use client";

import { GameProvider, useGame } from "./game-provider";
import { StatusBar } from "./status-bar";
import { MapTab } from "./map-tab";
import { HeroTab } from "./hero-tab";
import { CraftTab } from "./craft-tab";
import { JournalTab } from "./journal-tab";
import { CampfireTab } from "./campfire-tab";
import { RewardDialog } from "./reward-dialog";
import { OpeningStoryDialog } from "./opening-story-dialog";
import { CombatResultPanel } from "./combat-result-panel";
import { Button } from "@/components/ui/button";
import type { TabId } from "@/lib/game";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth/auth-provider";
import { AuthScreen } from "@/components/auth/auth-screen";
import { getOrCreatePlayerId, loadLocalSave } from "@/lib/game";

const TABS: { id: TabId; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "hero", label: "Hero" },
  { id: "craft", label: "Craft" },
  { id: "journal", label: "Journal" },
  { id: "campfire", label: "Campfire" },
];

function ShellInner() {
  const { state, tab, setTab, announcement } = useGame();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.toggle("high-contrast", state.settings.highContrast);
    root.dataset.fontScale = state.settings.fontScale;
    root.dataset.reducedMotion = state.settings.reducedMotion ? "1" : "0";
  }, [state.settings]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-amber-200 focus:px-3 focus:py-2 focus:text-stone-900"
      >
        Skip to content
      </a>
      <StatusBar />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-3 py-4 pb-28 sm:px-4"
      >
        <CombatResultPanel />
        {tab === "map" && <MapTab />}
        {tab === "hero" && <HeroTab />}
        {tab === "craft" && <CraftTab />}
        {tab === "journal" && <JournalTab />}
        {tab === "campfire" && <CampfireTab />}
      </main>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur"
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-1 py-2">
          {TABS.map((t) => (
            <li key={t.id}>
              <Button
                type="button"
                variant={tab === t.id ? "default" : "ghost"}
                className="h-12 w-full flex-col gap-0 px-1 text-xs sm:text-sm"
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <RewardDialog />
      <OpeningStoryDialog />
    </div>
  );
}

function AuthenticatedGame() {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
        <p role="status" className="text-sm text-muted-foreground">
          Opening the map…
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <GameProvider playerId={user.playerId} heroName={user.heroName}>
        <ShellInner />
      </GameProvider>
    );
  }

  if (isGuest) {
    const local = loadLocalSave();
    const playerId = local?.playerId ?? getOrCreatePlayerId();
    const heroName = local?.heroName?.trim() || "Wanderer";
    return (
      <GameProvider playerId={playerId} heroName={heroName} guest>
        <ShellInner />
      </GameProvider>
    );
  }

  return <AuthScreen />;
}

export function GameShell() {
  return (
    <AuthProvider>
      <AuthenticatedGame />
    </AuthProvider>
  );
}
