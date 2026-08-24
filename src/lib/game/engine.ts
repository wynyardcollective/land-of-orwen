import {
  GEMS,
  ITEMS,
  LOCATION_MAP,
  LORE_SOLUTION,
  QUEST_MAP,
  QUESTS,
} from "@/content";
import {
  autoEquipForQuest,
  clamp,
  computeStats,
  goldCap,
  paceDuration,
  successChance,
} from "./formulas";
import type {
  CampfireMessage,
  GameState,
  OwnedGem,
  OwnedItem,
  PendingReward,
  QuestDef,
} from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function pickItem(quest: QuestDef, wisdom: number, charisma: number): OwnedItem | undefined {
  if (!quest.itemPool.length) return undefined;
  const legendaryBoost = wisdom * 0.02;
  const pool = [...quest.itemPool];
  if (Math.random() < 0.08 + legendaryBoost) {
    const legendary = pool.find((id) => ITEMS[id]?.rarity === "legendary");
    if (legendary) {
      const def = ITEMS[legendary];
      return {
        uid: uid("item"),
        defId: legendary,
        power: def.basePower + Math.floor(charisma / 3),
      };
    }
  }
  const defId = pool[Math.floor(Math.random() * pool.length)];
  const def = ITEMS[defId];
  if (!def) return undefined;
  return {
    uid: uid("item"),
    defId,
    power: def.basePower + Math.floor(charisma / 4),
  };
}

function pickGem(quest: QuestDef, wisdom: number): OwnedGem | undefined {
  const chance = quest.gemChance + wisdom * 0.015;
  if (Math.random() > chance) return undefined;
  const ids = Object.keys(GEMS);
  const defId = ids[Math.floor(Math.random() * ids.length)];
  return { uid: uid("gem"), defId, tier: 1 };
}

export function resolveCompletedActions(state: GameState, now = Date.now()): GameState {
  if (!state.active || state.active.completesAt > now) return state;
  if (state.active.type === "travel") {
    const to = state.active.toLocationId;
    return {
      ...state,
      locationId: to,
      active: null,
      updatedAt: now,
    };
  }

  // Quest completion -> pending reward if none waiting
  if (state.pendingReward) return state;
  const quest = QUEST_MAP[state.active.questId];
  if (!quest) {
    return { ...state, active: null, updatedAt: now };
  }
  const stats = computeStats(state);
  const roll = Math.random() * 100;
  const success = roll <= state.active.successChance;
  const bonusGold = success
    ? Math.floor(quest.goldReward * (0.1 + stats.charisma * 0.03))
    : 0;
  const gold = success ? quest.goldReward : Math.max(1, Math.floor(quest.goldReward * 0.25));
  const item = success ? pickItem(quest, stats.wisdom, stats.charisma) : undefined;
  const gem = success ? pickGem(quest, stats.wisdom) : undefined;
  const narrative = success
    ? `You complete "${quest.name}". The land feels a fraction less hopeless.`
    : `You push through "${quest.name}" but come up short. Scrap gold is all you salvage—try again when better prepared.`;

  const reward: PendingReward = {
    questId: quest.id,
    success,
    gold,
    bonusGold,
    item,
    gem,
    narrative,
  };

  return {
    ...state,
    active: null,
    pendingReward: reward,
    updatedAt: now,
  };
}

