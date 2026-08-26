export const SITE = {
  name: "The Land of Orwen",
  domain: "rough.co.nz",
  url: "https://rough.co.nz",
  tagline: "A relaxing idle RPG of drought, rumor, and returning rain.",
  contactEmail: "admin@wynyardcollective.co.nz",
  operator: "Wynyard Collective",
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/lore", label: "Lore" },
  { href: "/play", label: "Play" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
