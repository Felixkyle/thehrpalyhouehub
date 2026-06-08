"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CASES,
  INDUSTRY_OPTIONS,
  TOPICS,
  type CaseStudy,
  type Difficulty,
  type ScenarioParagraph,
  type TopicKey,
} from "./case-study-vault-data";
import "./case-study-vault.css";

/**
 * Case Study Vault.
 *
 * Real React port of case_study_vault_v2.html — 32 case studies grouped
 * into 8 topic areas. Both the card grid and the modal detail view are
 * driven by the typed `CASES` data in `case-study-vault-data.ts`. There
 * is no `dangerouslySetInnerHTML` and no inline-handler dispatcher; the
 * filters, modal open/close, escape-to-close, body-scroll lock, and
 * download-summary behaviour are all real React state/handlers.
 *
 * DOM class names mirror the original page so case-study-vault.css still
 * styles everything correctly (.topic-section, .case-card, .case-card-top,
 * .case-tags, .modal-overlay, .modal, .modal-tags, .case-section, etc.).
 */

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

function ScenarioBody(props: { paragraphs: ScenarioParagraph[] }) {
  return (
    <Fragment>
      {props.paragraphs.map((p, i) => (
        <p key={i}>
          {typeof p === "string"
            ? p
            : p.map((seg, j) =>
                seg.italic ? (
                  <em key={j}>{seg.text}</em>
                ) : (
                  <Fragment key={j}>{seg.text}</Fragment>
                ),
              )}
        </p>
      ))}
    </Fragment>
  );
}

function CaseCard(props: { c: CaseStudy; onOpen: (id: string) => void }) {
  const { c, onOpen } = props;
  return (
    <div
      className={`case-card${c.featured ? " featured" : " "}`}
      data-topic={c.topic}
      data-diff={c.difficulty}
      data-industry={c.industryKey}
      data-title={c.searchTitle}
      data-org={c.searchOrg}
      data-preview={c.searchPreview}
      onClick={() => onOpen(c.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(c.id);
        }
      }}
    >
      <div className="case-card-top">
        <div className="case-tags">
          <span className={`diff-badge diff-${c.difficulty}`}>
            {DIFFICULTY_LABEL[c.difficulty]}
          </span>
          <span className="industry-badge">{c.industry}</span>
          {c.featured ? <span className="feat-badge">Featured</span> : null}
        </div>
        <div className="case-title">{c.title}</div>
        <div className="case-org">{c.orgLine}</div>
      </div>
      <div className="case-card-bottom">
        <div className="case-preview">{c.preview}</div>
        <div className="case-card-footer">
          <div className="case-sections">
            <div className="case-section-dot" />
            <div className="case-section-dot" />
            <div className="case-section-dot" />
            <div className="case-section-dot" />
            <div className="case-section-dot" />
          </div>
          <span className="read-link">Read case →</span>
        </div>
      </div>
    </div>
  );
}

