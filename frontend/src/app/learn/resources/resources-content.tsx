"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useResources, useSubmitResource } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import type { Resource } from "@/lib/api/types";
import "./resources.css";

/**
 * Resources Library.
 *
 * Wired to the real backend.
 * The category filter + search box drive `useResources({ category, q })`; the
 * server returns the matching `Resource[]`. The "submit a resource" strip is a
 * real form posting through `useSubmitResource()`.
 *
 * The API `Resource` shape differs slightly from the old mock (snake_case
 * fields, numeric `year`/`pages`, `download_url`/`open_url` instead of `file`).
 * Per-category presentation tokens (icon background / tag colours) are derived
 * locally from `category` so the existing CSS look is preserved.
 */

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "policy", label: "Policy & Toolkit" },
  { key: "research", label: "Research & Reports" },
  { key: "workshop", label: "Workshop Materials" },
  { key: "template", label: "Templates" },
];

// Presentation tokens per category — derived locally so the original look is
// preserved even though the API does not return colours.
const CATEGORY_STYLE: Record<
  Resource["category"],
  { iconBg: string; typeColor: string; typeBg: string; fallbackIcon: string }
> = {
  policy: {
    iconBg: "#E8F7EE",
    typeColor: "#1a5e35",
    typeBg: "#E8F7EE",
    fallbackIcon: "📋",
  },
  research: {
    iconBg: "#E8ECF2",
    typeColor: "#0D1F3C",
    typeBg: "#E8ECF2",
    fallbackIcon: "📊",
  },
  workshop: {
    iconBg: "#FFF8F5",
    typeColor: "#C9501E",
    typeBg: "#FFF8F5",
    fallbackIcon: "🎮",
  },
  template: {
    iconBg: "#FFF8F5",
    typeColor: "#C9501E",
    typeBg: "#FFF8F5",
    fallbackIcon: "✉️",
  },
};

function plural(n: number) {
  return n + " resource" + (n !== 1 ? "s" : "");
}

