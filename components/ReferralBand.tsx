import { BandFlag } from "./BandFlag";
import { Eyebrow } from "./Eyebrow";
import { FlagOutline, PeopleIcon, PinIcon } from "./icons";
import { PillLink } from "./PillButton";
import styles from "./ReferralBand.module.css";

/** "Your Journey, Our Direction". Closes Home, Services and About us. */
export function ReferralBand() {
  return (
    <section className={styles.section} aria-labelledby="referral-band-heading">
      <div className={`${styles.band} on-dark`}>
        <BandFlag className={styles.flag} />
        <div className={styles.grid}>
          <div className={styles.lead}>
            <Eyebrow onDark>Make a Referral</Eyebrow>
            <h2 id="referral-band-heading" className={styles.heading}>
              Your Journey,
              <br />
              Our Direction
            </h2>
            <PillLink href="/referral" tone="light" size="band" raised className={styles.button}>
              Make a Referral
            </PillLink>
          </div>

          <ul className={styles.feats}>
            <li className={styles.feat}>
              <PinIcon size={28} color="var(--indigo-100)" />
              <span className={styles.featRule} aria-hidden="true" />
              <span className={styles.featText}>
                Currently servicing
                <br />
                South East Queensland
              </span>
            </li>
            <li className={styles.feat}>
              <PeopleIcon size={28} color="var(--indigo-100)" />
              <span className={styles.featRule} aria-hidden="true" />
              <span className={styles.featText}>
                Self-managed and
                <br />
                plan-managed participants
              </span>
            </li>
            <li className={styles.feat}>
              <FlagOutline size={28} color="var(--indigo-100)" strokeWidth={1.2} />
              <span className={styles.featRule} aria-hidden="true" />
              <span className={styles.featText}>
                7+ years in mental health
                <br />
                and disability services
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