function CaseDetail(props: { c: CaseStudy }) {
  const { c } = props;
  return (
    <div className="case-modal" style={{ display: "block" }}>
      <div className="modal-header">
        <div className="modal-tags">
          <span className={`diff-badge diff-${c.difficulty}`}>
            {DIFFICULTY_LABEL[c.difficulty]}
          </span>
          <span className="industry-badge">{c.industry}</span>
          <span className="industry-badge">{c.topicLabel}</span>
        </div>
        <div className="modal-title">{c.title}</div>
        <div className="modal-org">{c.orgLine}</div>
      </div>
      <div className="modal-body">
        <div className="case-section">
          <div className="case-section-label">Scenario &amp; Background</div>
          <div className="case-section-body">
            <ScenarioBody paragraphs={c.scenario} />
          </div>
        </div>

        <div className="case-section">
          <div className="case-section-label">Challenge &amp; Decision Points</div>
          <div className="case-section-body">
            {c.challenge.kind === "list" ? (
              <ul>
                {c.challenge.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              c.challenge.paragraphs.map((p, i) => <p key={i}>{p}</p>)
            )}
          </div>
        </div>

        <div className="case-section">
          <div className="pause-box">
            <div className="pause-label">Pause &amp; Reflect</div>
            {c.pauseQs.map((q, i) => (
              <div key={i} className="pause-q">
                {q}
              </div>
            ))}
          </div>
        </div>

        <div className="case-section">
          <div className="case-section-label">Outcome &amp; Results</div>
          <div className="outcome-box">
            {c.outcomes.map((o, i) => (
              <div key={i} className="outcome-item">
                {o}
              </div>
            ))}
          </div>
        </div>

        <div className="case-section">
          <div className="case-section-label">Lessons Learned</div>
          <div className="lessons-box">
            <div className="lessons-label">Key Lessons</div>
            {c.lessons.map((l, i) => (
              <div key={i} className="lesson-item">
                <div className="lesson-dot" />
                {l}
              </div>
            ))}
          </div>
        </div>

        <div className="case-section">
          <div className="case-section-label">Application Questions</div>
          <div className="appq-box">
            <div className="appq-label">Apply the Learning</div>
            {c.appqs.map((a, i) => (
              <div key={i} className="appq-item">
                {a}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="download-btn"
          onClick={() => downloadSummary(c)}
        >
          ↓ Download Case Summary
        </button>
      </div>
    </div>
  );
}

function plainScenario(paragraphs: ScenarioParagraph[]): string {
  return paragraphs
    .map((p) =>
      typeof p === "string" ? p : p.map((seg) => seg.text).join(""),
    )
    .join("\n\n");
}

function downloadSummary(c: CaseStudy) {
  const diff = DIFFICULTY_LABEL[c.difficulty];
  const lessonsText = c.lessons.map((l) => "• " + l.trim()).join("\n");
  const appqText = c.appqs
    .map((a, i) => `${i + 1}. ${a.trim()}`)
    .join("\n");
  const content = [
    "HR PLAYHOUSE HUB — CASE STUDY VAULT",
    "====================================",
    "",
    c.title,
    `${c.org} | ${diff} | ${c.industry} | ${c.topicLabel}`,
    "",
    "SCENARIO",
    "--------",
    plainScenario(c.scenario).trim(),
    "",
    "KEY LESSONS",
    "-----------",
    lessonsText,
    "",
    "APPLICATION QUESTIONS",
    "---------------------",
    appqText,
    "",
    "Source: HR Playhouse Hub Case Study Vault",
    "learn.thehrplayhousehub.org",
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download =
    c.title.replace(/[“”"]/g, "").replace(/[^a-zA-Z0-9]/g, "_") +
    "_CaseStudy.txt";
  a.click();
}

export default function CaseStudyVaultContent() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<"" | TopicKey>("");
  const [difficulty, setDifficulty] = useState<"" | Difficulty>("");
  const [industryKey, setIndustryKey] = useState("");
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);

  // ── FILTER (mirrors original applyFilters) ───────────────────
  // q matches data-title / data-org / data-preview / data-industry
  // (the source includes industry in the search to keep query-only
  // typing of e.g. "saas" reachable). Topic and difficulty are exact
  // matches; the industry select uses contains().
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const industryLower = industryKey.toLowerCase();
    return CASES.map((c) => {
      const matchQ =
        !q ||
        c.searchTitle.includes(q) ||
        c.searchOrg.includes(q) ||
        c.searchPreview.includes(q) ||
        c.industryKey.includes(q);
      const matchTopic = !topic || c.topic === topic;
      const matchDiff = !difficulty || c.difficulty === difficulty;
      const matchInd = !industryLower || c.industryKey.includes(industryLower);
      return { c, visible: matchQ && matchTopic && matchDiff && matchInd };
    });
  }, [query, topic, difficulty, industryKey]);

  const visibleCases = filtered.filter((f) => f.visible);
  const count = visibleCases.length;
  const resultsLabel = count + " case" + (count === 1 ? "" : "s");

  const visibleByTopic = useMemo(() => {
    const map = new Map<TopicKey, CaseStudy[]>();
    for (const t of TOPICS) map.set(t.key, []);
    for (const { c, visible } of filtered) {
      if (!visible) continue;
      if (topic && c.topic !== topic) continue;
      map.get(c.topic)?.push(c);
    }
    return map;
  }, [filtered, topic]);

  const openCase = openCaseId ? CASES.find((c) => c.id === openCaseId) : null;

  // ── Body scroll lock + Escape-to-close, matching original ────
  useEffect(() => {
    if (!openCase) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCaseId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [openCase]);

  function clearFilters() {
    setQuery("");
    setTopic("");
    setDifficulty("");
    setIndustryKey("");
  }

  return (
    <div className="csv-root">
      <nav className="brand-nav">
        <a className="bn-logo" href="https://www.thehrplayhousehub.org/">
          <div className="bn-pill">HR Playhouse</div>
          <div className="bn-text">Hub</div>
        </a>
        <div className="bn-sep" />
        <div className="bn-page" id="bn-page-title">
          Case Study Vault
        </div>
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
            <div className="logo-icon">📚</div>
            <div className="logo-text">
              HR <em>Playhouse</em> Hub — Case Study Vault
            </div>
          </div>
          <div className="topbar-right">32 case studies · 8 topics</div>
        </div>
      </div>

      {/* HERO */}
      <div className="vault-hero">
        <div className="vault-hero-inner">
          <div className="vault-hero-tag">
            HR Playhouse Hub · Case Study Vault
          </div>
          <div className="vault-hero-title">
            Real Decisions. Real Consequences.
          </div>
          <div className="vault-hero-sub">
            A library of 32 research-grounded HR case studies across 8 topic
            areas. Each case includes scenario, decision points, pause &amp;
            reflect questions, outcome analysis, lessons learned, and
            application questions.
          </div>
          <div className="vault-stats">
            <div className="vault-stat">
              <div className="vault-stat-n">32</div>
              <div className="vault-stat-l">Case Studies</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-n">8</div>
              <div className="vault-stat-l">Topic Areas</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-n">8</div>
              <div className="vault-stat-l">Featured Cases</div>
            </div>
            <div className="vault-stat">
              <div className="vault-stat-n">3</div>
              <div className="vault-stat-l">Difficulty Levels</div>
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
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search cases, organisations, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            id="filter-topic"
            className="filter-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value as "" | TopicKey)}
          >
            <option value="">All topics</option>
            {TOPICS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            id="filter-diff"
            className="filter-select"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "" | Difficulty)
            }
          >
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <select
            id="filter-industry"
            className="filter-select"
            value={industryKey}
            onChange={(e) => setIndustryKey(e.target.value)}
          >
            <option value="">All industries</option>
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span id="results-count" className="results-count">
            {resultsLabel}
          </span>
          <button
            type="button"
            className="clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {/* VAULT BODY */}
      <div className="vault-body">
        {TOPICS.map((t) => {
          const cases = visibleByTopic.get(t.key) ?? [];
          if (topic && topic !== t.key) return null;
          if (cases.length === 0) return null;
          return (
            <div
              key={t.key}
              className="topic-section"
              data-topic={t.key}
            >
              <div className="topic-header">
                <div className={`topic-icon ${t.iconClass}`}>{t.icon}</div>
                <div className="topic-name">{t.label}</div>
                <div className="topic-count">{cases.length} cases</div>
              </div>
              <div className="cases-grid">
                {cases.map((c) => (
                  <CaseCard
                    key={c.id}
                    c={c}
                    onOpen={(id) => setOpenCaseId(id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {count === 0 ? (
          <div
            id="no-results"
            className="no-results"
            style={{ display: "block" }}
          >
            <div className="no-results-icon">🔎</div>
            <div className="no-results-title">
              No cases match your filters
            </div>
            <div>Try adjusting your search or clearing the filters</div>
          </div>
        ) : null}
      </div>

      {/* MODAL OVERLAY */}
      <div
        id="case-modal-overlay"
        className={`modal-overlay${openCase ? "" : " hidden"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenCaseId(null);
        }}
      >
        <div className="modal">
          <button
            type="button"
            className="modal-close"
            onClick={() => setOpenCaseId(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div id="case-modal-content">
            {openCase ? <CaseDetail c={openCase} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
