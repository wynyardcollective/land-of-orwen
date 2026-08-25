import {
  ENCOUNTERS,
  ENCOUNTER_MAP,
  ENEMY_MAP,
} from "@/content/encounters";
import {
  combatLine,
  combatNpcQuote,
} from "@/content/combat-flavor";
import { GEMS, ITEMS, LOCATION_MAP, DROUGHT_OMENS } from "@/content";
import {
  autoEquipForQuest,
  clamp,
  computeStats,
} from "./formulas";
import {
  combatRoundDuration,
  deriveCombatSheet,
  enemyDamage,
  fleeChance,
  heroDamage,
  resolveStance,
} from "./combat";
import type {
  ActiveCombat,
  CombatLogLine,
  CombatStance,
  EncounterDef,
  GameState,
  OwnedGem,
  OwnedItem,
  PendingReward,
  QuestDef,
  RewardTone,
} from "./types";

const LOG_CAP = 12;

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function pushLog(combat: ActiveCombat, text: string): CombatLogLine[] {
  const line: CombatLogLine = { round: combat.round, text, at: Date.now() };
  return [...combat.log, line].slice(-LOG_CAP);
}

function itemDropChance(enc: EncounterDef, wisdom: number) {
  return clamp(enc.itemChance + wisdom * 0.02, 0, 0.85);
}

