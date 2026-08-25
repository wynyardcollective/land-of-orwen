"use client";

import { GEMS, ITEMS, QUEST_MAP, ENCOUNTER_MAP } from "@/content";
import { rarityClass } from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TONE_LABEL: Record<string, string> = {
  success: "Success",
  fail: "Failure",
  "close-win": "Barely",
  "close-loss": "A hair from right",
  jackpot: "Jackpot",
};

export function RewardDialog() {
  const { state, claim } = useGame();
  const reward = state.pendingReward;
  const isCombat = reward?.kind === "combat";
  const quest = reward && !isCombat ? QUEST_MAP[reward.questId] : null;
  const enc =
    reward && isCombat && reward.encounterId
      ? ENCOUNTER_MAP[reward.encounterId]
      : null;
  const label = isCombat ? enc?.name ?? "Combat" : quest?.name ?? "Quest";

  return (
    <Dialog open={!!reward}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md" showCloseButton={false}>
        {reward && (
          <>
            <DialogHeader>
              <DialogTitle>
                {reward.tone === "jackpot"
                  ? "A pocket of luck"
                  : reward.tone === "close-win"
                    ? "Ugly, but it counted"
                    : reward.tone === "close-loss"
                      ? "Almost"
                      : reward.success
                        ? isCombat
                          ? "Victory"
                          : "What happened"
                        : isCombat
                          ? "Driven back"
                          : "Hard-earned scraps"}
              </DialogTitle>
              <DialogDescription>
                {label} ·{" "}
                {TONE_LABEL[reward.tone] ?? (reward.success ? "Success" : "Failure")}
                {reward.streak > 1 ? ` · streak ${reward.streak}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p className="leading-relaxed">{reward.narrative}</p>
              {reward.npcQuote && (
                <blockquote className="rounded-lg border border-amber-900/40 bg-muted/30 p-3 text-muted-foreground italic">
                  {reward.npcQuote}
                </blockquote>
              )}
              {reward.streakBonus && (
                <p className="text-amber-200">{reward.streakBonus}</p>
              )}
              {reward.unlockName && (
                <p className="text-emerald-300">
                  The path to {reward.unlockName} is on your map.
                </p>
              )}
              {reward.omen && (
                <p className="text-orange-200/90">{reward.omen}</p>
              )}
              {!reward.success && isCombat && (
                <p className="text-orange-200/90">
                  You are wounded — −5% offense until a quest or campfire rest.
                </p>
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
              {!reward.item && !reward.gem && reward.success && (
                <p className="text-muted-foreground">No item drop this time.</p>
              )}
              {reward.tone === "jackpot" && (
                <Badge variant="secondary">Fortune in a thirsty land</Badge>
              )}
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => claim()}>
                Claim
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
