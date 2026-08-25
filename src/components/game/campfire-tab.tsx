"use client";

import { useState } from "react";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function timeAgo(at: number) {
  const s = Math.max(0, Math.floor((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function CampfireTab() {
  const { state, postNote } = useGame();
  const [text, setText] = useState("");
  const [view, setView] = useState<"chat" | "rankings">("chat");

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="tablist" aria-label="Campfire sections">
        <Button
          type="button"
          size="sm"
          variant={view === "chat" ? "default" : "outline"}
          role="tab"
          aria-selected={view === "chat"}
          onClick={() => setView("chat")}
        >
          Chat
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === "rankings" ? "default" : "outline"}
          role="tab"
          aria-selected={view === "rankings"}
          onClick={() => setView("rankings")}
        >
          Rankings
        </Button>
      </div>

      {view === "chat" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Campfire</CardTitle>
            <p className="text-sm text-muted-foreground">
              A cozy board of travelers. Messages are saved with your progress;
              seeded tips help new adventurers.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                postNote(text);
                setText("");
              }}
            >
              <Input
                aria-label="Campfire message"
                placeholder="Share a tip or discovery…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
              />
              <Button type="submit" disabled={!text.trim()}>
                Send
              </Button>
            </form>
            <ul className="space-y-3">
              {state.campfireMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="rounded-xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {msg.author}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {msg.kind}
                    </Badge>
                    <span>{timeAgo(msg.at)}</span>
                  </div>
                  <p className="mt-1 text-sm">{msg.body}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Quests completed:{" "}
              <strong>{state.records.questsCompleted}</strong>
            </p>
            <p>
              Gold earned: <strong>{state.records.goldEarned}</strong>
            </p>
            <p>
              Legendaries found:{" "}
              <strong>{state.records.legendaryFound}</strong>
            </p>
            <p>
              Best quest streak:{" "}
              <strong>{state.records.bestStreak ?? 0}</strong>
            </p>
            <p className="text-muted-foreground">
              Live multiplayer leaderboards are out of scope for this slice —
              these are your personal records, synced with cloud saves.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
