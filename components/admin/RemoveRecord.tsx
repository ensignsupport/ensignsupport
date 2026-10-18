"use client";

import { useState } from "react";
import type { RemoveResult } from "@/lib/server/admin-data";
import styles from "./admin.module.css";

/**
 * "Remove personal details" for a Closed referral or enquiry (Privacy Policy
 * v2.0 clause 11). Two steps on purpose: the first click only shows what will
 * be deleted, the second deletes it. Nothing is shown until the record is
 * Closed, so a live record cannot be removed by accident.
 */
export function RemoveRecord({
  kind,
  refId,
  status,
  disabled,
  onRemove,
  onRemoved,
}: {
  kind: "referral" | "enquiry";
  refId: string;
  status: string;
  disabled?: boolean;
  onRemove: (ref: string) => Promise<RemoveResult>;
  onRemoved: (ref: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== "closed") return null;

  const what =
    kind === "referral"
      ? "the participant’s and referrer’s names and contact details, the reason, all notes and the status history"
      : "the name, email, phone, message, all replies and the status history";
  const when =
    kind === "referral"
      ? "Remove a referral that did not go ahead 12 months after it was closed. Keep a participant’s record for 7 years after services end."
      : "Remove an enquiry 12 months after it was closed.";

  const remove = async () => {
    setBusy(true);
    setError(null);
    const result = await onRemove(refId).catch(() => null);
    setBusy(false);
    if (result === "removed") {
      onRemoved(refId);
      return;
    }
    setError(
      result === "not_closed"
        ? "Only a Closed record can be removed. Close it first."
        : result === "not_found"
          ? "This record has already been removed."
          : "Could not remove it. Try again.",
    );
  };

  return (
    <section className={`${styles.group} ${styles.removeGroup}`} aria-labelledby={`remove-${refId}`}>
      <h3 id={`remove-${refId}`} className={styles.groupTitle}>
        Remove personal details
      </h3>
      <p className={styles.removeText}>{when}</p>
      {!confirming ? (
        <div>
          <button type="button" className={`${styles.btn} ${styles.btnDanger}`} disabled={disabled || busy} onClick={() => setConfirming(true)}>
            Remove personal details
          </button>
        </div>
      ) : (
        <div className={styles.removeConfirm} role="alertdialog" aria-labelledby={`remove-q-${refId}`} aria-describedby={`remove-d-${refId}`}>
          <p id={`remove-q-${refId}`} className={styles.removeQuestion}>
            Remove {refId} for good?
          </p>
          <p id={`remove-d-${refId}`} className={styles.removeText}>
            This deletes {what}. Only the reference number and the day it was received are kept. It cannot be undone.
          </p>
          <div className={styles.removeActions}>
            <button type="button" className={`${styles.btn} ${styles.btnDangerSolid}`} disabled={busy} onClick={remove}>
              {busy ? "Removing" : "Yes, remove for good"}
            </button>
            <button type="button" className={styles.btn} disabled={busy} onClick={() => { setConfirming(false); setError(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className={styles.fail} style={{ margin: 0 }}>
          {error}
        </p>
      )}
    </section>
  );
}
