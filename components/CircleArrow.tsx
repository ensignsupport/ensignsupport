import { ArrowRight } from "./icons";
import styles from "./CircleArrow.module.css";

export function CircleArrow({ size, iconSize = 16, strokeWidth = 1.8 }: { size: 40 | 52; iconSize?: number; strokeWidth?: number }) {
  return (
    <span className={`${styles.circle} ${size === 40 ? styles.s40 : styles.s52}`} aria-hidden="true">
      <ArrowRight size={iconSize} color="var(--ink)" strokeWidth={strokeWidth} />
    </span>
  );
}
