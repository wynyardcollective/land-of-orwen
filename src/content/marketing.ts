/** Editorial copy for public pages — substantive, original, not feature-bullet filler. */

import { SITE } from "./site";

export const HOME_HERO = {
  eyebrow: "An original idle chronicle",
  title: "Walk rough until the sky remembers rain.",
  lead:
    "rough is a browser role-playing game set in a countryside where drought arrived all at once — wrong ledgers, dry fords, and a sealed shrine that still expects a storm. Travel named places, work timed quests, listen in taverns, and carry your progress forward.",
  primaryCta: "Enter the game",
  secondaryCta: "Read the journal",
} as const;

export const HOME_PILLARS = [
  {
    title: "A map that grows with you",
    body:
      "Start at Merrick's Orchard with three open roads. Quests and tavern rumors unlock mills, shores, hamlets, fords, relay barns, and hidden coves — fourteen towns and eight secret sites across the drought country.",
  },
  {
    title: "Fiction you can play through",
    body:
      "Journal entries track Merrick's broken rainfall tallies, mill flow theft, shore wreck trade, and the Rainward Gate. Lore articles on this site expand the same world in long-form prose — not patch notes.",
  },
  {
    title: "Paced for real time",
    body:
      "Journeys, quests, tavern rounds, and combat rounds run while you wait. Swift pace shortens timers for a first visit; Classic pace suits a slow evening. Health and gold carry between fights.",
  },
  {
    title: "Your journey, saved",
    body:
      "Play as a guest with progress kept in your browser, or create a free account later to sync across devices. No download, no storefront — just the road and what you learn on it.",
  },
] as const;

export const HOME_WORLD = {
  title: "The country in drought",
  paragraphs: [
    "rough is not a single village with a quest board. It is a lattice of places that used to share water: orchard ditches, market wells, mill channels, canyon cracks, and a eastern basin that should still pool after storms.",
    "The main story follows that lattice inland — from Merrick's ledgers to Stonewheel Mill, the northern wreck line, Clara's Canyon, the Blackened Tablelands, and the Sealed Shrine. Side roads branch south to Bracken Ford and west to Harrow Ridge, where clerks and lookouts argue about the same missing rain from different angles.",
    "Every location has named work, local voices, and ambient detail. Secret sites appear only when rumor or fieldwork earns them — whisper wells under Tarowen, a broken aqueduct above the mill wheel, a ferryman's hide where the southern creek used to run.",
  ],
} as const;

export const ABOUT_SECTIONS = [
  {
    heading: "What this is",
    body:
      "rough is an original browser idle RPG created for rough.co.nz. It is inspired by the patient pacing of classic idle adventures, but the world, map, journal, and systems are written specifically for rough's drought — not a reskin of another property.",
  },
  {
    heading: "What you do",
    body:
      "You travel a illustrated countryside map, take quests at each place, wait through real-time work, and read what happened in the journal. Taverns sell rumors that open shortcuts and hidden sites. Mid-game routes introduce paced combat with stances, persistent health, and remedies bought or found on the road.",
  },
  {
    heading: "Who runs the site",
    body: `The site and game are operated by ${SITE.operator}. Questions about accounts, privacy, or accessibility: ${SITE.contactEmail}.`,
  },
  {
    heading: "Accounts",
    body:
      "Guest play stores progress in your browser. A free email account saves the same journey to the cloud so you can return from another device. Create an account from the play screen or from Settings inside the game; guest progress can be carried over when you register.",
  },
  {
    heading: "Accessibility",
    body:
      "The interface uses Atkinson Hyperlegible, adjustable font scale, high contrast, live regions for status changes, and keyboard-friendly controls. If something blocks your play, email us — fixes are part of keeping the road open to everyone.",
  },
] as const;
