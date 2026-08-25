"use client";

import { useMemo, useState } from "react";
import { currentGoals, LOCATION_MAP } from "@/content";
import {
  bestQuestForStat,
  computeStats,
  formatStat,
  successChance,
  weakestQuestStat,
} from "@/lib/game";
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

export function AssistPanel() {
  const { state, attemptQuest, setTab } = useGame();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const advice = useMemo(() => {
    const goals = currentGoals(state.storyFlags);
    const weak = weakestQuestStat(state);
    const best = bestQuestForStat(state, weak);
    const stats = computeStats(state);
    return { goals, weak, best, stats };
  }, [state]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          setMsg(null);
          setOpen(true);
        }}
      >
        Assist
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Journey assist</DialogTitle>
            <DialogDescription>
              Guidance for where to go next, without spoiling every secret.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Current goals</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                {advice.goals.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <p>
              Your weakest quest stat is{" "}
              <strong>{formatStat(advice.weak)}</strong> (
              {advice.stats[advice.weak]}).
            </p>
            <p className="text-muted-foreground">
              In combat, pick a stance that matches the enemy&apos;s weakness —
              Strike for Strength foes, Skirmish for Dexterity, Hex for
              Intelligence.
            </p>
            {advice.best ? (
              <p>
                Recommended here:{" "}
                <strong>{advice.best.name}</strong> (
                {successChance(
                  advice.stats[advice.best.stat],
                  advice.best.level,
                  advice.stats.charisma,
                  advice.best.rumor,
                )}
                % chance).
              </p>
            ) : (
              <p className="text-muted-foreground">
                No {formatStat(advice.weak)} quests at{" "}
                {LOCATION_MAP[state.locationId]?.name}. Travel somewhere that
                trains it.
              </p>
            )}
            {msg && (
              <p className="text-amber-200" role="status">
                {msg}
              </p>
            )}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {advice.best && (
              <Button
                type="button"
                onClick={() => {
                  const err = attemptQuest(advice.best!.id, true);
                  if (err) setMsg(err);
                  else setOpen(false);
                }}
              >
                Auto-equip & attempt recommended
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTab("journal");
                setOpen(false);
              }}
            >
              Open journal
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
