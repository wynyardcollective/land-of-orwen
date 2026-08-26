import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: `About ${SITE.name}: a free browser idle RPG hosted at ${SITE.domain}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <article className="prose-invert space-y-5">
        <h1 className="text-3xl font-semibold text-amber-100">About</h1>
        <p className="leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{SITE.name}</strong> is a free
          browser idle role-playing game set in a drought-struck countryside.
          Players travel a map, wait through timed journeys and quests, fight
          paced threats, craft gems, and uncover secret places through tavern
          rumors.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The game is inspired by the relaxed pacing of idle RPGs such as Land
          of Livia, but uses an original world, story, and systems. It runs
          entirely in the browser at{" "}
          <a className="text-amber-200 hover:underline" href={SITE.url}>
            {SITE.domain}
          </a>
          .
        </p>
        <h2 className="pt-2 text-xl font-semibold text-amber-100">Who runs this</h2>
        <p className="leading-relaxed text-muted-foreground">
          {SITE.name} is operated by {SITE.operator}. For questions about the
          site, accounts, or privacy, email{" "}
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
        <h2 className="pt-2 text-xl font-semibold text-amber-100">Accounts & saves</h2>
        <p className="leading-relaxed text-muted-foreground">
          Play requires a free email and password account. Saves are bound to
          that account and stored using Cloudflare infrastructure, with a local
          browser cache for responsiveness. You can sign out from Settings inside
          the game.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-amber-100">Accessibility</h2>
        <p className="leading-relaxed text-muted-foreground">
          The interface uses Atkinson Hyperlegible, adjustable font scale, high
          contrast, live regions for status updates, and keyboard-friendly
          controls. Feedback on accessibility is welcome at the contact address
          above.
        </p>
        <p className="pt-4">
          <Link href="/play" className="text-amber-200 hover:underline">
            Play the game →
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
