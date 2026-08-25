import type { RewardTone } from "@/lib/game/types";

export interface CombatOutcome {
  heroHit: string[];
  enemyHit: string[];
  heroCrit: string[];
  swiftFirst: string[];
  victory: string;
  defeat: string;
  jackpot: string;
  closeWin: string;
}

export const COMBAT_OUTCOMES: Record<string, CombatOutcome> = {
  "salt-wight": {
    heroHit: [
      "You crack salt-crust from the wight's ribs. Brine hisses away.",
      "Your strike scatters dried kelp. The figure staggers.",
    ],
    enemyHit: [
      "Salt fingers rake your arms. The sting outlasts the pain.",
      "The wight exhales brine. Your lungs rebel.",
    ],
    heroCrit: ["A perfect blow shatters the wight's core. Salt rains like snow."],
    swiftFirst: ["The Salt-Wight lunges before you set your feet."],
    victory: "The Salt-Wight collapses into a harmless heap of grit and rope.",
    defeat: "The tide takes your footing. The wight dissolves back into the wreck line.",
    jackpot: "One strike and the wight is only salt on the wind.",
    closeWin: "You stand dripping, but the shore is yours again.",
  },
  ashjackal: {
    heroHit: [
      "You catch the ashjackal mid-circle. It yips and breaks formation.",
      "Your weapon finds flank. Volcanic fur smolders.",
    ],
    enemyHit: [
      "Teeth graze your calf. Ash gets under your skin.",
      "The jackal feints left, bites right. Classic.",
    ],
    heroCrit: ["You pin the ashjackal with a single clean hit. It goes still."],
    swiftFirst: ["The ashjackal strikes first — a blur of smoke-grey."],
    victory: "The ashjackal limps into the heat haze. Salvage is yours.",
    defeat: "You retreat from the heap. The jackal's laugh follows like embers.",
    jackpot: "The beast never saw the finishing blow coming.",
    closeWin: "Blood and ash mix on the timber. You are still standing.",
  },
  "dust-bruiser": {
    heroHit: [
      "Your blow sends chalk dust exploding from the bruiser's bandages.",
      "A solid hit. The raider coughs grit.",
    ],
    enemyHit: [
      "A knuckled fist meets your guard. The canyon rings.",
      "The bruiser shoulder-checks you into the cliff wall.",
    ],
    heroCrit: ["You break through the bandages and the bruiser's pride with one strike."],
    swiftFirst: [],
    victory: "The Dust Bruiser kneels in the road, finally quiet.",
    defeat: "You crawl away while the raider counts your coin in their head.",
    jackpot: "One thunderous hit and the bruiser is dust in truth.",
    closeWin: "Every bone complains, but the road is open.",
  },
  "rift-stalker": {
    heroHit: [
      "You tag the stalker before it fades into the crack.",
      "A hit lands; the thing chitters in outrage.",
    ],
    enemyHit: [
      "Too many limbs — one finds a gap in your guard.",
      "The stalker drops from above. You barely roll clear.",
    ],
    heroCrit: ["You nail it to the stone with a strike that echoes for miles."],
    swiftFirst: ["The Rift Stalker strikes from the fissure before you breathe."],
    victory: "The stalker folds back into the dark, defeated.",
    defeat: "The crack network swallows your pride along with the trail.",
    jackpot: "The stalker never gets a second step.",
    closeWin: "Shaking, you seal the fissure with rubble and will.",
  },
  "heat-wraith": {
    heroHit: [
      "Your blow disperses the wraith's shimmer — briefly.",
      "Heat bends; your strike lands on something almost solid.",
    ],
    enemyHit: [
      "Furnace breath strips moisture from your lips.",
      "The wraith passes through your guard like a mirage with teeth.",
    ],
    heroCrit: ["You scatter the wraith with a strike backed by cold certainty."],
    swiftFirst: [],
    victory: "The Heat Wraith unravels into harmless shimmer.",
    defeat: "You fall back, parched. The vent keeps its secret.",
    jackpot: "The wraith ceases to exist between one heartbeat and the next.",
    closeWin: "Your throat is ash, but the watchtower stands.",
  },
  "cinder-hound": {
    heroHit: [
      "You clip the hound's haunch. Basalt fur chips away.",
      "A clean hit. The hound snarls and resets its circle.",
    ],
    enemyHit: [
      "Furnace jaws snap at your wrist. You pull back scorched.",
      "The pack instinct kicks in — another nip from the flank.",
    ],
    heroCrit: ["One blow and the Cinder Hound drops like a spent coal."],
    swiftFirst: ["The hound rushes before you finish your stance."],
    victory: "The Cinder Hound retreats between the shade stones, beaten.",
    defeat: "Couriers will find another route. You find your feet.",
    jackpot: "The hound never gets its second pass.",
    closeWin: "Smoke in your lungs, victory in your hands.",
  },
  "obsidian-knuckle": {
    heroHit: [
      "Glass-knuckles crack under your assault. The golem staggers.",
      "Sparks fly. Another chunk of obsidian falls.",
    ],
    enemyHit: [
      "The Knuckle's fist rings against your ribs like a bell.",
      "Obsidian knuckles graze your temple. Stars and ash.",
    ],
    heroCrit: ["You shatter the golem's core with a blow for the histories."],
    swiftFirst: [],
    victory: "The Obsidian Knuckle collapses into harmless shards.",
    defeat: "Mining wards win this round. You limp toward shade.",
    jackpot: "One strike unmade the golem entirely.",
    closeWin: "Bleeding, you stand on a field of black glass.",
  },
  "shrine-warden": {
    heroHit: [
      "Rainward stone chips. The warden's posture falters.",
      "Your strike echoes inside the shrine like answered prayer.",
    ],
    enemyHit: [
      "Stone boots drive into your chest. Breath leaves in a rush.",
      "The warden's backhand is doctrine made physical.",
    ],
    heroCrit: ["A perfect blow cracks the warden's ward. Silence follows."],
    swiftFirst: [],
    victory: "The Shrine Warden steps aside, duty satisfied.",
    defeat: "The threshold rejects you. You crawl back into daylight.",
    jackpot: "The warden kneels — not in defeat, but recognition.",
    closeWin: "Bruised, you are permitted to pass.",
  },
  "drought-spirit": {
    heroHit: [
      "Your strike binds the spirit tighter to the mortal coil — briefly.",
      "Thirst made visible recoils from your will.",
    ],
    enemyHit: [
      "Every drop of sweat the spirit steals feels intentional.",
      "Dry lips crack. The spirit feeds on the discomfort.",
    ],
    heroCrit: ["You speak a word of rain and the spirit unravels."],
    swiftFirst: [],
    victory: "The Drought Spirit dissipates, leaving only a cool breath.",
    defeat: "Parched and humbled, you withdraw from the sealed door.",
    jackpot: "The spirit disperses like morning mist.",
    closeWin: "Your mouth is desert, but the spirit is gone.",
  },
  "gate-sentinel": {
    heroHit: [
      "Rainward iron groans under your assault.",
      "Another blow. The sentinel's guard drops a fraction.",
    ],
    enemyHit: [
      "The Gate Sentinel hits like a closing door.",
      "Centuries of practice in one brutal swing.",
    ],
    heroCrit: ["One strike and the sentinel's ward shatters like ice."],
    swiftFirst: [],
    victory: "The Gate Sentinel salutes and crumbles. The Rainward Gate listens.",
    defeat: "The gate remains sealed. You remain alive — barely.",
    jackpot: "Orwen remembers rain. The sentinel falls in awe.",
    closeWin: "On your knees, you hear the gate begin to breathe.",
  },
};

