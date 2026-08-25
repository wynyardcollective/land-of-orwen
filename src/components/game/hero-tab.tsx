"use client";

import { useState } from "react";
import { ATTRIBUTE_HELP, GEMS, ITEMS } from "@/content";
import {
  AFFINITY_STAT,
  computeStats,
  formatStat,
  goldCap,
  rarityClass,
  SLOT_QUEST_STAT,
  currentHeroHp,
  heroMaxHp,
  type EquipSlot,
  type HeroStat,
} from "@/lib/game";
import { useGame } from "./game-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SLOTS: EquipSlot[] = [
  "weapon",
  "head",
  "chest",
  "hands",
  "legs",
  "feet",
  "ring",
  "amulet",
];

const ATTRIBUTE_ORDER: HeroStat[] = [
  "strength",
  "dexterity",
  "intelligence",
  "constitution",
  "wisdom",
  "charisma",
];

export function HeroTab() {
  const { state, equip, unequip, sell, setName, useItem } = useGame();
  const { user } = useAuth();
  const [nameDraft, setNameDraft] = useState(state.heroName);
  const [openStat, setOpenStat] = useState<HeroStat | null>(null);
  const [invError, setInvError] = useState<string | null>(null);
  const stats = computeStats(state);
  const help = openStat ? ATTRIBUTE_HELP[openStat] : null;
  const gearBonus = openStat ? stats[openStat] - state.stats[openStat] : 0;
  const maxHp = heroMaxHp(state);
  const hp = currentHeroHp(state, maxHp);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              aria-label="Hero name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={24}
            />
            <Button type="button" onClick={() => setName(nameDraft)}>
              Save name
            </Button>
          </div>
          <p className="text-xs text-muted-foreground break-all">
            Account: {user?.email ?? "signed in"}
          </p>
          <p className="text-sm" aria-live="polite">
            Health{" "}
            <strong className={hp < maxHp * 0.35 ? "text-orange-200" : ""}>
              {hp}/{maxHp}
            </strong>
            {state.wounded ? " · wounded (−5% offense)" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Attributes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tap an attribute to learn what it does and how to raise it.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {ATTRIBUTE_ORDER.map((stat) => (
            <button
              key={stat}
              type="button"
              onClick={() => setOpenStat(stat)}
              className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-left transition hover:border-amber-300/70 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              aria-label={`${formatStat(stat)} ${stats[stat]}. Open details.`}
            >
              <p className="text-xs text-muted-foreground">{formatStat(stat)}</p>
              <p className="text-lg font-semibold">{stats[stat]}</p>
              <p className="text-[11px] text-muted-foreground">
                base {state.stats[stat]}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!openStat}
        onOpenChange={(open) => {
          if (!open) setOpenStat(null);
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
          {help && openStat && (
            <>
              <DialogHeader>
                <DialogTitle>{formatStat(openStat)}</DialogTitle>
                <DialogDescription>{help.summary}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>
                  Total {stats[openStat]} · base {state.stats[openStat]} · gear{" "}
                  {gearBonus >= 0 ? "+" : ""}
                  {gearBonus}
                </p>
                {openStat === "constitution" && (
                  <p className="text-muted-foreground">
                    Gold cap with this Constitution: {goldCap(stats.constitution)}.
                  </p>
                )}
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {help.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p>
                  <span className="font-medium">How to raise: </span>
                  {help.howToRaise}
                </p>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => setOpenStat(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SLOTS.map((slot) => {
            const uid = state.equipment[slot];
            const item = uid
              ? state.inventory.find((i) => i.uid === uid)
              : undefined;
            const def = item ? ITEMS[item.defId] : undefined;
            return (
              <div
                key={slot}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium capitalize">
                    {slot}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({formatStat(SLOT_QUEST_STAT[slot])})
                    </span>
                  </p>
                  <p className={def ? rarityClass(def.rarity) : "text-muted-foreground"}>
                    {def ? `${def.name} +${item!.power}` : "Empty"}
                  </p>
                </div>
                {uid && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => unequip(slot)}
                  >
                    Unequip
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {invError && (
            <p className="mb-2 text-sm text-destructive" role="alert">
              {invError}
            </p>
          )}
          {state.inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Pack is empty. Complete quests to find gear and remedies.
            </p>
          ) : (
            <ul className="space-y-3">
              {state.inventory.map((item) => {
                const def = ITEMS[item.defId];
                if (!def) return null;
                const isConsumable = !!def.healAmount && !def.slot;
                const equipped = Object.values(state.equipment).includes(item.uid);
                const gem = item.gemId
                  ? state.gems.find((g) => g.uid === item.gemId)
                  : undefined;
                const gemDef = gem ? GEMS[gem.defId] : undefined;
                return (
                  <li
                    key={item.uid}
                    className="rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${rarityClass(def.rarity)}`}>
                          {def.name}{" "}
                          {equipped && (
                            <Badge variant="secondary" className="ml-1">
                              Equipped
                            </Badge>
                          )}
                          {isConsumable && (
                            <Badge variant="outline" className="ml-1">
                              Remedy · +{def.healAmount} HP
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isConsumable
                            ? `Consumable · restores ${def.healAmount} HP`
                            : `${formatStat(def.questStat!)} +${item.power} · ${formatStat(AFFINITY_STAT[def.affinity!])} affinity · ${def.rarity}`}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {def.description}
                        </p>
                        {gemDef && (
                          <p className="mt-1 text-xs text-emerald-300/90">
                            Socket: {gemDef.name} T{gem!.tier}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isConsumable ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const err = useItem(item.uid);
                              setInvError(err);
                            }}
                          >
                            Use (+{def.healAmount} HP)
                          </Button>
                        ) : (
                          !equipped && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                setInvError(null);
                                equip(item.uid);
                              }}
                            >
                              Equip
                            </Button>
                          )
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setInvError(null);
                            sell(item.uid);
                          }}
                        >
                          Sell ({def.sellValue}g)
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Records — quests {state.records.questsCompleted}, encounters won{" "}
        {state.records.encountersWon ?? 0}, gold earned {state.records.goldEarned},
        legendaries {state.records.legendaryFound}, best streak{" "}
        {state.records.bestStreak ?? 0}
      </p>
    </div>
  );
}
