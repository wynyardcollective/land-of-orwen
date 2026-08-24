"use client";

import { ITEMS, GEMS, QUEST_MAP } from "@/content";
import { rarityClass } from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RewardDialog() {
  const { state, claim } = useGame();
  const reward = state.pendingReward;
  const quest = reward ? QUEST_MAP[reward.questId] : null;

  return (
    <Dialog open={!!reward}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {reward && (
          <>
            <DialogHeader>
              <DialogTitle>
                {reward.success ? "Quest rewards" : "Hard-earned scraps"}
              </DialogTitle>
              <DialogDescription>
                {quest?.name ?? "Quest"} ·{" "}
                {reward.success ? "Success" : "Failure"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>{reward.narrative}</p>
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
                  Item: {ITEMS[reward.item.defId]?.name} +{reward.item.power}
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
