import type { Metadata } from "next";
import Image from "next/image";
import { BandFlag } from "@/components/BandFlag";
import { Eyebrow } from "@/components/Eyebrow";
import { CheckIcon, FlagOutline, HeartIcon, ShieldCheckIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { ReferralBand } from "@/components/ReferralBand";
import { SectionHeader } from "@/components/SectionHeader";
import journey from "@/assets/images/about-journey.jpg";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching, with more than seven years' experience in mental health and disability services.",
  alternates: { canonical: "/about" },
};

const EXPERIENCE = [
  "Disability and the NDIS, including psychosocial disability",
  "Psychosocial recovery coaching",
  "Seven or more years in mental health and disability services",
];

// Vision, Mission and Values are word for word from the developer brief,
// with the name changed to Ensign Support Services (Allen, approved).
const VISION =
  "Ensign Support Services helps people navigate their disability journey, building independence and meeting their disability-related needs.";
const MISSION =
  "Ensign Support Services helps NDIS participants understand their plan, connect with the right service providers, manage their supports, and build their capacity to work towards greater independence.";

const VALUES = [
  { icon: HeartIcon, name: "Compassion", copy: "Genuine care for participants and families, not just service delivery." },
  {
    icon: ShieldCheckIcon,
    name: "Integrity",
    copy: "Honest hours, honest invoicing to plan managers, honest reporting to the NDIA.",
  },
  {
    icon: FlagOutline,
    name: "Advocacy",
    copy: "Actively representing participants' interests within the NDIS system, especially those it tends to overlook.",
  },
];

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

      <section className={styles.photoSection}>
        <div className={`${styles.container} ${styles.photo}`}>
          <Image
            src={journey}
            alt="A man using a wheelchair and his coordinator moving together along a Brisbane riverside path towards the city"
            fill
            priority
            // On narrow screens the box is taller than the photo's shape, so the photo is requested wider.
            sizes="(max-width: 900px) 760px, (max-width: 1344px) 100vw, 1280px"
            className={styles.img}
            style={{ objectPosition: "40% 62%" }}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="who-we-are">
        <div className={`${styles.container} ${styles.whoGrid}`}>
          <div className={styles.whoLead}>
            <Eyebrow>Who We Are</Eyebrow>
            <h2 id="who-we-are" className={styles.h2}>
              Practical Knowledge
              <br />
              of the NDIS
            </h2>
          </div>
          <div className={styles.whoBody}>
            <p className={styles.whoCopy}>
              Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching. We work
              with people with disability, including psychosocial disability, and with the families and professionals
              around them. The team brings more than seven years&#8217; experience in mental health and disability
              services, and practical knowledge of the NDIS.
            </p>
            <ul className={styles.points}>
              {EXPERIENCE.map((point) => (
                <li key={point} className={styles.point}>
                  <span className={styles.tick} aria-hidden="true">
                    <CheckIcon size={13} color="var(--indigo-900)" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="why-ensign">
        <div className={`${styles.container} ${styles.why} on-dark`}>
          <BandFlag className={styles.flag} />
          <div className={styles.whyInner}>
            <Eyebrow onDark>Why Ensign</Eyebrow>
            <h2 id="why-ensign" className={styles.whyTitle}>
              Why Ensign
            </h2>
            {/* Word for word from the brief. The long dash became a comma (Allen, approved). */}
            <p className={styles.whyCopy}>
              The word ensign means a flag, a mark of direction. Ensign Support Services helps NDIS participants
              navigate their disability journey. We stand with them, work with them, and support them on that journey.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="vision-mission">
        <div className={`${styles.container} ${styles.stack}`}>
          <SectionHeader eyebrow="Vision and Mission" id="vision-mission" title="Where We Are Headed" />
          <div className={styles.vmGrid}>
            <div className={styles.vmCard}>
              <h3 className={styles.vmLabel}>Vision</h3>
              <p className={styles.vmCopy}>{VISION}</p>
            </div>
            <div className={styles.vmCard}>
              <h3 className={styles.vmLabel}>Mission</h3>
              <p className={styles.vmCopy}>{MISSION}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="values">
        <div className={`${styles.container} ${styles.stack}`}>
          <SectionHeader eyebrow="Our Values" id="values" title="What We Stand For" />
          <ul className={styles.valueGrid}>
            {VALUES.map(({ icon: Icon, name, copy }) => (
              <li key={name} className={styles.value}>
                <span className={styles.valueIcon} aria-hidden="true">
                  <Icon size={24} color="var(--indigo-900)" strokeWidth={1.6} />
                </span>
                <div className={styles.valueText}>
                  <h3 className={styles.valueName}>{name}</h3>
                  <p className={styles.valueCopy}>{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ReferralBand />
    </>
  );
}
