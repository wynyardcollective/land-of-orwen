import type { JournalEntry } from "@/lib/game/types";

export const JOURNAL: JournalEntry[] = [
  {
    id: "prelude",
    title: "Prelude — Dust on the Leaves",
    unlockFlag: "prelude_start",
    body: "Merrick kept you on basket work until the wells went wrong. This summer the ditch dried in a week and his rainfall tallies stopped matching the sky. He handed you forty gold, a bandage, and a dried apple — then told you to walk east and find out why the whole country lost its rain, not just the orchard. The journal entry is his. The road is yours.",
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
  {
    id: "tavern-drought-cult",
    title: "Tavern — Drought Cult",
    unlockFlag: "intel_drought_cult",
    body: "At the Dry Kettle, traders whisper that someone pays villages to smash rain gauges. The vandalism tracks upstream toward the mill country — as if drought itself were being curated.",
  },
  {
    id: "tavern-rain-saint",
    title: "Tavern — The Rain Saint",
    unlockFlag: "intel_rain_saint",
    body: "Merrick remembers a mossy roadside saint whose basin never emptied — until this summer. Pilgrims still leave coins; the coins still rust.",
  },
  {
    id: "tavern-flow-thief",
    title: "Tavern — Flow Thief",
    unlockFlag: "intel_flow_thief",
    body: "Mill ledgers show water disappearing between stations. Not evaporation — interception. Odo thinks an old aquifer tap was reopened somewhere in the canyon.",
  },
  {
    id: "tavern-shrine-symbols",
    title: "Tavern — Shrine Symbols",
    unlockFlag: "intel_shrine_symbols",
    body: "Pel's beachcombers swear the sealed door wants cloud, moon, and star — but the carvings lie about the order. Compare shore rubbings to orchard ledgers in Craft.",
  },
  {
    id: "tavern-rainward-gate",
    title: "Tavern — Rainward Gate",
    unlockFlag: "intel_rainward_gate",
    body: "Iri heard the Rainward Gate opens when drought is named aloud and the bearer wears a ring that remembers rain. The Ring of Returning Rain may be more than loot.",
  },
  {
    id: "windmere-note",
    title: "Windmere Hamlet",
    unlockFlag: "windmere_unlocked",
    body:
      "A crossroads hamlet where farmers trade ditch water by handshake. Vale at the drying shed hears every courier route worth knowing.",
  },
  {
    id: "ford-note",
    title: "Bracken Ford",
    unlockFlag: "ford_unlocked",
    body:
      "The southern ford dried with the rest of Orwen, but carts still queue. Hek at Bracken Stein keeps crossing fees and grudges in one ledger.",
  },
  {
    id: "ledger-note",
    title: "Ledger House",
    unlockFlag: "ledger_unlocked",
    body:
      "Clerks copy mill flow tallies and fight over numbers that do not add up. Someone is intercepting water between stations.",
  },
  {
    id: "relay-note",
    title: "Odo's Relay",
    unlockFlag: "relay_unlocked",
    body:
      "A stone barn on the north road where couriers still sleep on the floor. Chalk tallies show who passed before the river failed.",
  },
  {
    id: "ridge-note",
    title: "Harrow Ridge",
    unlockFlag: "ridge_unlocked",
    body:
      "Western bluffs where lookouts sketch cloud lines that never darken. Their charts disagree with Merrick's orchard ledgers.",
  },
  {
    id: "basin-note",
    title: "Silt Basin",
    unlockFlag: "basin_unlocked",
    body:
      "An eastern hollow where storm water should pool. Scholars think it ties to the same aquifer the mill charts keep losing.",
  },
  {
    id: "tavern-ford-trade",
    title: "Tavern — Southern Trade",
    unlockFlag: "intel_ford_trade",
    body:
      "At Bracken Stein, Hek swears half the southern grain runs north at night without paying crossing fees.",
  },
];

export function currentGoals(flags: string[]): string[] {
  const goals: string[] = [];
  if (!flags.includes("mill_unlocked")) {
    goals.push(
      "Help at Merrick's Orchard until the mill appears — or buy rumors at the Cider Bench / Dry Kettle.",
    );
  } else if (!flags.includes("shore_unlocked")) {
    goals.push(
      "Work Tarowen Square jobs to unlock the Northern Shore — or buy rumors at the Dry Kettle.",
    );
  } else if (!flags.includes("canyon_unlocked")) {
    goals.push(
      "Prove yourself at Stonewheel Mill to open Clara's Canyon — or try the Wheelhouse Tap.",
    );
  } else if (!flags.includes("tables_unlocked")) {
    goals.push(
      "Trade carefully on the Northern Shore to reveal the Tablelands — or ask at the Salt Gull.",
    );
  } else if (!flags.includes("shrine_unlocked")) {
    goals.push(
      "Listen for shore rumors to locate the Sealed Shrine — or pay for leads at the Salt Gull / Ash Canteen.",
    );
  } else if (!flags.includes("shrine_studied")) {
    goals.push("Study the shrine door, then solve the lore puzzle in Craft.");
  } else if (!flags.includes("chapter_complete")) {
    goals.push("Open the Rainward Gate at the Sealed Shrine.");
  } else {
    goals.push("Chapter complete. Keep training, crafting, and sharing campfire tips.");
  }
  return goals;
}
