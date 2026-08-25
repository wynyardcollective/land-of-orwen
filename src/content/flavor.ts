export interface QuestOutcome {
  success: string;
  fail: string;
  closeWin: string;
  closeLoss: string;
  jackpot: string;
}

export const LOCATION_NPCS: Record<
  string,
  { name: string; title: string; greet: string }
> = {
  "merrick-orchard": {
    name: "Old Merrick",
    title: "orchard keeper",
    greet: "Don't stand in the ditch. There's no water to ruin your boots, but the habit's the same.",
  },
  "tarowen-square": {
    name: "Aunt Calda",
    title: "well-warden",
    greet: "If you hear the bucket hit stone, that's not luck. That's a reminder.",
  },
  "ashen-grass": {
    name: "Shepherd Joss",
    title: "flock-watcher",
    greet: "Count twice. The wind steals sheep the way the drought steals names.",
  },
  "stone-mill": {
    name: "Millwright Pen",
    title: "gear-turner",
    greet: "Push when I say. The wheel remembers every lazy shoulder.",
  },
  "northern-shore": {
    name: "Kett",
    title: "vagrant trader",
    greet: "Don't call it junk until I've named a price. Then we can argue.",
  },
  "clara-canyon": {
    name: "Scholar Ila",
    title: "crack-mapper",
    greet: "The wind will try to finish your sentences. Let it. Then write the true ones down.",
  },
  "blackened-tables": {
    name: "Watchtower Wren",
    title: "ash-clearer",
    greet: "Shade first. Heroics second. The plateau cooks the impatient.",
  },
  "sealed-shrine": {
    name: "The Door",
    title: "rainward stone",
    greet: "It does not speak. It waits. That is almost the same thing.",
  },
};

export const LOCATION_BEATS: Record<string, string[]> = {
  "merrick-orchard": [
    "Dust lifts off the orchard path and settles again, thicker.",
    "A thirsty apple leaf clicks against another like dry teeth.",
    "Merrick's irrigation ditch holds a memory of mud, nothing more.",
    "Crows pace the fence as if waiting for a storm that forgot its cue.",
  ],
  "tarowen-square": [
    "The well-bucket knocks stone. Someone winces out of habit.",
    "Dried fruit changes hands like treasure. Water would be cheaper talk.",
    "A trader shades their eyes and pretends the sky might still change its mind.",
    "Market flags hang limp. Even gossip needs a breeze.",
  ],
  "ashen-grass": [
    "Pale grass hisses. It sounds like rain if you are lonely enough.",
    "A shepherd's whistle carries too far in this empty air.",
    "Sheep print the dust, then the wind erases them.",
    "The horizon shimmers. It is heat, not water. You know that now.",
  ],
  "stone-mill": [
    "A gear complains. Someone answers it with a grunt.",
    "The mill wheel sits like a beached fish, waiting for a river that left.",
    "Chalk numbers on the wall mark dry days. There are too many.",
    "Stone dust hangs in the light. It could almost be mist.",
  ],
  "northern-shore": [
    "Gulls argue over a boot that once had a foot and a story.",
    "Salt wind tastes like a promise it cannot keep.",
    "Wreck timber ticks as it dries a little more.",
    "A vagrant laughs, then coughs, then bargains anyway.",
  ],
  "clara-canyon": [
    "The canyon howls the same three notes, then invents a fourth.",
    "Redstone grit stings your teeth. You close your mouth and keep moving.",
    "A ledge shadow looks like water. It is only cooler rock.",
    "Somewhere below, a pebble decides to fall. You do not.",
  ],
  "blackened-tables": [
    "Heat shimmer makes the watchtower bow, then straighten.",
    "Ash drifts like grey snow that will not melt.",
    "A vent breathes. The plateau has lungs. They are unwell.",
    "Basalt is warm through your soles. The old fire has not finished leaving.",
  ],
  "sealed-shrine": [
    "The door's three marks catch a light that is not quite sun.",
    "Air here tastes like rain that stopped in the doorway.",
    "Dust hangs still, as if waiting for permission to fall.",
    "You think you hear a basin fill. You do not. Not yet.",
  ],
};

