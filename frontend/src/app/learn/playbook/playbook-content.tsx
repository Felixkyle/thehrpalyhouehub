"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePlaybook } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import type { PlaybookEntry as ApiPlaybookEntry } from "@/lib/api/types";
import {
  type PlaybookEntry,
  type PlaybookSection,
  type LegalSection,
  type ChecklistSection,
} from "./playbook-data";
import "./playbook.css";

// ── API → render-model adapter ─────────────────────────────────
//
// The backend returns flat PlaybookEntry records (string[] arrays). The
// existing <Entry>/<Section> UI is driven by the richer render model in
// playbook-data.ts (typed sections, jurisdiction tabs, etc.). We adapt each
// API record into that render model so the markup/CSS is preserved exactly,
// while the DATA now comes from the live API instead of the static array.

const STEPS_LABEL = { icon: "📋", text: "Step-by-Step Guide" };
const TEMPLATES_LABEL = {
  icon: "💬",
  text: "What to Say — Template Language",
};
const DONTS_LABEL = { icon: "✗", text: "Common Mistakes to Avoid" };
const LEGAL_LABEL = {
  icon: "⚖️",
  text: "Legal & Compliance — Select Jurisdiction",
};
const MVHR_LABEL = { icon: "👥", text: "Manager vs HR Responsibilities" };
const ESC_LABEL = { icon: "🚨", text: "When to Escalate" };

// Jurisdiction name → flag emoji. Falls back to a neutral globe.
const JUR_FLAGS: Record<string, string> = {
  uk: "🇬🇧",
  "united kingdom": "🇬🇧",
  nigeria: "🇳🇬",
  usa: "🇺🇸",
  "united states": "🇺🇸",
  us: "🇺🇸",
  singapore: "🇸🇬",
  china: "🇨🇳",
  "hong kong": "🇭🇰",
};

function jurFlag(name: string): string {
  return JUR_FLAGS[name.trim().toLowerCase()] ?? "🌍";
}

const JUR_NOTE =
  "This is general guidance only and does not constitute legal advice. Always consult a qualified employment lawyer in the relevant jurisdiction for specific situations.";

function adaptEntry(api: ApiPlaybookEntry): PlaybookEntry {
  const sections: PlaybookSection[] = [];

  if (api.steps.length) {
    sections.push({
      type: "steps",
      label: STEPS_LABEL,
      steps: api.steps.map((desc, i) => ({ n: i + 1, title: "", desc })),
    });
  }

  if (api.templates.length) {
    sections.push({
      type: "templates",
      label: TEMPLATES_LABEL,
      blocks: api.templates.map((t) => ({ label: t.name, text: t.body })),
    });
  }

  if (api.do_list.length || api.dont_list.length) {
    sections.push({
      type: "donts",
      label: DONTS_LABEL,
      doTitle: "✓ Do this",
      dontTitle: "✗ Never do this",
      do: api.do_list,
      dont: api.dont_list,
    });
  }

  if (api.legal.length) {
    sections.push({
      type: "legal",
      label: LEGAL_LABEL,
      tabs: api.legal.map((l) => ({
        code: l.jurisdiction,
        flag: jurFlag(l.jurisdiction),
        name: l.jurisdiction,
      })),
      panels: api.legal.map((l) => ({
        code: l.jurisdiction,
        legalItems: l.items.map((text) => ({
          icon: "•",
          strongLabel: "",
          text,
        })),
        note: JUR_NOTE,
      })),
    });
  }

  if (api.manager_guidance.length || api.hr_guidance.length) {
    sections.push({
      type: "mvhr",
      label: MVHR_LABEL,
      manager: { title: "👥 Manager responsible for", items: api.manager_guidance },
      hr: { title: "📋 HR responsible for", items: api.hr_guidance },
    });
  }

  if (api.escalation_flags.length) {
    sections.push({
      type: "escalation",
      label: ESC_LABEL,
      items: api.escalation_flags,
    });
  }

  if (api.checklist_url) {
    sections.push({
      type: "checklist",
      // payload is pipe-delimited lines for the in-browser .txt download;
      // the API exposes a URL instead, so we link to it directly.
      payload: api.checklist_url,
      buttonLabel: "↓ Download Checklist",
    });
  }

  const dataSearch = [
    api.title,
    api.category,
    api.summary,
    ...api.pills,
  ]
    .join(" ")
    .toLowerCase();

  // The category-filter buttons match on the entry id's leading prefix (e.g.
  // "dc" for "dc1"). The API id already follows that convention.
  return {
    id: api.id,
    catClass: "",
    dataTitle: api.title.toLowerCase(),
    dataCat: api.id,
    dataSearch,
    icon: api.icon,
    catBadge: api.category,
    title: api.title,
    summary: api.summary,
    pills: api.pills,
    sections,
  };
}

