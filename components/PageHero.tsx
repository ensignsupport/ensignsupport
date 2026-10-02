import type { ReactNode } from "react";
import { FlagSolid } from "./icons";
import styles from "./PageHero.module.css";

type Props = {
  kicker: string;
  /** Heading lines. Wrap the light word in <PageHero.Accent>. */
  title: ReactNode;
  intro: ReactNode;
};

/** The top of every page except Home: small flag label, big heading, short intro. */
export function PageHero({ kicker, title, intro }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.kicker}>
          <FlagSolid size={14} color="var(--text-3)" />
          <span>{kicker}</span>
        </div>
        <div className={styles.row}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
        </div>
      </div>
    </section>
  );
}

function Accent({ children }: { children: ReactNode }) {
  return <span className={styles.accentWord}>{children}</span>;
}

PageHero.Accent = Accent;
