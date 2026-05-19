"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./resources.css";

/**
 * Resources Library.
 *
 * Faithful port of 08_resources_library.html. The original rendered the grid
 * and modal imperatively from a `RESOURCES` array via `innerHTML`, with global
 * `setFilter` / `filterResources` / `openModal` / `closeModal` functions and a
 * `currentFilter` variable. That is now React state: `filter` + `query` drive a
 * derived `filtered` list, and `modalId` controls the detail modal.
 *
 * This page uses its own platform-style top nav (not the shared marketing
 * `.nav`), so that chrome is ported inline. Internal links that have a local
 * route use Next `<Link>`; the LMS course / sign-in links stay plain anchors,
 * matching the original generator's link-rewrite rules.
 */

type Resource = {
  id: string;
  category: "policy" | "research" | "workshop" | "template";
  icon: string;
  iconBg: string;
  typeTag: string;
  typeColor: string;
  typeBg: string;
  title: string;
  desc: string;
  year: string;
  pages: string;
  format: string;
  jurisdictions: string[];
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  file: string;
  contents: string[];
  longDesc: string;
};

const RESOURCES: Resource[] = [
  {
    id: "toolkit",
    category: "policy",
    icon: "📋",
    iconBg: "#E8F7EE",
    typeTag: "Policy & Toolkit",
    typeColor: "#1a5e35",
    typeBg: "#E8F7EE",
    title: "HR Policy & Toolkit Development for Higher Education Institutions",
    desc: "Comprehensive HR policy framework covering 10 policy areas with step-by-step procedures, template letters and compliance checklists. Includes jurisdiction guidance for UK, Nigeria, South Africa, India, Singapore and the Caribbean.",
    year: "2026",
    pages: "~45 pages",
    format: "Word Document (.docx)",
    jurisdictions: ["UK", "NG", "ZA", "IN", "SG", "JM"],
    tags: [
      "Recruitment",
      "Disciplinary",
      "Grievance",
      "Wellbeing",
      "Performance",
      "Absence",
      "L&D",
      "EDI",
      "Flexible Working",
      "Redundancy",
    ],
    isNew: true,
    isFeatured: true,
    file: "HR_Policy_Toolkit_ACU_Deliverable.docx",
    contents: [
      "10 fully developed HR policies with policy statements, scope, principles and procedures",
      "Step-by-step procedural guides for all 10 policy areas",
      "Template letters — offer, probation, disciplinary hearing, written warning, grievance outcome",
      "Compliance checklists at end of each policy section",
      "Jurisdiction compliance matrix — key legislation for 6 Commonwealth regions",
      "3-phase implementation checklist for HR departments adopting the toolkit",
      "Designed for adaptation — add your institutional name and logo",
    ],
    longDesc:
      "This toolkit was produced as a core deliverable of the HR Playhouse Hub project, funded by the Association of Commonwealth Universities (ACU) HR in HE Community Grant 2025–2026. It is designed to be a practical, ready-to-adapt resource for HR teams in higher education institutions across the Commonwealth, regardless of their size or existing HR infrastructure.",
  },
  {
    id: "benchmarking",
    category: "research",
    icon: "📊",
    iconBg: "#E8ECF2",
    typeTag: "Research Report",
    typeColor: "#0D1F3C",
    typeBg: "#E8ECF2",
    title:
      "HR Strategies in Commonwealth Universities: Literature Review & Benchmarking Report 2026",
    desc: "Evidence-based analysis drawing on 47 peer-reviewed sources to benchmark HR practice across 6 Commonwealth regions in 5 strategic HR domains. Includes maturity framework and 12 actionable recommendations.",
    year: "2026",
    pages: "~25 pages",
    format: "Word Document (.docx)",
    jurisdictions: ["UK", "NG", "ZA", "IN", "SG", "JM"],
    tags: [
      "Research",
      "Benchmarking",
      "Digital HR",
      "Wellbeing",
      "Recruitment",
      "Retention",
      "Workforce Planning",
    ],
    isNew: true,
    isFeatured: true,
    file: "HRPH_Literature_Review_Benchmarking_Report.docx",
    contents: [
      "Structured narrative literature review methodology covering 2015–2025 publications",
      "5 thematic HR reviews: Recruitment, Workforce Planning, Wellbeing, Digital Transformation, Retention & CPD",
      "Comparative benchmarking framework mapping 6 regions against 4-level maturity model",
      "5 highlighted Key Findings with evidence-based conclusions",
      "Section mapping HR Playhouse Hub features to their evidence base",
      "12 strategic recommendations for HR leaders, ACU members, and policy-makers",
      "47 fully formatted academic references",
    ],
    longDesc:
      "This report provides the evidence base for HR capacity building in Commonwealth higher education. It synthesises published literature, sector surveys and institutional reports to identify where HR practice stands today — and what investment in platforms like the HR Playhouse Hub can achieve.",
  },
  {
    id: "workshop",
    category: "workshop",
    icon: "🎮",
    iconBg: "#FFF8F5",
    typeTag: "Workshop Materials",
    typeColor: "#C9501E",
    typeBg: "#FFF8F5",
    title: "HR Challenge Sprint — Complete Workshop Pack",
    desc: "Everything you need to run a 90-minute gamified HR workshop. Includes facilitator slide deck, program brochure, 3 scenario cards, expert scorecard, and 6 achievement badges.",
    year: "2026",
    pages: "12-slide deck + 5 print pages",
    format: "PPTX + HTML (printable)",
    jurisdictions: ["All"],
    tags: ["Workshop", "Gamification", "Facilitation", "Training", "CPD"],
    isNew: true,
    isFeatured: false,
    file: "#",
    contents: [
      "Facilitator slide deck — 12 slides, full speaker notes, navy/terracotta brand",
      "Program brochure — A4, print-ready, full session flow and team roles",
      "Scenario Card A — The Invisible Shortlist (Inclusive Recruitment)",
      "Scenario Card B — The Burnout Threshold (Mental Health & Wellbeing)",
      "Scenario Card C — The Retention Crisis (Workforce Planning)",
      "Expert scorecard — points system for all 5 teams, bonus challenge rows",
      "6 achievement badges — HR Champion, Strategic Thinker, People First, Sprint MVP, Bold Innovator, Rising Star",
    ],
    longDesc:
      "The HR Challenge Sprint is a 90-minute experiential learning workshop designed for HR and administrative staff in higher education. Teams compete to solve real HR scenarios in a timed, scored format — guided by industry experts and academic contributors.",
  },
  {
    id: "playbook",
    category: "policy",
    icon: "📖",
    iconBg: "#E8F7EE",
    typeTag: "Policy & Toolkit",
    typeColor: "#1a5e35",
    typeBg: "#E8F7EE",
    title: "Everyday HR Playbook — 10 Situations, 6 Jurisdictions",
    desc: "Step-by-step guides for 10 common HR situations faced by university HR teams. Each situation includes actions, do/don't lists, legal checklist, and downloadable template — across 6 jurisdictions.",
    year: "2025–2026",
    pages: "Interactive web format",
    format: "HTML (platform page)",
    jurisdictions: ["UK", "NG", "ZA", "IN", "SG", "HK"],
    tags: [
      "Disciplinary",
      "Grievance",
      "Mental Health",
      "Absence",
      "Redundancy",
      "Onboarding",
      "Performance",
      "DEIB",
      "Conflict",
      "Flexible Working",
    ],
    isNew: false,
    isFeatured: false,
    file: "https://learn.thehrplayhousehub.org/playbook/",
    contents: [
      "Disciplinary procedures — step-by-step with template letters",
      "Grievance handling — formal and informal routes",
      "Managing mental health concerns — line manager guidance",
      "Absence management — short and long-term",
      "Redundancy process — collective and individual",
      "Onboarding best practice — first 90 days",
      "Performance management — conversations and PIPs",
      "DEIB in practice — inclusive culture actions",
      "Conflict resolution — early intervention and formal routes",
      "Flexible working requests — handling and deciding",
    ],
    longDesc:
      "The HR Playbook is an interactive platform resource giving HR practitioners immediate, practical guidance for the situations they encounter most often.",
  },
  {
    id: "casestudies",
    category: "research",
    icon: "📚",
    iconBg: "#E8ECF2",
    typeTag: "Case Studies",
    typeColor: "#0D1F3C",
    typeBg: "#E8ECF2",
    title: "HR Case Study Vault — 32 Evidence-Based Scenarios",
    desc: "32 original case studies covering 8 HR topic areas. Each includes scenario, decision points, pause & reflect sections, outcomes, lessons learned and application questions.",
    year: "2025–2026",
    pages: "32 case studies",
    format: "HTML (platform page)",
    jurisdictions: ["UK", "NG", "ZA", "IN", "SG", "HK"],
    tags: [
      "Recruitment",
      "Performance",
      "DEIB",
      "Retention",
      "Strategy",
      "Employee Relations",
      "Wellbeing",
      "Future of Work",
    ],
    isNew: false,
    isFeatured: false,
    file: "https://learn.thehrplayhousehub.org/case-study-vault/",
    contents: [
      "8 topic areas: Recruitment, Performance, DEIB, Retention, Strategy, Employee Relations, Wellbeing, Future of Work",
      "Each case study has: scenario, 3 decision points, pause & reflect, outcome, lessons, application questions",
      "Search and filter by topic, complexity, and institution type",
      "Download individual case study PDFs",
      "New cases added each quarter",
    ],
    longDesc:
      "The Case Study Vault provides HR professionals with real-world scenarios drawn from higher education practice, designed to develop analytical and decision-making skills.",
  },
  {
    id: "comms",
    category: "template",
    icon: "✉️",
    iconBg: "#FFF8F5",
    typeTag: "Templates",
    typeColor: "#C9501E",
    typeBg: "#FFF8F5",
    title: "HR Communications Pack — Emails, Invitations & Social Media",
    desc: "Complete communications package including platform launch email, onboarding email, professor invitation, industry expert invitation, benchmarking survey email, and 5 LinkedIn posts.",
    year: "2026",
    pages: "6 templates + 5 social posts",
    format: "Word Document (.docx)",
    jurisdictions: ["All"],
    tags: [
      "Communications",
      "Email",
      "Social Media",
      "LinkedIn",
      "Onboarding",
      "Workshop",
    ],
    isNew: true,
    isFeatured: false,
    file: "HRPH_Communications_Pack.docx",
    contents: [
      "Platform launch announcement email — for all stakeholders",
      "Staff onboarding email — Covenant University HR staff",
      "Professor invitation — academic contributors for workshop",
      "Industry expert invitation — speaking and mentoring role",
      "Benchmarking survey invitation — ACU network contacts",
      "5 LinkedIn posts — launch, workshop announcement, post-workshop, benchmarking, project completion",
    ],
    longDesc:
      "Ready-to-adapt communications for every stage of the HR Playhouse Hub project cycle — from launch to final report. Each template includes usage notes and bracketed fields to personalise.",
  },
  {
    id: "lit-review",
    category: "research",
    icon: "🔬",
    iconBg: "#E8ECF2",
    typeTag: "Research Report",
    typeColor: "#0D1F3C",
    typeBg: "#E8ECF2",
    title: "HR Playhouse Hub — Project Research & Evidence Base",
    desc: "The academic evidence base underpinning every design decision of the HR Playhouse Hub — from gamification science to Commonwealth HR capacity gaps. 47 peer-reviewed references.",
    year: "2026",
    pages: "Included in Benchmarking Report",
    format: "Word Document (.docx)",
    jurisdictions: ["All"],
    tags: [
      "Research",
      "Evidence Base",
      "Gamification",
      "HR Capacity",
      "Literature Review",
    ],
    isNew: true,
    isFeatured: false,
    file: "HRPH_Literature_Review_Benchmarking_Report.docx",
    contents: [
      "Gamification evidence — Hamari et al. 2014; Armstrong & Landers 2017",
      "Digital HR transformation — CIPD 2022; Dodd 2022; Bersin 2021",
      "Staff wellbeing in HE — Wray & Kinman 2021; Guthrie et al. 2018",
      "Inclusive recruitment — Bhopal 2020; Universities UK 2020",
      "Commonwealth HR capacity — ACU 2022; Teferra & Altbach 2019",
      "People analytics — Marler & Boudreau 2017; Tursunbayeva et al. 2022",
    ],
    longDesc:
      "Every feature of the HR Playhouse Hub was designed in response to documented evidence. This section of the benchmarking report maps each platform feature to its academic and practice evidence base.",
  },
  {
    id: "univ-list",
    category: "template",
    icon: "🌍",
    iconBg: "#FFF8F5",
    typeTag: "Templates",
    typeColor: "#C9501E",
    typeBg: "#FFF8F5",
    title: "Commonwealth University Outreach List — Benchmarking Survey",
    desc: "38 target universities across 6 Commonwealth regions with contact details, institution profiles and outreach strategy guidance. For distributing the benchmarking survey.",
    year: "2026",
    pages: "6-page landscape document",
    format: "Word Document (.docx)",
    jurisdictions: ["UK", "NG", "ZA", "IN", "SG", "JM"],
    tags: [
      "Outreach",
      "Benchmarking",
      "Commonwealth",
      "Universities",
      "Contacts",
    ],
    isNew: true,
    isFeatured: false,
    file: "HRPH_University_Target_List.docx",
    contents: [
      "14 sub-Saharan African universities with HR contact emails",
      "9 UK universities with HR department contacts",
      "8 South and Southeast Asian universities",
      "3 Caribbean universities including UWI campuses",
      "4 Pacific universities including ANU and University of the South Pacific",
      "Outreach strategy table — subject lines, follow-up timing, incentive offers",
    ],
    longDesc:
      "A practical outreach tool for distributing the Commonwealth HR Benchmarking Survey. All institutions listed are ACU members or active HR in HE Community participants.",
  },
];

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "policy", label: "Policy & Toolkit" },
  { key: "research", label: "Research & Reports" },
  { key: "workshop", label: "Workshop Materials" },
  { key: "template", label: "Templates" },
];