export function claimReward(state: GameState): GameState {
  const reward = state.pendingReward;
  if (!reward) return state;
  const quest = QUEST_MAP[reward.questId];
  const stats = computeStats(state);
  const cap = goldCap(stats.constitution);
  let gold = clamp(state.gold + reward.gold + reward.bonusGold, 0, cap);
  const inventory = [...state.inventory];
  const gems = [...state.gems];
  const storyFlags = [...state.storyFlags];
  const unlockedLocations = [...state.unlockedLocations];
  const completedQuests = [...state.completedQuests];
  const journalUnlocked = [...state.journalUnlocked];
  const records = { ...state.records };

  if (reward.item) inventory.push(reward.item);
  if (reward.gem) gems.push(reward.gem);
  if (reward.success && quest) {
    if (!completedQuests.includes(quest.id)) completedQuests.push(quest.id);
    records.questsCompleted += 1;
    if (quest.storyFlagOnSuccess && !storyFlags.includes(quest.storyFlagOnSuccess)) {
      storyFlags.push(quest.storyFlagOnSuccess);
    }
    if (quest.unlockLocationId && !unlockedLocations.includes(quest.unlockLocationId)) {
      unlockedLocations.push(quest.unlockLocationId);
    }
    if (reward.item && ITEMS[reward.item.defId]?.rarity === "legendary") {
      records.legendaryFound += 1;
    }
  }
  records.goldEarned += reward.gold + reward.bonusGold;

  // Unlock journal entries by flag
  const flagToJournal: Record<string, string> = {
    mill_unlocked: "mill-note",
    shore_unlocked: "shore-note",
    canyon_unlocked: "canyon-note",
    tables_unlocked: "tables-note",
    shrine_unlocked: "shrine-note",
    chapter_complete: "ending",
  };
  for (const flag of storyFlags) {
    const jid = flagToJournal[flag];
    if (jid && !journalUnlocked.includes(jid)) journalUnlocked.push(jid);
  }

  // Stat XP: tiny bumps on success
  const nextStats = { ...state.stats };
  if (reward.success && quest) {
    nextStats[quest.stat] += 1;
  }

  return {
    ...state,
    gold,
    inventory,
    gems,
    storyFlags,
    unlockedLocations,
    completedQuests,
    journalUnlocked,
    stats: nextStats,
    records,
    pendingReward: null,
    updatedAt: Date.now(),
  };
}

export function startTravel(state: GameState, toLocationId: string): GameState | { error: string } {
  if (state.active) return { error: "You are already traveling or questing." };
  if (state.pendingReward) return { error: "Claim your reward first." };
  if (!state.unlockedLocations.includes(toLocationId)) {
    return { error: "That place is not yet on your map." };
  }
  if (toLocationId === state.locationId) {
    return { error: "You are already here." };
  }
  const loc = LOCATION_MAP[toLocationId];
  if (!loc) return { error: "Unknown location." };
  const stats = computeStats(state);
  const seconds = paceDuration(loc.travelSeconds, state.settings.pace, stats.constitution);
  const now = Date.now();
  return {
    ...state,
    active: {
      type: "travel",
      toLocationId,
      startedAt: now,
      completesAt: now + seconds * 1000,
    },
    updatedAt: now,
  };
}

export function startQuest(
  state: GameState,
  questId: string,
  withAutoEquip = false,
): GameState | { error: string } {
  if (state.active) return { error: "You are already traveling or questing." };
  if (state.pendingReward) return { error: "Claim your reward first." };
  const quest = QUEST_MAP[questId];
  if (!quest) return { error: "Unknown quest." };
  if (quest.locationId !== state.locationId) {
    return { error: "Travel to that location first." };
  }
  if (quest.id === "shrine-open" && !state.loreSolved) {
    return { error: "Solve the lore puzzle in Craft before opening the gate." };
  }
  let next = withAutoEquip ? autoEquipForQuest(state, quest) : state;
  const stats = computeStats(next);
  const chance = successChance(stats[quest.stat], quest.level, stats.charisma, quest.rumor);
  const seconds = paceDuration(quest.durationSeconds, next.settings.pace, stats.constitution);
  const now = Date.now();
  return {
    ...next,
    active: {
      type: "quest",
      questId,
      startedAt: now,
      completesAt: now + seconds * 1000,
      successChance: chance,
      equippedSnapshot: { ...next.equipment },
    },
    updatedAt: now,
  };
}

export function equipItem(state: GameState, itemUid: string): GameState {
  const item = state.inventory.find((i) => i.uid === itemUid);
  if (!item) return state;
  const def = ITEMS[item.defId];
  if (!def) return state;
  return {
    ...state,
    equipment: { ...state.equipment, [def.slot]: itemUid },
    updatedAt: Date.now(),
  };
}

export function unequipSlot(state: GameState, slot: keyof GameState["equipment"]): GameState {
  const equipment = { ...state.equipment };
  delete equipment[slot];
  return { ...state, equipment, updatedAt: Date.now() };
}

