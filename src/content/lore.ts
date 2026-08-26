export interface LoreArticle {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
}

export const LORE_ARTICLES: LoreArticle[] = [
  {
    slug: "dust-on-the-leaves",
    title: "Dust on the Leaves",
    date: "2026-08-01",
    summary:
      "How the drought of Orwen began in Merrick's Orchard — and why the ledgers refuse to make sense.",
    body: [
      "Old Merrick swears the wells did not fail the usual way. In ordinary dry years, the ditches crack first and the apples shrink later. This season they emptied together, as if someone had turned a valve far upstream.",
      "His ledgers go back sixty years. The rainfall tallies for this summer are not merely low — they are wrong. Days marked wet show dust. Days marked dry show moss that should have died weeks ago. Merrick keeps writing anyway, because naming the absurdity is the only work left that feels honest.",
      "Travelers who leave the orchard for Tarowen Square carry more than baskets. They carry a question: if the sky forgot Orwen, who asked it to?",
    ],
  },
  {
    slug: "tavern-leads",
    title: "What Taverns Sell When Ale Runs Thin",
    date: "2026-08-10",
    summary:
      "In drought country, a round of rumors can open roads that quests alone would take weeks to earn.",
    body: [
      "The Dry Kettle in Tarowen still pours something that passes for ale. Senna's real inventory is quieter: hatch locations under the square, mill routes that bypass orchard errands, and the names of people who smash rain gauges for coin.",
      "Further inland, the Wheelhouse Tap chalks debt and sightings on the same board. The Salt Gull trades brine tea for cove coordinates. Ash Canteen logs heat vents that sink instead of rise.",
      "A lead is never free. Gold leaves the purse before wisdom arrives — and sometimes the room goes quiet for nothing. That is the wager of Orwen's taverns.",
    ],
  },
  {
    slug: "stances-and-wounds",
    title: "Stances, Wounds, and the Cost of Standing",
    date: "2026-08-18",
    summary:
      "Idle combat in Orwen is paced and imperfect: hits miss, health carries between fights, and rest has a price.",
    body: [
      "Threats on the shore, canyon, and tablelands do not wait politely. A traveler who engages chooses a stance — Strike, Skirmish, or Hex — and hopes it matches what the enemy fears.",
      "Blows land softly compared to old war stories. Armor matters. Dexterity steadies the eye. A miss writes itself into the log as zero damage and another breath spent.",
      "When the fight ends, health does not reset like a dream. Field bandages and tavern rests restore what combat took. Defeat leaves the wounded at empty strength until someone pays for recovery — or eats the last dried apple in the pack.",
    ],
  },
  {
    slug: "rainward-gate",
    title: "The Rainward Gate",
    date: "2026-08-24",
    summary:
      "Three symbols on a sealed door — cloud, moon, and star — and a ring said to remember the last storm.",
    body: [
      "The Sealed Shrine sits where rumor finally hardens into stone. Its door does not open for force. Scholars argue about the order of the marks; beachcombers swear the carvings lie.",
      "Craft tables along the road hold the same puzzle in quieter form: arrange the symbols until the gate listens. Guess poorly and the shrine keeps its silence. Guess well and the basin beyond mirrors a sky that begins to gather.",
      "Orwen's drought is not ended by one door. But naming rain — and carrying a ring that remembers it — is the first mercy the land has accepted in a long season.",
    ],
  },
];

export function getLoreArticle(slug: string) {
  return LORE_ARTICLES.find((a) => a.slug === slug);
}
