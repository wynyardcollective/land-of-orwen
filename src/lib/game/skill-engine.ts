import {
  ITEMS,
  SKILL_ACTIVITY_MAP,
  RECIPE_MAP,
  SKILL_BEATS,
} from "@/content";
import { paceDuration, clamp, computeStats } from "./formulas";
import { adSpeedFactor } from "./ad-boost";
import type {
  ActiveSkill,
  GameState,
  OwnedItem,
  PendingReward,
  SkillId,
  SkillLevels,
} from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

/** XP required per level tier — level 1 at 0 xp, level 2 at 15, etc. */
export const SKILL_XP_PER_LEVEL = 15;

export function skillLevelFromXp(xp: number): number {
  return Math.min(99, 1 + Math.floor(xp / SKILL_XP_PER_LEVEL));
}

export function skillLevel(state: GameState, skillId: SkillId): number {
  return skillLevelFromXp(state.skillXp[skillId] ?? 0);
}

export function materialCount(state: GameState, materialId: string): number {
  return state.materials[materialId] ?? 0;
}

export function hasMaterials(
  state: GameState,
  inputs: { materialId: string; amount: number }[],
): boolean {
  return inputs.every((i) => materialCount(state, i.materialId) >= i.amount);
}

export function deductMaterials(
  state: GameState,
  inputs: { materialId: string; amount: number }[],
): Record<string, number> {
  const materials = { ...state.materials };
  for (const input of inputs) {
    const left = (materials[input.materialId] ?? 0) - input.amount;
    if (left <= 0) delete materials[input.materialId];
    else materials[input.materialId] = left;
  }
  return materials;
}

export function addMaterials(
  materials: Record<string, number>,
  gains: Record<string, number>,
): Record<string, number> {
  const next = { ...materials };
  for (const [id, amount] of Object.entries(gains)) {
    if (amount <= 0) continue;
    next[id] = (next[id] ?? 0) + amount;
  }
  return next;
}

function rollYield(
  activity: import("./types").SkillActivityDef,
  wisdom: number,
): Record<string, number> {
  const gains: Record<string, number> = {};
  for (const y of activity.yields) {
    const span = y.max - y.min + 1;
    const base = y.min + Math.floor(Math.random() * span);
    const bonus = Math.random() < wisdom * 0.04 ? 1 : 0;
    gains[y.materialId] = base + bonus;
  }
  if (
    activity.rareMaterialId &&
    activity.rareChance &&
    Math.random() < activity.rareChance + wisdom * 0.02
  ) {
    gains[activity.rareMaterialId] =
      (gains[activity.rareMaterialId] ?? 0) + 1;
  }
  return gains;
}

export function startSkillActivity(
  state: GameState,
  activityId: string,
): GameState | { error: string } {
  if (state.active) {
    return {
      error: "You are already traveling, working, fighting, training, or listening at a tavern.",
    };
  }
  if (state.pendingReward) return { error: "Claim your reward first." };

  const activity = SKILL_ACTIVITY_MAP[activityId];
  if (!activity) return { error: "Unknown skill activity." };
  if (activity.locationId !== state.locationId) {
    return { error: "Travel to that location first." };
  }
  const level = skillLevel(state, activity.skill);
  if (level < activity.levelReq) {
    return {
      error: `Need ${activity.skill} level ${activity.levelReq} (you are ${level}).`,
    };
  }

  const stats = computeStats(state);
  const seconds = paceDuration(
    activity.durationSeconds,
    state.settings.pace,
    stats.constitution,
    adSpeedFactor(state),
  );
  const now = Date.now();
  return {
    ...state,
    active: {
      type: "skill",
      activityId,
      startedAt: now,
      completesAt: now + seconds * 1000,
    },
    updatedAt: now,
  };
}