export function combatLine(
  enemyId: string,
  kind: keyof CombatOutcome,
  fallback: string,
): string {
  const outcomes = COMBAT_OUTCOMES[enemyId];
  if (!outcomes) return fallback;
  const pool = outcomes[kind];
  if (Array.isArray(pool) && pool.length) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (typeof pool === "string") return pool;
  return fallback;
}

export function combatNpcQuote(locationId: string, tone: RewardTone) {
  const quotes: Record<string, Partial<Record<RewardTone, { name: string; quote: string }>>> = {
    "northern-shore": {
      success: {
        name: "Beachcomber Jess",
        quote: "Saw the fight from the dunes. You’ve got salt in your spine.",
      },
      fail: {
        name: "Beachcomber Jess",
        quote: "Live to scrap another day. The shore keeps its teeth.",
      },
      jackpot: {
        name: "Beachcomber Jess",
        quote: "That was a story worth trading for.",
      },
    },
    "clara-canyon": {
      success: {
        name: "Smuggler's Ghost (probably)",
        quote: "Road’s clear. Don’t make me say thanks twice.",
      },
      fail: {
        name: "Smuggler's Ghost (probably)",
        quote: "Crawl back when your bones stop singing.",
      },
    },
    "blackened-tables": {
      success: {
        name: "Watchtower Guard",
        quote: "Signal fire’s green. We saw you win from up top.",
      },
      fail: {
        name: "Watchtower Guard",
        quote: "We marked you down as alive. Fix that ratio next time.",
      },
    },
    "sealed-shrine": {
      success: {
        name: "Shrine Acolyte",
        quote: "The stone remembers courage. So do we.",
      },
      fail: {
        name: "Shrine Acolyte",
        quote: "The gate is patient. So must you be.",
      },
      jackpot: {
        name: "Shrine Acolyte",
        quote: "Rain stirs behind the door. You felt it too.",
      },
    },
  };
  const loc = quotes[locationId];
  const hit = loc?.[tone] ?? loc?.success;
  return hit ?? { name: "A witness", quote: "The land takes note." };
}
