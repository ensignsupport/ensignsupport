import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "./icons";
import styles from "./PillButton.module.css";

type Tone = "accent" | "light" | "dark";
type Size = "header" | "menu" | "hero" | "step" | "band" | "enquiry";

const iconSize: Record<Size, number> = {
  header: 16,
  menu: 16,
  hero: 18,
  step: 18,
  band: 18,
  enquiry: 18,
};

type Common = {
  tone: Tone;
  size: Size;
  raised?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({ tone, size, raised, className }: Omit<Common, "children">) {
  return [styles.pill, styles[tone], styles[size], raised ? styles.raised : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

function Dot({ tone, size }: { tone: Tone; size: Size }) {
  // On the light button the dot is accent, so the arrow is white.
  const arrowColour = tone === "light" ? "var(--white)" : "var(--ink)";
  return (
    <span className={styles.dot}>
      <ArrowRight size={iconSize[size]} color={arrowColour} />
    </span>
  );
}

export function PillLink({ href, ...rest }: Common & { href: string }) {
  return (
    <Link href={href} className={classes(rest)}>
      {rest.children}
      <Dot tone={rest.tone} size={rest.size} />
    </Link>
  );
}

export function PillButton({
  tone,
  size,
  raised,
  className,
  children,
  ...buttonProps
}: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button {...buttonProps} className={classes({ tone, size, raised, className })}>
      {children}
      <Dot tone={tone} size={size} />
    </button>
  );
}
