"use client";

import { useState } from "react";
import { GEMS, ITEMS, LORE_SOLUTION, LORE_SYMBOLS, RECIPES } from "@/content";
import {
  AFFINITY_STAT,
  formatStat,
  skillLevel,
  hasMaterials,
} from "@/lib/game";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CraftSkillsIntro,
  MaterialTile,
  RecipeCard,
  SkillSectionHeader,
} from "./skill-ui";

export function CraftTab() {
  const { state, upgrade, socket, loreGuess, resetLore, craftRecipe } = useGame();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [socketItem, setSocketItem] = useState("");
  const [socketGem, setSocketGem] = useState("");
  const socketReady = Boolean(socketItem && socketGem);

  const materialEntries = Object.entries(state.materials).filter(
    ([id, n]) => n > 0 && ITEMS[id]?.material,
  );

  const smithingRecipes = RECIPES.filter((r) => r.skill === "smithing");
  const cookingRecipes = RECIPES.filter((r) => r.skill === "cooking");

  return (
    <div className="space-y-4">
      <CraftSkillsIntro />

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading text-amber-100/95">
            Material sack
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gathered on the road — fish, ore, wood, and cooked goods.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {materialEntries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/50 bg-muted/20 px-4 py-6 text-center text-muted-foreground">
              Empty for now. Open the map, visit a town, and train a skill.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {materialEntries.map(([id, count]) => (
                <MaterialTile key={id} id={id} count={count} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3 space-y-4">
          <SkillSectionHeader
            skill="smithing"
            subtitle="Smelt and forge at Stonewheel Mill"
          />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-3">
            {smithingRecipes.map((recipe) => {
              const level = skillLevel(state, recipe.skill);
              const locked = level < recipe.levelReq;
              const canCraft = hasMaterials(state, recipe.inputs);
              const atLocation =
                !recipe.locationId || recipe.locationId === state.locationId;
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  level={level}
                  locked={locked}
                  canCraft={canCraft}
                  atLocation={atLocation}
                  materialCounts={state.materials}
                  onCraft={() => {
                    const err = craftRecipe(recipe.id);
                    setError(err);
                  }}
                />
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3 space-y-4">
          <SkillSectionHeader
            skill="cooking"
            subtitle="Cook anywhere with ingredients in your sack"
          />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-3">
            {cookingRecipes.map((recipe) => {
              const level = skillLevel(state, recipe.skill);
              const locked = level < recipe.levelReq;
              const canCraft = hasMaterials(state, recipe.inputs);
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  level={level}
                  locked={locked}
                  canCraft={canCraft}
                  atLocation={true}
                  materialCounts={state.materials}
                  onCraft={() => {
                    const err = craftRecipe(recipe.id);
                    setError(err);
                  }}
                />
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading text-amber-100/95">
            Gem crafting
          </CardTitle>
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
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/40 bg-card/30 p-3"
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
                      className="rounded-full"
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

          <div className="rounded-xl border border-border/40 bg-card/30 p-3 space-y-2">
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
              className="rounded-full"
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

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading text-amber-100/95">
            Lore research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Match the three shrine symbols in order. Hint from the journal: cloud,
            moon, star — but you must place them yourself. Guesses left:{" "}
            <strong>{state.loreGuessesLeft}</strong>
          </p>
          {!socketReady && !state.loreSolved && (
            <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
              Select an item and a gem in the socket panel above before you can
              submit a lore guess.
            </p>
          )}
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
                  disabled={
                    selected.length !== 3 ||
                    state.loreGuessesLeft <= 0 ||
                    !socketReady
                  }
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
