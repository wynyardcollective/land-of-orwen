export type TavernRumorKind =
  | "secret_location"
  | "early_location"
  | "intel"
  | "tip_gold";

export interface TavernDef {
  id: string;
  locationId: string;
  name: string;
  keeper: string;
  description: string;
  baseCost: number;
  /** Seconds to linger and listen before a rumor resolves */
  roundSeconds: number;
}

export interface TavernRumorDef {
  id: string;
  tavernId: string;
  weight: number;
  kind: TavernRumorKind;
  /** Story flag set when rumor hits */
  flag: string;
  headline: string;
  detail: string;
  /** For secret_location / early_location */
  unlockLocationId?: string;
  /** For intel — journal entry id */
  journalId?: string;
  /** Minimum story flags before this rumor enters the pool */
  requiresFlags?: string[];
  /** Skip if any of these flags exist */
  skipIfFlags?: string[];
  /** Skip if location already unlocked */
  skipIfLocationUnlocked?: string;
}

export const TAVERNS: TavernDef[] = [
  {
    id: "dry-kettle",
    locationId: "tarowen-square",
    name: "The Dry Kettle",
    keeper: "Barkeep Senna",
    description:
      "Tarowen's last proper tavern. The ale is thin and the chatter is thick — for a few coins, Senna will pour you something stronger: a lead.",
    baseCost: 18,
    roundSeconds: 45,
  },
  {
    id: "cider-bench",
    locationId: "merrick-orchard",
    name: "Cider Bench",
    keeper: "Old Merrick",
    description:
      "Not a tavern so much as a plank and two stools, but Merrick hears every traveler. He'll sell a cup and a hint to those who ask nicely.",
    baseCost: 12,
    roundSeconds: 40,
  },
  {
    id: "wheelhouse-tap",
    locationId: "stone-mill",
    name: "Wheelhouse Tap",
    keeper: "Miller Odo",
    description:
      "Mill hands gather here after turning the wheel. Odo keeps a chalkboard of who owes who — and who saw what on the roads.",
    baseCost: 22,
    roundSeconds: 50,
  },
  {
    id: "salt-gull",
    locationId: "northern-shore",
    name: "The Salt Gull",
    keeper: "Captain's Widow Pel",
    description:
      "A driftwood shack that serves brine-stung tea and sharper rumors. Pel trades in wrecks and whispers.",
    baseCost: 26,
    roundSeconds: 55,
  },
  {
    id: "ash-canteen",
    locationId: "blackened-tables",
    name: "Ash Canteen",
    keeper: "Watchmaster Iri",
    description:
      "The only roof on the tablelands that isn't choked with cinders. Iri logs heat-vent sightings and sells them by the sip.",
    baseCost: 32,
    roundSeconds: 60,
  },
  {
    id: "drying-shed",
    locationId: "windmere-hamlet",
    name: "The Drying Shed",
    keeper: "Hostess Vale",
    description:
      "A plank hall where fruit shrinks instead of cures. Vale pours thin cider and hears which roads still carry couriers.",
    baseCost: 16,
    roundSeconds: 42,
  },
  {
    id: "bracken-stein",
    locationId: "bracken-ford",
    name: "Bracken Stein",
    keeper: "Ford-warden Hek",
    description:
      "Mud-floor tavern at the crossing. Hek keeps crossing fees, grudges, and the names of everyone who still owes the ford.",
    baseCost: 20,
    roundSeconds: 48,
  },
];

export const TAVERN_MAP = Object.fromEntries(
  TAVERNS.map((t) => [t.id, t]),
) as Record<string, TavernDef>;

