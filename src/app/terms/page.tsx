import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description: `Terms of service for ${SITE.name} at ${SITE.domain}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SiteShell currentPath="/terms">
      <article className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <h1 className="text-3xl font-semibold text-amber-100">Terms of Service</h1>
        <p>Last updated: 26 August 2026</p>
        <p>
          By using {SITE.domain} or playing {SITE.name}, you agree to these
          Terms. If you do not agree, do not use the service.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">The service</h2>
        <p>
          {SITE.name} is a free browser game and related informational pages
          provided by {SITE.operator}. Features may change, pause, or end
          without notice. The game is provided &quot;as is&quot; without
          warranties of uninterrupted availability or error-free play.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Accounts</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>You must provide a valid email and keep your password secure.</li>
          <li>You are responsible for activity under your account.</li>
          <li>
            Do not attempt to break, scrape abusively, or disrupt the service,
            other players, or our infrastructure.
          </li>
          <li>
            We may suspend or delete accounts that violate these Terms or harm
            the service.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-100">Acceptable use</h2>
        <p>
          Use the site for lawful personal entertainment and reading. Do not
          use automated systems to create fake accounts, inflate traffic, or
          click advertisements. Cheating tools that abuse shared systems or
          other players are not allowed.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Intellectual property</h2>
        <p>
          Game text, systems, branding, and original world material on this site
          are owned by {SITE.operator} or used with permission. You may not copy
          or redistribute substantial portions without permission, except as
          allowed by fair dealing / fair use or other applicable law.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Advertising</h2>
        <p>
          Third-party ads (including Google AdSense) may appear on the site.
          Those partners have their own terms and privacy practices.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.operator} is not liable
          for indirect, incidental, or consequential damages arising from use of
          the service, including loss of save data. Our total liability for any
          claim relating to the service is limited to NZD $0 for free access, or
          the amount you paid us (if any) in the prior twelve months.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Privacy</h2>
        <p>
          Personal data is handled as described in our{" "}
          <Link href="/privacy" className="text-amber-200 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Contact</h2>
        <p>
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
        </p>
      </article>
    </SiteShell>
  );
}
