import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

/** The small label with a dot that sits above section headings. */
export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <div className={onDark ? `${styles.eyebrow} ${styles.onDark}` : styles.eyebrow}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </div>
  );
}
