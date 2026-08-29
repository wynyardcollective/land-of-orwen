import {
  TAVERN_MAP,
  TAVERN_MISS_FLAVOR,
  TAVERN_RUMORS,
  TAVERN_TIP_GOLD,
  type TavernRumorDef,
} from "@/content/taverns";
import { clamp, computeStats, goldCap, paceDuration } from "./formulas";
import { adSpeedFactor } from "./ad-boost";
import { currentHeroHp, heroMaxHp } from "./combat";
import type { ActiveTavern, GameState, TavernResult } from "./types";
import { LOCATION_MAP } from "@/content";

function rumorAvailable(
  rumor: TavernRumorDef,
  state: GameState,
): boolean {
  if (state.tavernRumorsClaimed.includes(rumor.id)) return false;
  if (state.storyFlags.includes(rumor.flag)) return false;
  if (rumor.requiresFlags?.some((f) => !state.storyFlags.includes(f))) {
    return false;
  }
  if (rumor.skipIfFlags?.some((f) => state.storyFlags.includes(f))) {
    return false;
  }
  if (
    rumor.skipIfLocationUnlocked &&
    state.unlockedLocations.includes(rumor.skipIfLocationUnlocked)
  ) {
    return false;
  }
  if (
    rumor.kind === "secret_location" ||
    rumor.kind === "early_location"
  ) {
    if (
      rumor.unlockLocationId &&
      state.unlockedLocations.includes(rumor.unlockLocationId)
    ) {
      return false;
    }
  }
  return true;
}

function rumorPool(state: GameState, tavernId: string) {
  return TAVERN_RUMORS.filter(
    (r) => r.tavernId === tavernId && rumorAvailable(r, state),
  );
}

export function tavernRoundCost(state: GameState, tavernId: string): number {
  const tavern = TAVERN_MAP[tavernId];
  if (!tavern) return 0;
  const stats = computeStats(state);
  return Math.max(
    8,
    Math.round(tavern.baseCost - stats.charisma * 0.9),
  );
}

export function tavernHitChance(state: GameState): number {
  const stats = computeStats(state);
  return clamp(
    0.26 + stats.charisma * 0.028 + stats.wisdom * 0.012,
    0.18,
    0.72,
  );
}

export function tavernRoundDuration(state: GameState, tavernId: string): number {
  const tavern = TAVERN_MAP[tavernId];
  if (!tavern) return 30;
  const stats = computeStats(state);
  return paceDuration(
    tavern.roundSeconds,
    state.settings.pace,
    stats.constitution,
    adSpeedFactor(state),
  );
}

function pickWeighted(rumors: TavernRumorDef[]): TavernRumorDef | null {
  if (!rumors.length) return null;
  const total = rumors.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of rumors) {
    roll -= r.weight;
    if (roll <= 0) return r;
  }
  return rumors[rumors.length - 1];
}

function applyRumor(
  state: GameState,
  rumor: TavernRumorDef,
  cost: number,
  goldAlreadyPaid: boolean,
): GameState {
  const storyFlags = [...state.storyFlags];
  if (!storyFlags.includes(rumor.flag)) storyFlags.push(rumor.flag);

  const unlockedLocations = [...state.unlockedLocations];
  const journalUnlocked = [...state.journalUnlocked];
  let gold = state.gold;

  if (
    (rumor.kind === "secret_location" || rumor.kind === "early_location") &&
    rumor.unlockLocationId &&
    !unlockedLocations.includes(rumor.unlockLocationId)
  ) {
    unlockedLocations.push(rumor.unlockLocationId);
    const locFlag = LOCATION_MAP[rumor.unlockLocationId]?.unlockStoryFlag;
    if (locFlag && !storyFlags.includes(locFlag)) {
      storyFlags.push(locFlag);
    }
    if (rumor.kind === "early_location") {
      const earlyFlag = rumor.flag;
      if (!storyFlags.includes(earlyFlag)) storyFlags.push(earlyFlag);
    }
  }

  if (rumor.kind === "intel" && rumor.journalId) {
    if (!journalUnlocked.includes(rumor.journalId)) {
      journalUnlocked.push(rumor.journalId);
    }
  }

  if (rumor.kind === "tip_gold") {
    const tip =
      TAVERN_TIP_GOLD[Math.floor(Math.random() * TAVERN_TIP_GOLD.length)];
    const stats = computeStats(state);
    gold = clamp(gold + tip, 0, goldCap(stats.constitution));
  } else if (!goldAlreadyPaid) {
    gold = Math.max(0, gold - cost);
  }

  const tavernRumorsClaimed = [...state.tavernRumorsClaimed, rumor.id];

  const newlyUnlocked =
    rumor.unlockLocationId &&
    !state.unlockedLocations.includes(rumor.unlockLocationId)
      ? [rumor.unlockLocationId]
      : [];
  const lastUnlock =
    newlyUnlocked.length > 0
      ? {
          ids: newlyUnlocked,
          names: newlyUnlocked.map(
            (id) => LOCATION_MAP[id]?.name ?? id,
          ),
          at: Date.now(),
        }
      : state.lastUnlock;

  const result: TavernResult = {
    at: Date.now(),
    tavernId: rumor.tavernId,
    cost,
    hit: true,
    rumorId: rumor.id,
    headline: rumor.headline,
    detail: rumor.detail,
  };

  return {
    ...state,
    gold,
    storyFlags,
    unlockedLocations,
    journalUnlocked,
    tavernRumorsClaimed,
    lastUnlock,
    lastTavernResult: result,
    updatedAt: Date.now(),
  };
}

