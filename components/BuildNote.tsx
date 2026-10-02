/**
 * A clearly marked stand-in for a page section that a later milestone builds.
 * Never ships: the launch check fails while any BuildNote remains.
 */
export function BuildNote({ children }: { children: string }) {
  return (
    <section style={{ padding: "48px var(--gutter) 0" }} data-build-note="">
      <p
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "28px",
          borderRadius: "var(--radius-card)",
          border: "1px dashed var(--indigo-150)",
          color: "var(--text-3)",
          fontSize: "15px",
          lineHeight: 1.55,
        }}
      >
        {children}
      </p>
    </section>
  );
}
