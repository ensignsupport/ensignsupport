import type { Metadata } from "next";
import { BuildNote } from "@/components/BuildNote";
import { PageHero } from "@/components/PageHero";
import { ReferralBand } from "@/components/ReferralBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "NDIS support coordination and psychosocial recovery coaching for self-managed and plan-managed participants in South East Queensland.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Our Services"
        title={
          <>
            Support That
            <br />
            <PageHero.Accent>Works</PageHero.Accent> Together
          </>
        }
        intro="Ensign Support Services works with self-managed and plan-managed NDIS participants."
      />
      <BuildNote>The two service cards and the We Work Alongside strip arrive in milestone 3.</BuildNote>
      <ReferralBand />
    </>
  );
}
