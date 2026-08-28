import type { SkillActivityDef, RecipeDef } from "@/lib/game/types";

export const SKILL_ACTIVITIES: SkillActivityDef[] = [
  // Woodcutting
  {
    id: "cut-apple-wood",
    locationId: "merrick-orchard",
    skill: "woodcutting",
    name: "Cut apple wood",
    description:
      "Trim dead branches from Merrick's rows. The wood is dry but still sells.",
    levelReq: 1,
    durationSeconds: 45,
    xp: 8,
    yields: [{ materialId: "apple-wood", min: 2, max: 4 }],
    rareMaterialId: "herb-bundle",
    rareChance: 0.12,
  },
  {
    id: "cut-pale-reeds",
    locationId: "ashen-grass",
    skill: "woodcutting",
    name: "Harvest pale reeds",
    description:
      "Bundle wind-scraped reeds from the grasslands. Weavers and cooks both want them.",
    levelReq: 3,
    durationSeconds: 55,
    xp: 12,
    yields: [{ materialId: "pale-reed", min: 3, max: 5 }],
    rareMaterialId: "herb-bundle",
    rareChance: 0.15,
  },
  {
    id: "trim-shed-timber",
    locationId: "windmere-hamlet",
    skill: "woodcutting",
    name: "Trim shed timber",
    description:
      "Neighbors stack drying planks; you plane the usable lengths for trade.",
    levelReq: 5,
    durationSeconds: 65,
    xp: 16,
    yields: [{ materialId: "apple-wood", min: 4, max: 6 }],
    rareMaterialId: "herb-bundle",
    rareChance: 0.18,
  },
  // Fishing
  {
    id: "net-silt-minnows",
    locationId: "northern-shore",
    skill: "fishing",
    name: "Net silt minnows",
    description:
      "Drag a net through the shallow wreck line. Minnows still dart in the brine.",
    levelReq: 1,
    durationSeconds: 50,
    xp: 8,
    yields: [{ materialId: "raw-fish", min: 2, max: 4 }],
    rareMaterialId: "silver-scale",
    rareChance: 0.1,
  },
  {
    id: "ford-creek-fish",
    locationId: "bracken-ford",
    skill: "fishing",
    name: "Wade for creek fish",
    description:
      "The ford is gravel, but pockets of water still hide stubborn trout.",
    levelReq: 4,
    durationSeconds: 60,
    xp: 14,
    yields: [{ materialId: "raw-fish", min: 3, max: 5 }],
    rareMaterialId: "silver-scale",
    rareChance: 0.14,
  },
  {
    id: "scoop-basin-crabs",
    locationId: "silt-basin",
    skill: "fishing",
    name: "Scoop basin crabs",
    description:
      "Crabs cling to cracked mud where storms ought to pool. Quick hands win.",
    levelReq: 8,
    durationSeconds: 75,
    xp: 22,
    yields: [{ materialId: "raw-fish", min: 4, max: 6 }],
    rareMaterialId: "silver-scale",
    rareChance: 0.2,
  },
  // Mining
  {
    id: "chip-copper",
    locationId: "clara-canyon",
    skill: "mining",
    name: "Chip copper veins",
    description:
      "Redstone walls hide green streaks. Smugglers once mined these ledges at night.",
    levelReq: 1,
    durationSeconds: 95,
    xp: 12,
    yields: [{ materialId: "copper-ore", min: 1, max: 2 }],
    rareMaterialId: "gem-chip",
    rareChance: 0.08,
  },
  {
    id: "mine-coal",
    locationId: "blackened-tables",
    skill: "mining",
    name: "Mine coal seams",
    description:
      "Basalt plates still radiate old heat. Coal pockets fuel forges and mills.",
    levelReq: 3,
    durationSeconds: 110,
    xp: 16,
    yields: [{ materialId: "coal", min: 1, max: 2 }],
    rareMaterialId: "ash-ore",
    rareChance: 0.12,
  },
  {
    id: "quarry-iron",
    locationId: "ledger-house",
    skill: "mining",
    name: "Quarry iron scraps",
    description:
      "Clerks ignore the scrap pile outside. You hammer loose workable iron.",
    levelReq: 6,
    durationSeconds: 125,
    xp: 20,
    yields: [{ materialId: "iron-ore", min: 1, max: 2 }],
    rareMaterialId: "gem-chip",
    rareChance: 0.15,
  },
  // Cooking (gather-style prep at market)
  {
    id: "pick-market-herbs",
    locationId: "tarowen-square",
    skill: "cooking",
    name: "Pick market herbs",
    description:
      "Stall vendors let you strip wilted tops for broth — if you share the yield.",
    levelReq: 1,
    durationSeconds: 40,
    xp: 6,
    yields: [{ materialId: "herb-bundle", min: 2, max: 4 }],
  },
];

