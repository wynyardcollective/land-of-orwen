import type {
  CampfireMessage,
  GameState,
  SettingsState,
  StatLevels,
} from "./types";

export const SAVE_KEY = "orwen-save-v1";
export const PLAYER_ID_KEY = "orwen-player-id";

const defaultSettings: SettingsState = {
  pace: "swift",
  fontScale: "normal",
  highContrast: false,
  soundEnabled: true,
  tutorialTips: true,
  reducedMotion: false,
};

const starterStats: StatLevels = {
  strength: 1,
  dexterity: 1,
  intelligence: 1,
  constitution: 0,
  wisdom: 0,
  charisma: 0,
};

const seedCampfire: CampfireMessage[] = [
  {
    id: "seed-1",
    author: "Mira of Tarowen",
    body: "If your success chance dips under 70%, circle back to easier grassland work. Gear beats stubbornness.",
    kind: "tip",
    at: Date.now() - 1000 * 60 * 40,
  },
  {
    id: "seed-2",
    author: "Old Brann",
    body: "Completed the orchard prelude and found a Warden helm. Constitution shaves travel time!",
    kind: "discovery",
    at: Date.now() - 1000 * 60 * 25,
  },
  {
    id: "seed-3",
    author: "Lys",
    body: "The sealed shrine only opens after you listen carefully on the northern shore. Bring Charisma.",
    kind: "tip",
    at: Date.now() - 1000 * 60 * 12,
  },
];

export function createPlayerId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function createInitialState(playerId: string, heroName = "Wanderer"): GameState {
  return {
    version: 1,
    playerId,
    heroName,
    gold: 40,
    locationId: "merrick-orchard",
    unlockedLocations: ["merrick-orchard", "tarowen-square", "ashen-grass"],
    storyFlags: ["prelude_start"],
    stats: { ...starterStats },
    equipment: {},
    inventory: [
      {
        uid: "start_bandage_1",
        defId: "field-bandage",
        power: 0,
      },
      {
        uid: "start_apple_1",
        defId: "dried-apple",
        power: 0,
      },
    ],
    gems: [],
    completedQuests: [],
    completedEncounters: [],
    journalUnlocked: ["prelude"],
    active: null,
    pendingReward: null,
    wounded: false,
    heroHp: null,
    campfireMessages: seedCampfire,
    playerNotes: [],
    loreSolved: false,
    loreGuessesLeft: 5,
    loreSelected: [],
    settings: { ...defaultSettings },
    records: {
      questsCompleted: 0,
      encountersWon: 0,
      goldEarned: 0,
      legendaryFound: 0,
      bestStreak: 0,
    },
    successStreak: 0,
    failStreak: 0,
    npcReactions: {},
    omen: null,
    lastUnlock: null,
    tavernRumorsClaimed: [],
    lastTavernResult: null,
    lastCombat: null,
    updatedAt: Date.now(),
  };
}

export function normalizeState(raw: GameState): GameState {
  const active =
    raw.active?.type === "combat" ||
    raw.active?.type === "quest" ||
    raw.active?.type === "travel" ||
    raw.active?.type === "tavern"
      ? raw.active
      : null;
  return {
    ...raw,
    active,
    completedEncounters: raw.completedEncounters ?? [],
    wounded: raw.wounded ?? false,
    heroHp: raw.heroHp === undefined ? null : raw.heroHp,
    records: {
      questsCompleted: raw.records?.questsCompleted ?? 0,
      encountersWon: raw.records?.encountersWon ?? 0,
      goldEarned: raw.records?.goldEarned ?? 0,
      legendaryFound: raw.records?.legendaryFound ?? 0,
      bestStreak: raw.records?.bestStreak ?? 0,
    },
    successStreak: raw.successStreak ?? 0,
    failStreak: raw.failStreak ?? 0,
    npcReactions: raw.npcReactions ?? {},
    omen: raw.omen ?? null,
    lastUnlock: raw.lastUnlock ?? null,
    tavernRumorsClaimed: raw.tavernRumorsClaimed ?? [],
    lastTavernResult: raw.lastTavernResult ?? null,
    lastCombat: raw.lastCombat ?? null,
    pendingReward: raw.pendingReward
      ? {
          ...raw.pendingReward,
          tone: raw.pendingReward.tone ?? (raw.pendingReward.success ? "success" : "fail"),
          streak: raw.pendingReward.streak ?? 0,
        }
      : null,
  };
}

export function loadLocalSave(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

export function writeLocalSave(state: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  localStorage.setItem(PLAYER_ID_KEY, state.playerId);
}

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return createPlayerId();
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;
  const id = createPlayerId();
  localStorage.setItem(PLAYER_ID_KEY, id);
  return id;
}
