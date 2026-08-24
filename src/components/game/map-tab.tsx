"use client";

import { useMemo, useState } from "react";
import { ITEMS, LOCATIONS, LOCATION_MAP, QUEST_MAP } from "@/content";
import {
  computeStats,
  formatStat,
  questsAtLocation,
  successChance,
} from "@/lib/game";
import type { QuestDef } from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function formatRemaining(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function MapTab() {
  const { state, travelTo, attemptQuest, now } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stats = computeStats(state);
  const selected = selectedId ? LOCATION_MAP[selectedId] : null;
  const quests = selected ? questsAtLocation(selected.id) : [];

  const activeProgress = useMemo(() => {
    if (!state.active) return null;
    const total = state.active.completesAt - state.active.startedAt;
    const done = now - state.active.startedAt;
    const pct = Math.min(100, Math.round((done / total) * 100));
    return { pct, remaining: state.active.completesAt - now, action: state.active };
  }, [state.active, now]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-amber-900/40 bg-gradient-to-b from-stone-900 to-stone-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Map of Orwen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a place to travel or view quests. Unlocked locations are
            labeled; locked ones stay dim until your story opens them.
          </p>
        </CardHeader>
        <CardContent>
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label="Illustrated countryside map of Orwen with location markers"
            className="h-auto w-full rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,_#1c1917_0%,_#0c0a09_70%)]"
          >
            <defs>
              <pattern id="grass" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 8 L4 0 L8 8" fill="none" stroke="#3f3a32" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grass)" opacity="0.5" />
            <path
              d="M10 70 Q30 55 45 60 T80 40"
              fill="none"
              stroke="#57534e"
              strokeWidth="0.8"
              strokeDasharray="1.5 1"
            />
            {LOCATIONS.map((loc) => {
              const unlocked = state.unlockedLocations.includes(loc.id);
              const here = state.locationId === loc.id;
              return (
                <g key={loc.id}>
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={here ? 3.2 : 2.4}
                    className={
                      unlocked
                        ? here
                          ? "fill-amber-300"
                          : "fill-emerald-400/90"
                        : "fill-stone-600"
                    }
                  />
                  <foreignObject
                    x={loc.x - 14}
                    y={loc.y + 3.5}
                    width="28"
                    height="12"
                  >
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        setError(null);
                        setSelectedId(loc.id);
                      }}
                      className={`w-full rounded px-0.5 text-center text-[3.2px] leading-tight focus:outline-none focus:ring-1 focus:ring-amber-300 ${
                        unlocked
                          ? "bg-black/50 text-stone-100 hover:bg-black/70"
                          : "cursor-not-allowed bg-black/30 text-stone-500"
                      }`}
                      aria-label={`${loc.name}${here ? ", current location" : ""}${unlocked ? "" : ", locked"}. ${loc.regionHint}`}
                    >
                      {loc.name}
                    </button>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {LOCATIONS.filter((l) => state.unlockedLocations.includes(l.id)).map(
              (loc) => (
                <li key={loc.id}>
                  <Button
                    type="button"
                    variant={state.locationId === loc.id ? "default" : "outline"}
                    className="h-auto w-full justify-start whitespace-normal px-3 py-2 text-left"
                    onClick={() => {
                      setError(null);
                      setSelectedId(loc.id);
                    }}
                  >
                    <span>
                      <span className="block font-medium">{loc.name}</span>
                      <span className="block text-xs opacity-80">
                        {loc.regionHint}
                        {loc.bestFor ? ` · best for ${formatStat(loc.bestFor)}` : ""}
                      </span>
                    </span>
                  </Button>
                </li>
              ),
            )}
          </ul>
        </CardContent>
      </Card>

      {activeProgress && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {activeProgress.action.type === "travel" ? "Traveling" : "Questing"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              {activeProgress.action.type === "travel"
                ? `En route to ${LOCATION_MAP[activeProgress.action.toLocationId]?.name}`
                : QUEST_MAP[activeProgress.action.questId]?.name ?? "Quest"}
            </p>
            <Progress value={activeProgress.pct} aria-label="Action progress" />
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {formatRemaining(activeProgress.remaining)} remaining ·{" "}
              {activeProgress.pct}%
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelectedId(null);
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>

              {state.locationId !== selected.id ? (
                <div className="space-y-3">
                  <p className="text-sm">
                    Travel time scales with pace and Constitution.
                  </p>
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => {
                        const err = travelTo(selected.id);
                        if (err) setError(err);
                        else setSelectedId(null);
                      }}
                    >
                      Travel here
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.settings.tutorialTips && (
                    <p className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs">
                      Quest success depends on your level versus the quest level.
                      Below ~70%, grind easier work or better gear first.
                    </p>
                  )}
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  {quests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No quests here yet.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {quests.map((q) => (
                        <QuestCard
                          key={q.id}
                          quest={q}
                          chance={successChance(
                            stats[q.stat],
                            q.level,
                            stats.charisma,
                            q.rumor,
                          )}
                          onAttempt={(auto) => {
                            const err = attemptQuest(q.id, auto);
                            if (err) setError(err);
                            else setSelectedId(null);
                          }}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuestCard({
  quest,
  chance,
  onAttempt,
}: {
  quest: QuestDef;
  chance: number;
  onAttempt: (autoEquip: boolean) => void;
}) {
  return (
    <li className="rounded-xl border border-border/70 bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{quest.name}</p>
          <p className="text-xs text-muted-foreground">
            Level {quest.level} {formatStat(quest.stat)}
            {quest.rumor ? " · rumor" : ""}
          </p>
        </div>
        <Badge variant={chance >= 70 ? "secondary" : "destructive"}>
          {chance}% success
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{quest.description}</p>
      <p className="mt-2 text-xs">
        Gold {quest.goldReward} · Possible loot:{" "}
        {quest.itemPool.map((id) => ITEMS[id]?.name).filter(Boolean).join(", ") ||
          "—"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => onAttempt(false)}>
          Attempt
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onAttempt(true)}
        >
          Auto-equip & attempt
        </Button>
      </div>
    </li>
  );
}