export const TRAVEL_BEATS: Record<string, string[]> = {
  "merrick-orchard": [
    "The path home smells of apples that never ripened.",
    "Orchard rows lean in, curious and thirsty.",
  ],
  "tarowen-square": [
    "Cart ruts lead toward town, then fade where water used to pool.",
    "You hear the square before you see it: dry talk, drier boots.",
  ],
  "ashen-grass": [
    "Grasslands open like a pale page. Your shadow is the only writing.",
    "A fence post lists. You list with it, then correct your stride.",
  ],
  "stone-mill": [
    "Uphill, the mill's silhouette looks like a stopped clock.",
    "You follow a riverbed the way you follow a rumor: hoping it still exists.",
  ],
  "northern-shore": [
    "The air turns salt. Gulls appear as if summoned by the smell.",
    "Sand gets into the story early. It always does.",
  ],
  "clara-canyon": [
    "The wind finds the canyon mouth and begins its argument.",
    "Red walls rise. The path narrows into a dare.",
  ],
  "blackened-tables": [
    "The ground darkens to basalt. Heat comes up to meet you.",
    "Ash on the tongue. You spit, politely, at the drought.",
  ],
  "sealed-shrine": [
    "The last stretch is quieter than it should be.",
    "Stone begins to look intentional. You are close.",
  ],
};