function pickEncounterItem(
  enc: EncounterDef,
  wisdom: number,
  charisma: number,
  force = false,
): OwnedItem | undefined {
  if (!enc.itemPool.length) return undefined;
  if (!force && Math.random() > itemDropChance(enc, wisdom)) return undefined;
  const legendaryBoost = wisdom * 0.02;
  const pool = [...enc.itemPool];
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

function pickEncounterGem(enc: EncounterDef, wisdom: number): OwnedGem | undefined {
  const chance = enc.gemChance + wisdom * 0.015;
  if (Math.random() > chance) return undefined;
  const ids = Object.keys(GEMS);
  const defId = ids[Math.floor(Math.random() * ids.length)];
  return { uid: uid("gem"), defId, tier: 1 };
}

function fakeQuestForStance(stance: CombatStance): QuestDef {
  return {
    id: "_combat",
    locationId: "",
    name: "",
    description: "",
    level: 1,
    stat: stance,
    durationSeconds: 1,
    goldReward: 0,
    itemPool: [],
    itemChance: 0,
    gemChance: 0,
  };
}

function getEnemyForCombat(combat: ActiveCombat) {
  return ENEMY_MAP[combat.enemyId];
}

export function startCombat(
  state: GameState,
  encounterId: string,
  stanceInput: CombatStance | "auto" = "auto",
): GameState | { error: string } {
  if (state.active) return { error: "You are already traveling, questing, or fighting." };
  if (state.pendingReward) return { error: "Claim your reward first." };
  const enc = ENCOUNTER_MAP[encounterId];
  if (!enc) return { error: "Unknown encounter." };
  if (enc.locationId !== state.locationId) {
    return { error: "Travel to that location first." };
  }
  if (enc.minStoryFlags?.some((f) => !state.storyFlags.includes(f))) {
    return { error: "This threat is not active yet — progress the story first." };
  }
  const enemy = ENEMY_MAP[enc.enemyId];
  if (!enemy) return { error: "Unknown enemy." };
  const stance = resolveStance(stanceInput, enemy);
  const fakeQuest = fakeQuestForStance(stance);
  let next = autoEquipForQuest(state, fakeQuest);
  const stats = computeStats(next);
  const sheet = deriveCombatSheet(stats, stance, next, next.wounded);
  const now = Date.now();
  const roundMs =
    combatRoundDuration(enc, next.settings.pace, stats.constitution) * 1000;

  const combat: ActiveCombat = {
    type: "combat",
    encounterId,
    enemyId: enc.enemyId,
    stance,
    waveIndex: 0,
    heroHp: sheet.maxHp,
    heroMaxHp: sheet.maxHp,
    enemyHp: enemy.maxHp,
    enemyMaxHp: enemy.maxHp,
    round: 0,
    startedAt: now,
    nextRoundAt: now + roundMs,
    log: [
      {
        round: 0,
        text: `You engage ${enemy.name}. Stance: ${stance}.`,
        at: now,
      },
    ],
    equippedSnapshot: { ...next.equipment },
    heroOffense: sheet.offense,
    heroArmor: sheet.armor,
    heroCrit: sheet.crit,
  };

  return { ...next, active: combat, updatedAt: now };
}

export function fleeCombat(state: GameState): GameState | { error: string } {
  if (!state.active || state.active.type !== "combat") {
    return { error: "You are not in combat." };
  }
  const combat = state.active;
  const enc = ENCOUNTER_MAP[combat.encounterId];
  const enemy = ENEMY_MAP[combat.enemyId];
  if (!enc || !enemy) return { error: "Combat state invalid." };
  const stats = computeStats(state);
  const now = Date.now();
  const fled = Math.random() < fleeChance(stats.charisma);

  if (!fled) {
    const dmg = enemyDamage(enemy, combat.heroArmor, combat.stance);
    const heroHp = Math.max(0, combat.heroHp - dmg);
    const log = pushLog(
      combat,
      combatLine(enemy.id, "enemyHit", `${enemy.name} catches you as you turn.`),
    );
    if (heroHp <= 0) {
      return finishCombatDefeat(state, combat, enc, now);
    }
    return {
      ...state,
      active: { ...combat, heroHp, log, nextRoundAt: now + 500 },
      updatedAt: now,
    };
  }

  const scrap = Math.max(1, Math.floor(enc.goldReward * 0.15));
  const reward: PendingReward = {
    kind: "combat",
    questId: "",
    encounterId: enc.id,
    success: false,
    gold: scrap,
    bonusGold: 0,
    narrative: `You slip away from ${enemy.name}. Scrap gold is all you salvage.`,
    tone: "fail",
    streak: 0,
  };

  return {
    ...state,
    active: null,
    pendingReward: reward,
    updatedAt: now,
  };
}

function finishCombatVictory(
  state: GameState,
  combat: ActiveCombat,
  enc: EncounterDef,
  now: number,
  lastHitCrit: boolean,
): GameState {
  const enemy = ENEMY_MAP[combat.enemyId]!;
  const stats = computeStats(state);
  const heroLow = combat.heroHp / combat.heroMaxHp < 0.2;
  let tone: RewardTone = "success";
  if (lastHitCrit) tone = "jackpot";
  else if (heroLow) tone = "close-win";

  let bonusGold = Math.floor(enc.goldReward * (0.1 + stats.charisma * 0.03));
  let gold = enc.goldReward;
  if (tone === "jackpot") {
    gold += Math.max(3, Math.ceil(enc.goldReward * 0.5));
    bonusGold += 2;
  }

  let item = pickEncounterItem(enc, stats.wisdom, stats.charisma);
  let gem = pickEncounterGem(enc, stats.wisdom);
  if (tone === "jackpot" && !gem) {
    gem = pickEncounterGem({ ...enc, gemChance: 1 }, stats.wisdom);
  }
  if (tone === "jackpot" && !item && enc.itemPool.length) {
    item = pickEncounterItem(enc, stats.wisdom + 4, stats.charisma, true);
  }

  let narrative: string;
  if (tone === "jackpot") narrative = combatLine(enemy.id, "jackpot", `${enemy.name} falls spectacularly.`);
  else if (tone === "close-win") narrative = combatLine(enemy.id, "closeWin", `You barely stand over ${enemy.name}.`);
  else narrative = combatLine(enemy.id, "victory", `${enemy.name} is defeated.`);

  const spoken = combatNpcQuote(enc.locationId, tone);
  const nextSuccessStreak = (state.successStreak ?? 0) + 1;

  const reward: PendingReward = {
    kind: "combat",
    questId: "",
    encounterId: enc.id,
    success: true,
    gold,
    bonusGold,
    item,
    gem,
    narrative,
    tone,
    npcName: spoken.name,
    npcQuote: spoken.quote,
    streak: nextSuccessStreak,
    streakBonus:
      nextSuccessStreak % 3 === 0
        ? `Streak of ${nextSuccessStreak}. The well remembers you — Constitution +1.`
        : undefined,
    unlockName: enc.unlockLocationId
      ? LOCATION_MAP[enc.unlockLocationId]?.name
      : undefined,
    legendary: item ? ITEMS[item.defId]?.rarity === "legendary" : false,
  };

  return {
    ...state,
    active: null,
    pendingReward: reward,
    wounded: false,
    updatedAt: now,
  };
}

function finishCombatDefeat(
  state: GameState,
  combat: ActiveCombat,
  enc: EncounterDef,
  now: number,
): GameState {
  const enemy = ENEMY_MAP[combat.enemyId]!;
  const stats = computeStats(state);
  const nextFailStreak = (state.failStreak ?? 0) + 1;
  const omenText =
    nextFailStreak >= 2
      ? DROUGHT_OMENS[Math.floor(Math.random() * DROUGHT_OMENS.length)]
      : undefined;
  const spoken = combatNpcQuote(enc.locationId, "fail");
  const gold = Math.max(1, Math.floor(enc.goldReward * 0.2));

  const reward: PendingReward = {
    kind: "combat",
    questId: "",
    encounterId: enc.id,
    success: false,
    gold,
    bonusGold: 0,
    narrative: combatLine(enemy.id, "defeat", `${enemy.name} drives you back.`),
    tone: "fail",
    npcName: spoken.name,
    npcQuote: spoken.quote,
    omen: omenText,
    streak: 0,
  };

  return {
    ...state,
    active: null,
    pendingReward: reward,
    wounded: true,
    updatedAt: now,
  };
}

function advanceOneRound(state: GameState, now: number): GameState {
  const combat = state.active;
  if (!combat || combat.type !== "combat") return state;
  const enc = ENCOUNTER_MAP[combat.encounterId];
  const enemy = ENEMY_MAP[combat.enemyId];
  if (!enc || !enemy) {
    return { ...state, active: null, updatedAt: now };
  }

  const stats = computeStats(state);
  const roundMs =
    combatRoundDuration(enc, state.settings.pace, stats.constitution) * 1000;
  let nextCombat: ActiveCombat = {
    ...combat,
    round: combat.round + 1,
    nextRoundAt: now + roundMs,
  };

  let heroHp = nextCombat.heroHp;
  let enemyHp = nextCombat.enemyHp;
  let log = nextCombat.log;
  let lastHitCrit = false;

  const swiftFirst = enemy.traits.includes("swift") && Math.random() < 0.35;

  if (swiftFirst) {
    log = pushLog(
      nextCombat,
      combatLine(enemy.id, "swiftFirst", `${enemy.name} strikes first.`),
    );
    const edmg = enemyDamage(enemy, nextCombat.heroArmor, nextCombat.stance);
    heroHp -= edmg;
    log = pushLog(
      { ...nextCombat, log },
      combatLine(enemy.id, "enemyHit", `${enemy.name} hits for ${edmg}.`),
    );
    if (heroHp <= 0) {
      return finishCombatDefeat(state, { ...nextCombat, heroHp, log }, enc, now);
    }
  }

  const hit = heroDamage(
    nextCombat.heroOffense,
    nextCombat.heroCrit,
    enemy.armor,
    nextCombat.stance,
    enemy,
  );
  lastHitCrit = hit.crit;
  enemyHp -= hit.dmg;
  log = pushLog(
    { ...nextCombat, log },
    hit.crit
      ? combatLine(enemy.id, "heroCrit", `Critical hit for ${hit.dmg}!`)
      : combatLine(enemy.id, "heroHit", `You hit for ${hit.dmg}.`),
  );

  if (enemyHp <= 0) {
    return finishCombatVictory(
      state,
      { ...nextCombat, heroHp, enemyHp: 0, log },
      enc,
      now,
      lastHitCrit,
    );
  }

  if (!swiftFirst) {
    const edmg = enemyDamage(enemy, nextCombat.heroArmor, nextCombat.stance);
    heroHp -= edmg;
    log = pushLog(
      { ...nextCombat, log },
      combatLine(enemy.id, "enemyHit", `${enemy.name} hits for ${edmg}.`),
    );
    if (heroHp <= 0) {
      return finishCombatDefeat(state, { ...nextCombat, heroHp, log }, enc, now);
    }
  }

  return {
    ...state,
    active: { ...nextCombat, heroHp, enemyHp, log },
    updatedAt: now,
  };
}

export function advanceCombatUntilCaughtUp(state: GameState, now: number): GameState {
  if (!state.active || state.active.type !== "combat") return state;
  if (state.pendingReward) return state;

  let current = state;
  let guard = 0;
  while (
    current.active &&
    current.active.type === "combat" &&
    current.active.nextRoundAt <= now &&
    guard < 200
  ) {
    current = advanceOneRound(current, now);
    guard += 1;
    if (current.pendingReward) break;
  }
  return current;
}

export function encountersAtLocation(locationId: string) {
  return ENCOUNTERS.filter((e) => e.locationId === locationId);
}

export function encounterAvailable(enc: EncounterDef, storyFlags: string[]) {
  if (!enc.minStoryFlags?.length) return true;
  return enc.minStoryFlags.every((f) => storyFlags.includes(f));
}
