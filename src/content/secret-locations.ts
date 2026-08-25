import type { LocationDef } from "@/lib/game/types";

/** Secret areas only reachable after tavern rumors (or overlap with story unlock flags). */
export const SECRET_LOCATIONS: LocationDef[] = [
  {
    id: "whisper-well",
    name: "Whisper Well",
    regionHint: "Secret · beneath Tarowen",
    description:
      "A forgotten cistern under the square where voices carry farther than they should. Old coins glitter in the mud — and older warnings.",
    x: 42,
    y: 54,
    unlockStoryFlag: "secret_whisper_well",
    travelSeconds: 45,
    secret: true,
    bestFor: "intelligence",
  },
  {
    id: "root-cellar",
    name: "Merrick's Root Cellar",
    regionHint: "Secret · under the orchard",
    description:
      "Cool earth and stacked apples hide Merrick's real ledger: rainfall tallies going back sixty years. The last pages are wet with fresh ink.",
    x: 14,
    y: 68,
    unlockStoryFlag: "secret_root_cellar",
    travelSeconds: 40,
    secret: true,
  },
  {
    id: "gulls-rest",
    name: "Gull's Rest Cove",
    regionHint: "Secret · north of the wreck line",
    description:
      "A sheltered cove only smugglers and seabirds remember. Timber forms a natural pier; someone left offering bowls of salt.",
    x: 78,
    y: 22,
    unlockStoryFlag: "secret_gulls_rest",
    travelSeconds: 90,
    secret: true,
    bestFor: "intelligence",
  },
  {
    id: "smugglers-nook",
    name: "Smuggler's Nook",
    regionHint: "Secret · off the canyon ledge",
    description:
      "A rope ladder descends to a ledge cave stacked with crates stamped with a raindrop seal — the wrong kind for drought country.",
    x: 68,
    y: 48,
    unlockStoryFlag: "secret_smugglers_nook",
    travelSeconds: 100,
    secret: true,
    bestFor: "dexterity",
  },
  {
    id: "ember-hollow",
    name: "Ember Hollow",
    regionHint: "Secret · heart of the tablelands",
    description:
      "A bowl in the basalt where heat pools but never rises. Scholars think something below breathes in reverse.",
    x: 50,
    y: 18,
    unlockStoryFlag: "secret_ember_hollow",
    travelSeconds: 120,
    secret: true,
    bestFor: "intelligence",
  },
];

export const ALL_LOCATIONS = [...SECRET_LOCATIONS];
