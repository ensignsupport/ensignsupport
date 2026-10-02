/**
 * Icons drawn exactly as in the admin designs. Decorative: the control that
 * holds one carries the accessible name. Sizes follow the site scale.
 */
type Props = { size?: number; className?: string };

const svg = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
  focusable: false as const,
  style: { width: `calc(${size} * var(--px, 1px))`, height: `calc(${size} * var(--px, 1px))` },
});

export function ReferralsIcon({ size = 18, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9h6M9 12.5h6M9 16h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function GoReferralsIcon({ size = 16, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9h6M9 12.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function EnquiriesIcon({ size = 18, strokeWidth = 1.6, className }: Props & { strokeWidth?: number }) {
  return (
    <svg {...svg(size)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

export function ViewSiteIcon({ size = 18, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SignOutIcon({ size = 18, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="var(--label-muted-aa)" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="var(--label-muted-aa)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseXIcon({ size = 16, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CallIcon({ size = 16, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SendIcon({ size = 16, className }: Props) {
  return (
    <svg {...svg(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminFlag({ size = 18, light = true }: { size?: number; light?: boolean }) {
  return (
    <svg {...svg(size)}>
      <path d="M6 21V3" stroke={light ? "var(--indigo-900)" : "var(--white)"} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 4h12l-3 4 3 4H6" fill={light ? "var(--indigo-700)" : "var(--white)"} />
    </svg>
  );
}
