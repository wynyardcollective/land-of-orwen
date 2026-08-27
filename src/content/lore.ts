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
      "Merrick's orchard went dry all at once — and his rainfall ledgers no longer match what anyone sees outside.",
    body: [
      "Merrick has kept rainfall tallies for sixty years. In a normal dry year the ditches crack first and the apples shrink later. This summer both happened the same week, like the water was cut off somewhere upstream.",
      "The numbers in his ledger are worse than wrong. He has days marked wet when the ground was dust. Days marked dry when moss was still green on the north wall. He keeps writing anyway because stopping would mean admitting he has no idea what is happening.",
      "People leaving for Tarowen Square do not just carry fruit. They carry Merrick's question: if the rain stopped, who told it to?",
    ],
  },
  {
    slug: "tavern-leads",
    title: "What Taverns Sell When Ale Runs Thin",
    date: "2026-08-10",
    summary:
      "When the casks run low, tavern keepers trade rumors — hatch routes, cove marks, and names worth gold.",
    body: [
      "The Dry Kettle in Tarowen still pours something that counts as ale. Senna makes more from what she hears: hatch locations under the square, mill roads that skip orchard errands, and the names of men who smash rain gauges for coin.",
      "Inland, the Wheelhouse Tap keeps debt and sightings on one chalk board. The Salt Gull trades brine tea for cove coordinates. Ash Canteen logs heat vents that sink instead of rise — nobody agrees why.",
      "A lead costs gold before you know if it is worth anything. Sometimes the room goes quiet and you pay for silence. That is still the best deal in Orwen most nights.",
    ],
  },
  {
    slug: "stances-and-wounds",
    title: "Stances, Wounds, and the Cost of Standing",
    date: "2026-08-18",
    summary:
      "Fights on the shore and in the tablelands are slow, messy, and they follow you after they end.",
    body: [
      "Enemies on the coast and in the canyon do not wait for you to be ready. You pick a stance — Strike, Skirmish, or Hex — and hope it matches what that thing is weak to.",
      "Damage is lower than the old war stories suggest. Armor helps. Dexterity keeps your aim steady. When you miss, the log shows zero and you still lose a beat in the round.",
      "Health does not snap back when the fight ends. Bandages and tavern beds fix some of it. If you lose badly you stay wounded until you pay for care — or eat the last dried apple in your pack.",
    ],
  },
  {
    slug: "rainward-gate",
    title: "The Rainward Gate",
    date: "2026-08-24",
    summary:
      "A sealed shrine door with three carved symbols — and a ring traders say still remembers the last storm.",
    body: [
      "The Sealed Shrine sits where road rumor finally turns into stone. The door does not open for force. Scholars fight over the symbol order. Beachcombers say the carvings were changed after the drought started.",
      "Craft tables along the road run the same puzzle in smaller form: line up cloud, moon, and star until something clicks. Wrong guesses cost you time. A correct one opens the basin beyond, where the air feels like rain might actually come back.",
      "One door will not end the drought. But people who solve the shrine and carry the ring say the land responds — a little — for the first time in months.",
    ],
  },
];

export function getLoreArticle(slug: string) {
  return LORE_ARTICLES.find((a) => a.slug === slug);
}
