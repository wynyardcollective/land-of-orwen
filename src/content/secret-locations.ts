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
  {
    id: "rain-saint-rest",
    name: "Rain Saint's Rest",
    regionHint: "Secret · mossy roadside",
    description:
      "A stone saint with a basin that held moss instead of water until this summer. Coins rust in the bowl. Pilgrims stopped coming when the wells failed.",
    x: 32,
    y: 66,
    unlockStoryFlag: "secret_rain_saint_rest",
    travelSeconds: 55,
    secret: true,
  },
  {
    id: "broken-aqueduct",
    name: "Broken Aqueduct",
    regionHint: "Secret · above the mill channel",
    description:
      "Stone arches over a channel that should carry river water. Boards wedge the gap where someone diverted the flow on purpose.",
    x: 24,
    y: 42,
    unlockStoryFlag: "secret_broken_aqueduct",
    travelSeconds: 50,
    secret: true,
  },
  {
    id: "ferrymans-hide",
    name: "Ferryman's Hide",
    regionHint: "Secret · under the ford",
    description:
      "A tarp boat tied to willow roots. The ferryman left crossing ledgers from before the creek died.",
    x: 34,
    y: 92,
    unlockStoryFlag: "secret_ferrymans_hide",
    travelSeconds: 60,
    secret: true,
    bestFor: "dexterity",
  },
];

export const ALL_LOCATIONS = [...SECRET_LOCATIONS];
