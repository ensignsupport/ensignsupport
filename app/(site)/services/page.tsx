import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { CircleArrow } from "@/components/CircleArrow";
import { PageHero } from "@/components/PageHero";
import { ReferralBand } from "@/components/ReferralBand";
import recoveryCoaching from "@/assets/images/service-recovery-coaching.jpg";
import supportCoordination from "@/assets/images/service-support-coordination.jpg";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "NDIS support coordination and psychosocial recovery coaching for self-managed and plan-managed participants in South East Queensland.",
  alternates: { canonical: "/services" },
};

type Service = {
  number: string;
  title: string;
  /** Word for word from the developer brief. */
  copy: string;
  image: StaticImageData;
  alt: string;
  position: string;
};

const SERVICES: Service[] = [
  {
    number: "01",
    title: "Support Coordination",
    copy: "We help participants and families understand their NDIS plan, connect with the right supports, and keep services working together. We work alongside plan managers, health professionals, and other providers so the plan is used in a practical, coordinated way.",
    image: supportCoordination,
    alt: "A coordinator on a video call with a participant and an allied health professional, working through the support plan",
    position: "center 40%",
  },
  {
    number: "02",
    title: "Psychosocial Recovery Coaching",
    copy: "We support participants living with psychosocial disability to build skills, routines, and community connections that matter to them. Coaching is practical and participant-led. It is not clinical treatment.",
    image: recoveryCoaching,
    alt: "A participant writing his goals in a notebook while his recovery coach listens",
    position: "60% 30%",
  },
];

const ALONGSIDE = ["Participants and families", "Plan managers", "Allied health professionals", "Other providers"];

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

      <section className={styles.cardsSection} aria-label="Our two services">
        <div className={styles.cards}>
          {SERVICES.map((service) => (
            <article key={service.number} className={styles.card} aria-labelledby={`service-${service.number}`}>
              <div className={styles.photo}>
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 1020px) 100vw, (min-width: 1441px) min(43vw, 780px), 610px"
                  className={styles.img}
                  style={{ objectPosition: service.position }}
                />
              </div>
              <div className={styles.body}>
                <span className={styles.number} aria-hidden="true">
                  {service.number}
                </span>
                <h2 id={`service-${service.number}`} className={styles.title}>
                  {service.title}
                </h2>
                <p className={styles.copy}>{service.copy}</p>
                <div className={styles.linkWrap}>
                  <Link href="/referral" className={styles.link}>
                    Make a referral
                    <span className="visually-hidden"> for {service.title.toLowerCase()}</span>
                    <CircleArrow size={40} iconSize={18} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.alongsideSection} aria-labelledby="alongside">
        <div className={styles.alongside}>
          <div className={styles.alongsideText}>
            <h2 id="alongside" className={styles.alongsideTitle}>
              We Work Alongside
            </h2>
            <p className={styles.alongsideCopy}>So your plan is used in a practical, coordinated way.</p>
          </div>
          <ul className={styles.chips}>
            {ALONGSIDE.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ReferralBand />
    </>
  );
}
