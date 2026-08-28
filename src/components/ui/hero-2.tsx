"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ArrowRight, ArrowDown, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const ACCENT = "oklch(0.82 0.12 85)";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Hero2Props {
  brand?: React.ReactNode;
  navLinks?: NavLink[];
  headline?: React.ReactNode;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  socialLinks?: SocialLink[];
  signInLabel?: string;
  signInHref?: string;
  className?: string;
}

const DEFAULT_NAV: NavLink[] = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/lore" },
  { label: "Play", href: "/play" },
];

function NavAnchor({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function Hero2({
  brand = "Watermelon",
  navLinks = DEFAULT_NAV,
  headline = (
    <>
      Walk the drought country,
      <br />
      <span className="font-serif italic text-amber-200/95">earn the rain back.</span>
    </>
  ),
  description = "An original browser idle chronicle — map, journal, taverns, and the road to the Rainward Gate.",
  primaryCtaLabel = "Enter the game",
  primaryCtaHref = "/play",
  secondaryCtaLabel = "Read the journal",
  secondaryCtaHref = "/lore",
  socialLinks = [],
  signInLabel = "Play",
  signInHref = "/play",
  className,
}: Hero2Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(
    navLinks.find((link) => link.active)?.label || navLinks[0]?.label || null,
  );

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  return (
    <section
      className={cn(
        "relative flex w-full min-h-[88vh] flex-col justify-between overflow-hidden bg-background text-foreground selection:bg-amber-200/25 selection:text-amber-50",
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://assets.watermelon.sh/hero-2.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,oklch(0.35_0.06_85/_0.35),transparent_55%),linear-gradient(180deg,oklch(0.12_0.02_70/_0.2),oklch(0.14_0.02_70/_0.92))]"
          aria-hidden
        />
      </div>

      <div className="relative z-50 mx-auto w-full max-w-6xl">
        <header className="flex items-center justify-between px-6 py-6 md:px-8 md:py-8">
          <NavAnchor href="/" className="group flex items-center gap-1">
            {typeof brand === "string" ? (
              <span className="relative text-xl font-bold tracking-tight text-amber-100/95 select-none">
                {brand}
                <span
                  className="absolute -right-1.5 top-1 h-1 w-1 rounded-full bg-amber-300/90"
                  style={{ background: ACCENT }}
                />
              </span>
            ) : (
              brand
            )}
          </NavAnchor>

          <nav className="hidden md:block">
            <ul
              className="flex items-center gap-8 lg:gap-12"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className="group relative flex flex-col items-center py-2"
                  onMouseEnter={() => setHoveredLink(link.label)}
                >
                  <NavAnchor
                    href={link.href}
                    onClick={() => setActiveLink(link.label)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium transition-colors",
                      hoveredLink === link.label ||
                        (!hoveredLink && activeLink === link.label)
                        ? "text-amber-100 font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50 stroke-[2.5] transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </NavAnchor>
                  {(hoveredLink === link.label ||
                    (!hoveredLink && activeLink === link.label)) && (
                    <motion.span
                      layoutId="orwenActiveDot"
                      className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-amber-300"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Link
              href={signInHref}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-full border-0 bg-card/60 px-7 text-sm font-medium text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-md hover:bg-card/80",
              )}
            >
              {signInLabel}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="z-50 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={cn(
                  "h-0.5 bg-amber-100 transition-transform",
                  isMobileMenuOpen ? "translate-y-2 rotate-45" : "",
                )}
              />
              <span
                className={cn(
                  "h-0.5 bg-amber-100 transition-opacity",
                  isMobileMenuOpen ? "opacity-0" : "",
                )}
              />
              <span
                className={cn(
                  "h-0.5 bg-amber-100 transition-transform",
                  isMobileMenuOpen ? "-translate-y-2 -rotate-45" : "",
                )}
              />
            </div>
          </button>
        </header>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-40 flex h-screen flex-col bg-background/98 px-6 pb-6 pt-24 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavAnchor
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 text-2xl font-semibold",
                    activeLink === link.label
                      ? "text-amber-100"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </NavAnchor>
              ))}
            </nav>
            <div className="mt-auto">
              <Link
                href={signInHref}
                className={cn(
                  buttonVariants(),
                  "h-12 w-full rounded-full bg-primary text-base text-primary-foreground",
                )}
              >
                {signInLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-12 md:px-8 md:py-16"
      >
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl font-medium leading-[1.08] tracking-tight text-stone-50 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-2xl text-base leading-relaxed text-stone-300 md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href={primaryCtaHref}
              className={cn(
                buttonVariants(),
                "group h-12 rounded-full border-0 bg-primary px-8 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.25)] hover:brightness-110 md:text-base",
              )}
            >
              {primaryCtaLabel}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={secondaryCtaHref}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-12 rounded-full border-0 bg-card/70 px-8 text-sm font-medium text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm hover:bg-card/90 md:text-base",
              )}
            >
              {secondaryCtaLabel}
              <BookOpen className="ml-2 h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {socialLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-8 md:pb-10"
        >
          <div className="flex w-full items-center justify-center gap-8 md:w-auto md:justify-start lg:gap-12">
            {socialLinks.map((social) => (
              <NavAnchor
                key={social.label}
                href={social.href}
                className="text-sm text-muted-foreground transition-colors hover:text-amber-100 md:text-base"
              >
                {social.label}
              </NavAnchor>
            ))}
          </div>

          <div className="group flex w-full cursor-pointer items-center justify-end gap-2 text-sm text-muted-foreground md:w-auto md:text-base">
            <span>Scroll to discover</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ArrowDown
                className="h-4 w-4 transition-transform group-hover:translate-y-1"
                strokeWidth={1.5}
              />
            </motion.span>
          </div>
        </motion.div>
      )}
    </section>
  );
}
