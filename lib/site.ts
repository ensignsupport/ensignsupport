/**
 * Every client fact the public site shows lives here.
 *
 * Rule: never invent a fact. Anything Andrew has not supplied stays a visible
 * placeholder in square brackets, for example [EMAIL]. The launch check
 * (npm run check:launch) fails while any placeholder remains.
 */

export const PLACEHOLDER = /^\[[A-Z0-9 ,.:'-]+\]$/;

export const site = {
  name: "Ensign Support Services",
  shortName: "Ensign",
  tagline: "NDIS support coordination and psychosocial recovery coaching.",
  abn: "19 518 036 825",
  // No public phone number by Andrew's choice: every contact goes to the email or the contact form.
  email: "andrew@ensignsupport.com.au",
  hours: "Monday to Friday, 7am to 7pm",
  serviceArea: "South East Queensland",
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
  const values: string[] = [site.email, site.hours];
  return values.filter(isPlaceholder);
}