export function sellItem(state: GameState, itemUid: string): GameState {
  const item = state.inventory.find((i) => i.uid === itemUid);
  if (!item) return state;
  const def = ITEMS[item.defId];
  if (!def) return state;
  const equipment = { ...state.equipment };
  for (const [slot, uid] of Object.entries(equipment)) {
    if (uid === itemUid) delete equipment[slot as keyof typeof equipment];
  }
  const stats = computeStats(state);
  const cap = goldCap(stats.constitution);
  return {
    ...state,
    gold: clamp(state.gold + def.sellValue, 0, cap),
    inventory: state.inventory.filter((i) => i.uid !== itemUid),
    equipment,
    updatedAt: Date.now(),
  };
}

export function upgradeGem(state: GameState, gemUid: string): GameState | { error: string } {
  const gem = state.gems.find((g) => g.uid === gemUid);
  if (!gem) return { error: "Gem not found." };
  if (gem.tier >= 3) return { error: "This gem is already at max tier." };
  const cost = gem.tier * 15;
  if (state.gold < cost) return { error: `Need ${cost} gold to upgrade.` };
  return {
    ...state,
    gold: state.gold - cost,
    gems: state.gems.map((g) =>
      g.uid === gemUid ? { ...g, tier: g.tier + 1 } : g,
    ),
    updatedAt: Date.now(),
  };
}

export function socketGem(
  state: GameState,
  itemUid: string,
  gemUid: string,
): GameState | { error: string } {
  const item = state.inventory.find((i) => i.uid === itemUid);
  const gem = state.gems.find((g) => g.uid === gemUid);
  if (!item || !gem) return { error: "Item or gem missing." };
  // Unequip gem from other items
  const inventory = state.inventory.map((i) =>
    i.gemId === gemUid ? { ...i, gemId: undefined } : i,
  );
  return {
    ...state,
    inventory: inventory.map((i) =>
      i.uid === itemUid ? { ...i, gemId: gemUid } : i,
    ),
    updatedAt: Date.now(),
  };
}

export function tryLoreGuess(
  state: GameState,
  symbols: string[],
): GameState | { error: string } {
  if (state.loreSolved) return { error: "Lore already solved." };
  if (state.loreGuessesLeft <= 0) return { error: "No guesses left. Travel and quest for inspiration, then reset." };
  const ok =
    symbols.length === LORE_SOLUTION.length &&
    symbols.every((s, i) => s === LORE_SOLUTION[i]);
  if (ok) {
    return {
      ...state,
      loreSolved: true,
      loreSelected: symbols,
      loreGuessesLeft: state.loreGuessesLeft - 1,
      storyFlags: state.storyFlags.includes("lore_solved")
        ? state.storyFlags
        : [...state.storyFlags, "lore_solved"],
      updatedAt: Date.now(),
    };
  }
  return {
    ...state,
    loreSelected: symbols,
    loreGuessesLeft: state.loreGuessesLeft - 1,
    updatedAt: Date.now(),
  };
}

export function resetLoreGuesses(state: GameState): GameState {
  if (state.loreSolved) return state;
  return { ...state, loreGuessesLeft: 5, loreSelected: [], updatedAt: Date.now() };
}

export function addCampfireNote(state: GameState, body: string): GameState {
  const msg: CampfireMessage = {
    id: uid("note"),
    author: state.heroName,
    body: body.trim().slice(0, 280),
    kind: "chat",
    at: Date.now(),
  };
  return {
    ...state,
    campfireMessages: [msg, ...state.campfireMessages].slice(0, 40),
    playerNotes: [body.trim(), ...state.playerNotes].slice(0, 20),
    updatedAt: Date.now(),
  };
}

export function renameHero(state: GameState, name: string): GameState {
  const heroName = name.trim().slice(0, 24) || state.heroName;
  return { ...state, heroName, updatedAt: Date.now() };
}

export function questsAtLocation(locationId: string): QuestDef[] {
  return QUESTS.filter((q) => q.locationId === locationId);
}

export { autoEquipForQuest };
