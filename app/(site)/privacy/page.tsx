import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Ensign Support Services handles personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Privacy"
        title={
          <>
            Privacy
            <br />
            <PageHero.Accent>Policy</PageHero.Accent>
          </>
        }
        intro="[PRIVACY POLICY: legal text to be supplied before launch.]"
      />
      <div style={{ height: "calc(40 * var(--px-space))" }} aria-hidden="true" />
    </>
  );
}
