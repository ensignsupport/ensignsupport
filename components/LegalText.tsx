import type { ReactNode } from "react";
import styles from "./LegalText.module.css";

/**
 * Renders a legal document written in a small, fixed subset of Markdown:
 * "## " headings, paragraphs separated by a blank line, "(a)" sub-clauses,
 * **bold** and *italic*. Web addresses and email addresses become links, and any
 * CONFIRM marker still in the text is highlighted so it cannot be missed.
 * The wording itself lives in lib/legal and changes only with legal sign-off.
 */

const INLINE =
  /(\*\*[^*]+\*\*|\*[^*]+\*|\[CONFIRM[:][^\]]*\]|www\.[\w.-]+\.[a-z]{2,}(?:\/[\w./-]*[\w/])?|[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,})/g;

function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("[CONFIRM")) return <mark key={key} className={styles.confirm}>{part}</mark>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    if (part.startsWith("www.")) {
      return (
        <a key={key} href={`https://${part}`} target="_blank" rel="noopener noreferrer">
          {part}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      );
    }
    if (/^[\w.+-]+@/.test(part)) {
      return (
        <a key={key} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    return part;
  });
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalText({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  // The paragraph straight after "## The short version" is shown as a card.
  const isSummary = (i: number) => {
    const prev = blocks[i - 1]?.trim() ?? "";
    return prev.startsWith("## ") && /short version/i.test(prev);
  };

  return (
    <div className={styles.legal}>
      {blocks.map((raw, i) => {
        const block = raw.trim();
        const key = `b${i}`;

        if (block.startsWith("## ")) {
          const title = block.slice(3).trim();
          return (
            <h2 key={key} id={slug(title)} className={styles.heading}>
              {title}
            </h2>
          );
        }

        // The opening block (name, ABN, version, date) keeps its line breaks.
        if (i === 0) {
          return (
            <p key={key} className={styles.meta}>
              {block.split("\n").map((line, j) => (
                <span key={j} className={styles.metaLine}>
                  {inline(line.trim(), `${key}-${j}`)}
                </span>
              ))}
            </p>
          );
        }

        const text = block.replace(/\s*\n\s*/g, " ");

        if (isSummary(i)) {
          return (
            <p key={key} className={styles.summary}>
              {inline(text, key)}
            </p>
          );
        }

        if (/^\([a-z]\)\s/.test(text)) {
          return (
            <p key={key} className={styles.sub}>
              <span className={styles.label}>{text.slice(0, 3)}</span>
              <span>{inline(text.slice(4), key)}</span>
            </p>
          );
        }

        const clause = text.match(/^(\d+\.\d+)\s+(.*)$/);
        if (clause) {
          return (
            <p key={key} className={styles.clause}>
              <span className={styles.label}>{clause[1]}</span>
              <span>{inline(clause[2], key)}</span>
            </p>
          );
        }

        return (
          <p key={key} className={styles.para}>
            {inline(text, key)}
          </p>
        );
      })}
    </div>
  );
}
