"use client";

import { GEMS, ITEMS, QUEST_MAP, ENCOUNTER_MAP } from "@/content";
import { rarityClass, formatSkill } from "@/lib/game";
import { useGame } from "./game-provider";
import { SkillRewardBlock } from "./skill-ui";
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
  const isSkill = reward?.kind === "skill";
  // Combat rewards use CombatResultPanel when a fight log is available
  const useModal = !!reward && !(isCombat && state.lastCombat);
  const quest = reward && !isCombat && !isSkill ? QUEST_MAP[reward.questId] : null;
  const enc =
    reward && isCombat && reward.encounterId
      ? ENCOUNTER_MAP[reward.encounterId]
      : null;
  const label = isSkill
    ? reward?.activityName ?? "Training"
    : isCombat
      ? enc?.name ?? "Combat"
      : quest?.name ?? "Quest";

  return (
    <Dialog open={useModal}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md" showCloseButton={false}>
        {reward && (
          <>
            <DialogHeader>
              <DialogTitle>
                {isSkill
                  ? "Work complete"
                  : reward.tone === "jackpot"
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
              {isSkill && (
                <SkillRewardBlock
                  skillId={reward.skillId}
                  skillXp={reward.skillXp}
                  materials={reward.materials}
                  item={
                    reward.item
                      ? {
                          defId: reward.item.defId,
                          power: reward.item.power,
                          legendary: reward.legendary,
                        }
                      : undefined
                  }
                />
              )}
              {!isSkill && reward.skillId && reward.skillXp && (
                <p className="text-emerald-300">
                  {formatSkill(reward.skillId)} +{reward.skillXp} XP
                </p>
              )}
              {!isSkill &&
                reward.materials &&
                Object.entries(reward.materials).map(([id, amount]) => (
                  <p key={id} className="text-stone-200">
                    Material: {ITEMS[id]?.name ?? id} ×{amount}
                  </p>
                ))}
              {(reward.gold > 0 || reward.bonusGold > 0) && (
                <p>
                  Gold +{reward.gold}
                  {reward.bonusGold > 0 ? ` (bonus +${reward.bonusGold})` : ""}
                </p>
              )}
              {reward.item && !isSkill && (
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
              {!reward.item && !reward.gem && reward.success && !isSkill && (
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
