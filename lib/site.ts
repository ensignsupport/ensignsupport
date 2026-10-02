/**
 * Every client fact the public site shows lives here.
 *
 * Rule: never invent a fact. Anything Andrew has not supplied stays a visible
 * placeholder in square brackets, for example [PHONE]. The launch check
 * (npm run check:launch) fails while any placeholder remains.
 */

export const PLACEHOLDER = /^\[[A-Z0-9 ,.:'-]+\]$/;

export const site = {
  name: "Ensign Support Services",
  shortName: "Ensign",
  tagline: "NDIS support coordination and psychosocial recovery coaching.",
  abn: "19 518 036 825",
  phone: "[PHONE]",
  email: "[EMAIL]",
  hours: "[HOURS]",
  serviceArea: "South East Queensland",
  social: {
    instagram: "[INSTAGRAM URL]",
    facebook: "[FACEBOOK URL]",
  },
  partnerUrl: "https://archwayautomation.com.au",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/referral", label: "Referral" },
] as const;

export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}

/** Every placeholder still on the site, for the launch check. */
export function openPlaceholders(): string[] {
  const values = [
    site.phone,
    site.email,
    site.hours,
    site.social.instagram,
    site.social.facebook,
  ];
  return values.filter(isPlaceholder);
}
