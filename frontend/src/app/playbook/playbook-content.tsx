"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PLAYBOOK_ENTRIES_HTML } from "./playbook-entries";
import "./playbook.css";

/**
 * Everyday HR Playbook.
 *
 * Faithful port of everyday_hr_playbook_v3.html. The 10 playbook entries are
 * very large, fully-static markup blocks; reproducing them as JSX by hand
 * would be ~2,000 lines of literal content with zero behavioural value, so the
 * original entry markup is preserved byte-for-byte in `playbook-entries.ts`
 * and rendered through `dangerouslySetInnerHTML` (exactly how the original
 * page already shipped it as static HTML).
 *
 * The interactive behaviour — `toggleEntry`, `filterEntries`, `searchEntries`,
 * `updateCount`, `scrollToEntry`, `downloadChecklist`, `switchJur` — is
 * re-implemented here verbatim. Because the entries are injected HTML, the
 * accordion / jurisdiction-tab / download handlers are re-bound via event
 * delegation on the entries container, which performs the identical class
 * toggles and `style.display` mutations the original functions did. The
 * search/category filtering still queries the same `.entry` nodes by their
 * `data-search` / `id` attributes and toggles `style.display`, matching the
 * original logic (including the exact `updateCount` "entry/entries" wording).
 *
 * This is an app page with its own `.brand-nav` + `.topbar` chrome (distinct
 * from the shared marketing nav), ported inline. Internal links use Next
 * `<Link>`; LMS links remain plain anchors per the link-rewrite rules.
 */

const CAT_BUTTONS: Array<{ cat: string; label: string }> = [
  { cat: "", label: "All" },
  { cat: "dc", label: "Conversations" },
  { cat: "mh", label: "Wellbeing" },
  { cat: "ab", label: "Absence" },
  { cat: "rd", label: "Redundancy" },
  { cat: "ob", label: "Onboarding" },
  { cat: "pp", label: "Performance" },
  { cat: "db", label: "DEIB" },
  { cat: "cf", label: "Conflict" },
  { cat: "fw", label: "Flex Working" },
  { cat: "of", label: "Offboarding" },
];

const SIDEBAR_ITEMS: Array<{ id: string; icon: string; label: string }> = [
  { id: "dc1", icon: "💬", label: "Difficult Conversations" },
  { id: "mh1", icon: "🌱", label: "Mental Health Support" },
  { id: "ab1", icon: "🏥", label: "Absence & Return to Work" },
  { id: "rd1", icon: "📦", label: "Redundancy" },
  { id: "ob1", icon: "🧱", label: "Onboarding" },
  { id: "pp1", icon: "📊", label: "Poor Performance" },
  { id: "db1", icon: "🌍", label: "DEIB Concerns" },
  { id: "cf1", icon: "🤝", label: "Conflict Between Employees" },
  { id: "fw1", icon: "⏰", label: "Flexible Working" },
  { id: "of1", icon: "🚪", label: "Resignation & Offboarding" },
];