/** Begin listening at a tavern — gold is paid up front; outcome resolves when the timer ends. */
export function startTavernRound(
  state: GameState,
  tavernId: string,
): GameState | { error: string } {
  if (state.active) {
    return { error: "Finish traveling, questing, fighting, or listening first." };
  }
  if (state.pendingReward) {
    return { error: "Claim your reward first." };
  }

  const tavern = TAVERN_MAP[tavernId];
  if (!tavern) return { error: "Unknown tavern." };
  if (tavern.locationId !== state.locationId) {
    return { error: "You must be at this tavern to buy a round." };
  }

  const cost = tavernRoundCost(state, tavernId);
  if (state.gold < cost) {
    return { error: `Need ${cost} gold for a round of rumors.` };
  }

  const pool = rumorPool(state, tavernId);
  if (!pool.length) {
    return {
      error: "The regulars have nothing new for you. Try another tavern or advance the story.",
    };
  }

  const now = Date.now();
  const seconds = tavernRoundDuration(state, tavernId);
  const active: ActiveTavern = {
    type: "tavern",
    tavernId,
    cost,
    hitChance: tavernHitChance(state),
    startedAt: now,
    completesAt: now + seconds * 1000,
  };

  return {
    ...state,
    gold: state.gold - cost,
    active,
    updatedAt: now,
  };
}

/** Resolve a finished tavern round (called from the main action resolver). */
export function completeTavernRound(
  state: GameState,
  active: ActiveTavern,
): GameState {
  const { tavernId, cost, hitChance } = active;
  const pool = rumorPool(state, tavernId);
  const hit = pool.length > 0 && Math.random() < hitChance;

  if (!hit) {
    const miss =
      TAVERN_MISS_FLAVOR[
        Math.floor(Math.random() * TAVERN_MISS_FLAVOR.length)
      ];
    const result: TavernResult = {
      at: Date.now(),
      tavernId,
      cost,
      hit: false,
      headline: "Nothing useful",
      detail: miss,
    };
    return {
      ...state,
      active: null,
      lastTavernResult: result,
      updatedAt: Date.now(),
    };
  }

  const rumor = pickWeighted(pool);
  if (!rumor) {
    const result: TavernResult = {
      at: Date.now(),
      tavernId,
      cost,
      hit: false,
      headline: "Nothing useful",
      detail: "The rumor mill jammed. Your gold bought only warmth.",
    };
    return {
      ...state,
      active: null,
      lastTavernResult: result,
      updatedAt: Date.now(),
    };
  }

  return {
    ...applyRumor(state, rumor, cost, true),
    active: null,
  };
}

/** @deprecated Use startTavernRound — kept for callers migrating from instant rounds. */
export function buyTavernRound(state: GameState, tavernId: string) {
  return startTavernRound(state, tavernId);
}

export function availableTavernRumors(state: GameState, tavernId: string) {
  return rumorPool(state, tavernId).length;
}

/** Gold cost to restore all missing HP at a tavern (Charisma softens the bill). */
export function tavernHealCost(state: GameState): number {
  const maxHp = heroMaxHp(state);
  const hp = currentHeroHp(state, maxHp);
  const missing = maxHp - hp;
  if (missing <= 0) return 0;
  const stats = computeStats(state);
  return Math.max(
    6,
    Math.round(missing * 1.15 - stats.charisma * 0.6),
  );
}

/** Instant full heal at the tavern you're standing in — paid in gold. */
export function tavernHeal(
  state: GameState,
  tavernId: string,
): GameState | { error: string } {
  if (state.active) {
    return { error: "Finish what you're doing before resting at the tavern." };
  }
  if (state.pendingReward) {
    return { error: "Claim your reward first." };
  }
  const tavern = TAVERN_MAP[tavernId];
  if (!tavern) return { error: "Unknown tavern." };
  if (tavern.locationId !== state.locationId) {
    return { error: "You must be at this tavern to rest." };
  }

  const maxHp = heroMaxHp(state);
  const before = currentHeroHp(state, maxHp);
  if (before >= maxHp) {
    return { error: "You are already at full health." };
  }

  const cost = tavernHealCost(state);
  if (state.gold < cost) {
    return { error: `Need ${cost} gold to rest and recover.` };
  }

  const healed = maxHp - before;
  const result: TavernResult = {
    at: Date.now(),
    tavernId,
    cost,
    hit: true,
    headline: "Rested",
    detail: `${tavern.keeper} finds you a quiet corner. You recover ${healed} HP (${cost}g).`,
  };

  return {
    ...state,
    gold: state.gold - cost,
    heroHp: maxHp,
    wounded: false,
    lastTavernResult: result,
    updatedAt: Date.now(),
  };
}
