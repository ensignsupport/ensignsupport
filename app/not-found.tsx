import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PillLink } from "@/components/PillButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Page not found. The design has no 404, so it is built from the site's own
 * header, page headline and footer. Dark button, because the accent is kept
 * for Make a Referral.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found on the Ensign Support Services website.",
};

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <PageHero
          kicker="Page not found"
          title={
            <>
              This page
              <br />
              <PageHero.Accent>is not here</PageHero.Accent>
            </>
          }
          intro="The link may be old or typed slightly wrong. The Home page has everything on the site."
        />
        <div style={{ padding: "calc(24 * var(--px-gap)) var(--gutter) calc(110 * var(--px-space))" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <PillLink href="/" tone="dark" size="hero">
              Go to Home
            </PillLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
