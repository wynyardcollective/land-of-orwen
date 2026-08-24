"use client";

import { JOURNAL, QUEST_MAP, currentGoals } from "@/content";
import { useGame } from "./game-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function JournalTab() {
  const { state } = useGame();
  const goals = currentGoals(state.storyFlags);
  const entries = JOURNAL.filter((j) => state.journalUnlocked.includes(j.id));

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
          <CardTitle className="text-base">Completed quests</CardTitle>
        </CardHeader>
        <CardContent>
          {state.completedQuests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No successful quests yet.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {state.completedQuests.map((id) => (
                <li key={id}>
                  <Badge variant="secondary">
                    {QUEST_MAP[id]?.name ?? id}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
