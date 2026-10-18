import type { Metadata } from "next";
import { LegalText } from "@/components/LegalText";
import { PageHero } from "@/components/PageHero";
import { PRIVACY_POLICY } from "@/lib/legal/privacy-policy";

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
        intro="How Ensign Support Services collects, uses, shares and protects personal information, and how you can see it, correct it or make a complaint."
      />
      <LegalText source={PRIVACY_POLICY} />
    </>
  );
}
