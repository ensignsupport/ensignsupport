import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BandFlag } from "@/components/BandFlag";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Eyebrow } from "@/components/Eyebrow";
import { ClockIcon, DocumentIcon, MailIcon, PinIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { PillLink } from "@/components/PillButton";
import { isPlaceholder, site } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ensign Support Services. We currently provide services across South East Queensland, with the potential to deliver services across Australia in the future.",
  alternates: { canonical: "/contact" },
};

function InfoValue({ value, href }: { value: string; href?: string }) {
  if (!href || isPlaceholder(value)) return <span className={styles.infoValue}>{value}</span>;
  return (
    <a className={styles.infoValue} href={href}>
      {value}
    </a>
  );
}

const INFO: { label: string; icon: ReactNode; value: ReactNode }[] = [
  {
    label: "Email",
    icon: <MailIcon size={22} color="var(--indigo-900)" strokeWidth={1.6} />,
    value: <InfoValue value={site.email} href={`mailto:${site.email}`} />,
  },
  {
    label: "Hours",
    icon: <ClockIcon size={22} color="var(--indigo-900)" />,
    value: <InfoValue value={site.hours} />,
  },
  {
    label: "Service area",
    icon: <PinIcon size={22} color="var(--indigo-900)" strokeWidth={1.6} />,
    value: <InfoValue value={site.serviceArea} />,
  },
  {
    label: "ABN",
    icon: <DocumentIcon size={22} color="var(--indigo-900)" />,
    value: <InfoValue value={site.abn} />,
  },
];

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

      <section className={styles.infoSection} aria-label="Contact details">
        <ul className={styles.info}>
          {INFO.map((item) => (
            <li key={item.label} className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.infoText}>
                <span className={styles.infoLabel}>{item.label}</span>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.main}>
          <EnquiryForm />

          <div className={styles.side}>
            <div className={`${styles.referCard} on-dark`}>
              <BandFlag className={styles.referFlag} width={520} height={312} />
              <div className={styles.referInner}>
                <Eyebrow onDark>Make a Referral</Eyebrow>
                <h2 className={styles.referTitle}>
                  Making a
                  <br />
                  Referral?
                </h2>
                <p className={styles.referCopy}>
                  Participants, families and professionals can use our online referral form.
                </p>
                <PillLink href="/referral" tone="light" size="band" className={styles.referButton}>
                  Make a Referral
                </PillLink>
              </div>
            </div>
            <div className={styles.area}>
              <span className={styles.areaIcon} aria-hidden="true">
                <PinIcon size={22} color="var(--indigo-900)" strokeWidth={1.6} />
              </span>
              <span className={styles.areaText}>
                <span className={styles.areaTitle}>{site.serviceArea}</span>
                <span className={styles.areaCopy}>Self-managed and plan-managed NDIS participants</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}