export default function PlaybookContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLSpanElement>(null);
  const catFilterRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);

  // ── updateCount (verbatim) ──────────────────────────────
  function updateCount() {
    const vis = rootRef.current
      ? rootRef.current.querySelectorAll('.entry:not([style*="none"])').length
      : 0;
    if (resultsRef.current)
      resultsRef.current.textContent =
        vis + " entr" + (vis === 1 ? "y" : "ies");
  }

  // ── searchEntries / filterEntries shared core ───────────
  function applyFilter(cat: string, q: string) {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".entry").forEach(function (e) {
      const matchCat = !cat || e.id.startsWith("entry-" + cat);
      const matchQ = !q || (e.dataset.search || "").includes(q);
      e.style.display = matchCat && matchQ ? "block" : "none";
    });
    updateCount();
  }

  function filterEntries(cat: string, target: HTMLElement) {
    catFilterRef.current
      ?.querySelectorAll(".cat-btn")
      .forEach((b) => b.classList.remove("active"));
    target.classList.add("active");
    const q = (searchRef.current?.value || "").toLowerCase();
    applyFilter(cat, q);
  }

  function searchEntries() {
    const q = (searchRef.current?.value || "").toLowerCase();
    const activeCat = catFilterRef.current?.querySelector<HTMLElement>(
      ".cat-btn.active",
    );
    const cat =
      activeCat && activeCat.dataset.cat ? activeCat.dataset.cat : "";
    applyFilter(cat, q);
  }

  function scrollToEntry(id: string, target: HTMLElement) {
    sidebarRef.current
      ?.querySelectorAll(".sidebar-nav-item")
      .forEach((i) => i.classList.remove("active"));
    target.classList.add("active");
    const el = rootRef.current?.querySelector<HTMLElement>("#entry-" + id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const h = el.querySelector(".entry-header");
    if (h && !h.classList.contains("open")) h.classList.add("open");
  }

  // ── Behaviour for the injected entries (toggle / switchJur
  //    / downloadChecklist), re-bound via event delegation. ──
  useEffect(() => {
    const container = entriesRef.current;
    if (!container) return;

    function onClick(ev: MouseEvent) {
      const targetEl = ev.target as HTMLElement;

      // downloadChecklist(eid, title)
      const dl = targetEl.closest<HTMLElement>(".dl-btn");
      if (dl) {
        const entry = dl.closest<HTMLElement>(".entry");
        const eid = entry ? entry.id.replace(/^entry-/, "") : "";
        // The original passed a human title; the file name is derived from it.
        // Recover it from the entry title to keep the same download filename.
        const title =
          entry?.querySelector(".entry-title")?.textContent?.trim() || eid;
        const dataEl = container!.querySelector("#cl-" + eid);
        if (!dataEl) return;
        const lines = (dataEl.textContent || "").split("|");
        const content = lines.join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download =
          title.replace(/[^a-zA-Z0-9]/g, "_") + "_Checklist.txt";
        a.click();
        return;
      }

      // switchJur(btn, eid, jur)
      const jurTab = targetEl.closest<HTMLElement>(".jur-tab");
      if (jurTab) {
        const section = jurTab.closest<HTMLElement>(".es");
        if (!section) return;
        section
          .querySelectorAll(".jur-tab")
          .forEach((t) => t.classList.remove("active"));
        section
          .querySelectorAll(".jur-panel")
          .forEach((p) => p.classList.remove("active"));
        jurTab.classList.add("active");
        // Determine which panel: tabs are in document order matching panels.
        const tabs = Array.from(section.querySelectorAll(".jur-tab"));
        const panels = Array.from(section.querySelectorAll(".jur-panel"));
        const idx = tabs.indexOf(jurTab);
        if (panels[idx]) panels[idx].classList.add("active");
        return;
      }

      // toggleEntry(h)
      const header = targetEl.closest<HTMLElement>(".entry-header");
      if (header) {
        header.classList.toggle("open");
      }
    }

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="playbook-root" ref={rootRef}>
      <nav className="brand-nav">
        <a className="bn-logo" href="https://www.thehrplayhousehub.org/">
          <div className="bn-pill">HR Playhouse</div>
          <div className="bn-text">Hub</div>
        </a>
        <div className="bn-sep" />
        <div className="bn-page">Everyday HR Playbook</div>
        <div className="bn-links">
          <Link className="bn-link" href="/dashboard">
            Dashboard
          </Link>
          <a
            className="bn-link"
            href="https://learn.thehrplayhousehub.org/courses/"
          >
            Courses
          </a>
          <Link className="bn-link" href="/case-study-vault">
            Case Studies
          </Link>
          <Link className="bn-link" href="/playbook">
            Playbook
          </Link>
          <Link className="bn-link" href="/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="bn-link" href="/ai-support">
            AI Support
          </Link>
        </div>
        <a className="bn-cta" href="https://www.thehrplayhousehub.org/">
          Main site
        </a>
      </nav>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="logo">
            <div className="logo-icon">📖</div>
            <div className="logo-text">
              HR <em>Playhouse</em> Hub — Everyday HR Playbook
            </div>
          </div>
          <div className="topbar-right">
            10 situations · UK · Nigeria · USA · Singapore · China · Hong Kong
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag">
            HR Playhouse Hub · Everyday HR Playbook
          </div>
          <div className="hero-title">What to Do When It Happens</div>
          <div className="hero-sub">
            Your grab-it-when-you-need-it guide to the 10 situations every HR
            professional and manager will face. Step-by-step actions, template
            language, legal checklists, and downloadable checklists — all in one
            place.
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-n">10</div>
              <div className="hero-stat-l">Situations Covered</div>
            </div>
            <div>
              <div className="hero-stat-n">7</div>
              <div className="hero-stat-l">Sections Per Entry</div>
            </div>
            <div>
              <div className="hero-stat-n">10</div>
              <div className="hero-stat-l">Downloadable Checklists</div>
            </div>
            <div>
              <div className="hero-stat-n">UK</div>
              <div className="hero-stat-l">Employment Law</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls-bar">
        <div className="controls-inner">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              ref={searchRef}
              className="search-input"
              type="text"
              placeholder="Search situations, topics, keywords..."
              onInput={searchEntries}
            />
          </div>
          <div className="cat-filter" ref={catFilterRef}>
            {CAT_BUTTONS.map((b, i) => (
              <button
                key={b.cat || "all"}
                className={`cat-btn${i === 0 ? " active" : ""}`}
                data-cat={b.cat}
                onClick={(e) => filterEntries(b.cat, e.currentTarget)}
              >
                {b.label}
              </button>
            ))}
          </div>
          <span ref={resultsRef} className="results-info">
            10 entries
          </span>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="main-body">
        {/* SIDEBAR */}
        <nav className="sidebar-nav" ref={sidebarRef}>
          <div className="sidebar-nav-title">📖 All Situations</div>
          {SIDEBAR_ITEMS.map((it) => (
            <a
              key={it.id}
              className="sidebar-nav-item"
              href="javascript:void(0)"
              onClick={(e) => {
                e.preventDefault();
                scrollToEntry(it.id, e.currentTarget);
              }}
            >
              <span className="sidebar-nav-icon">{it.icon}</span>
              {it.label}
            </a>
          ))}
        </nav>

        {/* ENTRIES (verbatim original markup) */}
        <div
          className="entries-col"
          ref={entriesRef}
          dangerouslySetInnerHTML={{ __html: PLAYBOOK_ENTRIES_HTML }}
        />
      </div>
    </div>
  );
}