export const RECIPES: RecipeDef[] = [
  {
    id: "cook-fish",
    skill: "cooking",
    name: "Smoke river fish",
    description: "Simple smoke over apple wood. Restores more than raw fillets.",
    levelReq: 1,
    durationSeconds: 45,
    xp: 10,
    inputs: [{ materialId: "raw-fish", amount: 2 }],
    outputMaterialId: "cooked-fish",
    outputAmount: 2,
  },
  {
    id: "cook-stew",
    skill: "cooking",
    name: "Boil drought stew",
    description:
      "Fish, herbs, and reed fiber in one pot. Tarowen cooks swear by it.",
    levelReq: 5,
    durationSeconds: 60,
    xp: 18,
    inputs: [
      { materialId: "raw-fish", amount: 3 },
      { materialId: "herb-bundle", amount: 2 },
    ],
    outputItemId: "shore-tonic",
    outputAmount: 1,
  },
  {
    id: "smelt-copper",
    skill: "smithing",
    name: "Smelt copper bars",
    description: "Forge orange metal into bars the millwrights will buy.",
    levelReq: 1,
    durationSeconds: 50,
    xp: 12,
    inputs: [{ materialId: "copper-ore", amount: 2 }],
    outputMaterialId: "copper-bar",
    outputAmount: 1,
    locationId: "stone-mill",
  },
  {
    id: "smelt-iron",
    skill: "smithing",
    name: "Smelt iron bars",
    description: "Coal and ore in the furnace. The wheel groans while you work.",
    levelReq: 5,
    durationSeconds: 70,
    xp: 20,
    inputs: [
      { materialId: "iron-ore", amount: 2 },
      { materialId: "coal", amount: 1 },
    ],
    outputMaterialId: "iron-bar",
    outputAmount: 1,
    locationId: "stone-mill",
  },
  {
    id: "forge-bronze-vest",
    skill: "smithing",
    name: "Forge bronze vest",
    description: "Hammer copper bars into a vest that still smells of forge smoke.",
    levelReq: 8,
    durationSeconds: 90,
    xp: 28,
    inputs: [{ materialId: "copper-bar", amount: 3 }],
    outputItemId: "bronze-chest",
    outputAmount: 1,
    locationId: "stone-mill",
  },
  {
    id: "forge-mill-hammer",
    skill: "smithing",
    name: "Forge mill hammer",
    description: "Iron bar and apple wood haft — heavy enough to turn a stuck gear.",
    levelReq: 12,
    durationSeconds: 100,
    xp: 32,
    inputs: [
      { materialId: "iron-bar", amount: 2 },
      { materialId: "apple-wood", amount: 3 },
    ],
    outputItemId: "mill-hammer",
    outputAmount: 1,
    locationId: "stone-mill",
  },
];

export const SKILL_ACTIVITY_MAP = Object.fromEntries(
  SKILL_ACTIVITIES.map((a) => [a.id, a]),
) as Record<string, SkillActivityDef>;

export const RECIPE_MAP = Object.fromEntries(
  RECIPES.map((r) => [r.id, r]),
) as Record<string, RecipeDef>;

export const SKILL_BEATS: Record<string, string[]> = {
  woodcutting: [
    "Saw teeth bite dry bark. Dust hangs in the heat.",
    "A branch cracks — Merrick would know which tree mourned it.",
    "Wood chips pile at your boots like pale confetti.",
    "Your shoulders warm. The pile grows anyway.",
  ],
  fishing: [
    "Line twitches. Something still lives in the drought.",
    "Brine on your wrists. Gulls argue overhead.",
    "The net heavy for a moment — then heavier with fish.",
    "Silver scales flash once before the bucket.",
  ],
  mining: [
    "Pick strikes stone. The canyon answers in red dust.",
    "Ore chips spark against the basalt.",
    "Coal blackens your palms. The seam runs deeper.",
    "Iron scrap clinks into your sack — honest weight.",
  ],
  cooking: [
    "Steam rises thin in the dry air. Herbs release their last scent.",
    "The pot bubbles on a low fire. Neighbors lean in.",
    "Smoke curls from apple wood. Fish skin tightens and browns.",
    "You stir once. The stew smells like rain that might return.",
  ],
  smithing: [
    "Hammer on anvil — the mill wheel groans in sympathy.",
    "Furnace heat washes your face. Metal glows orange.",
    "Slag chips away. The bar takes shape.",
    "Quench water hisses. The forge sighs and settles.",
  ],
};

export const SKILL_LABELS: Record<string, string> = {
  fishing: "Fishing",
  mining: "Mining",
  smithing: "Smithing",
  woodcutting: "Woodcutting",
  cooking: "Cooking",
};

export function activitiesAtLocation(locationId: string): SkillActivityDef[] {
  return SKILL_ACTIVITIES.filter((a) => a.locationId === locationId);
}

export function recipesForSkill(skill: string): RecipeDef[] {
  return RECIPES.filter((r) => r.skill === skill);
}
