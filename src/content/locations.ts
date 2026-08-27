import type { LocationDef } from "@/lib/game/types";
import { SECRET_LOCATIONS } from "./secret-locations";

export const LOCATIONS: LocationDef[] = [
  {
    id: "merrick-orchard",
    name: "Merrick's Orchard",
    regionHint: "Where the drought began",
    description:
      "Rows of thirsty apple trees lean toward empty irrigation ditches. Old Merrick still tends the soil, muttering about rains that refuse to come.",
    x: 18,
    y: 62,
    travelSeconds: 30,
    bestFor: "strength",
  },
  {
    id: "tarowen-square",
    name: "Tarowen Square",
    regionHint: "Market gossip and odd jobs",
    description:
      "A weathered market square where traders barter dried fruit and rumors. The well at the center is a shallow puddle.",
    x: 38,
    y: 48,
    travelSeconds: 60,
    bestFor: "intelligence",
  },
  {
    id: "ashen-grass",
    name: "Ashen Grasslands",
    regionHint: "Best early Dexterity work",
    description:
      "Wind-scraped hills of pale grass. Shepherds watch the horizon and worry about missing flocks.",
    x: 52,
    y: 68,
    travelSeconds: 90,
    bestFor: "dexterity",
  },
  {
    id: "stone-mill",
    name: "Stonewheel Mill",
    regionHint: "Strength training by the riverbed",
    description:
      "The mill wheel sits half-buried in a cracked riverbed. Millers hire anyone strong enough to turn gears by hand.",
    x: 28,
    y: 34,
    unlockStoryFlag: "mill_unlocked",
    travelSeconds: 120,
    bestFor: "strength",
  },
  {
    id: "northern-shore",
    name: "Northern Shore",
    regionHint: "Intelligence and careful searching",
    description:
      "Golden sand and shipwreck timber. Vagrants pick through debris while gulls argue overhead.",
    x: 72,
    y: 28,
    unlockStoryFlag: "shore_unlocked",
    travelSeconds: 150,
    bestFor: "intelligence",
  },
  {
    id: "clara-canyon",
    name: "Clara's Canyon",
    regionHint: "Narrow paths, sharper tests",
    description:
      "Redstone walls funnel wind into a constant whistle. Smugglers once used these ledges; now scholars map the cracks.",
    x: 64,
    y: 52,
    unlockStoryFlag: "canyon_unlocked",
    travelSeconds: 180,
    bestFor: "dexterity",
  },
  {
    id: "blackened-tables",
    name: "Blackened Tablelands",
    regionHint: "Ash and stubborn strength",
    description:
      "A plateau of basalt plates still warm from old eruptions. Heat shimmer hides ruined watchtowers.",
    x: 46,
    y: 22,
    unlockStoryFlag: "tables_unlocked",
    travelSeconds: 210,
    bestFor: "strength",
  },
  {
    id: "sealed-shrine",
    name: "Sealed Shrine",
    regionHint: "Story climax",
    description:
      "A stone door marked with three weathered symbols. Behind it, the air tastes like rain that never falls.",
    x: 82,
    y: 40,
    unlockStoryFlag: "shrine_unlocked",
    travelSeconds: 240,
    bestFor: "intelligence",
  },
  {
    id: "windmere-hamlet",
    name: "Windmere Hamlet",
    regionHint: "Stop on the orchard road",
    description:
      "A dozen cottages and a drying shed where neighbors trade water rights by handshake. The drought feels personal here.",
    x: 22,
    y: 54,
    unlockStoryFlag: "windmere_unlocked",
    travelSeconds: 75,
    bestFor: "intelligence",
  },
  {
    id: "bracken-ford",
    name: "Bracken Ford",
    regionHint: "Southern crossing town",
    description:
      "The ford is a gravel scar where a creek ought to run. Carts still queue to argue over who crosses first.",
    x: 36,
    y: 86,
    unlockStoryFlag: "ford_unlocked",
    travelSeconds: 100,
    bestFor: "strength",
  },
  {
    id: "ledger-house",
    name: "Ledger House",
    regionHint: "Mill country records",
    description:
      "A slate office where clerks copy flow tallies and fight over missing buckets. Pens scratch louder than the mill wheel.",
    x: 34,
    y: 28,
    unlockStoryFlag: "ledger_unlocked",
    travelSeconds: 110,
    bestFor: "intelligence",
  },
  {
    id: "odos-relay",
    name: "Odo's Relay",
    regionHint: "Waystation on the north road",
    description:
      "A stone barn with hitching posts and a chalk tally of who passed before the river dried. Couriers sleep on the floor when dust rolls in.",
    x: 54,
    y: 36,
    unlockStoryFlag: "relay_unlocked",
    travelSeconds: 130,
    bestFor: "dexterity",
  },
  {
    id: "harrow-ridge",
    name: "Harrow Ridge",
    regionHint: "Western high overlook",
    description:
      "Wind-scoured bluffs above the grain country. Lookouts trade cloud sightings with mill clerks who never see rain.",
    x: 8,
    y: 40,
    unlockStoryFlag: "ridge_unlocked",
    travelSeconds: 140,
    bestFor: "dexterity",
  },
  {
    id: "silt-basin",
    name: "Silt Basin",
    regionHint: "Eastern sink where water should pool",
    description:
      "A broad hollow of cracked mud and dead reeds. Storm water should collect here. It hasn't for months.",
    x: 90,
    y: 66,
    unlockStoryFlag: "basin_unlocked",
    travelSeconds: 160,
    bestFor: "intelligence",
  },
  ...SECRET_LOCATIONS,
];

export const LOCATION_MAP = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
) as Record<string, LocationDef>;

/** Secret pins stay hidden until a rumor or story beat reveals them. */
export function isLocationVisible(
  loc: LocationDef,
  unlockedLocations: string[],
  storyFlags: string[],
): boolean {
  if (!loc.secret) return true;
  if (unlockedLocations.includes(loc.id)) return true;
  if (loc.unlockStoryFlag && storyFlags.includes(loc.unlockStoryFlag)) {
    return true;
  }
  return false;
}

export function visibleLocations(
  unlockedLocations: string[],
  storyFlags: string[],
): LocationDef[] {
  return LOCATIONS.filter((loc) =>
    isLocationVisible(loc, unlockedLocations, storyFlags),
  );
}
