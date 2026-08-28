"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ITEMS,
  LOCATION_NPCS,
  ENEMY_MAP,
} from "@/content";
import type { TavernDef } from "@/content/taverns";
import type { LocationDef } from "@/lib/game/types";
import type { LocationUnlockInfo } from "@/content/unlocks";
import {
  computeStats,
  formatStat,
  formatRiskBand,
  successChance,
  paceDuration,
  deriveCombatSheet,
  combatRiskBand,
  resolveStance,
  skillLevel,
  tavernRoundCost,
  tavernHitChance,
  tavernRoundDuration,
  availableTavernRumors,
  tavernHealCost,
  currentHeroHp,
  heroMaxHp,
  type CombatStance,
  type EncounterDef,
  type GameState,
  type QuestDef,
  type SkillActivityDef,
} from "@/lib/game";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SkillActivityCard } from "./skill-ui";
import { cn } from "@/lib/utils";
import {
  MapPin,
  ScrollText,
  Pickaxe,
  Swords,
  Wine,
  Footprints,
  Lock,
} from "lucide-react";

type LocationSection = "quests" | "skills" | "threats" | "tavern";

const STANCES: { id: CombatStance | "auto"; label: string }[] = [
  { id: "auto", label: "Auto (match weakness)" },
  { id: "strength", label: "Strike (Strength)" },
  { id: "dexterity", label: "Skirmish (Dexterity)" },
  { id: "intelligence", label: "Hex (Intelligence)" },
];

