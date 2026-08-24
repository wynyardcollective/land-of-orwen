"use client";

import { useState } from "react";
import { GEMS, ITEMS, LORE_SOLUTION, LORE_SYMBOLS } from "@/content";
import { AFFINITY_STAT, formatStat } from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CraftTab() {
  const { state, upgrade, socket, loreGuess, resetLore } = useGame();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [socketItem, setSocketItem] = useState("");
  const [socketGem, setSocketGem] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gem crafting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>Complete quests to find raw gems.</li>
            <li>Upgrade tiers to increase potency (costs gold).</li>
            <li>Socket gems into gear for Constitution, Wisdom, or Charisma.</li>
          </ol>
          {state.gems.length === 0 ? (
            <p className="text-muted-foreground">No gems yet.</p>
          ) : (
            <ul className="space-y-2">
              {state.gems.map((gem) => {
                const def = GEMS[gem.defId];
                if (!def) return null;
                const cost = gem.tier * 15;
                return (
                  <li
                    key={gem.uid}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {def.name}{" "}
                        <Badge variant="outline">T{gem.tier}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{def.bonus + (gem.tier - 1) * 2}{" "}
                        {formatStat(AFFINITY_STAT[def.affinity])} · {def.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={gem.tier >= 3}
                      onClick={() => {
                        const err = upgrade(gem.uid);
                        setError(err);
                      }}
                    >
                      Upgrade ({cost}g)
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="rounded-xl border border-border/60 p-3 space-y-2">
            <p className="font-medium">Socket gem into item</p>
            <label className="block text-xs text-muted-foreground" htmlFor="socket-item">
              Item
            </label>
            <select
              id="socket-item"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={socketItem}
              onChange={(e) => setSocketItem(e.target.value)}
            >
              <option value="">Select item…</option>
              {state.inventory.map((item) => {
                const def = ITEMS[item.defId];
                return (
                  <option key={item.uid} value={item.uid}>
                    {def?.name ?? item.defId}
                  </option>
                );
              })}
            </select>
            <label className="block text-xs text-muted-foreground" htmlFor="socket-gem">
              Gem
            </label>
            <select
              id="socket-gem"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={socketGem}
              onChange={(e) => setSocketGem(e.target.value)}
            >
              <option value="">Select gem…</option>
              {state.gems.map((gem) => {
                const def = GEMS[gem.defId];
                return (
                  <option key={gem.uid} value={gem.uid}>
                    {def?.name} T{gem.tier}
                  </option>
                );
              })}
            </select>
            <Button
              type="button"
              size="sm"
              disabled={!socketItem || !socketGem}
              onClick={() => {
                const err = socket(socketItem, socketGem);
                setError(err);
                if (!err) {
                  setSocketItem("");
                  setSocketGem("");
                }
              }}
            >
              Socket
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Lore research</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Match the three shrine symbols in order. Hint from the journal: cloud,
            moon, star — but you must place them yourself. Guesses left:{" "}
            <strong>{state.loreGuessesLeft}</strong>
          </p>
          {state.loreSolved ? (
            <p className="rounded-lg bg-emerald-950/50 p-3 text-sm text-emerald-200">
              Solved: {LORE_SOLUTION.join(" ")}. The Rainward Gate will accept you.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Symbol palette">
                {LORE_SYMBOLS.map((sym) => (
                  <Button
                    key={sym}
                    type="button"
                    variant={selected.includes(sym) ? "default" : "outline"}
                    className="text-lg"
                    aria-label={`Symbol ${sym}`}
                    aria-pressed={selected.includes(sym)}
                    onClick={() => {
                      setSelected((prev) => {
                        if (prev.includes(sym)) return prev.filter((s) => s !== sym);
                        if (prev.length >= 3) return prev;
                        return [...prev, sym];
                      });
                    }}
                  >
                    {sym}
                  </Button>
                ))}
              </div>
              <p className="text-sm" aria-live="polite">
                Selected order: {selected.join(" ") || "(none)"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={selected.length !== 3 || state.loreGuessesLeft <= 0}
                  onClick={() => {
                    const err = loreGuess(selected);
                    setError(err);
                    if (err) setSelected([]);
                  }}
                >
                  Submit guess
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected([])}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    resetLore();
                    setSelected([]);
                    setError(null);
                  }}
                >
                  Reset guesses
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
