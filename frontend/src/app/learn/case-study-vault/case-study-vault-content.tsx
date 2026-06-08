"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCaseStudies, useCaseStudy } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import type { CaseStudySummary, CaseStudyDetail } from "@/lib/api/types";
import {
  INDUSTRY_OPTIONS,
  TOPICS,
  type Difficulty,
  type TopicKey,
} from "./case-study-vault-data";
import "./case-study-vault.css";

/**
 * Case Study Vault.
 *
 * Wired to the real backend: the card grid is driven by
 * `useCaseStudies(filters)` ({ case_studies: CaseStudySummary[] }) and the
 * detail modal by `useCaseStudy(id)` ({ ...CaseStudyDetail }). The static
 * `CASES` array is no longer imported — only the UI config (`TOPICS` for
 * topic grouping/labels/icons, `INDUSTRY_OPTIONS` for the filter select)
 * still comes from the local data module.
 *
 * Filters (search/topic/difficulty/industry) are passed through to the API
 * as { q, topic, difficulty, industry_key }. DOM class names mirror the
 * original page so case-study-vault.css still styles everything correctly.
 */

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.key, t.label]),
);

function CaseCard(props: { c: CaseStudySummary; onOpen: (id: string) => void }) {
  const { c, onOpen } = props;
  const diffLabel = DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty;
  return (
    <div
      className={`case-card${c.featured ? " featured" : " "}`}
      data-topic={c.topic}
      data-diff={c.difficulty}
      data-industry={c.industry_key}
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
          <span className={`diff-badge diff-${c.difficulty}`}>{diffLabel}</span>
          <span className="industry-badge">{c.industry}</span>
          {c.featured ? <span className="feat-badge">Featured</span> : null}
        </div>
        <div className="case-title">{c.title}</div>
        <div className="case-org">{c.org_line}</div>
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

function CaseDetail(props: { c: CaseStudyDetail }) {
  const { c } = props;
  const diffLabel = DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty;
  const topicLabel = TOPIC_LABEL[c.topic] ?? c.topic;
  const challengeItems = c.challenge.items ?? [];
  const challengeParagraphs = c.challenge.paragraphs ?? [];
  return (
    <div className="case-modal" style={{ display: "block" }}>
      <div className="modal-header">
        <div className="modal-tags">
          <span className={`diff-badge diff-${c.difficulty}`}>{diffLabel}</span>
          <span className="industry-badge">{c.industry}</span>
          <span className="industry-badge">{topicLabel}</span>
        </div>
        <div className="modal-title">{c.title}</div>
        <div className="modal-org">{c.org_line}</div>
      </div>
      <div className="modal-body">
        <div className="case-section">
          <div className="case-section-label">Scenario &amp; Background</div>
          <div className="case-section-body">
            {c.scenario.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="case-section">
          <div className="case-section-label">Challenge &amp; Decision Points</div>
          <div className="case-section-body">
            {challengeItems.length > 0 ? (
              <ul>
                {challengeItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              challengeParagraphs.map((p, i) => <p key={i}>{p}</p>)
            )}
          </div>
        </div>

        <div className="case-section">
          <div className="pause-box">
            <div className="pause-label">Pause &amp; Reflect</div>
            {c.reflect_questions.map((q, i) => (
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
            {c.application_questions.map((a, i) => (
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

function downloadSummary(c: CaseStudyDetail) {
  const diff = DIFFICULTY_LABEL[c.difficulty] ?? c.difficulty;
  const topicLabel = TOPIC_LABEL[c.topic] ?? c.topic;
  const lessonsText = c.lessons.map((l) => "• " + l.trim()).join("\n");
  const appqText = c.application_questions
    .map((a, i) => `${i + 1}. ${a.trim()}`)
    .join("\n");
  const content = [
    "HR PLAYHOUSE HUB — CASE STUDY VAULT",
    "====================================",
    "",
    c.title,
    `${c.org_line} | ${diff} | ${c.industry} | ${topicLabel}`,
    "",
    "SCENARIO",
    "--------",
    c.scenario.paragraphs.join("\n\n").trim(),
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

  // ── LIST QUERY: filters flow straight to the API ─────────────
  const debouncedQuery = useDebounced(query, 250);
  const listFilters = useMemo(
    () => ({
      q: debouncedQuery.trim() || undefined,
      topic: topic || undefined,
      difficulty: difficulty || undefined,
      industry_key: industryKey || undefined,
    }),
    [debouncedQuery, topic, difficulty, industryKey],
  );

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
    refetch: refetchList,
  } = useCaseStudies(listFilters);

  const cases = useMemo(() => listData?.case_studies ?? [], [listData]);
  const count = cases.length;
  const resultsLabel = count + " case" + (count === 1 ? "" : "s");

  // Group the API results by topic, preserving the TOPICS order.
  const casesByTopic = useMemo(() => {
    const map = new Map<string, CaseStudySummary[]>();
    for (const t of TOPICS) map.set(t.key, []);
    for (const c of cases) {
      if (!map.has(c.topic)) map.set(c.topic, []);
      map.get(c.topic)!.push(c);
    }
    return map;
  }, [cases]);

  // ── DETAIL QUERY: fetched on demand when a card is opened ────
  const {
    data: openCase,
    isLoading: detailLoading,
    isError: detailError,
    error: detailErr,
    refetch: refetchDetail,
  } = useCaseStudy(openCaseId);

  const modalOpen = openCaseId !== null;

  // ── Body scroll lock + Escape-to-close, matching original ────
  useEffect(() => {
    if (!modalOpen) return;
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
  }, [modalOpen]);

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
        {listLoading ? (
          <div className="no-results" style={{ display: "block" }}>
            <div className="no-results-icon">⏳</div>
            <div className="no-results-title">Loading case studies…</div>
            <div>Fetching the vault from the server</div>
          </div>
        ) : listError ? (
          <div className="no-results" style={{ display: "block" }}>
            <div className="no-results-icon">⚠</div>
            <div className="no-results-title">
              Couldn&apos;t load case studies
            </div>
            <div>
              {listErr instanceof ApiError
                ? listErr.message
                : "Something went wrong. Please try again."}
            </div>
            <button
              type="button"
              className="clear-btn"
              style={{ marginTop: 16 }}
              onClick={() => refetchList()}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {TOPICS.map((t) => {
              const topicCases = casesByTopic.get(t.key) ?? [];
              if (topic && topic !== t.key) return null;
              if (topicCases.length === 0) return null;
              return (
                <div
                  key={t.key}
                  className="topic-section"
                  data-topic={t.key}
                >
                  <div className="topic-header">
                    <div className={`topic-icon ${t.iconClass}`}>{t.icon}</div>
                    <div className="topic-name">{t.label}</div>
                    <div className="topic-count">
                      {topicCases.length} cases
                    </div>
                  </div>
                  <div className="cases-grid">
                    {topicCases.map((c) => (
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
          </>
        )}
      </div>

      {/* MODAL OVERLAY */}
      <div
        id="case-modal-overlay"
        className={`modal-overlay${modalOpen ? "" : " hidden"}`}
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
            {modalOpen ? (
              detailLoading ? (
                <div className="case-modal" style={{ display: "block" }}>
                  <div className="modal-body">
                    <div className="no-results" style={{ display: "block" }}>
                      <div className="no-results-icon">⏳</div>
                      <div className="no-results-title">Loading case…</div>
                    </div>
                  </div>
                </div>
              ) : detailError ? (
                <div className="case-modal" style={{ display: "block" }}>
                  <div className="modal-body">
                    <div className="no-results" style={{ display: "block" }}>
                      <div className="no-results-icon">⚠</div>
                      <div className="no-results-title">
                        Couldn&apos;t load this case
                      </div>
                      <div>
                        {detailErr instanceof ApiError
                          ? detailErr.message
                          : "Something went wrong. Please try again."}
                      </div>
                      <button
                        type="button"
                        className="clear-btn"
                        style={{ marginTop: 16 }}
                        onClick={() => refetchDetail()}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              ) : openCase ? (
                <CaseDetail c={openCase} />
              ) : null
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small debounce so each keystroke doesn't fire a new list request. */
function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
