"use client";

import { computeStats, goldCap, currentHeroHp, heroMaxHp } from "@/lib/game";
import { LOCATION_MAP } from "@/content";
import { useGame } from "./game-provider";
import { SettingsDialog } from "./settings-dialog";
import { AssistPanel } from "./assist-panel";
import { Badge } from "@/components/ui/badge";

export function StatusBar() {
  const { state, syncStatus } = useGame();
  const stats = computeStats(state);
  const cap = goldCap(stats.constitution);
  const loc = LOCATION_MAP[state.locationId];
  const maxHp = heroMaxHp(state);
  const hp = currentHeroHp(state, maxHp);
  const lowHp = hp <= maxHp * 0.35;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-wide text-amber-200/90">
            The Land of Orwen
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {loc?.name ?? "Unknown"} · {state.heroName}
          </p>
        </div>
        <Badge
          variant={lowHp ? "destructive" : "outline"}
          className="font-mono text-sm"
          aria-live="polite"
          aria-label={`Health ${hp} of ${maxHp}`}
        >
          HP {hp}/{maxHp}
          {state.wounded ? " · W" : ""}
        </Badge>
        <Badge variant="secondary" className="font-mono text-sm" aria-live="polite">
          Gold {state.gold}/{cap}
        </Badge>
        <Badge
          variant="outline"
          className="hidden text-xs sm:inline-flex"
          aria-label={`Cloud save status: ${syncStatus}`}
        >
          {syncStatus === "saving"
            ? "Saving…"
            : syncStatus === "saved"
              ? "Cloud saved"
              : syncStatus === "offline"
                ? "Local only"
                : syncStatus === "error"
                  ? "Save error"
                  : "Ready"}
        </Badge>
        <AssistPanel />
        <SettingsDialog />
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-1 px-3 pb-2 text-[11px] text-muted-foreground sm:text-xs">
        <span>STR {stats.strength}</span>
        <span>DEX {stats.dexterity}</span>
        <span>INT {stats.intelligence}</span>
      </div>
    </header>
  );
}
