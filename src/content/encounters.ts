import type { EnemyDef, EncounterDef } from "@/lib/game/types";

export const ENEMIES: EnemyDef[] = [
  {
    id: "salt-wight",
    name: "Salt-Wight",
    level: 3,
    maxHp: 28,
    offense: 5,
    armor: 1,
    weakTo: "intelligence",
    traits: ["warded", "drought"],
    description:
      "A crusted figure stitched from brine and old rope. It moves like tide remembering a wound.",
  },
  {
    id: "ashjackal",
    name: "Ashjackal",
    level: 4,
    maxHp: 24,
    offense: 7,
    armor: 0,
    weakTo: "dexterity",
    traits: ["swift", "pack"],
    description:
      "Lean and smoke-grey, it circles wreck timber with teeth filed by volcanic grit.",
  },
  {
    id: "dust-bruiser",
    name: "Dust Bruiser",
    level: 4,
    maxHp: 38,
    offense: 8,
    armor: 2,
    weakTo: "strength",
    traits: ["brute"],
    description:
      "A canyon raider wrapped in chalk bandages. Every step raises a cloud that tastes of bone.",
  },
  {
    id: "rift-stalker",
    name: "Rift Stalker",
    level: 4,
    maxHp: 30,
    offense: 6,
    armor: 1,
    weakTo: "dexterity",
    traits: ["swift"],
    description:
      "Something that learned to walk the crack network on too many legs and not enough mercy.",
  },
  {
    id: "heat-wraith",
    name: "Heat Wraith",
    level: 5,
    maxHp: 32,
    offense: 9,
    armor: 1,
    weakTo: "intelligence",
    traits: ["warded", "drought"],
    description:
      "Shimmering air given hunger. It drinks sweat before it drinks blood.",
  },
  {
    id: "cinder-hound",
    name: "Cinder Hound",
    level: 5,
    maxHp: 34,
    offense: 8,
    armor: 1,
    weakTo: "dexterity",
    traits: ["swift", "pack"],
    description:
      "Basalt-furred and furnace-eyed. The tablelands use them to keep trespassers honest.",
  },
  {
    id: "obsidian-knuckle",
    name: "Obsidian Knuckle",
    level: 5,
    maxHp: 42,
    offense: 10,
    armor: 3,
    weakTo: "strength",
    traits: ["brute"],
    description:
      "A golem of fused glass and rage. Its fists ring like church bells in a drought.",
  },
  {
    id: "shrine-warden",
    name: "Shrine Warden",
    level: 6,
    maxHp: 48,
    offense: 11,
    armor: 3,
    weakTo: "intelligence",
    traits: ["warded", "brute"],
    description:
      "Rainward stone given a soldier's posture. It does not hate you — it hates intrusion.",
  },
  {
    id: "drought-spirit",
    name: "Drought Spirit",
    level: 6,
    maxHp: 36,
    offense: 12,
    armor: 0,
    weakTo: "intelligence",
    traits: ["drought", "warded"],
    description:
      "A whisper of thirst made visible. Where it passes, wells dream of emptying.",
  },
  {
    id: "gate-sentinel",
    name: "Gate Sentinel",
    level: 6,
    maxHp: 55,
    offense: 13,
    armor: 4,
    weakTo: "strength",
    traits: ["brute", "warded"],
    description:
      "The final hinge of the Rainward Gate. It has waited centuries to test someone's spine.",
  },
];

export const ENEMY_MAP = Object.fromEntries(
  ENEMIES.map((e) => [e.id, e]),
) as Record<string, EnemyDef>;

