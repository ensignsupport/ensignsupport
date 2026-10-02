"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/app/admin/actions";
import styles from "./admin.module.css";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signInAction, undefined);
  return (
    <form action={action} className={styles.signInForm}>
      <input type="hidden" name="next" value={next} />
      <label className={styles.field}>
        Passphrase
        <input
          className={styles.input}
          type="password"
          name="passphrase"
          autoComplete="current-password"
          required
          maxLength={200}
          aria-describedby={state?.error ? "sign-in-error" : undefined}
          aria-invalid={state?.error ? true : undefined}
          autoFocus
        />
      </label>
      {state?.error && (
        <p id="sign-in-error" className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`} disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
