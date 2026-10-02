import type { Metadata } from "next";
import { ReferralForm } from "@/components/forms/ReferralForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Make a Referral",
  description:
    "Participants, families and professionals can refer to Ensign Support Services. We work with self-managed and plan-managed NDIS participants.",
  alternates: { canonical: "/referral" },
};

export default function ReferralPage() {
  return (
    <>
      <PageHero
        kicker="Referral"
        title={
          <>
            Make a
            <br />
            <PageHero.Accent>Referral</PageHero.Accent>
          </>
        }
        intro="Participants, families and professionals can refer to Ensign Support Services. We work with self-managed and plan-managed NDIS participants."
      />
      <ReferralForm />
      <div style={{ height: 40 }} aria-hidden="true" />
    </>
  );
}
