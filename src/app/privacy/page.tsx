import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-chrome";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: `Privacy policy for ${SITE.name} at ${SITE.domain}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SiteShell currentPath="/privacy">
      <article className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <h1 className="text-3xl font-semibold text-amber-100">Privacy Policy</h1>
        <p>Last updated: 29 August 2026</p>
        <p>
          This Privacy Policy explains how {SITE.operator} (&quot;we&quot;,
          &quot;us&quot;) collects and uses information when you visit{" "}
          {SITE.domain}, play {SITE.name} in a browser, or use our official
          Android app on Google Play.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Android app</h2>
        <p>
          rough Android app is a secure client for the same online
          game at {SITE.domain}. It requires an internet connection. The app
          does <strong className="text-foreground">not</strong> show
          third-party advertisements (unlike the public website, which may use
          Google AdSense). Data collection for accounts and cloud saves is the
          same as browser play. The app requests network access only — no
          location, camera, contacts, or other sensitive permissions.
        </p>
        <p>
          Package name:{" "}
          <code className="text-foreground">nz.co.wynyardcollective.rough</code>
          . Privacy questions for the app:{" "}
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Account data</strong> — email
            address, password (stored as a bcrypt hash), and optional hero name
            when you register.
          </li>
          <li>
            <strong className="text-foreground">Guest play</strong> — if you
            choose guest mode, progress is stored only in your browser
            (localStorage) until you create an account.
          </li>
          <li>
            <strong className="text-foreground">Game save data</strong> —
            progress such as location, inventory, quests, and settings, stored
            so you can continue across devices while signed in.
          </li>
          <li>
            <strong className="text-foreground">Technical data</strong> —
            standard server and security logs (for example IP address, user
            agent, and timestamps) may be processed by our hosting provider
            (Cloudflare) to operate and protect the service.
          </li>
          <li>
            <strong className="text-foreground">Local storage</strong> — the
            browser may keep a local copy of your save and preferences for
            performance.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-100">How we use information</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and authenticate your account</li>
          <li>To store and sync game progress</li>
          <li>To keep the service secure and reliable</li>
          <li>
            To understand aggregate traffic and improve the site (including via
            advertising partners described below)
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-100">Advertising</h2>
        <p>
          On the public website (not in the Android app), we use Google AdSense
          to display advertisements. Google and its partners may use cookies or
          similar technologies to serve ads based on your prior visits to this
          or other websites. You can learn more and manage ad personalization at{" "}
          <a
            className="text-amber-200 hover:underline"
            href="https://www.google.com/settings/ads"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>{" "}
          and review Google&apos;s policies at{" "}
          <a
            className="text-amber-200 hover:underline"
            href="https://policies.google.com/technologies/ads"
            rel="noopener noreferrer"
            target="_blank"
          >
            How Google uses information from sites that use our services
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Cookies</h2>
        <p>
          We use an httpOnly session cookie to keep you signed in. Advertising
          partners may set their own cookies subject to their policies. You can
          control cookies through your browser settings; disabling them may
          affect login and some site features.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">
          Account and data deletion
        </h2>
        <p>
          You may request deletion of your account and associated cloud save data
          by emailing{" "}
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
          . We will verify ownership of the account and delete personal data
          within a reasonable period, except where retention is required for
          security or legal obligations.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Data retention</h2>
        <p>
          We retain account and save data while your account remains active unless
          you request deletion. Contact{" "}
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
          . Hosting and security logs are retained according to our provider&apos;s
          practices and operational needs.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Children</h2>
        <p>
          {SITE.name} is not directed at children under 13. We do not knowingly
          collect personal information from children under 13. If you believe a
          child has provided such information, contact us and we will take
          appropriate steps.
        </p>

        <h2 className="text-xl font-semibold text-amber-100">Contact</h2>
        <p>
          Privacy questions:{" "}
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
