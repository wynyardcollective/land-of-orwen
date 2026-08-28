/** Copy and flavor for the /play entrance screen. */

export const PLAY_FLAVOR_LINES = [
  "Merrick's Orchard waits at the bend of the north road.",
  "Tarowen still sells rumors for a cup of thin ale.",
  "The shrine seal holds — until someone earns the rain back.",
  "Bracken Ford argues about water while the creek runs dry.",
  "A relay barn on Harrow Ridge still expects a storm.",
] as const;

export const PLAY_WAYPOINTS = [
  { label: "Orchard", active: true },
  { label: "Tarowen", active: false },
  { label: "Mill", active: false },
  { label: "Shrine", active: false },
] as const;

export const PLAY_LOADING_LINES = [
  "Checking ledgers…",
  "Listening for rain on the road…",
  "Reading Merrick's tallies…",
] as const;