export const TAVERN_RUMORS: TavernRumorDef[] = [
  // —— Dry Kettle (Tarowen) ——
  {
    id: "tk-whisper-well",
    tavernId: "dry-kettle",
    weight: 10,
    kind: "secret_location",
    flag: "secret_whisper_well",
    unlockLocationId: "whisper-well",
    headline: "Whisper Well found",
    detail:
      "Senna slides you a damp map scrap: a hatch beneath the square where voices echo like prophecy.",
  },
  {
    id: "tk-mill-tip",
    tavernId: "dry-kettle",
    weight: 8,
    kind: "early_location",
    flag: "tavern_mill_tip",
    unlockLocationId: "stone-mill",
    headline: "Path to Stonewheel Mill",
    detail:
      "A miller’s courier left his route notes on the bar. The wheel’s path is on your map — no orchard errand required.",
    skipIfLocationUnlocked: "stone-mill",
  },
  {
    id: "tk-drought-cult",
    tavernId: "dry-kettle",
    weight: 12,
    kind: "intel",
    flag: "intel_drought_cult",
    journalId: "tavern-drought-cult",
    headline: "Whispers of a drought cult",
    detail:
      "Three traders swear someone is paying villages to smash rain gauges. Senna thinks it started upstream.",
  },
  {
    id: "tk-lucky-coin",
    tavernId: "dry-kettle",
    weight: 6,
    kind: "tip_gold",
    flag: "tavern_lucky_coin_1",
    headline: "A lucky coin",
    detail: "Someone bought your round and left a fat tip in the sawdust.",
  },
  // —— Cider Bench (Orchard) ——
  {
    id: "cb-root-cellar",
    tavernId: "cider-bench",
    weight: 10,
    kind: "secret_location",
    flag: "secret_root_cellar",
    unlockLocationId: "root-cellar",
    headline: "Root Cellar opened",
    detail:
      "Merrick finally admits where he keeps the real ledgers — under the oldest apple root.",
  },
  {
    id: "cb-rain-saint",
    tavernId: "cider-bench",
    weight: 12,
    kind: "intel",
    flag: "intel_rain_saint",
    journalId: "tavern-rain-saint",
    headline: "The Rain Saint",
    detail:
      "Merrick mutters about a roadside shrine that still weeps moss. Pilgrims stopped going when the wells failed.",
  },
  {
    id: "cb-mill-tip",
    tavernId: "cider-bench",
    weight: 6,
    kind: "early_location",
    flag: "tavern_mill_tip",
    unlockLocationId: "stone-mill",
    headline: "Shortcut to the mill",
    detail:
      "A drover’s trail bypasses Tarowen entirely. Stonewheel Mill is on your map.",
    skipIfLocationUnlocked: "stone-mill",
  },
  {
    id: "cb-rain-saint-rest",
    tavernId: "cider-bench",
    weight: 8,
    kind: "secret_location",
    flag: "secret_rain_saint_rest",
    unlockLocationId: "rain-saint-rest",
    headline: "Rain Saint's Rest",
    detail:
      "Merrick finally names the mossy saint on the south road — basin empty, coins rusting, but the spot is on your map.",
    requiresFlags: ["windmere_unlocked"],
  },
  // —— Wheelhouse Tap (Mill) ——
  {
    id: "wt-shore-tip",
    tavernId: "wheelhouse-tap",
    weight: 8,
    kind: "early_location",
    flag: "tavern_shore_tip",
    unlockLocationId: "northern-shore",
    headline: "Northern Shore mapped",
    detail:
      "Odo’s chalkboard lists a trader caravan route north. The wreck line is on your map now.",
    skipIfLocationUnlocked: "northern-shore",
    requiresFlags: ["mill_unlocked"],
  },
  {
    id: "wt-flow-thief",
    tavernId: "wheelhouse-tap",
    weight: 12,
    kind: "intel",
    flag: "intel_flow_thief",
    journalId: "tavern-flow-thief",
    headline: "The flow thief",
    detail:
      "Mill charts show water vanishing between stations — not evaporating. Something intercepts the aquifer.",
  },
  {
    id: "wt-canyon-tip",
    tavernId: "wheelhouse-tap",
    weight: 6,
    kind: "early_location",
    flag: "tavern_canyon_tip",
    unlockLocationId: "clara-canyon",
    headline: "Canyon route marked",
    detail:
      "A smuggler bribed Odo for safe passage. Clara's Canyon appears on your map.",
    skipIfLocationUnlocked: "clara-canyon",
  },
  {
    id: "wt-broken-aqueduct",
    tavernId: "wheelhouse-tap",
    weight: 9,
    kind: "secret_location",
    flag: "secret_broken_aqueduct",
    unlockLocationId: "broken-aqueduct",
    headline: "Broken Aqueduct",
    detail:
      "Odo heard boards in the old channel above the wheel. Someone diverted the flow on purpose — it's on your map.",
    requiresFlags: ["ledger_unlocked"],
  },
  // —— Salt Gull (Shore) ——
  {
    id: "sg-gulls-rest",
    tavernId: "salt-gull",
    weight: 10,
    kind: "secret_location",
    flag: "secret_gulls_rest",
    unlockLocationId: "gulls-rest",
    headline: "Gull's Rest Cove",
    detail:
      "Pel marks a hidden inlet on your map — where offerings of salt still appear at dawn.",
    requiresFlags: ["shore_unlocked"],
  },
  {
    id: "sg-shrine-hint",
    tavernId: "salt-gull",
    weight: 10,
    kind: "intel",
    flag: "intel_shrine_symbols",
    journalId: "tavern-shrine-symbols",
    headline: "Shrine symbol gossip",
    detail:
      "Beachcombers argue the sealed door wants cloud, moon, star — but not in the order the carvings show.",
    requiresFlags: ["shore_unlocked"],
  },
  {
    id: "sg-tables-tip",
    tavernId: "salt-gull",
    weight: 7,
    kind: "early_location",
    flag: "tavern_tables_tip",
    unlockLocationId: "blackened-tables",
    headline: "Tablelands trail",
    detail:
      "Pel knows a vent road inland. The Blackened Tablelands are on your map.",
    skipIfLocationUnlocked: "blackened-tables",
    requiresFlags: ["shore_unlocked"],
  },
  {
    id: "sg-smuggler-nook",
    tavernId: "salt-gull",
    weight: 5,
    kind: "secret_location",
    flag: "secret_smugglers_nook",
    unlockLocationId: "smugglers-nook",
    headline: "Smuggler's Nook",
    detail:
      "A drunk ropehand draws a ladder down the canyon wall. The nook is on your map.",
    requiresFlags: ["canyon_unlocked"],
  },
  // —— Ash Canteen (Tables) ——
  {
    id: "ac-ember-hollow",
    tavernId: "ash-canteen",
    weight: 10,
    kind: "secret_location",
    flag: "secret_ember_hollow",
    unlockLocationId: "ember-hollow",
    headline: "Ember Hollow",
    detail:
      "Iri’s vent logs point to a basin where heat sinks instead of rises. It’s on your map.",
    requiresFlags: ["tables_unlocked"],
  },
  {
    id: "ac-shrine-tip",
    tavernId: "ash-canteen",
    weight: 8,
    kind: "early_location",
    flag: "tavern_shrine_tip",
    unlockLocationId: "sealed-shrine",
    headline: "Shrine approach",
    detail:
      "Watchtower scouts traded coordinates. The Sealed Shrine is on your map.",
    skipIfLocationUnlocked: "sealed-shrine",
    requiresFlags: ["tables_unlocked"],
  },
  {
    id: "ac-rainward",
    tavernId: "ash-canteen",
    weight: 12,
    kind: "intel",
    flag: "intel_rainward_gate",
    journalId: "tavern-rainward-gate",
    headline: "Rainward Gate lore",
    detail:
      "Iri heard the gate opens only when drought is named aloud — and when the bearer carries a ring that remembers rain.",
    requiresFlags: ["shrine_unlocked"],
  },
  // —— Drying Shed (Windmere) ——
  {
    id: "ds-relay-tip",
    tavernId: "drying-shed",
    weight: 8,
    kind: "early_location",
    flag: "tavern_relay_tip",
    unlockLocationId: "odos-relay",
    headline: "Relay route marked",
    detail:
      "Vale copies a courier's chalk marks. Odo's Relay is on your map if you haven't walked it yet.",
    skipIfLocationUnlocked: "odos-relay",
  },
  // —— Bracken Stein (Ford) ——
  {
    id: "bs-ferry-hide",
    tavernId: "bracken-stein",
    weight: 10,
    kind: "secret_location",
    flag: "secret_ferrymans_hide",
    unlockLocationId: "ferrymans-hide",
    headline: "Ferryman's Hide",
    detail:
      "Hek mentions a tarp boat under the willows. The ferryman's ledgers are still tied there — on your map.",
  },
  {
    id: "bs-ford-gossip",
    tavernId: "bracken-stein",
    weight: 10,
    kind: "intel",
    flag: "intel_ford_trade",
    journalId: "tavern-ford-trade",
    headline: "Southern trade routes",
    detail:
      "Southern carts still run even without a creek. Hek says half the grain is smuggled north through the ford at night.",
  },
];

