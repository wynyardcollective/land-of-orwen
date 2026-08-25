"use client";

import { useState } from "react";
import { JOURNAL, LOCATION_MAP, QUEST_MAP, ENCOUNTER_MAP, currentGoals } from "@/content";
import { formatStat } from "@/lib/game";
import { useGame } from "./game-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function JournalTab() {
  const { state } = useGame();
  const goals = currentGoals(state.storyFlags);
  const entries = JOURNAL.filter((j) => state.journalUnlocked.includes(j.id));
  const [openQuestId, setOpenQuestId] = useState<string | null>(null);
  const [openEncounterId, setOpenEncounterId] = useState<string | null>(null);
  const openQuest = openQuestId ? QUEST_MAP[openQuestId] : null;
  const openEncounter = openEncounterId ? ENCOUNTER_MAP[openEncounterId] : null;
  const openLocation = openQuest
    ? LOCATION_MAP[openQuest.locationId]
    : openEncounter
      ? LOCATION_MAP[openEncounter.locationId]
      : undefined;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Current goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Story entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Journal is blank.</p>
          ) : (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-border/60 p-3"
              >
                <h3 className="font-medium text-amber-100">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {entry.body}
                </p>
              </article>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Heard in the field</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(state.npcReactions ?? {}).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Finish a quest and someone will have an opinion.
            </p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(state.npcReactions).map(([locId, rec]) => (
                <li
                  key={locId}
                  className="rounded-xl border border-border/60 p-3 text-sm"
                >
                  <p className="font-medium text-amber-100">
                    {rec.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {LOCATION_MAP[locId]?.name}
                    </span>
                  </p>
                  <p className="mt-1 italic text-muted-foreground">{rec.quote}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Completed quests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tap a quest to reread what you were asked to do.
          </p>
        </CardHeader>
        <CardContent>
          {state.completedQuests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No successful quests yet.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {state.completedQuests.map((id) => {
                const quest = QUEST_MAP[id];
                const label = quest?.name ?? id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => setOpenQuestId(id)}
                      aria-haspopup="dialog"
                      aria-label={`Details for ${label}`}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {label}
                      </Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Completed encounters</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tap a fight to reread what you faced.
          </p>
        </CardHeader>
        <CardContent>
          {(state.completedEncounters ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No victories in the field yet.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {(state.completedEncounters ?? []).map((id) => {
                const enc = ENCOUNTER_MAP[id];
                const label = enc?.name ?? id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => setOpenEncounterId(id)}
                      aria-haspopup="dialog"
                      aria-label={`Details for ${label}`}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {label}
                      </Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!openQuest || !!openEncounter}
        onOpenChange={(open) => {
          if (!open) {
            setOpenQuestId(null);
            setOpenEncounterId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {openQuest && (
            <>
              <DialogHeader>
                <DialogTitle>{openQuest.name}</DialogTitle>
                <DialogDescription>
                  {openLocation?.name ?? "Unknown place"} · Level{" "}
                  {openQuest.level} · {formatStat(openQuest.stat)}
                  {openQuest.rumor ? " · Rumor" : ""}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {openQuest.description}
              </p>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpenQuestId(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
          {openEncounter && !openQuest && (
            <>
              <DialogHeader>
                <DialogTitle>{openEncounter.name}</DialogTitle>
                <DialogDescription>
                  {openLocation?.name ?? "Unknown place"}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {openEncounter.description}
              </p>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpenEncounterId(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