function plural(n: number) {
  return n + " resource" + (n !== 1 ? "s" : "");
}

export default function ResourcesContent() {
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modalId, setModalId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return RESOURCES.filter((r) => {
      const matchCat = filter === "all" || r.category === filter;
      const matchQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [filter, query]);

  // The original showed the featured strip only for the all/policy/research
  // filters.
  const showFeatured =
    filter === "all" || filter === "policy" || filter === "research";

  const modalResource = modalId
    ? RESOURCES.find((r) => r.id === modalId)
    : null;

  function renderDownload(r: Resource) {
    const isExternal = r.file.startsWith("http");
    if (isExternal) {
      return (
        <a
          className="modal-dl-btn"
          href={r.file}
          target="_blank"
          rel="noreferrer"
        >
          → Open on Platform
        </a>
      );
    }
    if (r.file === "#") {
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
    return (
      <a className="modal-dl-btn" href="#" download={r.file}>
        ↓ Download
      </a>
    );
  }

  return (
    <div className="resources-page">
      {/* ── NAV ─────────────────────────────────── */}
      <nav className="topnav">
        <a className="nav-logo" href="https://learn.thehrplayhousehub.org">
          <div className="nav-logo-mark">HR</div>
          <span className="nav-logo-name">HR Playhouse Hub</span>
        </a>
        <div className="nav-sep" />
        <div className={`nav-links${navOpen ? " open" : ""}`}>
          <a
            className="nav-link"
            href="https://learn.thehrplayhousehub.org/courses/"
          >
            Courses
          </a>
          <Link className="nav-link" href="/case-study-vault">
            Case Studies
          </Link>
          <Link className="nav-link" href="/playbook">
            Playbook
          </Link>
          <Link className="nav-link active" href="/resources">
            Resources
          </Link>
          <Link className="nav-link" href="/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="nav-link" href="/ai-support">
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
            href="https://learn.thehrplayhousehub.org/courses/"
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
            <div className="hero-stat-n">{RESOURCES.length}</div>
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
        <div className="result-count">{plural(filtered.length)}</div>
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
          <div className="sec-count">{plural(filtered.length)}</div>
        </div>

        {filtered.length > 0 ? (
          <div className="resource-grid">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="res-card"
                onClick={() => setModalId(r.id)}
              >
                <div className="res-card-top">
                  <div className="res-type-row">
                    <div
                      className="res-icon"
                      style={{ background: r.iconBg }}
                    >
                      {r.icon}
                    </div>
                    <span
                      className="res-type-tag"
                      style={{ background: r.typeBg, color: r.typeColor }}
                    >
                      {r.typeTag}
                    </span>
                    {r.isNew && <span className="res-new">NEW</span>}
                  </div>
                  <div className="res-title">{r.title}</div>
                  <div className="res-desc">{r.desc}</div>
                  <div className="res-meta">
                    <span className="res-meta-item">📅 {r.year}</span>
                    <span className="res-meta-item">📄 {r.pages}</span>
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
            ))}
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
            <a
              className="feat-btn"
              href="mailto:contact@thehrplayhousehub.org?subject=Resource Submission — HR Playhouse Hub"
            >
              Submit a Resource →
            </a>
            <Link className="feat-btn secondary" href="/innovation-lab">
              Visit Innovation Lab
            </Link>
          </div>
        </div>
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
                  <div className="mmi-value">{modalResource.typeTag}</div>
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
                  <div className="mmi-value">{modalResource.pages}</div>
                </div>
              </div>
              <p className="modal-desc">{modalResource.longDesc}</p>
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
