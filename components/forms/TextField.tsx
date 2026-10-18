"use client";

import { forwardRef } from "react";
import styles from "./fields.module.css";

type Props = {
  id: string;
  label: string;
  optional?: boolean;
  type?: "text" | "email" | "tel";
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  /** Short guidance shown under the label and read out with the field. */
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

/** A labelled text input. Errors are tied to the input for screen readers. */
export const TextField = forwardRef<HTMLInputElement & HTMLTextAreaElement, Props>(function TextField(
  { id, label, optional, type = "text", multiline, rows = 4, placeholder, hint, autoComplete, inputMode, value, error, onChange },
  ref,
) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: id,
    className: styles.input,
    placeholder,
    autoComplete,
    value,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    "aria-required": optional ? undefined : (true as const),
  };
  return (
    <label className={styles.label} htmlFor={id}>
      <span>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </span>
      {hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
      {multiline ? (
        <textarea {...common} ref={ref} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} ref={ref} type={type} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      ) : null}
    </label>
  );
});
