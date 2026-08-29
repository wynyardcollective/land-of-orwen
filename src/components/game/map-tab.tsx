"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LOCATION_MAP,
  visibleLocations,
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
  shopAtLocation,
  TAVERN_MAP,
  TAVERN_BEATS,
  activitiesAtLocation,
  SKILL_ACTIVITY_MAP,
  RECIPE_MAP,
} from "@/content";
import {
  formatStat,
  questsAtLocation,
  playCue,
  encounterAvailable,
  skillBeatForActive,
  type ActiveAction,
} from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { SkillTrainingCard } from "./skill-ui";
import { LocationPanel } from "./location-panel";

function formatRemaining(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function MapTab() {
  const { state, travelTo, attemptQuest, attemptSkill, engageCombat, fleeCombat, buyTavernRound, healAtTavern, buyFromShop, now } =
    useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = selectedId ? LOCATION_MAP[selectedId] : null;
  const selectedUnlocked = selected
    ? state.unlockedLocations.includes(selected.id)
    : false;
  const unlockInfo = selected && !selectedUnlocked
    ? getLocationUnlockInfo(selected.id)
    : null;
  const quests = selected && selectedUnlocked ? questsAtLocation(selected.id) : [];
  const skillActivities =
    selected && selectedUnlocked ? activitiesAtLocation(selected.id) : [];
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
  const shopHere =
    state.locationId === selected?.id ? shopAtLocation(state.locationId) : null;
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
          <CardTitle className="text-base">Map of rough</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fourteen towns and eight hidden sites across the drought country.
            Tap a pin to travel or view local work.
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`map-weather relative aspect-square w-full overflow-visible rounded-xl border border-border/60 bg-[radial-gradient(ellipse_at_center,_#1c1917_0%,_#0c0a09_70%)] weather-${weather}`}
            data-weather={weather}
            role="img"
            aria-label={`Illustrated countryside map of rough. Weather: ${weather}.`}
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
              {/* Western ridge */}
              <path
                d="M2 18 L8 42 L6 72 L2 88"
                fill="none"
                stroke="#44403c"
                strokeWidth="0.6"
                opacity="0.5"
              />
              {/* Dry eastern basin */}
              <ellipse
                cx="88"
                cy="64"
                rx="9"
                ry="6"
                fill="none"
                stroke="#57534e"
                strokeWidth="0.5"
                strokeDasharray="1 1.5"
                opacity="0.55"
              />
              {/* Southern ford creek (dry) */}
              <path
                d="M28 78 Q36 86 44 90 T58 88"
                fill="none"
                stroke="#57534e"
                strokeWidth="0.45"
                strokeDasharray="1.2 1.2"
                opacity="0.45"
              />
              {/* Main road east */}
              <path
                d="M10 70 Q30 55 45 60 T80 40"
                fill="none"
                stroke="#57534e"
                strokeWidth="0.8"
                strokeDasharray="1.5 1"
              />
              {/* South road to Bracken Ford */}
              <path
                d="M18 62 Q28 72 36 86"
                fill="none"
                stroke="#57534e"
                strokeWidth="0.55"
                strokeDasharray="1.2 1.2"
                opacity="0.7"
              />
              {/* North spur to relay & mill */}
              <path
                d="M28 34 Q42 38 54 36 T72 28"
                fill="none"
                stroke="#57534e"
                strokeWidth="0.55"
                strokeDasharray="1.2 1.2"
                opacity="0.65"
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
              <text
                x="50"
                y="6"
                textAnchor="middle"
                fill="#78716c"
                fontSize="3"
                opacity="0.6"
              >
                N
              </text>
              <text
                x="4"
                y="52"
                textAnchor="middle"
                fill="#78716c"
                fontSize="2.8"
                opacity="0.5"
              >
                W
              </text>
              <text
                x="96"
                y="52"
                textAnchor="middle"
                fill="#78716c"
                fontSize="2.8"
                opacity="0.5"
              >
                E
              </text>
              <text
                x="50"
                y="98"
                textAnchor="middle"
                fill="#78716c"
                fontSize="3"
                opacity="0.6"
              >
                S
              </text>
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
            <LocationPanel
              location={selected}
              unlocked={selectedUnlocked}
              atLocation={state.locationId === selected.id}
              unlockInfo={unlockInfo}
              state={state}
              quests={quests}
              skillActivities={skillActivities}
              threats={threats}
              tavern={tavernHere ?? null}
              shop={shopHere ?? null}
              error={error}
              onClose={() => setSelectedId(null)}
              onTravel={() => {
                const err = travelTo(selected.id);
                if (err) setError(err);
                else setSelectedId(null);
              }}
              onAttemptQuest={(questId, auto) => {
                const err = attemptQuest(questId, auto);
                if (err) setError(err);
                else setSelectedId(null);
              }}
              onAttemptSkill={(activityId) => {
                const err = attemptSkill(activityId);
                if (err) setError(err);
                else setSelectedId(null);
              }}
              onEngageCombat={(encounterId, stance) => {
                const err = engageCombat(encounterId, stance);
                if (err) setError(err);
                else setSelectedId(null);
              }}
              onTavernBuy={() => {
                if (!tavernHere) return;
                const err = buyTavernRound(tavernHere.id);
                if (err) setError(err);
                else setSelectedId(null);
              }}
              onTavernHeal={() => {
                if (!tavernHere) return;
                const err = healAtTavern(tavernHere.id);
                if (err) setError(err);
              }}
              onShopBuy={(stockId) => {
                if (!shopHere) return;
                const err = buyFromShop(shopHere.id, stockId);
                if (err) setError(err);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CombatLogLineText({ text }: { text: string }) {
  const match = text.match(/^(.*?)(\s*\(\d+\s*damage\))\s*$/i);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <span className="font-semibold text-amber-100">{match[2]}</span>
    </>
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
    const dealt = action.damageDealt ?? 0;
    const taken = action.damageTaken ?? 0;
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
            <p className="text-[11px] text-muted-foreground">
              Damage dealt this fight:{" "}
              <strong className="text-emerald-200">{dealt}</strong>
              {" · "}
              hits {action.heroHits ?? 0} / misses {action.heroMisses ?? 0}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{enemy?.name ?? "Enemy"}</span>
              <span aria-live="polite">
                {action.enemyHp}/{action.enemyMaxHp} HP
              </span>
            </div>
            <Progress value={enemyPct} aria-label="Enemy health" />
            <p className="text-[11px] text-muted-foreground">
              Damage taken from them:{" "}
              <strong className="text-orange-200">{taken}</strong>
              {" · "}
              hits {action.enemyHits ?? 0} / misses {action.enemyMisses ?? 0}
            </p>
          </div>
          <div
            className="max-h-52 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-2 text-xs leading-relaxed"
            aria-live="polite"
          >
            {action.log.map((line, i) => (
              <p key={`${line.at}-${line.round}-${i}`}>
                <CombatLogLineText text={line.text} />
              </p>
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
        : action.type === "skill" && action.activityId
          ? SKILL_ACTIVITY_MAP[action.activityId]?.locationId
          : action.type === "skill" && action.recipeId
            ? RECIPE_MAP[action.recipeId]?.locationId
            : undefined;

  const lines =
    action.type === "travel"
      ? TRAVEL_BEATS[action.toLocationId]
      : action.type === "tavern"
        ? TAVERN_BEATS[action.tavernId]
        : action.type === "skill"
          ? skillBeatForActive(action)
          : LOCATION_BEATS[locId ?? ""];
  const beat = rotatingBeat(lines, action.startedAt, now);
  const title =
    action.type === "travel"
      ? `On the road to ${LOCATION_MAP[action.toLocationId]?.name}`
      : action.type === "tavern"
        ? `${TAVERN_MAP[action.tavernId]?.name ?? "Tavern"} — listening`
        : action.type === "skill"
          ? action.activityId
            ? SKILL_ACTIVITY_MAP[action.activityId]?.name
            : RECIPE_MAP[action.recipeId ?? ""]?.name ?? "Crafting"
          : QUEST_MAP[action.questId]?.name ?? "Quest";

  useEffect(() => {
    if (!soundEnabled) return;
    playCue(true, "ambient");
    const id = window.setInterval(() => playCue(true, "ambient"), 8000);
    return () => window.clearInterval(id);
  }, [soundEnabled, action.startedAt]);

  if (action.type === "skill") {
    const skillId =
      action.activityId
        ? SKILL_ACTIVITY_MAP[action.activityId]?.skill
        : action.recipeId
          ? RECIPE_MAP[action.recipeId]?.skill
          : "woodcutting";
    return (
      <SkillTrainingCard
        title={title}
        skill={skillId}
        beat={beat}
        pct={pct}
        remaining={remaining}
        formatRemaining={formatRemaining}
      />
    );
  }

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