export const QUEST_OUTCOMES: Record<string, QuestOutcome> = {
  "orchard-haul": {
    success:
      "The last cask thuds into place. Merrick does not smile, but he stops swearing at the ditch. That is praise.",
    fail: "A hoop splits. Water that was never much becomes a dark comma in the dust. Merrick looks away so you can keep your pride.",
    closeWin:
      "You nearly drop the heaviest barrel. Your knees bargain. The barrel, somehow, agrees to stay whole.",
    closeLoss:
      "One more step would have done it. The cask kisses a stone and sulks leaking. Almost counts as thirst.",
    jackpot:
      "Under the last cask: a coin from a rainier year, stuck in the wood like a secret.",
  },
  "orchard-prune": {
    success:
      "Dead limbs fall clean. Light reaches the path. Merrick nods once, as if the trees might forgive him.",
    fail: "A branch cracks the wrong way and takes a healthy shoot with it. The orchard keeps score.",
    closeWin:
      "You slip, catch a trunk, and still make the cut. Bark under your nails. Heart loud. Trees quieter.",
    closeLoss:
      "The saw binds. You yank. The limb twists and stays, uglier. Almost a good day's work.",
    jackpot:
      "In a hollow of the worst branch: a copper buckle and a moth that thought it was rain.",
  },
  "orchard-listen": {
    success:
      "Between ink blots, a pattern: the dry spell started upstream, not in the soil. Merrick's ledger points at the mill.",
    fail: "The numbers swim. You copy a date wrong and the story of the drought goes blurry for a day.",
    closeWin:
      "You almost miss the margin note. Merrick's hand shook on that line. The mill is named in a whisper of graphite.",
    closeLoss:
      "You stare until the pages look like weather. Meaning hides. Tomorrow, perhaps.",
    jackpot:
      "Tucked in the spine: a tide chart that should not belong to an orchard. The shore is already in the story.",
  },
  "square-bargain": {
    success:
      "Calda watches you talk water-credits into orchard labor. The traders leave poorer in pride and richer in work.",
    fail: "They smell eagerness. The deal sours. You leave with a handful of dried figs and a lesson.",
    closeWin:
      "You name a price too high, then laugh it into the right number. Calda's eyebrow is a standing ovation.",
    closeLoss:
      "Almost. A trader's cousin arrives with a worse offer that still wins. The square is unkind to almosts.",
    jackpot:
      "A rumor rides the handshake: northern wreckage, and people who cannot price what they hold.",
  },
  "square-lift": {
    success:
      "Stone by stone, the well remembers depth. The bucket drops and does not immediately insult you.",
    fail: "A block slips. Dust plumes. The well is as useless as this morning, plus a bruise.",
    closeWin:
      "The last masonry chunk teeters. You swear, shove, and it yields as if embarrassed.",
    closeLoss:
      "You had it. Then a pebble under your heel argued otherwise. The well keeps its junk.",
    jackpot:
      "Wedged in the debris: a ring that still thinks it is jewelry, and a sip of trapped dew.",
  },
  "square-courier": {
    success:
      "The seed satchel reaches the grasslands before dusk. Joss takes it like a letter from a wetter country.",
    fail: "You miss a turn in the heat. The satchel is late. The shepherds are polite about disappointment.",
    closeWin:
      "A strap breaks. You knot it with your teeth and still beat the shadow of the square's last roof.",
    closeLoss:
      "So close the shepherds can see you. Dusk wins by a length. The seeds sulk in twilight.",
    jackpot:
      "A shepherd presses extra coin into your palm 'for the running.' Your lungs file a complaint.",
  },
  "grass-sheep": {
    success:
      "You find the lost ewes in a hollow the wind forgot. Joss laughs like rain on a roof that still exists.",
    fail: "You find three sheep and lose two. The fourth was a white rock with ambitions.",
    closeWin:
      "The last lamb is a rumor until it isn't. You grab fleece. It grabs back. You both survive.",
    closeLoss:
      "Almost in your arms. Then the flock startles and the count goes wrong again.",
    jackpot:
      "In the wool: a copper clasp and burrs enough to start a small, angry garden.",
  },
  "grass-fence": {
    success:
      "Posts stand like tired soldiers who have decided to stay on duty. Night thieves will have to work.",
    fail: "A post splits. The wire sighs. The fence is a suggestion, and suggestions are cheap here.",
    closeWin:
      "The last post leans, then remembers dignity. You hammer as if the drought can hear it.",
    closeLoss:
      "One more strike. The head glances. The post stays drunk. Almost a line of defense.",
    jackpot:
      "Under a kicked-up clod: a worn glove that still knows a fence's language.",
  },
  "grass-herbs": {
    success:
      "You note which plants still green. The healer will call it science. You call it paying attention.",
    fail: "Heat makes every leaf look guilty. Your notes contradict themselves by noon.",
    closeWin:
      "You almost pick the wrong sprig. A bee disagrees. You write the true name instead.",
    closeLoss:
      "The catalog blurs. You have a list of maybes. Maybes do not make draughts.",
    jackpot:
      "A plant the healer thought extinct. They will not sleep. Neither will your reputation.",
  },
  "mill-turn": {
    success:
      "The wheel groans, then yields a quarter-turn. Pen whoops like a person who has been thirsty for sound.",
    fail: "Your shoulder files a formal protest. The wheel does not move. The dry days get another chalk mark.",
    closeWin:
      "It sticks. You roar. Something in the axle decides to be kind for one ugly second.",
    closeLoss:
      "So close the gear teeth almost kiss. Then they sulk apart. Almost a river, in spirit.",
    jackpot:
      "When it moves, a hidden compartment in the rim coughs out a millwright's spare hammer-charm.",
  },
  "mill-gears": {
    success:
      "Oil finds the seized teeth. The crawlspace returns you with knuckles intact and a story about darkness.",
    fail: "You jam a wrist and a gear. Pen hauls you out. The mill is still a monument to stubbornness.",
    closeWin:
      "The last cog bites your sleeve, then lets go as if it recognized a friend.",
    closeLoss:
      "Almost free, almost oiled, almost useful. The dark keeps the rest.",
    jackpot:
      "Behind a plate: a vial of better oil and a note in a dead miller's joke.",
  },
  "mill-math": {
    success:
      "You redraw the channels for bucket brigades. The numbers admit the river is gone. The plan does not.",
    fail: "Your diagram assumes hope. Hope is not a gradient. Pen sighs and saves the chalk.",
    closeWin:
      "An error almost ships. You catch it in the margin. The mill might yet pretend to be a machine.",
    closeLoss:
      "The math is nearly kind. Nearly is a dry word. You leave the slate half-true.",
    jackpot:
      "In an old folio: flow charts that mention a shrine 'where rain is stored like grain.'",
  },
  "shore-comb": {
    success:
      "To the untrained eye, debris. To you: a shape that still wants to be a relic. Kett pretends not to be impressed.",
    fail: "You pocket salt and splinters. The beach keeps its better secrets for ruder people.",
    closeWin:
      "Your boot finds a hollow. You almost walk past. The relic taps back.",
    closeLoss:
      "Fingers brush metal. A wave — there is no wave — of luck pulls it under sand anyway.",
    jackpot:
      "A tide-glass bead, still holding a thumbprint of a storm.",
  },
  "shore-trade": {
    success:
      "You price wreckage honestly and still profit. Kett grins with too many teeth. The tablelands get mentioned like a dare.",
    fail: "You overpay for a story and underpay for a nail. The vagrants educate you at leisure.",
    closeWin:
      "The deal nearly collapses into insult. You name the true worth. Hands shake, somewhat clean.",
    closeLoss:
      "Almost a profit. A cousin of a cousin 'remembers' a better offer. The beach is a parliament of almosts.",
    jackpot:
      "In the swap: a map-scrap of black stone country, warm as a lie that might be true.",
  },
  "shore-haul": {
    success:
      "Beams for Tarowen's well slide onto the cart. Salt fights you the whole way. You win by inches.",
    fail: "Slick wood wins. You sit in sand and consider a new career in sitting.",
    closeWin:
      "The timber nearly takes you into the surf-line of memory. You plant your heels and refuse the past.",
    closeLoss:
      "One haul from done. The beam twists. Pride and pine both splinter.",
    jackpot:
      "A ship's nail, still honest, and a coin fused to it by old fire.",
  },
  "shore-rumor": {
    success:
      "Around a driftwood fire, someone names a sealed shrine and three marks that still hold rain. The door is no longer a rumor. It is a direction.",
    fail: "They talk in circles. You learn three jokes and zero geography.",
    closeWin:
      "You almost laugh at the wrong moment. You listen instead. Cloud, moon, star — in that order of hunger.",
    closeLoss:
      "The storyteller coughs the ending away. You have a shrine with no door, or a door with no map.",
    jackpot:
      "A listener presses a carved pebble into your hand: practice for a lock that is also a prayer.",
  },
  "canyon-ledge": {
    success:
      "You cross the knife-edge while the canyon howls. Ila does not clap. She writes your name smaller, which is respect.",
    fail: "A gust votes no. You freeze, then retreat. The ledge keeps its undefeated record.",
    closeWin:
      "A foot slips. The other foot files an emergency petition. You remain in the story.",
    closeLoss:
      "Almost across. The wind takes the last step personally. You take the long way back.",
    jackpot:
      "In a crack: a wind-amulet someone dropped rather than fall with it.",
  },
  "canyon-map": {
    success:
      "Your sketches of the drinking-cracks are ugly and accurate. Ila pays in coin and a look that means continue.",
    fail: "The fissures look alike. Your map would get a goat lost. Ila is kind about goats.",
    closeWin:
      "You almost skip a fork. The wind writes it for you. You copy the wind, then correct it.",
    closeLoss:
      "Nearly a complete network. One blank ruins the rest. Scholarship is cruel that way.",
    jackpot:
      "A scholar's spare charcoal and a note: 'the plateau breathes what the canyon drinks.'",
  },
  "canyon-boulder": {
    success:
      "The fallen gate yields. Light returns to the old smuggler road. Your shoulders file for hazard pay.",
    fail: "The rock is a philosophy: stay. You are not yet a better philosophy.",
    closeWin:
      "The lever slips, then bites. The boulder agrees, grudgingly, to be history.",
    closeLoss:
      "It budges a thumb-width. Then it remembers gravity. Almost a road.",
    jackpot:
      "Behind the stone: a smuggler's glove, still shaped like a daring hand.",
  },
  "tables-ash": {
    success:
      "Ash leaves the stairs. The horizon comes back like a shy animal. Wren allows herself a drink of shade.",
    fail: "The drifts win. You cough grey. The watchtower remains a rumor of a view.",
    closeWin:
      "The last drift slumps aside. You see weather that is not here. That is still a kind of seeing.",
    closeLoss:
      "Almost clear. The wind donates more ash, cheerfully. The plateau has a sense of humor.",
    jackpot:
      "Under a drift: a helm cheek-guard that shrugged off older heat than yours.",
  },
  "tables-survey": {
    success:
      "You log the vents that still breathe. If rain is being held, these lungs are suspects.",
    fail: "Shimmer lies. You record ghosts. Wren crosses out half the page without unkindness.",
    closeWin:
      "One vent almost fools you into poetry. You write the temperature instead. Science survives.",
    closeLoss:
      "The pattern is nearly there. Heat erases the last number. The plateau keeps its diagnosis.",
    jackpot:
      "A vent coughs a warm pebble veined like a storm-map.",
  },
  "tables-dash": {
    success:
      "Shade to shade, you outrun the cook-pot plateau. Wren admits you might live long enough to be useful.",
    fail: "You misjudge a gap. The basalt teaches you humility, medium-rare.",
    closeWin:
      "Your boot smokes, metaphorically. You make the last stone by a prayer and a blister.",
    closeLoss:
      "Almost the next shade. The heat votes. You retreat, cooked but countable.",
    jackpot:
      "In the last shade: a waterskin ghost — empty — and a lucky coin someone bet against the sun.",
  },
  "shrine-study": {
    success:
      "Cloud, moon, star: the door is a sentence. You have the grammar. The lock is still a lock.",
    fail: "The marks stare. You stare back. Neither of you blinks. Scholarship requires blinking.",
    closeWin:
      "You almost order them wrong. A memory of shoreline carvings slaps your hand.",
    closeLoss:
      "Two symbols sit right. The third sulks. The door is a pedant.",
    jackpot:
      "In the dust at the threshold: a practice-scratch of the true order, left by someone braver and earlier.",
  },
  "shrine-brace": {
    success:
      "You hold the arch while dust rains. History does not collapse today. Your arms send a bill.",
    fail: "A cough of stone. You step back. The arch remains, barely, and so do you.",
    closeWin:
      "A crack talks. You answer with your whole back. The shrine agrees to postpone ruin.",
    closeLoss:
      "Almost held. A flake of ceiling votes no. You both live. The almost is loud.",
    jackpot:
      "A chip of the arch, still humming, like a tuning fork for weather.",
  },
  "shrine-open": {
    success:
      "The Rainward Gate yields. Behind it, a basin of still water mirrors a sky that begins, shyly, to gather.",
    fail: "The door remains a door. You remain on the dry side of a miracle.",
    closeWin:
      "It sticks on the last symbol. You breathe. The stone remembers rain the way you remember thirst.",
    closeLoss:
      "A hair from open. The basin, if it exists, keeps its silence. Almost is a cruel weather.",
    jackpot:
      "On the far sill: the Ring of Returning Rain, warm, as if it had been waiting with a pulse.",
  },
};

