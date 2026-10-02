import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CircleArrow } from "@/components/CircleArrow";
import {
  ArrowRight,
  CallingIcon,
  ConnectIcon,
  CycleIcon,
  DocumentIcon,
  FlagOutline,
  FlagSolid,
  GrowthIcon,
  HeartIcon,
  ShieldCheckIcon,
  ShieldIcon,
} from "@/components/icons";
import { PillLink } from "@/components/PillButton";
import { ReferralBand } from "@/components/ReferralBand";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/lib/site";
import heroCoordinator from "@/assets/images/hero-coordinator.jpg";
import heroParticipant from "@/assets/images/hero-participant.jpg";
import recoveryCoaching from "@/assets/images/service-recovery-coaching.jpg";
import supportCoordination from "@/assets/images/service-support-coordination.jpg";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · NDIS support coordination and psychosocial recovery coaching` },
  description:
    "Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching for self-managed and plan-managed participants in South East Queensland.",
  alternates: { canonical: "/" },
};

const WHAT_WE_DO = [
  { icon: DocumentIcon, title: "Understand Your Plan", copy: "Make sense of your NDIS plan and how it can be used." },
  { icon: ConnectIcon, title: "Connect With Supports", copy: "Find and connect with the right service providers." },
  { icon: CycleIcon, title: "Keep It Working", copy: "Alongside plan managers, health professionals and providers." },
  { icon: GrowthIcon, title: "Build Your Capacity", copy: "Work towards greater independence, at your pace." },
];

const VALUES = [
  { icon: HeartIcon, name: "Compassion" },
  { icon: ShieldCheckIcon, name: "Integrity" },
  { icon: FlagOutline, name: "Advocacy" },
];

const STATS = [
  { number: "7+", label: "Years' experience" },
  { number: "2", label: "Services, equal focus" },
  { number: "SEQ", label: "Where we work today" },
  { number: "All", label: "Ages supported" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero: on laptops and monitors the text and photo fill the first screen */}
      <div className={styles.heroFold}>
      <section className={styles.heroSection}>
        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.kicker}>
            <FlagSolid size={14} color="var(--text-3)" />
            <span>{site.tagline}</span>
          </div>
          <h1 aria-label="NDIS Plans Made Clear" className={styles.heroLine1}>
            NDIS Plans
          </h1>
          <div className={styles.heroRow}>
            <div className={styles.heroLine2} aria-hidden="true">
              <span className={styles.heroAccent}>Made</span> Clear
            </div>
            <p className={styles.heroIntro}>
              Support coordination helps you understand your NDIS plan, find the right supports, and keep those
              supports working together.
            </p>
          </div>

          <div className={styles.heroFoot}>
            <div className={styles.heroFootLeft}>
              <p className={styles.whoLine}>
                Self-managed and plan-managed.
                <br />
                Currently South East Queensland.
              </p>
              <div className={styles.heroActions}>
                <PillLink href="/referral" tone="accent" size="hero">
                  Make a Referral
                </PillLink>
                <Link href="/services" className={styles.textLink}>
                  View Services
                </Link>
              </div>
            </div>
            <div className={styles.experience}>
              <div className={styles.avatars} aria-hidden="true">
                <span className={`${styles.avatar} ${styles.avatarA}`}>
                  <HeartIcon size={18} color="var(--white)" strokeWidth={1.8} />
                </span>
                <span className={`${styles.avatar} ${styles.avatarB}`}>
                  <ShieldIcon size={18} color="var(--white)" strokeWidth={1.8} />
                </span>
                <span className={`${styles.avatar} ${styles.avatarC}`}>
                  <FlagOutline size={18} color="var(--white)" strokeWidth={1.8} />
                </span>
              </div>
              <p className={styles.expText}>
                <span className={styles.expNumber}>7+</span>
                <span className={styles.expLabel}>Years&#8217; experience</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image: participant and coordinator on the same call */}
      <section className={styles.heroImageSection}>
        <div className={styles.heroImage}>
          <div className={styles.split}>
            <div className={styles.half}>
              <Image
                src={heroParticipant}
                alt="A participant at home, smiling on a phone call with his coordinator"
                fill
                priority
                // object-fit: cover crops this photo to the box height, so it is requested wider than its box.
                sizes="(max-width: 760px) 100vw, min(65vw, 1160px)"
                className={styles.photo}
                style={{ objectPosition: "22% center" }}
              />
            </div>
            <div className={styles.half}>
              <Image
                src={heroCoordinator}
                alt="A support coordinator on the same call, working through the plan"
                fill
                priority
                // A wide photo in a tall box: requested at box height times its 2.33 aspect ratio.
                sizes="(max-width: 760px) 660px, min(112vw, 2000px)"
                className={styles.photo}
                style={{ objectPosition: "96% center" }}
              />
            </div>
          </div>
          <div className={styles.callBadge} aria-hidden="true">
            <CallingIcon size={26} color="var(--indigo-700)" />
          </div>
          <div className={styles.shade} aria-hidden="true" />

          <div className={styles.whoCard}>
            <span className={styles.whoCardImage}>
              <Image
                src={recoveryCoaching}
                alt=""
                fill
                sizes="270px"
                className={styles.photo}
                style={{ objectPosition: "50% 62%" }}
              />
            </span>
            <span className={styles.whoCardText}>
              <span className={styles.whoCardTitle}>Who We Work With</span>
              <span className={styles.whoCardBody}>Self-managed and plan-managed NDIS participants.</span>
            </span>
          </div>

          <p className={styles.note} aria-hidden="true">
            Beside you,
            <br />
            every step
          </p>

          <Link href="/referral" className={styles.refer} aria-label="Make a Referral">
            <span className={styles.referText} aria-hidden="true">
              Make a
              <br />
              Referral
            </span>
            <span className={styles.referDot}>
              <ArrowRight size={22} color="var(--white)" />
            </span>
          </Link>
        </div>
      </section>
      </div>

      {/* Service teaser row */}
      <section className={styles.teaserSection} aria-label="Our services">
        <div className={styles.teaserGrid}>
          <div className={styles.teaserPhoto}>
            <Image
              src={supportCoordination}
              alt="A coordinator on a video call with a participant and therapist, cross-checking the support plan"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 310px"
              className={styles.photo}
              style={{ objectPosition: "center 40%" }}
            />
          </div>

          <Link href="/services" className={styles.teaserLink}>
            <span className={styles.teaserBody}>
              <span className={styles.number} aria-hidden="true">
                01
              </span>
              <span className={styles.teaserTitle}>
                Support
                <br />
                Coordination
              </span>
              <span className={styles.teaserCopy}>
                Understand your NDIS plan, connect with the right supports, and keep services working together.
              </span>
            </span>
          </Link>

          <div className={styles.teaserPhoto}>
            <Image
              src={recoveryCoaching}
              alt="A participant writing her goals in a notebook during a coaching session"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 310px"
              className={styles.photo}
              style={{ objectPosition: "60% 30%" }}
            />
          </div>

          <div className={styles.teaserLast}>
            <Link href="/services" className={styles.explore}>
              <span className={styles.exploreText}>Explore Our Services</span>
              <CircleArrow size={52} iconSize={18} />
            </Link>
            <Link href="/services" className={styles.teaserLinkBottom}>
              <span className={styles.number} aria-hidden="true">
                02
              </span>
              <span className={styles.teaserTitle}>
                Psychosocial
                <br />
                Recovery Coaching
              </span>
              <span className={styles.teaserCopy}>
                Practical, participant-led coaching to build skills, routines and community connections.
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className={styles.section} aria-labelledby="what-we-do">
        <div className={`${styles.container} ${styles.stack48}`}>
          <SectionHeader
            eyebrow="What We Do"
            id="what-we-do"
            size="home"
            title={
              <>
                Support That Keeps
                <br />
                Your Plan on Track
              </>
            }
            aside={
              <div className={styles.aside}>
                <p className={styles.asideCopy}>
                  Ensign Support Services works with self-managed and plan-managed NDIS participants.
                </p>
                <Link href="/services" className={styles.viewAll}>
                  View All Services
                  <CircleArrow size={40} />
                </Link>
              </div>
            }
          />
          <ul className={styles.cardGrid}>
            {WHAT_WE_DO.map(({ icon: Icon, title, copy }) => (
              <li key={title} className={styles.doCard}>
                <span className={styles.doIcon} aria-hidden="true">
                  <Icon size={26} color="var(--indigo-900)" />
                </span>
                <div className={styles.doText}>
                  <h3 className={styles.doTitle}>{title}</h3>
                  <p className={styles.doCopy}>{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Ensign: values and stats */}
      <section className={styles.section} aria-labelledby="why-choose">
        <div className={`${styles.container} ${styles.stack44}`}>
          <SectionHeader
            eyebrow="About Us"
            id="why-choose"
            size="home"
            title="Why Choose Ensign?"
            aside={
              <p className={styles.asideCopy}>
                Practical, participant-led support from a team with more than seven years in mental health and
                disability services.
              </p>
            }
          />
          <ul className={styles.valueGrid} aria-label="Our values">
            {VALUES.map(({ icon: Icon, name }) => (
              <li key={name} className={styles.value}>
                <span className={styles.valueIcon} aria-hidden="true">
                  <Icon size={24} color="var(--indigo-900)" strokeWidth={1.6} />
                </span>
                <span className={styles.valueName}>{name}</span>
              </li>
            ))}
          </ul>
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <p key={stat.label} className={styles.stat}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <ReferralBand />
    </>
  );
}
