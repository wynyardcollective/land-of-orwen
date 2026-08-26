import { ITEMS } from "@/content/items";
import { clamp, computeStats, itemPowerBonus, paceDuration } from "./formulas";
import type {
  CombatStance,
  EnemyDef,
  EncounterDef,
  EquipSlot,
  GameState,
  QuestStat,
  StatLevels,
} from "./types";

export interface CombatSheet {
  maxHp: number;
  offense: number;
  armor: number;
  crit: number;
  /** Chance to land a hit (0–1) */
  accuracy: number;
}

/** Global multiplier applied to raw damage before armor. */
export const DAMAGE_SCALE = 0.62;

export function wardenGearPower(state: GameState): number {
  let total = 0;
  for (const slot of Object.keys(state.equipment) as EquipSlot[]) {
    const uid = state.equipment[slot];
    if (!uid) continue;
    const owned = state.inventory.find((i) => i.uid === uid);
    if (!owned) continue;
    const def = ITEMS[owned.defId];
    if (!def || def.affinity !== "warden") continue;
    total += owned.power + itemPowerBonus(owned, state.gems);
  }
  return total;
}

export function heroAccuracy(
  stats: StatLevels,
  stance: CombatStance,
  wounded = false,
): number {
  let chance =
    0.68 +
    stats.dexterity * 0.022 +
    stats.wisdom * 0.008 +
    (stance === "dexterity" ? 0.04 : 0) +
    (stance === "intelligence" ? stats.wisdom * 0.006 : 0);
  if (wounded) chance -= 0.05;
  return clamp(chance, 0.45, 0.92);
}

export function enemyAccuracy(enemy: EnemyDef): number {
  let chance = 0.62 + enemy.level * 0.018;
  if (enemy.traits.includes("swift")) chance += 0.07;
  if (enemy.traits.includes("brute")) chance -= 0.05;
  if (enemy.traits.includes("pack")) chance += 0.03;
  if (enemy.traits.includes("warded")) chance += 0.02;
  return clamp(chance, 0.42, 0.88);
}

export function deriveCombatSheet(
  stats: StatLevels,
  stance: CombatStance,
  state: GameState,
  wounded = false,
): CombatSheet {
  const wardenPower = wardenGearPower(state);
  const maxHp = Math.round(20 + stats.constitution * 8 + wardenPower * 2);
  const primary = stats[stance];
  const others = (["strength", "dexterity", "intelligence"] as QuestStat[])
    .filter((s) => s !== stance)
    .reduce((sum, s) => sum + stats[s] * 0.5, 0);
  let offense = Math.max(1, Math.round(primary + others));
  if (wounded) offense = Math.max(1, Math.round(offense * 0.95));
  const armor = Math.round(stats.constitution + wardenPower * 0.5);
  const crit = clamp(0.05 + stats.wisdom * 0.015, 0.05, 0.35);
  const accuracy = heroAccuracy(stats, stance, wounded);
  return { maxHp, offense, armor, crit, accuracy };
}

/** Max HP for the hero (stance-independent). */
export function heroMaxHp(state: GameState): number {
  const stats = computeStats(state);
  return deriveCombatSheet(stats, "strength", state, false).maxHp;
}

/** Current persistent HP, clamped to max. `null` save → full. */
export function currentHeroHp(state: GameState, maxHp = heroMaxHp(state)): number {
  if (state.heroHp == null) return maxHp;
  return clamp(state.heroHp, 0, maxHp);
}

export function isConsumableItem(def: { healAmount?: number; slot?: string } | undefined) {
  return !!def && typeof def.healAmount === "number" && def.healAmount > 0 && !def.slot;
}

export function resolveStance(
  requested: CombatStance | "auto",
  enemy: EnemyDef,
): CombatStance {
  if (requested !== "auto") return requested;
  return enemy.weakTo;
}

export function combatRoundDuration(
  encounter: EncounterDef,
  pace: GameState["settings"]["pace"],
  constitution: number,
) {
  return paceDuration(encounter.durationRoundSeconds, pace, constitution);
}

export type RiskBand = "safe" | "even" | "deadly";

