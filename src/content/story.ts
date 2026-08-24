import type { JournalEntry } from "@/lib/game/types";

export const JOURNAL: JournalEntry[] = [
  {
    id: "prelude",
    title: "Prelude — Dust on the Leaves",
    unlockFlag: "prelude_start",
    body: "You grew up hauling baskets for Old Merrick. This season the wells cough dust, the apples shrink, and even the birds sound thirsty. Merrick's ledger says the drought is wrong—too sudden, too complete. Someone must leave the orchard and learn why the clouds forgot Orwen.",
  },
  {
    id: "mill-note",
    title: "The Silent Wheel",
    unlockFlag: "mill_unlocked",
    body: "Rain charts point upstream to Stonewheel Mill. Without a river, the millers turn gears by hand and keep records of every dry day. If the sky is broken, the break may show in their numbers.",
  },
  {
    id: "shore-note",
    title: "Salt and Rumors",
    unlockFlag: "shore_unlocked",
    body: "Traders whisper of a northern shore littered with wreckage and talk. Vagrants there trade relics they barely understand. Somewhere in the chatter sits a path to a sealed shrine.",
  },
  {
    id: "canyon-note",
    title: "Clara's Wind",
    unlockFlag: "canyon_unlocked",
    body: "The canyon funnels every whisper into a howl. Smugglers' ledges now host scholars mapping cracks that drink moisture from the land. Crossing them will temper your footing—and your nerve.",
  },
  {
    id: "tables-note",
    title: "Blackened Horizon",
    unlockFlag: "tables_unlocked",
    body: "Beyond the shore, basalt tablelands still radiate old heat. Watchtowers choke on ash. If rain is being held somewhere, the plateau's vents may be the lungs of the problem.",
  },
  {
    id: "shrine-note",
    title: "Three Symbols",
    unlockFlag: "shrine_unlocked",
    body: "The sealed shrine waits with a door of three marks: cloud, moon, and star. Solve the lore puzzle in Craft to remember the order, then open the Rainward Gate.",
  },
  {
    id: "ending",
    title: "Rain Remembers",
    unlockFlag: "chapter_complete",
    body: "Behind the door, a basin of still water mirrors a sky that begins to gather. The Ring of Returning Rain warms on your hand. Orwen's drought is not ended—but it has been named, and naming is the first mercy.",
  },
];

export function currentGoals(flags: string[]): string[] {
  const goals: string[] = [];
  if (!flags.includes("mill_unlocked")) {
    goals.push("Help at Merrick's Orchard until the mill appears on your map.");
  } else if (!flags.includes("shore_unlocked")) {
    goals.push("Work Tarowen Square jobs to unlock the Northern Shore.");
  } else if (!flags.includes("canyon_unlocked")) {
    goals.push("Prove yourself at Stonewheel Mill to open Clara's Canyon.");
  } else if (!flags.includes("tables_unlocked")) {
    goals.push("Trade carefully on the Northern Shore to reveal the Tablelands.");
  } else if (!flags.includes("shrine_unlocked")) {
    goals.push("Listen for shore rumors to locate the Sealed Shrine.");
  } else if (!flags.includes("shrine_studied")) {
    goals.push("Study the shrine door, then solve the lore puzzle in Craft.");
  } else if (!flags.includes("chapter_complete")) {
    goals.push("Open the Rainward Gate at the Sealed Shrine.");
  } else {
    goals.push("Chapter complete. Keep training, crafting, and sharing campfire tips.");
  }
  return goals;
}
