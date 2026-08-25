export type QuestStat = "strength" | "dexterity" | "intelligence";
export type HeroStat =
  | QuestStat
  | "constitution"
  | "wisdom"
  | "charisma";

export type SecondaryAffinity = "warden" | "sage" | "herald";

export type EquipSlot =
  | "weapon"
  | "head"
  | "chest"
  | "hands"
  | "legs"
  | "feet"
  | "ring"
  | "amulet";

export type Pace = "swift" | "balanced" | "classic";
export type FontScale = "normal" | "large" | "xlarge";
export type TabId = "map" | "hero" | "craft" | "journal" | "campfire";

export type ItemRarity = "common" | "uncommon" | "rare" | "legendary";

export interface StatLevels {
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  wisdom: number;
  charisma: number;
}

export interface ItemDef {
  id: string;
  name: string;
  slot: EquipSlot;
  questStat: QuestStat;
  affinity: SecondaryAffinity;
  rarity: ItemRarity;
  basePower: number;
  sellValue: number;
  description: string;
}

export interface OwnedItem {
  uid: string;
  defId: string;
  power: number;
  gemId?: string;
}

export interface GemDef {
  id: string;
  name: string;
  affinity: SecondaryAffinity;
  tier: number;
  bonus: number;
  description: string;
}

export interface OwnedGem {
  uid: string;
  defId: string;
  tier: number;
}

export interface LocationDef {
  id: string;
  name: string;
  regionHint: string;
  description: string;
  x: number;
  y: number;
  unlockStoryFlag?: string;
  travelSeconds: number;
  bestFor?: QuestStat;
}

export interface QuestDef {
  id: string;
  locationId: string;
  name: string;
  description: string;
  level: number;
  stat: QuestStat;
  durationSeconds: number;
  goldReward: number;
  storyFlagOnSuccess?: string;
  unlockLocationId?: string;
  rumor?: boolean;
  itemPool: string[];
  gemChance: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  unlockFlag: string;
}

export interface CampfireMessage {
  id: string;
  author: string;
  body: string;
  kind: "chat" | "discovery" | "tip";
  at: number;
}

export interface ActiveTravel {
  type: "travel";
  toLocationId: string;
  startedAt: number;
  completesAt: number;
}

export interface ActiveQuest {
  type: "quest";
  questId: string;
  startedAt: number;
  completesAt: number;
  successChance: number;
  equippedSnapshot: Partial<Record<EquipSlot, string>>;
}

export type ActiveAction = ActiveTravel | ActiveQuest | null;

export type RewardTone =
  | "success"
  | "fail"
  | "close-win"
  | "close-loss"
  | "jackpot";

export interface PendingReward {
  questId: string;
  success: boolean;
  gold: number;
  bonusGold: number;
  item?: OwnedItem;
  gem?: OwnedGem;
  narrative: string;
  tone: RewardTone;
  npcName?: string;
  npcQuote?: string;
  omen?: string;
  streak: number;
  streakBonus?: string;
  unlockName?: string;
  legendary?: boolean;
}

export interface SettingsState {
  pace: Pace;
  fontScale: FontScale;
  highContrast: boolean;
  soundEnabled: boolean;
  tutorialTips: boolean;
  reducedMotion: boolean;
}

export interface GameState {
  version: 1;
  playerId: string;
  heroName: string;
  gold: number;
  locationId: string;
  unlockedLocations: string[];
  storyFlags: string[];
  stats: StatLevels;
  equipment: Partial<Record<EquipSlot, string>>;
  inventory: OwnedItem[];
  gems: OwnedGem[];
  completedQuests: string[];
  journalUnlocked: string[];
  active: ActiveAction;
  pendingReward: PendingReward | null;
  campfireMessages: CampfireMessage[];
  playerNotes: string[];
  loreSolved: boolean;
  loreGuessesLeft: number;
  loreSelected: string[];
  settings: SettingsState;
  records: {
    questsCompleted: number;
    goldEarned: number;
    legendaryFound: number;
    bestStreak: number;
  };
  successStreak: number;
  failStreak: number;
  npcReactions: Record<string, { name: string; quote: string; at: number }>;
  omen: { text: string; at: number } | null;
  lastUnlock: { ids: string[]; names: string[]; at: number } | null;
  updatedAt: number;
}

export const SLOT_QUEST_STAT: Record<EquipSlot, QuestStat> = {
  weapon: "strength",
  head: "strength",
  chest: "strength",
  hands: "dexterity",
  legs: "dexterity",
  feet: "dexterity",
  ring: "intelligence",
  amulet: "intelligence",
};

export const AFFINITY_STAT: Record<SecondaryAffinity, HeroStat> = {
  warden: "constitution",
  sage: "wisdom",
  herald: "charisma",
};

export const PACE_MULTIPLIER: Record<Pace, number> = {
  swift: 0.08,
  balanced: 0.35,
  classic: 1,
};

export const BASE_GOLD_CAP = 200;
