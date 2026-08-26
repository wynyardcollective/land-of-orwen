import Link from "next/link";
import { PUBLIC_NAV, SITE } from "@/content/site";

export function SiteHeader({ currentPath }: { currentPath?: string }) {
  return (
    <header className="border-b border-border/70 bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-wide text-amber-200/95">
            {SITE.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{SITE.domain}</p>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap gap-1">
          {PUBLIC_NAV.map((item) => {
            const active = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-card/60">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-amber-100/90">{SITE.name}</p>
          <p className="mt-1 max-w-sm">{SITE.tagline}</p>
          <p className="mt-2">
            Contact:{" "}
            <a
              className="text-amber-200/90 underline-offset-2 hover:underline"
              href={`mailto:${SITE.contactEmail}`}
            >
              {SITE.contactEmail}
            </a>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {PUBLIC_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border/40 py-3 text-center text-xs text-muted-foreground">
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
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader currentPath={currentPath} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
