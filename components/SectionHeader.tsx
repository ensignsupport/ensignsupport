import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import styles from "./SectionHeader.module.css";

type Props = {
  eyebrow: string;
  title: ReactNode;
  id?: string;
  size?: "home" | "page";
  /** Optional copy or link on the right of the heading. */
  aside?: ReactNode;
};

/** Eyebrow, section heading and an optional note on the right. */
export function SectionHeader({ eyebrow, title, id, size = "page", aside }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.lead}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className={`${styles.title} ${styles[size]}`}>
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