export function LocationPanel({
  location,
  unlocked,
  atLocation,
  unlockInfo,
  state,
  quests,
  skillActivities,
  threats,
  tavern,
  error,
  onClose,
  onTravel,
  onAttemptQuest,
  onAttemptSkill,
  onEngageCombat,
  onTavernBuy,
  onTavernHeal,
}: {
  location: LocationDef;
  unlocked: boolean;
  atLocation: boolean;
  unlockInfo: LocationUnlockInfo | null;
  state: GameState;
  quests: QuestDef[];
  skillActivities: SkillActivityDef[];
  threats: EncounterDef[];
  tavern: TavernDef | null;
  error: string | null;
  onClose: () => void;
  onTravel: () => void;
  onAttemptQuest: (questId: string, autoEquip: boolean) => void;
  onAttemptSkill: (activityId: string) => void;
  onEngageCombat: (encounterId: string, stance: CombatStance | "auto") => void;
  onTavernBuy: () => void;
  onTavernHeal: () => void;
}) {
  const stats = computeStats(state);
  const npc = LOCATION_NPCS[location.id];

  const sections = useMemo(() => {
    const list: { id: LocationSection; label: string; count: number }[] = [];
    if (atLocation && quests.length > 0) {
      list.push({ id: "quests", label: "Quests", count: quests.length });
    }
    if (atLocation && skillActivities.length > 0) {
      list.push({ id: "skills", label: "Skills", count: skillActivities.length });
    }
    if (atLocation && threats.length > 0) {
      list.push({ id: "threats", label: "Threats", count: threats.length });
    }
    if (atLocation && tavern) {
      list.push({ id: "tavern", label: "Tavern", count: 0 });
    }
    return list;
  }, [atLocation, quests.length, skillActivities.length, threats.length, tavern]);

  const [section, setSection] = useState<LocationSection>("quests");

  useEffect(() => {
    if (sections.length === 0) return;
    if (!sections.some((s) => s.id === section)) {
      setSection(sections[0].id);
    }
  }, [location.id, sections, section]);

  const travelSeconds = paceDuration(
    location.travelSeconds,
    state.settings.pace,
    stats.constitution,
  );

  return (
    <>
      <DialogHeader className="space-y-3 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="font-heading text-lg text-amber-50/95">
              {location.name}
            </DialogTitle>
            <DialogDescription className="mt-1 leading-relaxed">
              {location.description}
            </DialogDescription>
          </div>
          {location.regionHint && (
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {location.regionHint}
            </Badge>
          )}
        </div>

        {npc && (
          <div className="rounded-xl border border-amber-900/35 bg-gradient-to-r from-amber-500/8 to-transparent px-3 py-2.5">
            <p className="text-sm">
              <span className="font-medium text-amber-100">{npc.name}</span>
              <span className="text-muted-foreground"> · {npc.title}</span>
            </p>
            <p className="mt-1 text-sm italic text-muted-foreground">
              {atLocation && state.npcReactions?.[location.id]
                ? state.npcReactions[location.id].quote
                : `“${npc.greet}”`}
            </p>
          </div>
        )}
      </DialogHeader>

      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!unlocked ? (
        <LockedLocationBody
          unlockInfo={unlockInfo}
          state={state}
          onClose={onClose}
        />
      ) : !atLocation ? (
        <TravelBody
          travelSeconds={travelSeconds}
          onTravel={onTravel}
          onClose={onClose}
        />
      ) : (
        <div className="space-y-3">
          {state.wounded && (
            <p className="rounded-lg border border-orange-500/40 bg-orange-950/30 px-3 py-2 text-xs text-orange-100">
              Wounded — −5% offense until you finish a quest or rest at a tavern.
            </p>
          )}

          {sections.length > 0 && (
            <nav
              className="flex flex-wrap gap-1 rounded-xl border border-border/50 bg-card/40 p-1"
              aria-label="Location activities"
            >
              {sections.map((s) => {
                const Icon =
                  s.id === "quests"
                    ? ScrollText
                    : s.id === "skills"
                      ? Pickaxe
                      : s.id === "threats"
                        ? Swords
                        : Wine;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    aria-current={section === s.id ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                      section === s.id
                        ? "bg-primary/15 text-amber-100"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {s.label}
                    {s.count > 0 && (
                      <Badge variant="outline" className="h-5 px-1 text-[10px]">
                        {s.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {state.settings.tutorialTips && section === "quests" && quests.length > 0 && (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Success % compares your stat to quest level. Under ~70%, try easier work or better gear.
            </p>
          )}

          {section === "quests" && (
            <ul className="space-y-3">
              {quests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No quests here.</p>
              ) : (
                quests.map((q) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    chance={successChance(
                      stats[q.stat],
                      q.level,
                      stats.charisma,
                      q.rumor,
                    )}
                    onAttempt={onAttemptQuest}
                  />
                ))
              )}
            </ul>
          )}

          {section === "skills" && (
            <ul className="space-y-3">
              {skillActivities.map((act) => (
                <SkillActivityCard
                  key={act.id}
                  activity={act}
                  playerLevel={skillLevel(state, act.skill)}
                  onStart={() => onAttemptSkill(act.id)}
                />
              ))}
            </ul>
          )}

          {section === "threats" && (
            <ul className="space-y-3">
              {threats.map((enc) => (
                <EncounterCard
                  key={enc.id}
                  encounter={enc}
                  gameState={state}
                  onEngage={onEngageCombat}
                />
              ))}
            </ul>
          )}

          {section === "tavern" && tavern && (
            <TavernPanel
              tavern={tavern}
              state={state}
              listening={
                state.active?.type === "tavern" &&
                state.active.tavernId === tavern.id
              }
              onBuy={onTavernBuy}
              onHeal={onTavernHeal}
            />
          )}

          {sections.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing to do here yet — explore other towns or check the journal.
            </p>
          )}
        </div>
      )}
    </>
  );
}

function LockedLocationBody({
  unlockInfo,
  state,
  onClose,
}: {
  unlockInfo: LocationUnlockInfo | null;
  state: GameState;
  onClose: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/20 px-3 py-2">
        <Lock className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-sm text-muted-foreground">Not on your map yet</span>
      </div>
      {unlockInfo ? (
        <>
          <p className="text-sm leading-relaxed">
            Complete the quest below and <strong>claim the reward</strong> to open this route.
          </p>
          <div className="rounded-xl border border-amber-900/40 bg-card/40 p-4 text-sm">
            <p className="font-medium text-amber-100">{unlockInfo.questName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              At {unlockInfo.questLocationName} · Lv {unlockInfo.level}{" "}
              {formatStat(unlockInfo.stat)}
              {unlockInfo.rumor ? " · rumor" : ""}
            </p>
            <p className="mt-2 text-muted-foreground">{unlockInfo.questDescription}</p>
          </div>
          {!state.unlockedLocations.includes(unlockInfo.questLocationId) && (
            <p className="text-sm text-orange-200/90">
              Unlock {unlockInfo.questLocationName} first — see Journal → Current goals.
            </p>
          )}
          {state.unlockedLocations.includes(unlockInfo.questLocationId) &&
            state.locationId !== unlockInfo.questLocationId && (
              <p className="text-sm text-muted-foreground">
                Travel to {unlockInfo.questLocationName} to attempt this quest.
              </p>
            )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Opens through story progress elsewhere. Check Journal → Current goals.
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
}

function TravelBody({
  travelSeconds,
  onTravel,
  onClose,
}: {
  travelSeconds: number;
  onTravel: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-card/40 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-muted/30">
            <Footprints className="size-4 text-amber-200/80" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium">You are elsewhere</p>
            <p className="text-xs text-muted-foreground">
              Travel time scales with pace and Constitution (~{travelSeconds}s at your settings).
            </p>
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:justify-between">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="button" onClick={onTravel} className="rounded-full">
          <MapPin className="mr-1.5 size-3.5" aria-hidden />
          Travel here
        </Button>
      </DialogFooter>
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
  onAttempt: (questId: string, autoEquip: boolean) => void;
}) {
  const loot = quest.itemPool
    .map((id) => ITEMS[id]?.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <li className="rounded-2xl border border-border/50 bg-card/45 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-heading font-medium text-amber-50/95">{quest.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Lv {quest.level} {formatStat(quest.stat)}
            {quest.rumor ? " · rumor" : ""}
          </p>
        </div>
        <Badge
          variant={chance >= 70 ? "secondary" : "destructive"}
          className="shrink-0 tabular-nums"
        >
          {chance}%
        </Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {quest.description}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-amber-800/35 bg-amber-950/25 px-2 py-0.5 text-amber-200/90">
          {quest.goldReward}g
        </span>
        {loot.map((name) => (
          <span
            key={name}
            className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-muted-foreground"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          onClick={() => onAttempt(quest.id, false)}
        >
          Attempt
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => onAttempt(quest.id, true)}
        >
          Auto-equip
        </Button>
      </div>
    </li>
  );
}

function EncounterCard({
  encounter,
  gameState,
  onEngage,
}: {
  encounter: EncounterDef;
  gameState: GameState;
  onEngage: (encounterId: string, stance: CombatStance | "auto") => void;
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
    <li className="rounded-2xl border border-red-900/35 bg-card/45 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-heading font-medium text-amber-50/95">{encounter.name}</p>
          <p className="text-xs text-muted-foreground">
            {enemy.name} · Lv {enemy.level} · weak {formatStat(enemy.weakTo)}
          </p>
        </div>
        <Badge variant={riskVariant}>{formatRiskBand(risk)}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{encounter.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Hit chance ~{hitPct}% · Gold {encounter.goldReward}
      </p>
      <div className="mt-3 space-y-2">
        <Label htmlFor={`stance-${encounter.id}`} className="text-xs">
          Stance
        </Label>
        <select
          id={`stance-${encounter.id}`}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={stance}
          onChange={(e) => setStance(e.target.value as CombatStance | "auto")}
        >
          {STANCES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        size="sm"
        className="mt-3 rounded-full"
        onClick={() => onEngage(encounter.id, stance)}
      >
        Engage
      </Button>
    </li>
  );
}

function TavernPanel({
  tavern,
  state,
  listening,
  onBuy,
  onHeal,
}: {
  tavern: TavernDef;
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
    <div className="space-y-3 rounded-2xl border border-violet-900/40 bg-violet-950/15 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-sm font-semibold text-violet-100">
            {tavern.name}
          </h3>
          <p className="text-xs text-muted-foreground">{tavern.keeper}</p>
        </div>
        <Badge variant="outline" className="border-violet-700/60 text-[10px]">
          {rumorsLeft} lead{rumorsLeft === 1 ? "" : "s"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{tavern.description}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-border/40 bg-black/20 px-3 py-2 text-xs">
          <p>
            Health{" "}
            <strong className={hp < maxHp * 0.35 ? "text-orange-200" : "text-emerald-200"}>
              {hp}/{maxHp}
            </strong>
            {state.wounded ? " · wounded" : ""}
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-2 rounded-full"
            variant="outline"
            disabled={!needsHeal || busy || !canAffordHeal}
            onClick={onHeal}
          >
            {!needsHeal
              ? "Full health"
              : !canAffordHeal
                ? `Need ${healCost}g`
                : busy
                  ? "Busy…"
                  : `Rest (${healCost}g)`}
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 bg-black/20 px-3 py-2 text-xs">
          <p className="text-muted-foreground">
            Round: <strong className="text-amber-100">{cost}g</strong> · ~{seconds}s ·
            ~{hitPct}% rumor chance
          </p>
          {listening ? (
            <p className="mt-2 text-violet-200" role="status">Listening…</p>
          ) : (
            <Button
              type="button"
              size="sm"
              className="mt-2 rounded-full"
              variant="secondary"
              disabled={!canAfford || busy || rumorsLeft === 0}
              onClick={onBuy}
            >
              {!canAfford
                ? `Need ${cost}g`
                : rumorsLeft === 0
                  ? "No new rumors"
                  : busy
                    ? "Busy…"
                    : `Buy round (${cost}g)`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}