function formatPages(r: Resource): string {
  if (r.pages == null) return r.format;
  return `~${r.pages} pages`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResourcesContent() {
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modalId, setModalId] = useState<string | null>(null);

  // Submit-a-resource form state.
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subUrl, setSubUrl] = useState("");
  const [subError, setSubError] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Server-side filtering: pass category + search query to the API.
  const apiFilters = {
    category: filter === "all" ? undefined : filter,
    q: query.trim() || undefined,
  };
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useResources(apiFilters);
  const submit = useSubmitResource();

  const resources = useMemo(() => data?.resources ?? [], [data]);

  // The original showed the featured strip only for the all/policy/research
  // filters.
  const showFeatured =
    filter === "all" || filter === "policy" || filter === "research";

  const modalResource = modalId
    ? resources.find((r) => r.id === modalId) ?? null
    : null;

  function renderDownload(r: Resource) {
    if (r.open_url) {
      return (
        <a
          className="modal-dl-btn"
          href={r.open_url}
          target="_blank"
          rel="noreferrer"
        >
          → Open on Platform
        </a>
      );
    }
    if (r.download_url) {
      return (
        <a
          className="modal-dl-btn"
          href={r.download_url}
          target="_blank"
          rel="noreferrer"
        >
          ↓ Download
        </a>
      );
    }
    return (
      <a
        className="modal-dl-btn"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert("This resource is available via the platform page.");
        }}
      >
        ↓ Download
      </a>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubError(null);

    const name = subName.trim();
    const email = subEmail.trim();
    const title = subTitle.trim();
    const desc = subDesc.trim();
    const url = subUrl.trim();

    if (!name || !email || !title || !desc) {
      setSubError("Please complete all required fields.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setSubError("Please enter a valid email address.");
      return;
    }

    try {
      await submit.mutateAsync({
        submitter_name: name,
        submitter_email: email,
        resource_title: title,
        resource_description: desc,
        resource_url: url || undefined,
      });
      setSubName("");
      setSubEmail("");
      setSubTitle("");
      setSubDesc("");
      setSubUrl("");
    } catch (err) {
      if (err instanceof ApiError) {
        setSubError(err.message || "Something went wrong. Please try again.");
      } else {
        setSubError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="resources-page">
      {/* ── NAV ─────────────────────────────────── */}
      <nav className="topnav">
        <a className="nav-logo" href="">
          <div className="nav-logo-mark">HR</div>
          <span className="nav-logo-name">HR Playhouse Hub</span>
        </a>
        <div className="nav-sep" />
        <div className={`nav-links${navOpen ? " open" : ""}`}>
          <Link className="nav-link" href="/learn/my-courses">
            Courses
          </Link>
          <Link className="nav-link" href="/learn/case-study-vault">
            Case Studies
          </Link>
          <Link className="nav-link" href="/learn/playbook">
            Playbook
          </Link>
          <Link className="nav-link active" href="/learn/resources">
            Resources
          </Link>
          <Link className="nav-link" href="/learn/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="nav-link" href="/learn/ai-support">
            AI Support
          </Link>
        </div>
        <button
          className="res-hamburger"
          onClick={() => setNavOpen((v) => !v)}
          style={{
            display: "none",
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(255,255,255,.1)",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 18,
              height: 2,
              background: "#fff",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 18,
              height: 2,
              background: "#fff",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 18,
              height: 2,
              background: "#fff",
              borderRadius: 1,
            }}
          />
        </button>
        <div className="nav-right">
          <a
            className="nav-cta"
            href="/learn/my-courses"
          >
            Start Learning
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <div className="hero">
        <div className="hero-tag">📚 Open Access Resources</div>
        <h1>
          HR Resources <em>Library</em>
        </h1>
        <p className="hero-sub">
          Free toolkits, research reports, policy frameworks and practice guides
          for HR professionals in higher education — produced by the HR
          Playhouse Hub and the ACU HR in HE Community.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-n">{resources.length}</div>
            <div className="hero-stat-l">Resources available</div>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <div className="hero-stat-n">6</div>
            <div className="hero-stat-l">Jurisdictions covered</div>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <div className="hero-stat-n">Free</div>
            <div className="hero-stat-l">All resources open access</div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ─────────────────────────── */}
      <div className="filter-bar">
        <div className="search-wrap">
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search resources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`chip${filter === f.key ? " active" : ""}`}
              data-filter={f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="result-count">{plural(resources.length)}</div>
      </div>

      {/* ── PAGE BODY ──────────────────────────── */}
      <div className="page-body">
        {/* FEATURED STRIP */}
        {showFeatured && (
          <div className="featured-strip">
            <div>
              <div className="feat-label">⭐ Featured Release — 2026</div>
              <div className="feat-title">
                HR Policy &amp; Toolkit Development for Higher Education
                Institutions
              </div>
              <div className="feat-desc">
                A comprehensive HR policy framework covering 10 policy areas
                with step-by-step procedures, template letters, compliance
                checklists and jurisdiction guidance for 6 Commonwealth regions.
                Produced for the ACU HR in HE Community.
              </div>
              <div className="feat-badges">
                <span className="feat-badge">10 Policy Areas</span>
                <span className="feat-badge">6 Jurisdictions</span>
                <span className="feat-badge">Template Letters</span>
                <span className="feat-badge">Compliance Checklists</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="feat-btn"
                  onClick={() => setModalId("toolkit")}
                >
                  ↓ Download Toolkit
                </button>
                <button
                  className="feat-btn secondary"
                  onClick={() => setModalId("toolkit")}
                >
                  Preview Contents →
                </button>
              </div>
            </div>
            <div className="feat-divider" />
            <div>
              <div className="feat-label">📊 Research Report — 2026</div>
              <div className="feat-title">
                HR Strategies in Commonwealth Universities: A Literature Review
                &amp; Benchmarking Report
              </div>
              <div className="feat-desc">
                Evidence-based analysis of HR practice across the Commonwealth,
                benchmarking 5 strategic HR domains against leading practice
                with recommendations for institutional HR leaders.
              </div>
              <div className="feat-badges">
                <span className="feat-badge">47 References</span>
                <span className="feat-badge">5 HR Domains</span>
                <span className="feat-badge">6 Regions</span>
                <span className="feat-badge">ACU Endorsed</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="feat-btn"
                  onClick={() => setModalId("benchmarking")}
                >
                  ↓ Download Report
                </button>
                <button
                  className="feat-btn secondary"
                  onClick={() => setModalId("benchmarking")}
                >
                  Read Summary →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALL RESOURCES GRID */}
        <div className="sec-head">
          <h2>All Resources</h2>
          <div className="sec-head-line" />
          <div className="sec-count">{plural(resources.length)}</div>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <div
              className="empty-icon"
              style={{
                display: "inline-block",
                width: 36,
                height: 36,
                border: "3px solid rgba(255,255,255,.25)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div className="empty-title">Loading resources…</div>
            <div className="empty-text">Fetching the latest library.</div>
            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          </div>
        ) : isError ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div className="empty-title">Couldn&apos;t load resources</div>
            <div className="empty-text">
              {error instanceof ApiError
                ? error.message
                : "Something went wrong. Please try again."}
            </div>
            <button
              className="feat-btn"
              style={{ marginTop: 16 }}
              onClick={() => refetch()}
            >
              ↻ Retry
            </button>
          </div>
        ) : resources.length > 0 ? (
          <div className="resource-grid">
            {resources.map((r) => {
              const style = CATEGORY_STYLE[r.category];
              return (
                <div
                  key={r.id}
                  className="res-card"
                  onClick={() => setModalId(r.id)}
                >
                  <div className="res-card-top">
                    <div className="res-type-row">
                      <div
                        className="res-icon"
                        style={{ background: style.iconBg }}
                      >
                        {r.icon ?? style.fallbackIcon}
                      </div>
                      <span
                        className="res-type-tag"
                        style={{
                          background: style.typeBg,
                          color: style.typeColor,
                        }}
                      >
                        {r.type_tag}
                      </span>
                      {r.is_new && <span className="res-new">NEW</span>}
                    </div>
                    <div className="res-title">{r.title}</div>
                    <div className="res-desc">{r.description}</div>
                    <div className="res-meta">
                      <span className="res-meta-item">📅 {r.year}</span>
                      <span className="res-meta-item">📄 {formatPages(r)}</span>
                      <span className="res-meta-item">🗂 {r.format}</span>
                    </div>
                  </div>
                  <div className="res-card-bottom">
                    <div className="res-jurisdiction">
                      {r.jurisdictions.map((j) => (
                        <span key={j} className="jur-pill">
                          {j}
                        </span>
                      ))}
                    </div>
                    <button
                      className="res-dl-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalId(r.id);
                      }}
                    >
                      ↓ Access
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No resources found</div>
            <div className="empty-text">
              Try a different search term or filter category.
            </div>
          </div>
        )}

        {/* CONTRIBUTE STRIP */}
        <div className="submit-strip">
          <div className="submit-strip-text">
            <h3>
              Have a resource to share with the Commonwealth HR community?
            </h3>
            <p>
              We welcome HR policy documents, research, toolkits and practice
              guides from institutions across the ACU network. All submissions
              are reviewed before publication.
            </p>
          </div>
          <div className="submit-btn-row">
            <button
              className="feat-btn"
              onClick={() => setShowSubmitForm((v) => !v)}
            >
              Submit a Resource →
            </button>
            <Link className="feat-btn secondary" href="/learn/innovation-lab">
              Visit Innovation Lab
            </Link>
          </div>
        </div>

        {/* SUBMIT FORM */}
        {showSubmitForm && (
          <div className="submit-strip" style={{ display: "block" }}>
            {submit.isSuccess ? (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <h3
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  Thank you — your submission has been received.
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,.6)",
                  }}
                >
                  Our team reviews all submissions before publication. We&apos;ll
                  be in touch.
                </p>
                <button
                  className="feat-btn secondary"
                  style={{ marginTop: 14 }}
                  onClick={() => {
                    submit.reset();
                    setShowSubmitForm(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <input
                  className="search-input"
                  type="text"
                  placeholder="Your name *"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                />
                <input
                  className="search-input"
                  type="email"
                  placeholder="Your email *"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Resource title *"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                />
                <textarea
                  className="search-input"
                  placeholder="Resource description *"
                  rows={3}
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  style={{ resize: "vertical", paddingLeft: 14 }}
                />
                <input
                  className="search-input"
                  type="url"
                  placeholder="Resource URL (optional)"
                  value={subUrl}
                  onChange={(e) => setSubUrl(e.target.value)}
                />
                {subError && (
                  <div
                    style={{
                      color: "#ffb4a3",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ⚠ {subError}
                  </div>
                )}
                <div className="submit-btn-row">
                  <button
                    className="feat-btn"
                    type="submit"
                    disabled={submit.isPending}
                  >
                    {submit.isPending ? "Submitting…" : "Submit Resource →"}
                  </button>
                  <button
                    className="feat-btn secondary"
                    type="button"
                    onClick={() => {
                      setShowSubmitForm(false);
                      setSubError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL ──────────────────────────────── */}
      <div
        className={`modal-bg${modalResource ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalId(null);
        }}
      >
        <div className="modal">
          {modalResource && (
            <>
              <button
                className="modal-close"
                onClick={() => setModalId(null)}
              >
                ✕
              </button>
              <h2>{modalResource.title}</h2>
              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <div className="mmi-label">Type</div>
                  <div className="mmi-value">{modalResource.type_tag}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="mmi-label">Year</div>
                  <div className="mmi-value">{modalResource.year}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="mmi-label">Format</div>
                  <div className="mmi-value">{modalResource.format}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="mmi-label">Length</div>
                  <div className="mmi-value">{formatPages(modalResource)}</div>
                </div>
              </div>
              <p className="modal-desc">
                {modalResource.long_description ?? modalResource.description}
              </p>
              <div className="modal-contents">
                <h4>What&apos;s included:</h4>
                <ul>
                  {modalResource.contents.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {modalResource.tags.map((t) => (
                  <span key={t} className="modal-tag">
                    {t}
                  </span>
                ))}
              </div>
              {renderDownload(modalResource)}
              <p className="modal-credit">
                Produced by Covenant University · ACU HR in HE Community Grant
                2025–2026 · contact@thehrplayhousehub.org
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
