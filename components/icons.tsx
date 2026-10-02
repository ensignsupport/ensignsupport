/**
 * Every icon on the site, drawn exactly as in the design source.
 * Icons are decorative (aria-hidden). The control that holds one carries
 * the accessible name.
 */

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
  focusable: false as const,
});

/** The Ensign flag mark used in the logo tile. */
export function FlagMark({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 21V3" stroke="var(--indigo-900)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 4h12l-3 4 3 4H6" fill="var(--indigo-700)" />
    </svg>
  );
}

/** Small solid flag used before page eyebrows. */
export function FlagSolid({ size = 14, color = "currentColor", className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 21V3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 4h12l-3 4 3 4H6" fill={color} />
    </svg>
  );
}

/** Outline flag used in value cards and the referral band. */
export function FlagOutline({ size = 24, color = "currentColor", strokeWidth = 1.6, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 21V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 5h10l-2.5 3.5L17 12H7" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ size = 16, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeft({ size = 16, color = "currentColor", strokeWidth = 2, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19 12H5M11 18l-6-6 6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ size = 16, color = "currentColor", className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalArrow({ size = 12, color = "currentColor", className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 17L17 7M9 7h8v8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ size = 18, color = "currentColor", strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon({ size = 22, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M4 7l8 6 8-6" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ size = 20, color = "currentColor", className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 18, color = "currentColor", strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function InstagramIcon({ size = 21, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 21, className }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3Z" />
    </svg>
  );
}

export function PinIcon({ size = 28, color = "currentColor", strokeWidth = 1.2, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export function PeopleIcon({ size = 28, color = "currentColor", strokeWidth = 1.2, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth={strokeWidth} />
      <path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M18 14.4c1.6.7 2.7 2.2 3 4.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

type StrokeIconProps = IconProps & { color?: string };

export function HeartIcon({ size = 24, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldIcon({ size = 24, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 24, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocumentIcon({ size = 26, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9 9h6M9 12.5h6M9 16h3.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function ConnectIcon({ size = 26, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="6" cy="12" r="2.6" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="18" cy="6" r="2.6" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="18" cy="18" r="2.6" stroke={color} strokeWidth={strokeWidth} />
      <path d="M8.4 10.8l7.2-3.6M8.4 13.2l7.2 3.6" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export function CycleIcon({ size = 26, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GrowthIcon({ size = 26, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 19l5-5 4 3 7-8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9h5v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CallingIcon({ size = 26, color = "currentColor", className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M15 3.5a6 6 0 0 1 5.5 5.5M15 7a2.6 2.6 0 0 1 2 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 13, color = "currentColor", strokeWidth = 2.4, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon({ size = 22, color = "currentColor", strokeWidth = 1.6, className }: StrokeIconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 7.5V12l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