export const DROUGHT_OMENS = [
  "A crow lands on a well-rim and will not drink. It watches you instead.",
  "Dry lightning walks the horizon without thunder. The grass flinches anyway.",
  "A dust devil spells nothing, then collapses like a failed prayer.",
  "Every bird goes quiet at once. The quiet has a direction: inland.",
  "Your shadow looks wet. The ground does not. You keep walking.",
];

export const ARRIVAL_LINES: Record<string, string> = {
  "merrick-orchard": "You have made it safely to Merrick's Orchard. The trees lean in to see who still bothers.",
  "tarowen-square": "You have made it safely to Tarowen Square. The well greets you with a hollow knock.",
  "ashen-grass": "You have made it safely to the Ashen Grasslands. Wind tries to steal your name and fails.",
  "stone-mill": "You have made it safely to Stonewheel Mill. The stopped wheel is a kind of handshake.",
  "northern-shore": "You have made it safely to the Northern Shore. Gulls file your arrival under 'possible food.'",
  "clara-canyon": "You have made it safely to Clara's Canyon. The wind finishes your first sentence for you.",
  "blackened-tables": "You have made it safely to the Blackened Tablelands. Heat stands up to meet you.",
  "sealed-shrine": "You have made it safely to the Sealed Shrine. The air tastes like a storm that has not been invited in.",
};

