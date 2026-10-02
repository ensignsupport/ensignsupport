import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted fonts. Nothing is loaded from Google at runtime.
const geist = localFont({
  src: "./fonts/Geist-Variable-latin.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const caveat = localFont({
  src: "./fonts/Caveat-500-latin.woff2",
  variable: "--font-caveat",
  weight: "500",
  display: "swap",
  preload: false, // used once, on the Home hero only
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · NDIS support coordination and psychosocial recovery coaching`,
    template: `%s · ${site.name}`,
  },
  description:
    "Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching for self-managed and plan-managed participants in South East Queensland.",
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBFBFD",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${geist.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