export const TAVERN_RUMOR_MAP = Object.fromEntries(
  TAVERN_RUMORS.map((r) => [r.id, r]),
) as Record<string, TavernRumorDef>;

export function tavernAtLocation(locationId: string) {
  return TAVERNS.find((t) => t.locationId === locationId);
}

export const TAVERN_MISS_FLAVOR = [
  "The room goes quiet, then loud again. Nothing useful tonight.",
  "Your coin buys warmth, not wisdom. Try again after another round.",
  "Someone changed the subject when you leaned in. The trail goes cold.",
  "A fight breaks out and your question is forgotten in the scuffle.",
  "The barkeep shrugs. 'Come back when you’ve got more face — or more gold.'",
];

export const TAVERN_BEATS: Record<string, string[]> = {
  "dry-kettle": [
    "Senna slides a cup across the scarred bar. The ale is thin; the gossip isn't.",
    "A trader argues about rain gauges. Someone else buys silence with a stare.",
    "Dice clatter in the corner. You lean in and pretend not to listen.",
    "The kettle hisses. Voices drop when coin changes hands.",
  ],
  "cider-bench": [
    "Merrick pours cider that tastes like patience. Travelers swap half-truths on the plank.",
    "Apple wood smokes in the pit. A drover mentions a path you haven't walked.",
    "Merrick hums an old rain-song. Regulars answer with names you almost catch.",
    "The orchard wind carries laughter. Someone at the bench knows something.",
  ],
  "wheelhouse-tap": [
    "Mill hands argue over chalk tallies. Odo wipes the board and starts a fresh column.",
    "Gear grease and cheap spirits. Road stories compete with the wheel's groan.",
    "A smuggler's coin buys a second cup — and a longer stare your way.",
    "Odo points at the chalkboard without looking. The regulars understand.",
  ],
  "salt-gull": [
    "Pel stokes the driftwood stove. Brine and tea war the shack against the shore wind.",
    "Wreck wood creaks outside. Beachcombers trade rumors like salvage.",
    "Someone sketches a cove in spilled salt. Pel pretends not to notice you watching.",
    "Gull cries punctuate every pause. Pel refills cups without being asked.",
  ],
  "ash-canteen": [
    "Iri ticks a vent sighting into a soot-stained log. The canteen smells of ash and spice.",
    "Watchtower hands speak in half-whispers. Heat shimmer is a familiar backdrop.",
    "A scout drops a coin for another cup. Iri's eyes track who listens too closely.",
    "Cinders tap the roof. Someone mentions a gate that remembers rain.",
  ],
  "drying-shed": [
    "Apple racks creak in the shed. Vale slides cups to travelers who still have routes to name.",
    "Thin cider and thinner hope. Someone mentions a relay barn that still counts couriers.",
    "Fruit leather dries too fast. Vale writes names she overhears on a flour sack.",
    "Wind rattles the plank walls. Regulars trade road news like it might still matter.",
  ],
  "bracken-stein": [
    "Mud sticks to every boot. Hek calls crossing fees without looking up from his ledger.",
    "Cart wheels grind outside. Hek knows who paid and who will argue about it later.",
    "Someone offers a ford story for ale. Hek pours anyway and listens for profit.",
    "The stein's handle is sticky. Hek quotes a name you almost recognize from Merrick's notes.",
  ],
};

export const TAVERN_TIP_GOLD = [3, 5, 8, 12];
