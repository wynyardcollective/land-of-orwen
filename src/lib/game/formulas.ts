import {
  AFFINITY_STAT,
  BASE_GOLD_CAP,
  PACE_MULTIPLIER,
  SLOT_QUEST_STAT,
  type EquipSlot,
  type GameState,
  type HeroStat,
  type OwnedItem,
  type Pace,
  type QuestDef,
  type QuestStat,
  type StatLevels,
} from "./types";
import { GEMS, ITEMS, QUESTS } from "@/content";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function paceDuration(baseSeconds: number, pace: Pace, constitution = 0) {
  const cut = constitution * 0.04;
  const scaled = baseSeconds * PACE_MULTIPLIER[pace] * (1 - clamp(cut, 0, 0.4));
  return Math.max(2, Math.round(scaled));
}

export function goldCap(constitution: number) {
  return BASE_GOLD_CAP + constitution * 25;
}

export function itemPowerBonus(item: OwnedItem, gems: GameState["gems"]) {
  let bonus = 0;
  if (item.gemId) {
    const owned = gems.find((g) => g.uid === item.gemId);
    if (owned) {
      const def = GEMS[owned.defId];
      if (def) bonus += def.bonus + (owned.tier - 1) * 2;
    }
  }
  return bonus;
}

export function computeStats(state: GameState): StatLevels {
  const stats: StatLevels = { ...state.stats };
  for (const slot of Object.keys(state.equipment) as EquipSlot[]) {
    const uid = state.equipment[slot];
    if (!uid) continue;
    const owned = state.inventory.find((i) => i.uid === uid);
    if (!owned) continue;
    const def = ITEMS[owned.defId];
    if (!def?.slot || !def.questStat || !def.affinity) continue;
    const power = owned.power + itemPowerBonus(owned, state.gems);
    stats[def.questStat] += power;
    const secondary = AFFINITY_STAT[def.affinity];
    stats[secondary] += Math.max(1, Math.floor(power / 2));
  }
  return stats;
}

export function successChance(
  heroStatLevel: number,
  questLevel: number,
  charisma = 0,
  rumor = false,
) {
  const delta = heroStatLevel - questLevel;
  let chance = 55 + delta * 12;
  if (rumor) chance += charisma * 2;
  return clamp(Math.round(chance), 5, 98);
}

export function autoEquipForQuest(state: GameState, quest: QuestDef): GameState {
  const next: GameState = {
    ...state,
    equipment: { ...state.equipment },
  };
  const slots = (Object.keys(SLOT_QUEST_STAT) as EquipSlot[]).filter(
    (s) => SLOT_QUEST_STAT[s] === quest.stat,
  );
  for (const slot of slots) {
    const candidates = state.inventory.filter((item) => {
      const def = ITEMS[item.defId];
      return def?.slot === slot;
    });
    if (!candidates.length) {
      delete next.equipment[slot];
      continue;
    }
    candidates.sort(
      (a, b) =>
        b.power +
        itemPowerBonus(b, state.gems) -
        (a.power + itemPowerBonus(a, state.gems)),
    );
    next.equipment[slot] = candidates[0].uid;
  }
  return next;
}

export function bestQuestForStat(
  state: GameState,
  stat: QuestStat,
): QuestDef | null {
  const available = QUESTS.filter(
    (q) =>
      q.locationId === state.locationId &&
      q.stat === stat &&
      state.unlockedLocations.includes(q.locationId),
  );
  if (!available.length) return null;
  const stats = computeStats(state);
  available.sort(
    (a, b) =>
      successChance(stats[a.stat], a.level, stats.charisma, a.rumor) -
      successChance(stats[b.stat], b.level, stats.charisma, b.rumor),
  );
  // Prefer something near 70–100%
  const good = available
    .map((q) => ({
      q,
      c: successChance(stats[q.stat], q.level, stats.charisma, q.rumor),
    }))
    .filter((x) => x.c >= 70)
    .sort((a, b) => b.q.level - a.q.level);
  return good[0]?.q ?? available[available.length - 1];
}

export function weakestQuestStat(state: GameState): QuestStat {
  const s = computeStats(state);
  const entries: [QuestStat, number][] = [
    ["strength", s.strength],
    ["dexterity", s.dexterity],
    ["intelligence", s.intelligence],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

export function formatStat(stat: HeroStat) {
  return stat.charAt(0).toUpperCase() + stat.slice(1);
}

export function formatSkill(skill: string) {
  return skill
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function rarityClass(rarity: string) {
  switch (rarity) {
    case "legendary":
      return "text-amber-300";
    case "rare":
      return "text-violet-300";
    case "uncommon":
      return "text-emerald-300";
    default:
      return "text-stone-300";
  }
}
