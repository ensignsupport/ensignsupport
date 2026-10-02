import type { Metadata } from "next";
import { BuildNote } from "@/components/BuildNote";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ensign Support Services. We currently provide services across South East Queensland, with the potential to deliver services across Australia in the future.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title={
          <>
            Get in
            <br />
            <PageHero.Accent>Touch</PageHero.Accent>
          </>
        }
        intro="We currently provide services across South East Queensland, with the potential to deliver services across Australia in the future."
      />
      <BuildNote>The contact cards arrive in milestone 3. The enquiry form arrives in milestone 4.</BuildNote>
      <div style={{ height: 40 }} aria-hidden="true" />
    </>
  );
}