/** Coarse prediction for UI — not a guarantee */
export function combatRiskBand(
  sheet: CombatSheet,
  enemy: EnemyDef,
  stance: CombatStance,
): RiskBand {
  const stanceMult = stance === enemy.weakTo ? 1.15 : 0.85;
  const heroHit = sheet.accuracy * (stance === enemy.weakTo ? 1.03 : 0.97);
  const enemyHit = enemyAccuracy(enemy);
  const heroDpr = Math.max(
    0.5,
    (sheet.offense * stanceMult * DAMAGE_SCALE - enemy.armor) * heroHit,
  );
  const enemyDpr = Math.max(
    0.5,
    (enemy.offense * DAMAGE_SCALE - sheet.armor) * enemyHit,
  );
  const roundsToKill = enemy.maxHp / heroDpr;
  const roundsToDie = sheet.maxHp / enemyDpr;
  const ratio = roundsToKill / Math.max(1, roundsToDie);
  if (ratio < 0.75) return "deadly";
  if (ratio > 1.35) return "safe";
  return "even";
}

export function formatRiskBand(band: RiskBand) {
  switch (band) {
    case "safe":
      return "Favorable";
    case "even":
      return "Even";
    case "deadly":
      return "Deadly";
  }
}

export function fleeChance(charisma: number) {
  return clamp(0.4 + charisma * 0.03, 0.35, 0.9);
}

export function jitterMultiplier() {
  return 0.85 + Math.random() * 0.3;
}

export function applyDamage(raw: number, armor: number) {
  return Math.max(1, Math.round(raw * DAMAGE_SCALE - armor));
}

export type AttackResult =
  | { hit: false; dmg: 0; crit: false }
  | { hit: true; dmg: number; crit: boolean };

export function heroAttack(
  offense: number,
  crit: number,
  accuracy: number,
  enemyArmor: number,
  stance: CombatStance,
  enemy: EnemyDef,
): AttackResult {
  let hitChance = accuracy;
  if (stance === enemy.weakTo) hitChance += 0.03;
  else hitChance -= 0.04;
  if (enemy.traits.includes("swift")) hitChance -= 0.03;
  hitChance = clamp(hitChance, 0.35, 0.95);

  if (Math.random() >= hitChance) {
    return { hit: false, dmg: 0, crit: false };
  }

  let raw = offense * jitterMultiplier();
  if (stance === enemy.weakTo) raw *= 1.15;
  else raw *= 0.92;
  if (enemy.traits.includes("warded") && stance === "intelligence") {
    raw *= 0.5;
  }
  const isCrit = Math.random() < crit;
  if (isCrit) raw *= 1.5;
  return { hit: true, dmg: applyDamage(raw, enemyArmor), crit: isCrit };
}

/** @deprecated Prefer heroAttack — kept for call-site migration */
export function heroDamage(
  offense: number,
  crit: number,
  enemyArmor: number,
  stance: CombatStance,
  enemy: EnemyDef,
  accuracy = 0.75,
): AttackResult {
  return heroAttack(offense, crit, accuracy, enemyArmor, stance, enemy);
}

export function enemyAttack(
  enemy: EnemyDef,
  heroArmor: number,
): AttackResult {
  const hitChance = enemyAccuracy(enemy);
  if (Math.random() >= hitChance) {
    return { hit: false, dmg: 0, crit: false };
  }

  let raw = enemy.offense * jitterMultiplier();
  if (enemy.traits.includes("brute")) raw *= 1.08;
  if (enemy.traits.includes("drought")) raw *= 1.05;
  if (enemy.traits.includes("pack")) raw *= 1.06;
  return { hit: true, dmg: applyDamage(raw, heroArmor), crit: false };
}

/** @deprecated Prefer enemyAttack */
export function enemyDamage(
  enemy: EnemyDef,
  heroArmor: number,
  _stance?: CombatStance,
): number {
  const result = enemyAttack(enemy, heroArmor);
  return result.hit ? result.dmg : 0;
}

export function encountersAtLocation(locationId: string, encounters: EncounterDef[]) {
  return encounters.filter((e) => e.locationId === locationId);
}

export function encounterAvailable(enc: EncounterDef, storyFlags: string[]) {
  if (!enc.minStoryFlags?.length) return true;
  return enc.minStoryFlags.every((f) => storyFlags.includes(f));
}