export function rotatingBeat(
  lines: string[] | undefined,
  startedAt: number,
  now: number,
  intervalMs = 4000,
) {
  if (!lines?.length) return "The land waits with you.";
  const i = Math.floor(Math.max(0, now - startedAt) / intervalMs) % lines.length;
  return lines[i];
}

export function npcQuote(
  locationId: string,
  tone: "success" | "fail" | "close-win" | "close-loss" | "jackpot",
) {
  const npc = LOCATION_NPCS[locationId];
  if (!npc) return { name: "A passerby", quote: "Well." };
  const lines: Record<typeof tone, string> = {
    success: `${npc.name} (${npc.title}): "That'll do. Don't get proud. Proud dries faster than shirts."`,
    fail: `${npc.name} (${npc.title}): "I've seen worse. I've also seen rain. Come back when your hands remember."`,
    "close-win": `${npc.name} (${npc.title}): "Ugly, but it counted. That's how this country stays on the map."`,
    "close-loss": `${npc.name} (${npc.title}): "A hair from right. The drought loves hairs."`,
    jackpot: `${npc.name} (${npc.title}): "Would you look at that. Even thirsty land keeps a surprise in a pocket."`,
  };
  return { name: npc.name, quote: lines[tone] };
}

export function mapWeather(
  flags: string[],
  locationId: string,
  omenAt: number | null,
  now: number,
) {
  if (flags.includes("chapter_complete")) return "rain";
  if (omenAt && now - omenAt < 1000 * 60 * 12) return "omen";
  if (locationId === "northern-shore") return "salt";
  if (locationId === "blackened-tables") return "ash";
  if (locationId === "clara-canyon") return "wind";
  if (locationId === "stone-mill") return "stone";
  if (flags.includes("mill_unlocked")) return "dust";
  return "drought";
}
