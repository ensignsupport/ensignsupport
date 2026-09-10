/**
 * The wavy join between a dark band and the light page.
 *
 * `position="bottom"` sits at the foot of the hero, flowing down into the page.
 * `position="top"` is flipped, so the page flows down into the closing band.
 * Both are filled with the page colour, never the band colour.
 */
export default function Wave({ position = 'bottom' }) {
  return (
    <svg
      className={`wave wave--${position}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="wave__back"
        d="M0,58 C170,104 330,18 500,48 C670,78 830,108 1000,76 C1170,44 1300,10 1440,40 L1440,120 L0,120 Z"
      />
      <path
        className="wave__front"
        d="M0,82 C185,120 345,44 525,70 C705,96 865,120 1045,90 C1225,60 1335,42 1440,66 L1440,120 L0,120 Z"
      />
    </svg>
  );
}
