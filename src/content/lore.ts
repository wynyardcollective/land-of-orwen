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
      "The orchard workers still haul baskets because hunger does not pause for mystery. Merrick pays in coin and dried fruit and the kind of silence that means he is ashamed the sky failed before his trees did.",
      "Tarowen Square takes the fruit and returns gossip: traders smashing gauges, a mill country that counts water disappearing between stations, whispers about a cult that wants drought to stay. Merrick copies what he hears into the same ledger as the rain.",
      "People leaving for Tarowen do not just carry apples. They carry his question: if the rain stopped, who told it to? And whether anyone walking east will come back with an answer the ledger can believe.",
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
      "Windmere's drying shed and Bracken Stein at the southern ford run the same economy on smaller scales: cider that tastes like patience, crossing fees written in mud, couriers who still sign relay tallies as if the north road matters.",
      "A lead costs gold before you know if it is worth anything. Sometimes the room goes quiet and you pay for silence. That is still the best deal in Orwen most nights, because the alternative is walking blind while the wells go empty.",
      "The best rumors do not sound dramatic. They sound like a drover forgetting a name, or a clerk leaving a page uncopied. You learn to listen for what people almost say.",
    ],
  },
  {
    slug: "stances-and-wounds",
    title: "Stances, Wounds, and the Cost of Standing",
    date: "2026-08-18",
    summary:
      "Fights on the shore and in the tablelands are slow, messy, and they follow you after they end.",
    body: [
      "Enemies on the coast and in the canyon do not wait for you to be ready. You pick a stance — Strike, Skirmish, or Hex — and hope it matches what that thing is weak to. Old soldiers say wars were faster. In Orwen, every round is a negotiation with tired arms.",
      "Damage is lower than the ballads suggest. Armor helps. Dexterity keeps your aim steady. When you miss, the log shows zero and you still lose a beat in the round — time you cannot buy back with gold.",
      "Health does not snap back when the fight ends. Bandages and tavern beds fix some of it. If you lose badly you stay wounded until you pay for care — or eat the last dried apple in your pack and hope the next quest clears the shame.",
      "Watchtower guards on the tablelands mark your signal fires. Beachcombers on the shore bet on whether you return. The land keeps score even when no one is cheering.",
      "Combat is not the center of Orwen. It is a toll gate on the road to places that will not open for talk alone — wreck lines, ash vents, shrine stone that remembers weight.",
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
      "Pel at the Salt Gull swears the ring that fits the gate was traded twice before anyone knew what it was. Iri at the Ash Canteen says drought must be named aloud before the stone listens. Merrick's orchard notes mention the same three symbols beside rainfall tallies from wetter years.",
      "One door will not end the drought. But people who solve the shrine and carry the ring say the land responds — a little — for the first time in months. Clouds gather without breaking. Moss returns to a single stone. It is not mercy yet. It is proof the sky can still be addressed.",
      "Whether that proof becomes rain depends on who keeps walking after the door opens.",
    ],
  },
  {
    slug: "north-road",
    title: "Ledger House and the North Road",
    date: "2026-08-26",
    summary:
      "Mill clerks, relay barns, and western lookouts all count the same missing water — and none of their books agree.",
    body: [
      "Stonewheel Mill turned gears by hand when the river left. Ledger House uphill is where the numbers go to be copied until they make sense. Chief Clerk Maren runs the office like a court: ink, argument, and the assumption that someone is lying about buckets.",
      "Odo's Relay is the barn where couriers still sleep on the floor. Chalk tallies list who passed before the channel dried. Sten the porter sweeps the same dust line twice because dust is the only thing that keeps arriving.",
      "Harrow Ridge looks west from bluffs where lookout Tams sketches cloud lines that never darken. Those charts disagree with Merrick's orchard tallies in ways that matter — wet days inland when the orchard saw dust, dry days on the ridge when moss still grew.",
      "The Broken Aqueduct secret is what connects the stories: boards wedged in a channel above the mill, saw marks fresh, arrows pointing upstream. Someone diverted flow on purpose. Ledger House and the relay are where that crime gets names attached.",
      "Walking the north road is not a detour from the drought. It is how you learn the drought was built, not merely suffered.",
    ],
  },
  {
    slug: "south-ford",
    title: "South of the Grass",
    date: "2026-08-27",
    summary:
      "Bracken Ford still charges crossing fees for a creek that died — and half the grain in Orwen crosses at night.",
    body: [
      "Bracken Ford is a gravel scar south of the Ashen Grasslands. Shepherd Joss sends walkers down the dry creek bed when wagon ruts still show where water ran. The ford should be empty. Carts still queue.",
      "Ford-warden Hek keeps fees on a board written in mud and temper. Bracken Stein serves what passes for ale and sharper gossip: which carts run north without paying, which names match Merrick's missing gauge payments, where a tarp boat still ties to willow roots under the crossing.",
      "Windmere Hamlet sits between orchard and ford — a crossroads where Vale at the drying shed hears couriers before the square does. Water rights are traded by handshake there because law moved slower than thirst.",
      "The Ferryman's Hide is what Hek will not put on the fee board: ledgers from when the creek ran, crossings logged by moon phase, proof that southern trade never stopped — only went quiet.",
      "South of the grass is where Orwen's hunger shows without poetry. No shrine symbols. Just carts, fees, and the question of who still profits when the sky refuses.",
    ],
  },
];

export function getLoreArticle(slug: string) {
  return LORE_ARTICLES.find((a) => a.slug === slug);
}
