import type { HeroStat } from "@/lib/game/types";

export interface AttributeHelp {
  id: HeroStat;
  summary: string;
  details: string[];
  howToRaise: string;
}

export const ATTRIBUTE_HELP: Record<HeroStat, AttributeHelp> = {
  strength: {
    id: "strength",
    summary:
      "Muscle and stubborn effort. Strength decides how often heavy labor, lifting, and brute-force quests succeed.",
    details: [
      "Used on Strength quests. Your total versus the quest level sets success chance.",
      "Aim for about 70% or better before attempting harder work.",
      "Weapon, helm, and chest gear add Strength.",
    ],
    howToRaise:
      "Complete Strength quests to raise the base, and equip Warden-style heavy gear.",
  },
  dexterity: {
    id: "dexterity",
    summary:
      "Balance, tracking, and quick hands. Dexterity governs climbing, herding, and other nimble work.",
    details: [
      "Used on Dexterity quests. Higher total versus the quest level means safer attempts.",
      "Hands, legs, and feet slots always train Dexterity when filled.",
    ],
    howToRaise:
      "Run grassland and canyon jobs, and wear gloves, pants, and boots.",
  },
  intelligence: {
    id: "intelligence",
    summary:
      "Study, bargaining, and reading the land. Intelligence covers ledgers, rumors, and shrine puzzles.",
    details: [
      "Used on Intelligence quests, including rumor-listening work.",
      "Rings and amulets add Intelligence.",
      "Charisma can further boost rumor quests on top of this stat.",
    ],
    howToRaise:
      "Study, trade, and listen on the shore; equip scholar rings and amulets.",
  },
  constitution: {
    id: "constitution",
    summary:
      "Stamina for the road. Constitution shortens idle waits and lets you carry more gold.",
    details: [
      "Each point trims travel and quest duration by 4%, up to 40%.",
      "Gold cap starts at 200 and grows by 25 per Constitution.",
      "Gear with Warden affinity, and gems socketed for Constitution, raise this total.",
    ],
    howToRaise:
      "Socket Emberstone gems and wear Warden affinity pieces (often helms and vests).",
  },
  wisdom: {
    id: "wisdom",
    summary:
      "A knack for noticing relics. Wisdom raises your chance of finding gear and rare drops on successful quests.",
    details: [
      "Adds +2% item drop chance per Wisdom (on top of each quest's base drop rate).",
      "Also raises the chance of legendary items and raw gems.",
      "Does not change quest success chance.",
      "Sage affinity gear and Mistpearl gems add Wisdom.",
    ],
    howToRaise:
      "Equip Sage pieces and socket Mistpearls, then keep completing quests.",
  },
  charisma: {
    id: "charisma",
    summary:
      "A fair tongue and a lucky smile. Charisma improves rewards and rumor work.",
    details: [
      "Adds bonus gold on successful quests.",
      "Can raise the power of items you find.",
      "Increases success chance on rumor-tagged Intelligence quests.",
      "Herald affinity gear and Songglass gems add Charisma.",
    ],
    howToRaise:
      "Wear Herald pieces, socket Songglass, and take rumor quests when ready.",
  },
};