export function startRecipeCraft(
  state: GameState,
  recipeId: string,
): GameState | { error: string } {
  if (state.active) {
    return {
      error: "You are already traveling, working, fighting, training, or listening at a tavern.",
    };
  }
  if (state.pendingReward) return { error: "Claim your reward first." };

  const recipe = RECIPE_MAP[recipeId];
  if (!recipe) return { error: "Unknown recipe." };
  if (recipe.locationId && recipe.locationId !== state.locationId) {
    return { error: "Travel to the forge at Stonewheel Mill first." };
  }
  const level = skillLevel(state, recipe.skill);
  if (level < recipe.levelReq) {
    return {
      error: `Need ${recipe.skill} level ${recipe.levelReq} (you are ${level}).`,
    };
  }
  if (!hasMaterials(state, recipe.inputs)) {
    return { error: "You don't have enough materials for this recipe." };
  }

  const stats = computeStats(state);
  const seconds = paceDuration(
    recipe.durationSeconds,
    state.settings.pace,
    stats.constitution,
    adSpeedFactor(state),
  );
  const now = Date.now();
  return {
    ...state,
    materials: deductMaterials(state, recipe.inputs),
    active: {
      type: "skill",
      recipeId,
      startedAt: now,
      completesAt: now + seconds * 1000,
    },
    updatedAt: now,
  };
}

export function completeSkillActivity(
  state: GameState,
  active: ActiveSkill,
): GameState {
  const stats = computeStats(state);
  const now = Date.now();

  if (active.activityId) {
    const activity = SKILL_ACTIVITY_MAP[active.activityId];
    if (!activity) {
      return { ...state, active: null, updatedAt: now };
    }
    const materials = rollYield(activity, stats.wisdom);
    const narrative = `You finish "${activity.name}" and pack your haul.`;
    const reward: PendingReward = {
      kind: "skill",
      questId: activity.id,
      success: true,
      gold: 0,
      bonusGold: 0,
      narrative,
      tone: "success",
      streak: 0,
      skillId: activity.skill,
      skillXp: activity.xp,
      materials,
      activityName: activity.name,
    };
    return {
      ...state,
      active: null,
      pendingReward: reward,
      updatedAt: now,
    };
  }

  if (active.recipeId) {
    const recipe = RECIPE_MAP[active.recipeId];
    if (!recipe) {
      return { ...state, active: null, updatedAt: now };
    }
    const materials: Record<string, number> = {};
    let item: OwnedItem | undefined;
    if (recipe.outputMaterialId && recipe.outputAmount) {
      materials[recipe.outputMaterialId] = recipe.outputAmount;
    }
    if (recipe.outputItemId) {
      const def = ITEMS[recipe.outputItemId];
      if (def) {
        item = {
          uid: uid("item"),
          defId: recipe.outputItemId,
          power: def.basePower,
        };
      }
    }
    const narrative = `You complete "${recipe.name}". The work holds.`;
    const reward: PendingReward = {
      kind: "skill",
      questId: recipe.id,
      success: true,
      gold: 0,
      bonusGold: 0,
      item,
      narrative,
      tone: "success",
      streak: 0,
      skillId: recipe.skill,
      skillXp: recipe.xp,
      materials: Object.keys(materials).length ? materials : undefined,
      activityName: recipe.name,
    };
    return {
      ...state,
      active: null,
      pendingReward: reward,
      updatedAt: now,
    };
  }

  return { ...state, active: null, updatedAt: now };
}

export function applySkillReward(
  state: GameState,
  reward: PendingReward,
): Pick<GameState, "skillXp" | "materials" | "records"> {
  const skillId = reward.skillId;
  let skillXp = { ...state.skillXp };
  if (skillId && reward.skillXp) {
    skillXp = {
      ...skillXp,
      [skillId]: (skillXp[skillId] ?? 0) + reward.skillXp,
    };
  }
  let materials = state.materials;
  if (reward.materials) {
    materials = addMaterials(materials, reward.materials);
  }

  const records = {
    ...state.records,
    skillsCompleted: (state.records.skillsCompleted ?? 0) + 1,
  };

  return { skillXp, materials, records };
}

export function skillBeatForActive(active: ActiveSkill): string[] {
  if (active.activityId) {
    const act = SKILL_ACTIVITY_MAP[active.activityId];
    return SKILL_BEATS[act?.skill ?? "woodcutting"] ?? [];
  }
  if (active.recipeId) {
    const recipe = RECIPE_MAP[active.recipeId];
    return SKILL_BEATS[recipe?.skill ?? "smithing"] ?? [];
  }
  return [];
}

export const EMPTY_SKILL_XP: SkillLevels = {
  fishing: 0,
  mining: 0,
  smithing: 0,
  woodcutting: 0,
  cooking: 0,
};
