import Link from "next/link";
import { PUBLIC_NAV, SITE } from "@/content/site";
import { RoughSiteNav } from "@/components/site/rough-hero";

export function SiteHeader({ currentPath }: { currentPath?: string }) {
  return <RoughSiteNav currentPath={currentPath} />;
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-3">
          <p className="font-heading text-base font-semibold text-amber-100/95">
            {SITE.name}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {SITE.description}
          </p>
          <p className="text-sm text-muted-foreground">
            <a
              className="text-amber-200/90 underline-offset-2 hover:underline"
              href={`mailto:${SITE.contactEmail}`}
            >
              {SITE.contactEmail}
            </a>
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-1">
          {PUBLIC_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.operator} · {SITE.domain}
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath?: string;
}) {
  return (
    <div className="site-ambient flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader currentPath={currentPath} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
