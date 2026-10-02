/** The large flag drawn faintly behind every dark band. */
export function BandFlag({ className, width = 700, height = 420 }: { className?: string; width?: number; height?: number }) {
  return (
    <svg viewBox="0 0 700 420" width={width} height={height} style={{ width: `calc(${width} * var(--px, 1px))`, height: `calc(${height} * var(--px, 1px))` }} aria-hidden="true" focusable="false" className={className}>
      <path d="M330 420 V 60" stroke="var(--flag-shadow)" strokeWidth="12" strokeLinecap="round" />
      <path d="M336 64 h 260 l -66 86 l 66 86 h -260 Z" fill="var(--flag-shadow)" />
    </svg>
  );
}
