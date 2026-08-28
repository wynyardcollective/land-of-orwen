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
  MaterialTile,
  RecipeCard,
  SkillSectionHeader,
} from "./skill-ui";
import { cn } from "@/lib/utils";
import {
  Package,
  Hammer,
  UtensilsCrossed,
  Gem,
  BookOpen,
} from "lucide-react";

type CraftSection = "materials" | "smithing" | "cooking" | "gems" | "lore";

const SECTIONS: {
  id: CraftSection;
  label: string;
  icon: typeof Package;
}[] = [
  { id: "materials", label: "Sack", icon: Package },
  { id: "smithing", label: "Smithing", icon: Hammer },
  { id: "cooking", label: "Cooking", icon: UtensilsCrossed },
  { id: "gems", label: "Gems", icon: Gem },
  { id: "lore", label: "Lore", icon: BookOpen },
];

export function CraftTab() {
  const { state, upgrade, socket, loreGuess, resetLore, craftRecipe } = useGame();
  const [section, setSection] = useState<CraftSection>("materials");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [socketItem, setSocketItem] = useState("");
  const [socketGem, setSocketGem] = useState("");
  const socketReady = Boolean(socketItem && socketGem);

  const materialEntries = Object.entries(state.materials).filter(
    ([id, n]) => n > 0 && ITEMS[id]?.material,
  );
  const materialCount = materialEntries.reduce((sum, [, n]) => sum + n, 0);

  const smithingRecipes = RECIPES.filter((r) => r.skill === "smithing");
  const cookingRecipes = RECIPES.filter((r) => r.skill === "cooking");

  const readySmithing = smithingRecipes.filter((r) => {
    const level = skillLevel(state, r.skill);
    const atMill = !r.locationId || r.locationId === state.locationId;
    return level >= r.levelReq && hasMaterials(state, r.inputs) && atMill;
  }).length;

  const readyCooking = cookingRecipes.filter((r) => {
    const level = skillLevel(state, r.skill);
    return level >= r.levelReq && hasMaterials(state, r.inputs);
  }).length;

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-amber-800/25 bg-gradient-to-br from-amber-500/8 via-card/40 to-violet-900/10 px-4 py-3 backdrop-blur-sm">
        <h2 className="font-heading text-base font-semibold text-amber-100/95">
          Craft & workbench
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Materials from the map feed recipes here. Smith at Stonewheel Mill;
          cook anywhere with a full sack.
        </p>
      </header>

      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <nav
        className="flex flex-wrap gap-1 rounded-xl border border-border/50 bg-card/40 p-1 backdrop-blur-sm"
        aria-label="Craft sections"
      >
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          let hint = "";
          if (s.id === "materials" && materialCount > 0) hint = String(materialCount);
          if (s.id === "smithing" && readySmithing > 0) hint = `${readySmithing} ready`;
          if (s.id === "cooking" && readyCooking > 0) hint = `${readyCooking} ready`;
          if (s.id === "gems" && state.gems.length > 0) hint = String(state.gems.length);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSection(s.id);
                setError(null);
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition sm:flex-none sm:px-3",
                active
                  ? "bg-primary/15 text-amber-100 shadow-[inset_0_1px_0_oklch(1_0_0/_0.06)]"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
              <span>{s.label}</span>
              {hint && (
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] tabular-nums"
                >
                  {hint}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {section === "materials" && (
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading text-amber-100/95">
              Material sack
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {materialCount > 0
                ? `${materialCount} units across ${materialEntries.length} types`
                : "Gather fish, ore, wood, and herbs on the map."}
            </p>
          </CardHeader>
          <CardContent>
            {materialEntries.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/50 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                Empty for now. Train a skill at any town pin on the Map tab.
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
      )}

      {section === "smithing" && (
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <SkillSectionHeader
              skill="smithing"
              subtitle="Forge at Stonewheel Mill — smelt ore, then hammer gear"
            />
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {state.locationId !== "stone-mill" && (
              <p className="rounded-lg border border-orange-800/35 bg-orange-950/20 px-3 py-2 text-xs text-orange-100/90">
                Travel to <strong>Stonewheel Mill</strong> on the map to use the
                forge. Recipes below show what you can craft once there.
              </p>
            )}
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
      )}

      {section === "cooking" && (
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <SkillSectionHeader
              skill="cooking"
              subtitle="Cook anywhere — fish and herbs from your sack"
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
      )}

      {section === "gems" && (
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading text-amber-100/95">
                Gem upgrades
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Quest drops — upgrade with gold, then socket into gear.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {state.gems.length === 0 ? (
                <p className="text-muted-foreground">No gems yet. Complete quests for drops.</p>
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
                        <div className="min-w-0">
                          <p className="font-medium">
                            {def.name}{" "}
                            <Badge variant="outline">T{gem.tier}</Badge>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +{def.bonus + (gem.tier - 1) * 2}{" "}
                            {formatStat(AFFINITY_STAT[def.affinity])}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full shrink-0"
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
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading text-amber-100/95">
                Socket gem
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Bind a gem to gear for Constitution, Wisdom, or Charisma.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground" htmlFor="socket-item">
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
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground" htmlFor="socket-gem">
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
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  size="sm"
                  className="w-full rounded-full sm:w-auto"
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
                  Socket gem into item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {section === "lore" && (
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading text-amber-100/95">
              Shrine lore puzzle
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Match three symbols for the Rainward Gate. Guesses left:{" "}
              <strong>{state.loreGuessesLeft}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!socketReady && !state.loreSolved && (
              <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                Socket an item and a gem under <strong>Gems</strong> before
                submitting a guess.
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
                  Selected: {selected.join(" ") || "(none)"}
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
                  <Button type="button" variant="outline" onClick={() => setSelected([])}>
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
      )}
    </div>
  );
}
