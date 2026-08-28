import Link from "next/link";
import { PUBLIC_NAV, SITE } from "@/content/site";

export function SiteHeader({ currentPath }: { currentPath?: string }) {
  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="min-w-0 group">
          <p className="truncate font-heading text-base font-semibold tracking-tight text-amber-100/95 transition group-hover:text-amber-50">
            {SITE.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{SITE.subtitle}</p>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-1">
          {PUBLIC_NAV.map((item) => {
            if (item.href === "/play") return null;
            const active = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                  active
                    ? "bg-muted/80 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/play"
            className="ml-1 inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Play
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-2">
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
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {PUBLIC_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-foreground hover:underline">
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
