"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  referralDetailAction,
  referralNoteAction,
  referralStatusAction,
} from "@/app/admin/actions";
import type { ReferralDetail, ReferralRow } from "@/lib/server/admin-data";
import {
  REFERRAL_STATUSES,
  SERVICE_FILTERS,
  formatDay,
  formatFull,
  planLabel,
  referrerLabel,
  serviceLabel,
  serviceShort,
  statusLabel,
  type ReferralStatus,
} from "@/lib/admin/labels";
import { PLAN_TYPES, REFERRER_TYPES } from "@/lib/forms/schema";
import { CallIcon, CloseXIcon, EnquiriesIcon, SearchIcon } from "./AdminIcons";
import styles from "./admin.module.css";

type Filter = "all" | ReferralStatus;
type Sort = "new" | "old" | "az" | "status";

const ORDER = REFERRAL_STATUSES.map((s) => s.id);
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
const pillClass = (status: string) =>
  `${styles.pill} ${styles[`st-${status}`] ?? ""}`;

/** Admin: Referrals (AdminReferrals.dc.html). Real data, filtered and sorted in the browser. */
export function ReferralsBoard({
  rows: initialRows,
  initialRef,
  initialStatus,
}: {
  rows: ReferralRow[];
  initialRef: string | null;
  initialStatus: Filter;
}) {
  const [rows, setRows] = useState(initialRows);
  const [status, setStatus] = useState<Filter>(initialStatus);
  const [service, setService] = useState("all");
  const [plan, setPlan] = useState("all");
  const [refType, setRefType] = useState("all");
  const [sort, setSort] = useState<Sort>("new");
  const [q, setQ] = useState("");
  const startRef =
    initialRef && initialRows.some((r) => r.ref === initialRef)
      ? initialRef
      : null;
  const [selRef, setSelRef] = useState<string | null>(startRef);
  const [detail, setDetail] = useState<ReferralDetail | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [note, setNote] = useState("");
  const [noteMsg, setNoteMsg] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const rowButtons = useRef(new Map<string, HTMLButtonElement>());
  const drawerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    ORDER.forEach((k) => (c[k] = rows.filter((r) => r.status === k).length));
    return c;
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (service === "all" || r.service === service) &&
        (plan === "all" || r.planType === plan) &&
        (refType === "all" || r.referrerType === refType) &&
        (!needle ||
          [
            r.participantName,
            r.participantSuburb,
            r.referrerName,
            r.referrerOrgRole ?? "",
            r.ref,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
    const sorters: Record<Sort, (a: ReferralRow, b: ReferralRow) => number> = {
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      old: (a, b) => a.createdAt.localeCompare(b.createdAt),
      az: (a, b) => a.participantName.localeCompare(b.participantName, "en-AU"),
      status: (a, b) =>
        ORDER.indexOf(a.status) - ORDER.indexOf(b.status) ||
        b.createdAt.localeCompare(a.createdAt),
    };
    return list.slice().sort(sorters[sort]);
  }, [rows, status, service, plan, refType, sort, q]);

  const anyFilter =
    status !== "all" ||
    service !== "all" ||
    plan !== "all" ||
    refType !== "all" ||
    q.trim() !== "";
  const clear = () => {
    setStatus("all");
    setService("all");
    setPlan("all");
    setRefType("all");
    setQ("");
  };

  const sel = rows.find((r) => r.ref === selRef) ?? null;

  const open = useCallback(async (ref: string) => {
    setSelRef(ref);
    setDetail(null);
    setStatusMsg(null);
    setNote("");
    setNoteMsg(null);
    const d = await referralDetailAction(ref);
    setDetail(d);
  }, []);

  const close = useCallback(() => {
    const ref = selRef;
    setSelRef(null);
    setDetail(null);
    if (ref) rowButtons.current.get(ref)?.focus();
  }, [selRef]);

  // A link from an alert email opens that referral straight away.
  useEffect(() => {
    if (startRef)
      referralDetailAction(startRef).then(setDetail, () => undefined);
  }, [startRef]);

  // Move focus into the panel when it opens; Escape closes it; Tab stays inside it.
  useEffect(() => {
    if (!selRef) return;
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selRef, close]);

  const changeStatus = async (next: ReferralStatus) => {
    if (!sel || sel.status === next || busy) return;
    const before = sel.status;
    setBusy(true);
    setStatusMsg(null);
    setRows((list) =>
      list.map((r) => (r.ref === sel.ref ? { ...r, status: next } : r)),
    );
    const d = await referralStatusAction(sel.ref, next).catch(() => null);
    if (d) {
      setDetail(d);
      setStatusMsg({ ok: true, text: "Saved" });
    } else {
      setRows((list) =>
        list.map((r) => (r.ref === sel.ref ? { ...r, status: before } : r)),
      );
      setStatusMsg({ ok: false, text: "Could not save. Try again." });
    }
    setBusy(false);
  };

  const addNote = async () => {
    if (!sel || busy) return;
    if (!note.trim()) {
      setNoteMsg({ ok: false, text: "Write a note first." });
      return;
    }
    setBusy(true);
    setNoteMsg(null);
    const result = await referralNoteAction(sel.ref, note).catch(() => null);
    if (result?.ok) {
      setDetail(result.detail);
      setNote("");
      setNoteMsg({ ok: true, text: "Note saved" });
    } else {
      setNoteMsg({
        ok: false,
        text:
          result && !result.ok
            ? result.error
            : "Could not save the note. Try again.",
      });
    }
    setBusy(false);
  };

  const tabs: { k: Filter; label: string; count: number }[] = [
    { k: "all", label: "All", count: rows.length },
    ...REFERRAL_STATUSES.map((s) => ({
      k: s.id as Filter,
      label: s.label,
      count: counts[s.id],
    })),
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Referrals</h1>
          <p className={styles.subtitle}>
            Referrals submitted through the website referral form.
          </p>
        </div>
        <div className={styles.tools}>
          <label className={styles.searchLabel}>
            <span className="visually-hidden">Search referrals</span>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.search}
              type="search"
              placeholder="Search name, suburb, referrer"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>
      </header>

      <div className={styles.summary}>
        {REFERRAL_STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.sumCard} ${status === s.id ? styles.sumCardOn : ""}`}
            aria-pressed={status === s.id}
            onClick={() => setStatus(status === s.id ? "all" : s.id)}
          >
            <span
              className={pillClass(s.id)}
              style={{ alignSelf: "flex-start" }}
            >
              {s.label}
            </span>
            <span className={styles.sumCount}>{counts[s.id]}</span>
          </button>
        ))}
      </div>

      <div className={styles.filterBar}>
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
        <div className={styles.filters}>
          <select
            className={styles.select}
            aria-label="Filter by service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="all">All services</option>
            {SERVICE_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            aria-label="Filter by plan type"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="all">All plan types</option>
            {PLAN_TYPES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            aria-label="Filter by referrer"
            value={refType}
            onChange={(e) => setRefType(e.target.value)}
          >
            <option value="all">All referrers</option>
            {REFERRER_TYPES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="new">Sort: Newest first</option>
            <option value="old">Sort: Oldest first</option>
            <option value="az">Sort: Participant A to Z</option>
            <option value="status">Sort: Status</option>
          </select>
          {anyFilter && (
            <button type="button" className={styles.linkButton} onClick={clear}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.table}>
          <div className={styles.head} aria-hidden="true">
            <span>Participant</span>
            <span>Service</span>
            <span>Plan</span>
            <span>Referred by</span>
            <span>Received</span>
            <span>Status</span>
          </div>
          <ul className={styles.rows} aria-label="Referrals">
            {shown.map((r) => (
              <li key={r.ref}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) rowButtons.current.set(r.ref, el);
                    else rowButtons.current.delete(r.ref);
                  }}
                  className={`${styles.row} ${r.ref === selRef ? styles.rowSel : ""}`}
                  onClick={() => open(r.ref)}
                  aria-label={`Open referral for ${r.participantName}, ${statusLabel(r.status)}, received ${formatDay(r.createdAt)}`}
                >
                  <span className={styles.cellStack}>
                    <span className={styles.cellMain}>{r.participantName}</span>
                    <span className={styles.cellSub}>
                      {r.participantSuburb}
                    </span>
                  </span>
                  <span className={styles.cellClip}>
                    <span className={styles.svc}>
                      {serviceShort(r.service)}
                    </span>
                  </span>
                  <span className={styles.cellText}>
                    {planLabel(r.planType)}
                  </span>
                  <span className={styles.cellStack}>
                    <span className={styles.cellTextTrunc}>
                      {r.referrerName}
                    </span>
                    <span className={styles.cellSub}>
                      {referrerLabel(r.referrerType)}
                    </span>
                  </span>
                  <span className={styles.cellText}>
                    {formatDay(r.createdAt)}
                  </span>
                  <span>
                    <span className={pillClass(r.status)}>
                      {statusLabel(r.status)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {shown.length === 0 && (
            <div className={styles.empty}>
              {rows.length === 0 ? (
                <>
                  <span className={styles.emptyTitle}>No referrals yet</span>
                  <span className={styles.emptyText}>
                    Referrals sent through the website will show here.
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.emptyTitle}>
                    No referrals match these filters
                  </span>
                  <span className={styles.emptyText}>
                    Try a different status or clear the filters.
                  </span>
                  <button type="button" className={styles.btn} onClick={clear}>
                    Clear filters
                  </button>
                </>
              )}
            </div>
          )}
          <div className={styles.tableFoot} role="status">
            Showing {shown.length} of {rows.length} referrals
          </div>
        </div>
      </div>

      {sel && (
        <>
          <div className={styles.shade} onClick={close} aria-hidden="true" />
          <aside
            ref={drawerRef}
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-title"
          >
            <div className={styles.drawerHead}>
              <div className={styles.drawerHeadText}>
                <span className={styles.drawerKicker}>
                  Referral {sel.ref} · received {formatDay(sel.createdAt)}
                </span>
                <h2
                  id="referral-title"
                  ref={titleRef}
                  tabIndex={-1}
                  className={styles.drawerTitle}
                >
                  {sel.participantName}
                </h2>
                <span>
                  <span className={pillClass(sel.status)}>
                    {statusLabel(sel.status)}
                  </span>
                </span>
              </div>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Close"
                onClick={close}
              >
                <CloseXIcon />
              </button>
            </div>
            <div className={styles.drawerBody}>
              <div className={`${styles.group} ${styles.groupTight}`}>
                <h3 className={styles.groupTitle}>Status</h3>
                <div className={styles.segRow}>
                  {REFERRAL_STATUSES.map((s) => (
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
                  <span
                    role="status"
                    className={statusMsg?.ok ? styles.saved : styles.fail}
                  >
                    {statusMsg?.text}
                  </span>
                </div>
              </div>

              {!detail && (
                <p className={styles.emptyText} role="status">
                  Loading the details
                </p>
              )}
              {detail && (
                <>
                  <div className={styles.actionRow}>
                    <a
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      href={telHref(detail.participantPhone)}
                    >
                      <CallIcon />
                      Call participant
                    </a>
                    <a
                      className={styles.btn}
                      href={`mailto:${detail.participantEmail}`}
                    >
                      <EnquiriesIcon size={16} strokeWidth={1.7} />
                      Email
                    </a>
                  </div>

                  <section
                    className={styles.group}
                    aria-labelledby="ref-support"
                  >
                    <h3 id="ref-support" className={styles.groupTitle}>
                      Support requested
                    </h3>
                    <dl className={styles.dl}>
                      <dt>Service</dt>
                      <dd>{serviceLabel(sel.service)}</dd>
                      <dt>Plan type</dt>
                      <dd>{planLabel(sel.planType)}</dd>
                      <dt>Reason</dt>
                      <dd className={styles.dlLong}>{detail.reason}</dd>
                    </dl>
                  </section>

                  <section
                    className={styles.group}
                    aria-labelledby="ref-participant"
                  >
                    <h3 id="ref-participant" className={styles.groupTitle}>
                      Participant
                    </h3>
                    <dl className={styles.dl}>
                      <dt>Name</dt>
                      <dd>{sel.participantName}</dd>
                      <dt>Phone</dt>
                      <dd>{detail.participantPhone}</dd>
                      <dt>Email</dt>
                      <dd>{detail.participantEmail}</dd>
                      <dt>Preferred contact</dt>
                      <dd>
                        {detail.participantPreferredContact ?? "Not provided"}
                      </dd>
                      <dt>Suburb</dt>
                      <dd>{sel.participantSuburb}</dd>
                    </dl>
                  </section>

                  <section className={styles.group} aria-labelledby="ref-by">
                    <h3 id="ref-by" className={styles.groupTitle}>
                      Referred by
                    </h3>
                    <dl className={styles.dl}>
                      <dt>Name</dt>
                      <dd>{sel.referrerName}</dd>
                      <dt>Relationship</dt>
                      <dd>{referrerLabel(sel.referrerType)}</dd>
                      <dt>Organisation</dt>
                      <dd>{sel.referrerOrgRole ?? "Not provided"}</dd>
                      <dt>Phone</dt>
                      <dd>{detail.referrerPhone}</dd>
                      <dt>Email</dt>
                      <dd>{detail.referrerEmail}</dd>
                      <dt>Consent</dt>
                      <dd>Given</dd>
                      <dt>Heard via</dt>
                      <dd>{detail.heardVia ?? "Not provided"}</dd>
                    </dl>
                  </section>

                  <section className={styles.group} aria-labelledby="ref-notes">
                    <h3 id="ref-notes" className={styles.groupTitle}>
                      Internal notes
                    </h3>
                    <label className={styles.noteLabel}>
                      <span className="visually-hidden">Add a note</span>
                      <textarea
                        className={styles.note}
                        placeholder="Add a note for the team. Notes are not shared with the referrer."
                        value={note}
                        maxLength={4000}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </label>
                    <div className={styles.noteActions}>
                      <span
                        role="status"
                        className={noteMsg?.ok ? styles.saved : styles.fail}
                      >
                        {noteMsg?.text}
                      </span>
                      <button
                        type="button"
                        className={styles.btn}
                        onClick={addNote}
                        disabled={busy}
                      >
                        Save note
                      </button>
                    </div>
                    {detail.notes.length > 0 && (
                      <ul className={styles.list} aria-label="Saved notes">
                        {detail.notes.map((n) => (
                          <li key={n.id} className={styles.noteItem}>
                            <p className={styles.noteBody}>{n.body}</p>
                            <span className={styles.noteWhen}>
                              {formatFull(n.at)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section
                    className={styles.group}
                    aria-labelledby="ref-history"
                  >
                    <h3 id="ref-history" className={styles.groupTitle}>
                      Status history
                    </h3>
                    <ul className={styles.list}>
                      {detail.history
                        .filter((h) => h.from !== null)
                        .map((h, i) => (
                          <li key={i} className={styles.historyItem}>
                            <span>
                              {statusLabel(h.to)}, was {statusLabel(h.from!)}
                            </span>
                            <span className={styles.historyWhen}>
                              {formatFull(h.at)}
                            </span>
                          </li>
                        ))}
                      <li className={styles.historyItem}>
                        <span>Received as New</span>
                        <span className={styles.historyWhen}>
                          {formatFull(sel.createdAt)}
                        </span>
                      </li>
                    </ul>
                  </section>
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
