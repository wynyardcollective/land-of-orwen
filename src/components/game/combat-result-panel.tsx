"use client";

import { useEffect, useRef } from "react";
import { GEMS, ITEMS, ENCOUNTER_MAP } from "@/content";
import { rarityClass } from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TONE_LABEL: Record<string, string> = {
  success: "Victory",
  fail: "Defeat",
  "close-win": "Barely won",
  "close-loss": "Close loss",
  jackpot: "Jackpot",
};

/** Inline combat aftermath — keeps the fight log visible while claiming rewards. */
export function CombatResultPanel() {
  const { state, claim } = useGame();
  const reward = state.pendingReward;
  const combat = state.lastCombat;
  const logEndRef = useRef<HTMLDivElement>(null);

  const show =
    reward?.kind === "combat" && combat != null;

  useEffect(() => {
    if (!show) return;
    logEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [show, combat?.log.length]);

  if (!show || !reward || !combat) return null;

  const enc = reward.encounterId
    ? ENCOUNTER_MAP[reward.encounterId]
    : undefined;
  const heroPct = Math.round(
    (combat.heroHpLeft / Math.max(1, combat.heroMaxHp)) * 100,
  );

  return (
    <Card className="mb-4 border-amber-900/50 bg-gradient-to-b from-stone-900 to-stone-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {combat.fled
            ? "Fled"
            : reward.success
              ? "Combat resolved"
              : "Driven back"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {enc?.name ?? combat.enemyName} ·{" "}
          {TONE_LABEL[reward.tone] ??
            (reward.success ? "Victory" : "Defeat")}
          {reward.streak > 1 ? ` · streak ${reward.streak}` : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">You dealt</p>
            <p className="text-lg font-semibold text-emerald-200">
              {combat.damageDealt} damage
            </p>
            <p className="text-xs text-muted-foreground">
              {combat.heroHits} hits · {combat.heroMisses} misses ·{" "}
              {combat.rounds} rounds
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm">
            <p className="text-xs text-muted-foreground">
              {combat.enemyName} dealt
            </p>
            <p className="text-lg font-semibold text-orange-200">
              {combat.damageTaken} damage
            </p>
            <p className="text-xs text-muted-foreground">
              {combat.enemyHits} hits · {combat.enemyMisses} misses
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Your HP after the fight</span>
            <span>
              {combat.heroHpLeft}/{combat.heroMaxHp}
            </span>
          </div>
          <Progress value={heroPct} aria-label="Your remaining health" />
        </div>

        <div
          className="max-h-56 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed"
          aria-label="Combat log"
        >
          {combat.log.map((line, i) => (
            <p
              key={`${line.at}-${line.round}-${i}`}
              className={
                line.text.startsWith("—") ||
                line.text.startsWith("Gold") ||
                line.text.startsWith("Item") ||
                line.text.startsWith("Legendary") ||
                line.text.startsWith("Gem") ||
                line.text.startsWith("Claim")
                  ? "mt-1 font-medium text-amber-100/95"
                  : undefined
              }
            >
              {line.text}
            </p>
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="space-y-2 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-sm">
          <p className="font-medium text-amber-100">Reward</p>
          <p className="leading-relaxed text-muted-foreground">
            {reward.narrative}
          </p>
          {reward.npcQuote && (
            <blockquote className="text-muted-foreground italic">
              {reward.npcName ? `${reward.npcName}: ` : ""}“{reward.npcQuote}”
            </blockquote>
          )}
          <p>
            Gold +{reward.gold}
            {reward.bonusGold > 0 ? ` (bonus +${reward.bonusGold})` : ""}
          </p>
          {reward.item && (
            <p
              className={rarityClass(
                ITEMS[reward.item.defId]?.rarity ?? "common",
              )}
            >
              {reward.legendary ? "Legendary: " : "Item: "}
              {ITEMS[reward.item.defId]?.name} +{reward.item.power}
            </p>
          )}
          {reward.gem && (
            <p className="text-emerald-300">
              Gem: {GEMS[reward.gem.defId]?.name} T{reward.gem.tier}
            </p>
          )}
          {reward.streakBonus && (
            <p className="text-amber-200">{reward.streakBonus}</p>
          )}
          {reward.unlockName && (
            <p className="text-emerald-300">
              Path opened: {reward.unlockName}
            </p>
          )}
          {!reward.success && !combat.fled && (
            <p className="text-orange-200/90">
              You are wounded (−5% offense) and at 0 HP until you heal.
            </p>
          )}
          {reward.tone === "jackpot" && (
            <Badge variant="secondary">Fortune in a thirsty land</Badge>
          )}
          <Button type="button" className="mt-1 w-full sm:w-auto" onClick={() => claim()}>
            Claim reward
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
