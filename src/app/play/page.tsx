import { GameShell } from "@/components/game/game-shell";
import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Play — ${SITE.name}`,
  description: `Sign in and play ${SITE.name}, the idle RPG of drought and rumor.`,
  robots: { index: false, follow: true },
};

export default function PlayPage() {
  return <GameShell />;
}