/**
 * Everyday HR Playbook.
 *
 * Real React implementation of everyday_hr_playbook_v3.html. The 10 entries
 * are now structured data in `playbook-data.ts` and rendered by the <Entry>
 * component below — there is no `dangerouslySetInnerHTML` anywhere. The
 * accordion (toggleEntry), jurisdiction tabs (switchJur), checklist download
 * (downloadChecklist), category filtering (filterEntries), search
 * (searchEntries) and sidebar scroll (scrollToEntry) are all implemented in
 * real React state — no class-list hacks, no event delegation, no
 * `style.display` mutations from outside React.
 *
 * The rendered DOM keeps the same element nesting and the same CSS class
 * names that playbook.css already styles (notably the `.entry-header.open +
 * .entry-body` selector that drives the accordion, the `.jur-panel.active`
 * selector for jurisdiction tabs, and all `.es`, `.step*`, `.template-*`,
 * `.dont-*`, `.legal-*`, `.mvhr-*`, `.esc*`, `.dl-btn` classes).
 *
 * This is an app page with its own `.brand-nav` + `.topbar` chrome (distinct
 * from the shared marketing nav). Internal links use Next `<Link>`; LMS
 * links remain plain anchors per the link-rewrite rules.
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

function downloadChecklist(entry: PlaybookEntry, section: ChecklistSection) {
  // `payload` now holds the API-provided checklist URL. Open it directly.
  const a = document.createElement("a");
  a.href = section.payload;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = entry.title.replace(/[^a-zA-Z0-9]/g, "_") + "_Checklist";
  a.click();
}

// ── <Entry> component ──────────────────────────────────────────
//
// Renders a single playbook entry with the original DOM/class structure.
// Open/closed state and the active jurisdiction tab live as React state.

type EntryHandle = {
  id: string;
  open: () => void;
  scrollIntoView: () => void;
};

function Entry(props: {
  entry: PlaybookEntry;
  visible: boolean;
  registerHandle: (handle: EntryHandle) => void;
}) {
  const { entry, visible, registerHandle } = props;
  const [open, setOpen] = useState(false);
  // One active jurisdiction index per legal section in this entry. Keyed
  // by the section's index within `entry.sections`.
  const [activeJur, setActiveJur] = useState<Record<number, number>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  // Expose imperative handles for the sidebar's scrollToEntry behaviour.
  // Stable across renders for this entry id.
  const handleRegistered = useRef(false);
  if (!handleRegistered.current) {
    handleRegistered.current = true;
    registerHandle({
      id: entry.id,
      open: () => setOpen(true),
      scrollIntoView: () => {
        rootRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
    });
  }

  return (
    <div
      ref={rootRef}
      className={`entry ${entry.catClass}`}
      id={`entry-${entry.id}`}
      data-title={entry.dataTitle}
      data-cat={entry.dataCat}
      data-search={entry.dataSearch}
      style={{ display: visible ? "block" : "none" }}
    >
      <div
        className={`entry-header${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="entry-top">
          <div className="entry-icon">{entry.icon}</div>
          <div className="entry-meta">
            <div className="entry-cat-badge">{entry.catBadge}</div>
            <div className="entry-title">{entry.title}</div>
            <div className="entry-summary">{entry.summary}</div>
            <div className="entry-pills">
              {entry.pills.map((p) => (
                <span key={p} className="entry-pill">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="entry-chev">▼</div>
        </div>
      </div>
      <div className="entry-body">
        {entry.sections.map((section, sIdx) => (
          <Section
            key={sIdx}
            entry={entry}
            section={section}
            sectionIndex={sIdx}
            activeJurIdx={activeJur[sIdx] ?? 0}
            setActiveJurIdx={(idx) =>
              setActiveJur((s) => ({ ...s, [sIdx]: idx }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function Section(props: {
  entry: PlaybookEntry;
  section: PlaybookSection;
  sectionIndex: number;
  activeJurIdx: number;
  setActiveJurIdx: (idx: number) => void;
}) {
  const { entry, section, activeJurIdx, setActiveJurIdx } = props;

  switch (section.type) {
    case "steps":
      return (
        <div className="es">
          <EsLabel icon={section.label.icon} text={section.label.text} />
          <div className="steps-list">
            {section.steps.map((s) => (
              <div key={s.n} className="step">
                <div className="step-n">{s.n}</div>
                <div className="step-body">
                  {s.title ? (
                    <div className="step-title">{s.title}</div>
                  ) : null}
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "templates":
      return (
        <div className="es">
          <EsLabel icon={section.label.icon} text={section.label.text} />
          {section.blocks.map((b, i) => (
            <div key={i} className="template-block">
              <div className="template-label">{b.label}</div>
              <div className="template-text">{b.text}</div>
              {b.note ? <div className="template-note">{b.note}</div> : null}
            </div>
          ))}
        </div>
      );

    case "donts":
      return (
        <div className="es">
          <EsLabel icon={section.label.icon} text={section.label.text} />
          <div className="dont-grid">
            <div className="dont-col do">
              <div className="dont-col-title">{section.doTitle}</div>
              {section.do.map((item, i) => (
                <div key={i} className="dont-item">
                  <span className="dont-item-dot">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="dont-col dont">
              <div className="dont-col-title">{section.dontTitle}</div>
              {section.dont.map((item, i) => (
                <div key={i} className="dont-item">
                  <span className="dont-item-dot">✗</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "legal":
      return (
        <LegalSectionView
          entry={entry}
          section={section}
          activeIdx={activeJurIdx}
          onSelect={setActiveJurIdx}
        />
      );

    case "mvhr":
      return (
        <div className="es">
          <EsLabel icon={section.label.icon} text={section.label.text} />
          <div className="mvhr-grid">
            <div className="mvhr-col mgr">
              <div className="mvhr-title">{section.manager.title}</div>
              {section.manager.items.map((it, i) => (
                <div key={i} className="mvhr-item">
                  <div className="mvhr-dot" />
                  {it}
                </div>
              ))}
            </div>
            <div className="mvhr-col hr">
              <div className="mvhr-title">{section.hr.title}</div>
              {section.hr.items.map((it, i) => (
                <div key={i} className="mvhr-item">
                  <div className="mvhr-dot" />
                  {it}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "escalation":
      return (
        <div className="es">
          <EsLabel icon={section.label.icon} text={section.label.text} />
          <div className="escalation-list">
            {section.items.map((t, i) => (
              <div key={i} className="esc-item">
                <div className="esc-icon">🚨</div>
                <div className="esc-text">{t}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "checklist":
      return (
        <div className="es">
          <button
            type="button"
            className="dl-btn"
            onClick={() => downloadChecklist(entry, section)}
          >
            {section.buttonLabel}
          </button>
        </div>
      );
  }
}

function EsLabel(props: { icon: string; text: string }) {
  return (
    <div className="es-label">
      <span className="es-icon">{props.icon}</span>
      <span style={{ color: "inherit" }}>{props.text}</span>
    </div>
  );
}

function LegalSectionView(props: {
  entry: PlaybookEntry;
  section: LegalSection;
  activeIdx: number;
  onSelect: (idx: number) => void;
}) {
  const { section, activeIdx, onSelect } = props;
  const activePanel = section.panels[activeIdx] ?? section.panels[0];
  return (
    <div className="es">
      <EsLabel icon={section.label.icon} text={section.label.text} />
      <div className="jur-tabs">
        {section.tabs.map((t, i) => (
          <button
            key={t.code}
            type="button"
            className={`jur-tab${i === activeIdx ? " active" : ""}`}
            onClick={() => onSelect(i)}
          >
            {t.flag} {t.name}
          </button>
        ))}
      </div>
      {activePanel ? (
        <div className="jur-panel active">
          <div className="legal-grid">
            {activePanel.legalItems.map((item, i) => (
              <div key={i} className="legal-item">
                <div className="legal-icon">{item.icon}</div>
                <div className="legal-text">
                  {item.strongLabel ? <strong>{item.strongLabel}</strong> : null}
                  {item.strongLabel ? " " : null}
                  {item.text}
                </div>
              </div>
            ))}
          </div>
          <div className="jur-note">{activePanel.note}</div>
        </div>
      ) : null}
    </div>
  );
}

export default function PlaybookContent() {
  const { data, isLoading, isError, error, refetch } = usePlaybook();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);

  // Adapt the live API entries into the render model the UI expects.
  const entries = useMemo<PlaybookEntry[]>(
    () => (data?.entries ?? []).map(adaptEntry),
    [data],
  );
  // Imperative handles registered by each <Entry>, keyed by entry id, so
  // sidebar scrollToEntry can both open and scroll the target without
  // climbing back through the DOM.
  const handlesRef = useRef<Map<string, EntryHandle>>(new Map());

  function registerHandle(handle: EntryHandle) {
    handlesRef.current.set(handle.id, handle);
  }

  // ── Filtering (filterEntries / searchEntries / updateCount) ────
  //
  // Preserves the exact original logic: matchCat = !cat || entry id starts
  // with `${cat}` (the data-cat in source was always "{cat}1", and entry
  // ids in source were `entry-{cat}1`; the original filter used
  // `id.startsWith('entry-' + cat)`). We mirror that by checking the
  // entry's `dataCat` field starts with the selected category prefix.
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return entries.map((entry) => {
      const matchCat = !activeCat || entry.dataCat.startsWith(activeCat);
      const matchQ = !q || entry.dataSearch.includes(q);
      return { entry, visible: matchCat && matchQ };
    });
  }, [entries, query, activeCat]);

  const visibleCount = filtered.filter((f) => f.visible).length;
  const resultsLabel =
    visibleCount + " entr" + (visibleCount === 1 ? "y" : "ies");

  function scrollToEntry(id: string) {
    setActiveSidebar(id);
    const handle = handlesRef.current.get(id);
    if (!handle) return;
    handle.open();
    handle.scrollIntoView();
  }

  return (
    <div className="playbook-root">
      <nav className="brand-nav">
        <a className="bn-logo" href="https://www.thehrplayhousehub.org/">
          <div className="bn-pill">HR Playhouse</div>
          <div className="bn-text">Hub</div>
        </a>
        <div className="bn-sep" />
        <div className="bn-page">Everyday HR Playbook</div>
        <div className="bn-links">
          <Link className="bn-link" href="/learn/dashboard">
            Dashboard
          </Link>
          <a
            className="bn-link"
            href="/learn/my-courses"
          >
            Courses
          </a>
          <Link className="bn-link" href="/learn/case-study-vault">
            Case Studies
          </Link>
          <Link className="bn-link" href="/learn/playbook">
            Playbook
          </Link>
          <Link className="bn-link" href="/learn/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="bn-link" href="/learn/ai-support">
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
              className="search-input"
              type="text"
              placeholder="Search situations, topics, keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="cat-filter">
            {CAT_BUTTONS.map((b) => (
              <button
                key={b.cat || "all"}
                type="button"
                className={`cat-btn${b.cat === activeCat ? " active" : ""}`}
                data-cat={b.cat}
                onClick={() => setActiveCat(b.cat)}
              >
                {b.label}
              </button>
            ))}
          </div>
          <span className="results-info">{resultsLabel}</span>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="main-body">
        {/* SIDEBAR */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-title">📖 All Situations</div>
          {SIDEBAR_ITEMS.map((it) => (
            <a
              key={it.id}
              className={`sidebar-nav-item${
                activeSidebar === it.id ? " active" : ""
              }`}
              href={`#entry-${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToEntry(it.id);
              }}
            >
              <span className="sidebar-nav-icon">{it.icon}</span>
              {it.label}
            </a>
          ))}
        </nav>

        {/* ENTRIES */}
        <div className="entries-col">
          {isLoading ? (
            <div className="entry" style={{ padding: "40px", textAlign: "center" }}>
              <div className="entry-summary">Loading playbook…</div>
            </div>
          ) : isError ? (
            <div className="entry" style={{ padding: "40px", textAlign: "center" }}>
              <div className="entry-title">Couldn’t load the playbook</div>
              <div className="entry-summary">
                {error instanceof ApiError
                  ? error.message
                  : "Something went wrong while loading entries."}
              </div>
              <button
                type="button"
                className="dl-btn"
                style={{ marginTop: 16 }}
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="entry" style={{ padding: "40px", textAlign: "center" }}>
              <div className="entry-summary">No playbook entries available yet.</div>
            </div>
          ) : (
            filtered.map(({ entry, visible }) => (
              <Entry
                key={entry.id}
                entry={entry}
                visible={visible}
                registerHandle={registerHandle}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
