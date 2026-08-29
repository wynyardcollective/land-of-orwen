export interface OpeningSection {
  heading: string;
  paragraphs: string[];
}

/** Shown once when a new journey begins (or after "New journey" in Settings). */
export const OPENING_TITLE = "Before you leave the orchard";

export const OPENING_SECTIONS: OpeningSection[] = [
  {
    heading: "Starting from scratch",
    paragraphs: [
      "You stand at Merrick's Orchard with forty gold, a field bandage, and a dried apple. No armor. No reputation. No map beyond what you already know from hauling fruit for the old man.",
      "That is how most roads in rough begin — someone with empty pockets and a problem too large for the people who stayed home.",
    ],
  },
  {
    heading: "Something broke the rain",
    paragraphs: [
      "This drought did not creep in like the old dry years. Wells emptied in days. Merrick's ledgers show wet days when the ground was dust and dry days when moss was still green. Traders smash rain gauges upstream. Mill numbers say water vanishes between stations.",
      "Whole villages are living on rumor and ration lines. Somewhere past Tarowen, past the mill country and the northern shore, people talk about a sealed shrine and a gate called Rainward — as if the last real storm were locked behind stone instead of lost in the sky.",
    ],
  },
  {
    heading: "You are in the middle of it",
    paragraphs: [
      "Merrick did not send a company. He sent you. Not because you are the strongest walker in rough — because the land is running out of time and someone has to start walking.",
      "The journal already has his notes. The map shows Merrick's Orchard, Tarowen Square, and the Ashen Grass — with hamlets, fords, and waystations waiting beyond the first roads.",
      "When you are ready, tap the orchard on the map, choose a quest, and let the wait run. This is an idle road. The drought did not pause for anyone — but your journey starts now.",
    ],
  },
];

export const OPENING_MERRICK_QUOTE =
  "Don't come back with guesses. Come back with something the sky can answer to.";
