import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { ABOUT_SECTIONS } from "@/content/marketing";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.description} Operated by ${SITE.operator}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <article className="site-prose max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-amber-100 sm:text-4xl">
          About {SITE.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-300">
          {SITE.description}
        </p>
        {ABOUT_SECTIONS.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-amber-100">
              {section.heading}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
        <p className="mt-10">
          <Link href="/play" className="site-cta-primary inline-flex">
            Enter the game
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
