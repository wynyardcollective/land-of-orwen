export const SITE = {
  name: "The Land of Orwen",
  domain: "rough.co.nz",
  url: "https://rough.co.nz",
  tagline: "A drought-struck countryside idle RPG — map, journal, and returning rain.",
  subtitle: "Idle chronicle · browser RPG",
  description:
    "Original browser idle RPG: travel Orwen's drought country, read the journal, unlock taverns and hidden places, and pursue the Rainward Gate.",
  contactEmail: "admin@wynyardcollective.co.nz",
  operator: "Wynyard Collective",
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/lore", label: "Journal" },
  { href: "/play", label: "Play" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
