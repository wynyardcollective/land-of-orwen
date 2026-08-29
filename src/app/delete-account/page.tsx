import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-chrome";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Delete account — ${SITE.name}`,
  description: `How to request deletion of your ${SITE.name} account and cloud save data.`,
  alternates: { canonical: "/delete-account" },
};

export default function DeleteAccountPage() {
  return (
    <SiteShell currentPath="/delete-account">
      <article className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <h1 className="text-3xl font-semibold text-amber-100">Delete your account</h1>
        <p>Last updated: 29 August 2026</p>
        <p>
          You can request deletion of your {SITE.name} account and associated
          cloud save data at any time. This applies to play on {SITE.domain} and
          in the official Android app ({SITE.name} on Google Play).
        </p>

        <h2 className="text-xl font-semibold text-amber-100">How to request deletion</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Email{" "}
            <a
              className="text-amber-200 hover:underline"
              href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent(
                `${SITE.name} account deletion request`,
              )}`}
            >
              {SITE.contactEmail}
            </a>
            from the email address linked to your account.
          </li>
          <li>
            Include your account email and, if helpful, your hero name so we can
            verify ownership.
          </li>
          <li>
            We will confirm when your account and save data have been deleted,
            usually within 30 days.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-amber-100">What we delete</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your account (email and password hash)</li>
          <li>Cloud save data tied to your account (progress, inventory, settings)</li>
          <li>Hero name and other profile fields stored for your account</li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-100">What may remain</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Short-lived security and hosting logs (for example IP address and
            timestamps) retained by our provider for fraud prevention and
            operations
          </li>
          <li>
            Data collected by Google for advertising (AdSense on the website,
            AdMob in the Android app), subject to Google&apos;s policies and
            your device settings
          </li>
          <li>
            Guest progress stored only in your browser&apos;s local storage —
            clear site data in your browser or uninstall the app to remove it
            locally
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-100">More information</h2>
        <p>
          See our{" "}
          <Link href="/privacy" className="text-amber-200 hover:underline">
            Privacy Policy
          </Link>{" "}
          for how we handle personal data, or email{" "}
          <a
            className="text-amber-200 hover:underline"
            href={`mailto:${SITE.contactEmail}`}
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
      </article>
    </SiteShell>
  );
}
