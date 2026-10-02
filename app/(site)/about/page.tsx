import type { Metadata } from "next";
import { BuildNote } from "@/components/BuildNote";
import { PageHero } from "@/components/PageHero";
import { ReferralBand } from "@/components/ReferralBand";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching, with more than seven years' experience in mental health and disability services.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Us"
        title={
          <>
            Helping You
            <br />
            <PageHero.Accent>Navigate</PageHero.Accent> Your Journey
          </>
        }
        intro="Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching."
      />
      <BuildNote>The journey photo, Who We Are, Why Ensign, Vision, Mission and Values arrive in milestone 3.</BuildNote>
      <ReferralBand />
    </>
  );
}
