"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { enquiryReplyAction, enquiryStatusAction, openEnquiryAction } from "@/app/admin/actions";
import type { EnquiryDetail, EnquiryRow, ThreadLine } from "@/lib/server/admin-data";
import { ENQUIRY_STATUSES, formatWhen, statusLabel, type EnquiryStatus } from "@/lib/admin/labels";
import { GoReferralsIcon, SearchIcon, SendIcon } from "./AdminIcons";
import styles from "./admin.module.css";

type Filter = "all" | EnquiryStatus;
type Sort = "new" | "old" | "unread";

const pillClass = (status: string) => `${styles.pill} ${styles[`st-${status}`] ?? ""}`;

const delivery = (d: ThreadLine["delivery"]) =>
  d === "sent" ? "Emailed" : d === "failed" ? "Email could not be sent" : "Waiting to be emailed";

/** Admin: Enquiries (AdminEnquiries.dc.html). Inbox, reading pane, reply by email. */
export function EnquiriesBoard({ rows: initialRows, initialRef }: { rows: EnquiryRow[]; initialRef: string | null }) {
  const [rows, setRows] = useState(initialRows);
  const [status, setStatus] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("new");
  const [q, setQ] = useState("");
  const startRef = initialRef && initialRows.some((e) => e.ref === initialRef) ? initialRef : null;
  const [selRef, setSelRef] = useState<string | null>(startRef);
  const [detail, setDetail] = useState<EnquiryDetail | null>(null);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    ENQUIRY_STATUSES.forEach((s) => (c[s.id] = rows.filter((r) => r.status === s.id).length));
    return c;
  }, [rows]);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.filter(
      (e) =>
        (status === "all" || e.status === status) &&
        (!needle || [e.name, e.email, e.preview, e.ref].join(" ").toLowerCase().includes(needle)),
    );
    const sorters: Record<Sort, (a: EnquiryRow, b: EnquiryRow) => number> = {
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      old: (a, b) => a.createdAt.localeCompare(b.createdAt),
      unread: (a, b) =>
        (a.status === "new" ? 0 : 1) - (b.status === "new" ? 0 : 1) || b.createdAt.localeCompare(a.createdAt),
    };
    return list.slice().sort(sorters[sort]);
  }, [rows, status, sort, q]);

  const sel = rows.find((e) => e.ref === selRef) ?? null;

  const open = useCallback(async (ref: string) => {
    setSelRef(ref);
    setDetail(null);
    setDraft("");
    setMsg(null);
    setStatusMsg(null);
    const d = await openEnquiryAction(ref);
    setDetail(d);
    setRows((list) => list.map((e) => (e.ref === ref ? { ...e, read: true } : e)));
    titleRef.current?.focus();
  }, []);

  // A link from an alert email opens that enquiry straight away.
  useEffect(() => {
    if (!startRef) return;
    openEnquiryAction(startRef).then(
      (d) => {
        setDetail(d);
        setRows((list) => list.map((e) => (e.ref === startRef ? { ...e, read: true } : e)));
      },
      () => undefined,
    );
  }, [startRef]);

  const changeStatus = async (next: EnquiryStatus) => {
    if (!sel || sel.status === next || busy) return;
    const before = sel.status;
    setBusy(true);
    setStatusMsg(null);
    setRows((list) => list.map((e) => (e.ref === sel.ref ? { ...e, status: next } : e)));
    const ok = await enquiryStatusAction(sel.ref, next).catch(() => false);
    if (!ok) setRows((list) => list.map((e) => (e.ref === sel.ref ? { ...e, status: before } : e)));
    setStatusMsg(ok ? { ok: true, text: "Saved" } : { ok: false, text: "Could not save. Try again." });
    setBusy(false);
  };

  const send = async () => {
    if (!sel || busy || !draft.trim()) return;
    setBusy(true);
    setMsg(null);
    const result = await enquiryReplyAction(sel.ref, draft).catch(() => null);
    if (result?.ok) {
      setDetail(result.detail);
      setDraft("");
      setRows((list) => list.map((e) => (e.ref === sel.ref ? { ...e, status: "replied" } : e)));
      const last = result.detail.thread[result.detail.thread.length - 1];
      setMsg({
        ok: true,
        text:
          last?.delivery === "sent"
            ? "Reply sent."
            : "Reply saved. The email has not gone out yet. It will keep trying automatically.",
      });
    } else {
      setMsg({ ok: false, text: result && !result.ok ? result.error : "Could not send the reply. Try again." });
    }
    setBusy(false);
  };

  const tabs: { k: Filter; label: string; count: number }[] = [
    { k: "all", label: "All", count: rows.length },
    ...ENQUIRY_STATUSES.map((s) => ({ k: s.id as Filter, label: s.label, count: counts[s.id] })),
  ];
  const first = sel ? sel.name.split(/\s+/).slice(0, 2).join(" ") : "";

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Enquiries</h1>
          <p className={styles.subtitle}>General enquiries from the Contact page.</p>
        </div>
        <div className={styles.tabs} role="group" aria-label="Status">
          {tabs.map((t) => (
            <button
              key={t.k}
              type="button"
              aria-pressed={status === t.k}
              className={`${styles.tab} ${status === t.k ? styles.tabOn : ""}`}
              onClick={() => setStatus(t.k)}
            >
              {t.label}
              <span className={styles.tabCount}>{t.count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.inbox}>
        <section aria-label="Enquiry list" className={styles.panel}>
          <div className={styles.panelTools}>
            <label className={styles.searchLabel}>
              <span className="visually-hidden">Search enquiries</span>
              <SearchIcon className={styles.searchIcon} />
              <input
                className={`${styles.search} ${styles.searchWide}`}
                type="search"
                placeholder="Search name, email or message"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <select className={styles.select} aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="unread">Unread first</option>
            </select>
          </div>
          <ul className={styles.items}>
            {items.map((e) => (
              <li key={e.ref}>
                <button
                  type="button"
                  className={`${styles.item} ${e.ref === selRef ? styles.itemSel : ""}`}
                  onClick={() => open(e.ref)}
                  aria-current={e.ref === selRef ? "true" : undefined}
                >
                  <span className={styles.itemTop}>
                    <span className={styles.itemWho}>
                      <span className={`${styles.dot} ${e.status === "new" ? styles.dotOn : ""}`} aria-hidden="true" />
                      <span className={`${styles.itemName} ${e.status === "new" ? styles.itemNameNew : ""}`}>{e.name}</span>
                    </span>
                    <span className={styles.itemWhen}>{formatWhen(e.createdAt)}</span>
                  </span>
                  <span className={styles.itemPreview}>{e.preview}</span>
                  <span>
                    <span className={pillClass(e.status)}>{statusLabel(e.status)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {items.length === 0 && (
            <div className={styles.emptySmall}>
              {rows.length === 0 ? (
                <>
                  <span className={styles.emptyTitle}>No enquiries yet</span>
                  <span className={styles.emptyText}>Enquiries from the Contact page will show here.</span>
                </>
              ) : (
                <>
                  <span className={styles.emptyTitle}>No enquiries here</span>
                  <span className={styles.emptyText}>Try another tab or search.</span>
                </>
              )}
            </div>
          )}
        </section>

        <section aria-label="Enquiry" className={styles.panel}>
          {sel ? (
            <>
              <div className={styles.readHead}>
                <div className={`${styles.drawerHeadText} ${styles.readHeadText}`}>
                  <h2 ref={titleRef} tabIndex={-1} className={styles.drawerTitle}>
                    {sel.name}
                  </h2>
                  <span className={styles.readMeta}>
                    <a href={`mailto:${sel.email}`}>{sel.email}</a>
                    {detail?.phone && <span>{detail.phone}</span>}
                    <span>{formatWhen(sel.createdAt)}</span>
                  </span>
                </div>
                <div className={styles.segRow} role="group" aria-label="Status">
                  {ENQUIRY_STATUSES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.seg} ${sel.status === s.id ? styles.segOn : ""}`}
                      aria-pressed={sel.status === s.id}
                      disabled={busy}
                      onClick={() => changeStatus(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                  <span role="status" className={statusMsg?.ok ? styles.saved : styles.fail}>
                    {statusMsg?.text}
                  </span>
                </div>
              </div>
              <ol className={styles.thread} aria-label="Messages">
                <li className={styles.bubbleWrap}>
                  <span className={styles.bubbleWho}>
                    {sel.name} · {formatWhen(sel.createdAt)}
                  </span>
                  <div className={styles.bubble}>{detail ? detail.message : "Loading the message"}</div>
                </li>
                {detail?.thread.map((m, i) => (
                  <li key={i} className={`${styles.bubbleWrap} ${styles.bubbleWrapOurs}`}>
                    <span className={styles.bubbleWho}>
                      Ensign Support Services · {formatWhen(m.at)} · {delivery(m.delivery)}
                    </span>
                    <div className={`${styles.bubble} ${styles.bubbleOurs}`}>{m.body}</div>
                  </li>
                ))}
              </ol>
              <div className={styles.compose}>
                <label className={styles.composeLabel}>
                  Reply to {first}
                  <textarea
                    className={`${styles.note} ${styles.composeNote}`}
                    placeholder="Write a reply. It will be sent from the Ensign email address."
                    value={draft}
                    maxLength={4000}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                </label>
                {msg && (
                  <p role="status" className={msg.ok ? styles.saved : styles.fail} style={{ margin: 0 }}>
                    {msg.text}
                  </p>
                )}
                <div className={styles.composeFoot}>
                  <Link className={styles.btn} href="/admin/referrals" prefetch={false}>
                    <GoReferralsIcon />
                    Go to referrals
                  </Link>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={send}
                    disabled={busy || !draft.trim()}
                  >
                    Send reply
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noSel}>Select an enquiry to read it.</div>
          )}
        </section>
      </div>
    </>
  );
}
