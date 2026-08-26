"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ITEMS,
  LOCATIONS,
  LOCATION_MAP,
  visibleLocations,
  LOCATION_NPCS,
  LOCATION_BEATS,
  QUEST_MAP,
  TRAVEL_BEATS,
  mapWeather,
  rotatingBeat,
  ENCOUNTERS,
  ENCOUNTER_MAP,
  ENEMY_MAP,
  getLocationUnlockInfo,
  tavernAtLocation,
  TAVERN_MAP,
  TAVERN_BEATS,
} from "@/content";
import {
  computeStats,
  formatStat,
  questsAtLocation,
  successChance,
  playCue,
  deriveCombatSheet,
  combatRiskBand,
  formatRiskBand,
  resolveStance,
  encounterAvailable,
  tavernRoundCost,
  tavernHitChance,
  tavernRoundDuration,
  availableTavernRumors,
  tavernHealCost,
  currentHeroHp,
  heroMaxHp,
  type ActiveAction,
  type CombatStance,
  type EncounterDef,
  type GameState,
} from "@/lib/game";
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
import { Label } from "@/components/ui/label";

function formatRemaining(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function MapTab() {
  const { state, travelTo, attemptQuest, engageCombat, fleeCombat, buyTavernRound, healAtTavern, now } =
    useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stats = computeStats(state);
  const selected = selectedId ? LOCATION_MAP[selectedId] : null;
  const selectedUnlocked = selected
    ? state.unlockedLocations.includes(selected.id)
    : false;
  const unlockInfo = selected && !selectedUnlocked
    ? getLocationUnlockInfo(selected.id)
    : null;
  const quests = selected && selectedUnlocked ? questsAtLocation(selected.id) : [];
  const threats = selected
    ? ENCOUNTERS.filter(
        (e) =>
          e.locationId === selected.id &&
          encounterAvailable(e, state.storyFlags),
      )
    : [];
  const weather = mapWeather(
    state.storyFlags,
    state.locationId,
    state.omen?.at ?? null,
    now,
  );
  const pulseIds = new Set(
    state.lastUnlock && now - state.lastUnlock.at < 12_000
      ? state.lastUnlock.ids
      : [],
  );
  const pathGlow = 0.35 + 0.08 * state.unlockedLocations.length;
  const omenFresh =
    state.omen && now - state.omen.at < 1000 * 60 * 12 ? state.omen : null;
  const mapLocations = visibleLocations(
    state.unlockedLocations,
    state.storyFlags,
  );
  const tavernHere =
    state.locationId === selected?.id ? tavernAtLocation(state.locationId) : null;
  const tavernFresh =
    state.lastTavernResult && now - state.lastTavernResult.at < 14_000
      ? state.lastTavernResult
      : null;

  const activeProgress = useMemo(() => {
    if (!state.active) return null;
    if (state.active.type === "combat") {
      const combat = state.active;
      const total = Math.max(1, combat.nextRoundAt - (combat.startedAt || now));
      const elapsed = now - (combat.nextRoundAt - total);
      const pct = Math.min(
        100,
        Math.round(((now - combat.startedAt) / Math.max(1, combat.nextRoundAt - combat.startedAt)) * 100),
      );
      return {
        pct: Math.min(100, Math.max(0, pct)),
        remaining: combat.nextRoundAt - now,
        action: state.active,
      };
    }
    const total = state.active.completesAt - state.active.startedAt;
    const done = now - state.active.startedAt;
    const pct = Math.min(100, Math.round((done / total) * 100));
    return { pct, remaining: state.active.completesAt - now, action: state.active };
  }, [state.active, now]);

  return (
    <div className="space-y-4">
      <Card className="border-amber-900/40 bg-gradient-to-b from-stone-900 to-stone-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Map of Orwen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tap a pin on the map or a name below to travel or view quests. Dim
            locked pins can be tapped to see how to unlock them. Secret places
            appear only after tavern rumors pan out.
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`map-weather relative aspect-square w-full overflow-visible rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,_#1c1917_0%,_#0c0a09_70%)] weather-${weather}`}
            data-weather={weather}
            role="img"
            aria-label={`Illustrated countryside map of Orwen. Weather: ${weather}.`}
          >
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                <pattern
                  id="grass"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 8 L4 0 L8 8"
                    fill="none"
                    stroke="#3f3a32"
                    strokeWidth="0.3"
                  />
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
              <path
                d="M10 70 Q30 55 45 60 T80 40"
                fill="none"
                stroke="#d6b15a"
                strokeWidth="1.1"
                strokeDasharray="2 1"
                opacity={pathGlow}
                className="map-path-glow"
              />
            </svg>
            {mapLocations.map((loc) => {
              const unlocked = state.unlockedLocations.includes(loc.id);
              const here = state.locationId === loc.id;
              const secret = loc.secret && unlocked;
              const label = `${loc.name}${here ? ", current location" : ""}${unlocked ? "" : ", locked"}. ${loc.regionHint}`;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSelectedId(loc.id);
                  }}
                  aria-label={
                    unlocked
                      ? label
                      : `${label} Tap for unlock requirements.`
                  }
                  title={unlocked ? loc.name : `${loc.name} (locked — tap for details)`}
                  className={`absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-0.5 rounded-xl px-1 pt-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                    unlocked
                      ? secret
                        ? "cursor-pointer opacity-90 hover:brightness-110"
                        : "cursor-pointer hover:brightness-110"
                      : "cursor-pointer opacity-55 hover:opacity-70"
                  }`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <span
                    className={`mt-1 block size-4 shrink-0 rounded-full ring-2 ring-black/50 sm:size-5 ${
                      unlocked
                        ? secret
                          ? "bg-violet-400"
                          : here
                            ? "bg-amber-300"
                            : "bg-emerald-400"
                        : "bg-stone-600"
                    } ${pulseIds.has(loc.id) ? "map-pin-pulse" : ""} ${
                      here && !state.settings.reducedMotion ? "map-pin-here" : ""
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`max-w-24 rounded bg-black/70 px-1 py-0.5 text-center text-[10px] leading-tight sm:text-xs ${
                      unlocked ? "text-stone-100" : "text-stone-400"
                    }`}
                  >
                    {loc.name}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {mapLocations.map((loc) => {
              const unlocked = state.unlockedLocations.includes(loc.id);
              return (
                <li key={loc.id}>
                  <Button
                    type="button"
                    variant={
                      unlocked && state.locationId === loc.id
                        ? "default"
                        : "outline"
                    }
                    className={`h-auto w-full justify-start whitespace-normal px-3 py-2 text-left ${
                      !unlocked ? "opacity-60" : ""
                    }`}
                    onClick={() => {
                      setError(null);
                      setSelectedId(loc.id);
                    }}
                  >
                    <span>
                      <span className="block font-medium">
                        {loc.name}
                        {!unlocked ? " (locked)" : ""}
                      </span>
                      <span className="block text-xs opacity-80">
                        {loc.regionHint}
                        {loc.bestFor ? ` · best for ${formatStat(loc.bestFor)}` : ""}
                      </span>
                    </span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {omenFresh && (
        <p
          className="rounded-xl border border-orange-400/40 bg-orange-950/40 px-3 py-2 text-sm text-orange-100"
          role="status"
        >
          Drought omen — {omenFresh.text}
        </p>
      )}

      {state.lastUnlock && now - state.lastUnlock.at < 12_000 && (
        <p
          className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-100"
          role="status"
        >
          Path opened: {state.lastUnlock.names.join(", ")}
        </p>
      )}

      {tavernFresh && (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            tavernFresh.hit
              ? "border-violet-400/40 bg-violet-950/40 text-violet-100"
              : "border-stone-500/40 bg-stone-900/60 text-stone-200"
          }`}
          role="status"
        >
          {tavernFresh.hit ? (
            <>
              <span className="font-medium">{tavernFresh.headline}</span>
              {" — "}
              {tavernFresh.detail}
            </>
          ) : (
            tavernFresh.detail
          )}
        </p>
      )}

      {activeProgress && (
        <WaitScene
          pct={activeProgress.pct}
          remaining={activeProgress.remaining}
          action={activeProgress.action}
          now={now}
          soundEnabled={state.settings.soundEnabled}
          onFlee={fleeCombat}
          wounded={state.wounded}
        />
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

              {!selectedUnlocked ? (
                <div className="space-y-3">
                  <Badge variant="outline">Locked</Badge>
                  {unlockInfo ? (
                    <>
                      <p className="text-sm leading-relaxed">
                        To open this area on your map, <strong>successfully complete</strong>{" "}
                        the quest below and claim your reward.
                      </p>
                      <div className="rounded-xl border border-amber-900/40 bg-muted/30 p-3 text-sm">
                        <p className="font-medium text-amber-100">
                          {unlockInfo.questName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          At {unlockInfo.questLocationName} · Level {unlockInfo.level}{" "}
                          {formatStat(unlockInfo.stat)}
                          {unlockInfo.rumor ? " · rumor" : ""}
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          {unlockInfo.questDescription}
                        </p>
                      </div>
                      {!state.unlockedLocations.includes(
                        unlockInfo.questLocationId,
                      ) && (
                        <p className="text-sm text-orange-200/90">
                          {unlockInfo.questLocationName} is not on your map yet —
                          follow Journal goals to unlock it first.
                        </p>
                      )}
                      {state.unlockedLocations.includes(
                        unlockInfo.questLocationId,
                      ) &&
                        state.locationId !== unlockInfo.questLocationId && (
                          <p className="text-sm text-muted-foreground">
                            Travel to {unlockInfo.questLocationName} to attempt
                            this quest.
                          </p>
                        )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This place opens through story progress elsewhere. Check
                      Journal → Current goals.
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSelectedId(null)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <>
              {LOCATION_NPCS[selected.id] && (
                <p className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm">
                  <span className="font-medium">
                    {LOCATION_NPCS[selected.id].name}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {LOCATION_NPCS[selected.id].title}
                  </span>
                  <span className="mt-1 block text-muted-foreground italic">
                    {state.locationId === selected.id &&
                    state.npcReactions?.[selected.id]
                      ? state.npcReactions[selected.id].quote
                      : `“${LOCATION_NPCS[selected.id].greet}”`}
                  </span>
                </p>
              )}

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
                      Below ~70%, grind easier work or better gear first. In combat,
                      match your stance to the enemy&apos;s weakness — Strike, Skirmish,
                      or Hex.
                    </p>
                  )}
                  {state.wounded && (
                    <p className="rounded-lg border border-orange-500/40 bg-orange-950/30 p-3 text-xs text-orange-100">
                      Wounded — −5% offense until you finish a quest or rest at the
                      campfire.
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
                  {threats.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-sm font-semibold text-amber-100">
                        Threats
                      </h3>
                      <ul className="space-y-3">
                        {threats.map((enc) => (
                          <EncounterCard
                            key={enc.id}
                            encounter={enc}
                            gameState={state}
                            onEngage={(stance) => {
                              const err = engageCombat(enc.id, stance);
                              if (err) setError(err);
                              else setSelectedId(null);
                            }}
                          />
                        ))}
                      </ul>
                    </div>
                  )}
                  {tavernHere && (
                    <TavernPanel
                      tavern={tavernHere}
                      state={state}
                      listening={
                        state.active?.type === "tavern" &&
                        state.active.tavernId === tavernHere.id
                      }
                      onBuy={() => {
                        const err = buyTavernRound(tavernHere.id);
                        if (err) setError(err);
                        else setSelectedId(null);
                      }}
                      onHeal={() => {
                        const err = healAtTavern(tavernHere.id);
                        if (err) setError(err);
                      }}
                    />
                  )}
                </div>
              )}
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TavernPanel({
  tavern,
  state,
  listening,
  onBuy,
  onHeal,
}: {
  tavern: import("@/content/taverns").TavernDef;
  state: GameState;
  listening: boolean;
  onBuy: () => void;
  onHeal: () => void;
}) {
  const cost = tavernRoundCost(state, tavern.id);
  const hitPct = Math.round(tavernHitChance(state) * 100);
  const seconds = tavernRoundDuration(state, tavern.id);
  const rumorsLeft = availableTavernRumors(state, tavern.id);
  const canAfford = state.gold >= cost;
  const busy = !!state.active || !!state.pendingReward;
  const maxHp = heroMaxHp(state);
  const hp = currentHeroHp(state, maxHp);
  const healCost = tavernHealCost(state);
  const needsHeal = hp < maxHp;
  const canAffordHeal = state.gold >= healCost;

  return (
    <div className="space-y-2 rounded-xl border border-violet-900/50 bg-violet-950/20 p-3 pt-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-violet-100">{tavern.name}</h3>
          <p className="text-xs text-muted-foreground">{tavern.keeper}</p>
        </div>
        <Badge variant="outline" className="border-violet-700/60">
          {rumorsLeft} lead{rumorsLeft === 1 ? "" : "s"} left
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{tavern.description}</p>
      <div className="rounded-lg border border-border/40 bg-black/20 px-3 py-2 text-xs">
        <p>
          Your health:{" "}
          <strong className={hp < maxHp * 0.35 ? "text-orange-200" : "text-emerald-200"}>
            {hp}/{maxHp} HP
          </strong>
          {state.wounded ? " · wounded" : ""}
        </p>
        <p className="mt-1 text-muted-foreground">
          Rest here to restore all health. Cost scales with how hurt you are;
          Charisma softens the bill.
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-2"
          variant="outline"
          disabled={!needsHeal || busy || !canAffordHeal}
          onClick={onHeal}
        >
          {!needsHeal
            ? "Already full health"
            : !canAffordHeal
              ? `Need ${healCost}g to rest`
              : busy
                ? "Busy…"
                : `Rest & recover (${healCost}g)`}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Pay <strong className="text-amber-100">{cost} gold</strong> and linger{" "}
        <strong className="text-amber-100">~{seconds}s</strong> for a chance to
        learn something useful (~{hitPct}%; Charisma & Wisdom help). Gold is
        spent up front, even on a miss.
      </p>
      {listening ? (
        <p className="text-xs text-violet-200" role="status">
          You are listening for rumors…
        </p>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!canAfford || busy || rumorsLeft === 0}
          onClick={onBuy}
        >
          {!canAfford
            ? `Need ${cost} gold`
            : rumorsLeft === 0
              ? "Nothing new here"
              : busy
                ? "Busy…"
                : `Buy a round (${cost}g, ~${seconds}s)`}
        </Button>
      )}
    </div>
  );
}

function WaitScene({
  pct,
  remaining,
  action,
  now,
  soundEnabled,
  onFlee,
  wounded,
}: {
  pct: number;
  remaining: number;
  action: NonNullable<ActiveAction>;
  now: number;
  soundEnabled: boolean;
  onFlee: () => string | null;
  wounded: boolean;
}) {
  if (action.type === "combat") {
    const enc = ENCOUNTER_MAP[action.encounterId];
    const enemy = ENEMY_MAP[action.enemyId];
    const heroPct = Math.round((action.heroHp / action.heroMaxHp) * 100);
    const enemyPct = Math.round((action.enemyHp / action.enemyMaxHp) * 100);
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">In combat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">
            {enc?.name ?? "Fight"} · Round {action.round}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>You</span>
              <span aria-live="polite">
                {action.heroHp}/{action.heroMaxHp} HP
              </span>
            </div>
            <Progress value={heroPct} aria-label="Your health" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{enemy?.name ?? "Enemy"}</span>
              <span aria-live="polite">
                {action.enemyHp}/{action.enemyMaxHp} HP
              </span>
            </div>
            <Progress value={enemyPct} aria-label="Enemy health" />
          </div>
          <div
            className="max-h-32 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-2 text-xs leading-relaxed"
            aria-live="polite"
          >
            {action.log.slice(-6).map((line) => (
              <p key={`${line.at}-${line.round}`}>{line.text}</p>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Next round in {formatRemaining(remaining)} · Stance:{" "}
            {formatStat(action.stance)}
            {wounded ? " · wounded" : ""}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFlee()}
          >
            Flee
          </Button>
        </CardContent>
      </Card>
    );
  }

  const locId =
    action.type === "travel"
      ? action.toLocationId
      : action.type === "quest"
        ? QUEST_MAP[action.questId]?.locationId
        : undefined;
  const lines =
    action.type === "travel"
      ? TRAVEL_BEATS[action.toLocationId]
      : action.type === "tavern"
        ? TAVERN_BEATS[action.tavernId]
        : LOCATION_BEATS[locId ?? ""];
  const beat = rotatingBeat(lines, action.startedAt, now);
  const title =
    action.type === "travel"
      ? `On the road to ${LOCATION_MAP[action.toLocationId]?.name}`
      : action.type === "tavern"
        ? `${TAVERN_MAP[action.tavernId]?.name ?? "Tavern"} — listening`
        : QUEST_MAP[action.questId]?.name ?? "Quest";

  useEffect(() => {
    if (!soundEnabled) return;
    playCue(true, "ambient");
    const id = window.setInterval(() => playCue(true, "ambient"), 8000);
    return () => window.clearInterval(id);
  }, [soundEnabled, action.startedAt]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {action.type === "travel"
            ? "Traveling"
            : action.type === "tavern"
              ? "At the tavern"
              : "In the work"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="min-h-10 text-sm leading-relaxed text-amber-100/90" aria-live="polite">
          {beat}
        </p>
        <Progress value={pct} aria-label="Action progress" />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {formatRemaining(remaining)} remaining · {pct}%
        </p>
      </CardContent>
    </Card>
  );
}

function QuestCard({
  quest,
  chance,
  onAttempt,
}: {
  quest: import("@/lib/game").QuestDef;
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

const STANCES: { id: CombatStance | "auto"; label: string }[] = [
  { id: "auto", label: "Auto (match weakness)" },
  { id: "strength", label: "Strike (Strength)" },
  { id: "dexterity", label: "Skirmish (Dexterity)" },
  { id: "intelligence", label: "Hex (Intelligence)" },
];

function EncounterCard({
  encounter,
  gameState,
  onEngage,
}: {
  encounter: EncounterDef;
  gameState: import("@/lib/game").GameState;
  onEngage: (stance: CombatStance | "auto") => void;
}) {
  const [stance, setStance] = useState<CombatStance | "auto">("auto");
  const enemy = ENEMY_MAP[encounter.enemyId];
  if (!enemy) return null;
  const stats = computeStats(gameState);
  const resolved = resolveStance(stance, enemy);
  const sheet = deriveCombatSheet(stats, resolved, gameState, gameState.wounded);
  const risk = combatRiskBand(sheet, enemy, resolved);
  const riskVariant =
    risk === "safe" ? "secondary" : risk === "even" ? "outline" : "destructive";
  const hitPct = Math.round(sheet.accuracy * 100);

  return (
    <li className="rounded-xl border border-red-900/40 bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{encounter.name}</p>
          <p className="text-xs text-muted-foreground">
            {enemy.name} · L{enemy.level} · weak to {formatStat(enemy.weakTo)}
          </p>
        </div>
        <Badge variant={riskVariant}>{formatRiskBand(risk)}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{encounter.description}</p>
      <p className="mt-1 text-xs text-muted-foreground italic">{enemy.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Your hit chance with this stance: ~{hitPct}% · Damage is modest — expect
        longer fights.
      </p>
      <div className="mt-3 space-y-2">
        <Label htmlFor={`stance-${encounter.id}`}>Stance</Label>
        <select
          id={`stance-${encounter.id}`}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={stance}
          onChange={(e) =>
            setStance(e.target.value as CombatStance | "auto")
          }
        >
          {STANCES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-xs">
        Gold {encounter.goldReward} · Possible loot:{" "}
        {encounter.itemPool.map((id) => ITEMS[id]?.name).filter(Boolean).join(", ") ||
          "—"}
      </p>
      <div className="mt-3">
        <Button type="button" size="sm" onClick={() => onEngage(stance)}>
          Engage
        </Button>
      </div>
    </li>
  );
}