export const ENCOUNTERS: EncounterDef[] = [
  {
    id: "shore-salt-wight",
    locationId: "northern-shore",
    name: "Confront the Salt-Wight",
    description:
      "Something crawls from the wreck line at dusk. Locals swear it was a sailor once.",
    enemyId: "salt-wight",
    durationRoundSeconds: 12,
    goldReward: 9,
    itemPool: ["shore-sandals", "warlock-ring"],
    itemChance: 0.38,
    gemChance: 0.14,
    minStoryFlags: ["shore_unlocked"],
  },
  {
    id: "shore-ashjackal",
    locationId: "northern-shore",
    name: "Drive off the Ashjackal",
    description:
      "The beast has claimed a salvage heap. Traders won't approach until it's gone.",
    enemyId: "ashjackal",
    durationRoundSeconds: 10,
    goldReward: 10,
    itemPool: ["market-boots", "herald-gloves"],
    itemChance: 0.36,
    gemChance: 0.15,
    minStoryFlags: ["shore_unlocked"],
  },
  {
    id: "canyon-dust-bruiser",
    locationId: "clara-canyon",
    name: "Break the Dust Bruiser",
    description:
      "A raider blocks the smuggler road. The canyon echoes with their laughter.",
    enemyId: "dust-bruiser",
    durationRoundSeconds: 14,
    goldReward: 12,
    itemPool: ["mill-hammer", "bronze-chest"],
    itemChance: 0.34,
    gemChance: 0.16,
    minStoryFlags: ["canyon_unlocked"],
  },
  {
    id: "canyon-rift-stalker",
    locationId: "clara-canyon",
    name: "Face the Rift Stalker",
    description:
      "Tracks vanish into a fissure — then something climbs back out looking hungry.",
    enemyId: "rift-stalker",
    durationRoundSeconds: 11,
    goldReward: 11,
    itemPool: ["herald-gloves", "shore-sandals"],
    itemChance: 0.35,
    gemChance: 0.16,
    minStoryFlags: ["canyon_unlocked"],
  },
  {
    id: "tables-heat-wraith",
    locationId: "blackened-tables",
    name: "Banish the Heat Wraith",
    description:
      "A vent's breath has learned malice. Watchtowers report scorched guard cloaks.",
    enemyId: "heat-wraith",
    durationRoundSeconds: 13,
    goldReward: 14,
    itemPool: ["ash-helm", "canyon-amulet"],
    itemChance: 0.38,
    gemChance: 0.2,
    minStoryFlags: ["tables_unlocked"],
  },
  {
    id: "tables-cinder-hound",
    locationId: "blackened-tables",
    name: "Hunt the Cinder Hound",
    description:
      "It harries supply lines between shade stones. Even hardened couriers refuse the route.",
    enemyId: "cinder-hound",
    durationRoundSeconds: 11,
    goldReward: 13,
    itemPool: ["herald-gloves", "shore-sandals"],
    itemChance: 0.36,
    gemChance: 0.18,
    minStoryFlags: ["tables_unlocked"],
  },
  {
    id: "tables-obsidian-knuckle",
    locationId: "blackened-tables",
    name: "Shatter the Obsidian Knuckle",
    description:
      "Old mining wards woke when the ash fell. This one still remembers how to punch.",
    enemyId: "obsidian-knuckle",
    durationRoundSeconds: 15,
    goldReward: 16,
    itemPool: ["ash-helm", "mill-hammer"],
    itemChance: 0.4,
    gemChance: 0.22,
    minStoryFlags: ["tables_unlocked"],
  },
  {
    id: "shrine-warden-fight",
    locationId: "sealed-shrine",
    name: "Challenge the Shrine Warden",
    description:
      "Stone boots scrape the threshold. The warden tests whether you belong inside.",
    enemyId: "shrine-warden",
    durationRoundSeconds: 14,
    goldReward: 17,
    itemPool: ["canyon-amulet", "ash-helm"],
    itemChance: 0.42,
    gemChance: 0.24,
    minStoryFlags: ["shrine_unlocked"],
  },
  {
    id: "shrine-drought-spirit",
    locationId: "sealed-shrine",
    name: "Bind the Drought Spirit",
    description:
      "Thirst given shape circles the sealed door. It wants the rain you haven't earned yet.",
    enemyId: "drought-spirit",
    durationRoundSeconds: 12,
    goldReward: 18,
    itemPool: ["warlock-ring", "canyon-amulet"],
    itemChance: 0.4,
    gemChance: 0.26,
    minStoryFlags: ["shrine_studied"],
  },
  {
    id: "shrine-gate-sentinel",
    locationId: "sealed-shrine",
    name: "Defeat the Gate Sentinel",
    description:
      "The Rainward Gate's last guardian. Lore solved or not, it will not yield without blood.",
    enemyId: "gate-sentinel",
    waves: ["gate-sentinel"],
    durationRoundSeconds: 16,
    goldReward: 22,
    itemPool: ["ring-of-success", "ash-helm"],
    itemChance: 0.45,
    gemChance: 0.28,
    minStoryFlags: ["lore_solved"],
  },
];

export const ENCOUNTER_MAP = Object.fromEntries(
  ENCOUNTERS.map((e) => [e.id, e]),
) as Record<string, EncounterDef>;

export function encountersAtLocation(locationId: string) {
  return ENCOUNTERS.filter((e) => e.locationId === locationId);
}
