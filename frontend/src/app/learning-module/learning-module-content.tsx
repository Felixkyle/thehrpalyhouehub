"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useRef, useState } from "react";
import "./learning-module.css";

type TabId = "home" | "l1" | "l2" | "l3" | "l4" | "fp";
const ALLOWED_TABS: TabId[] = ["home", "l1", "l2", "l3", "l4", "fp"];

function getSavedTab(): TabId {
  if (typeof window === "undefined") return "home";
  try {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested && (ALLOWED_TABS as string[]).includes(requested)) {
      return requested as TabId;
    }
    const saved = localStorage.getItem("hrph_last_tab");
    if (saved && (ALLOWED_TABS as string[]).includes(saved)) {
      return saved as TabId;
    }
  } catch {
    return "home";
  }
  return "home";
}

function syncTabProgress(id: TabId) {
  if (typeof window === "undefined") return;
  try {
    window.scrollTo(0, 0);
    localStorage.setItem("hrph_last_tab", id);
    if (id === "l1") {
      localStorage.setItem("hrph_level1_started", "true");
      localStorage.setItem("hrph_current_level", "l1");
    } else if (id === "l2") {
      localStorage.setItem("hrph_level2_started", "true");
      localStorage.setItem("hrph_current_level", "l2");
    } else if (id === "l3") {
      localStorage.setItem("hrph_level3_started", "true");
      localStorage.setItem("hrph_current_level", "l3");
    } else if (id === "l4") {
      localStorage.setItem("hrph_level4_started", "true");
      localStorage.setItem("hrph_current_level", "l4");
    } else if (id === "fp") {
      localStorage.setItem("hrph_final_project_started", "true");
    }
  } catch {}
}

export default function LearningModuleContent() {
  const [activeTab, setActiveTabState] = useState<TabId>("home");

  // Mark each level as "started" in localStorage when first visited, mirroring
  // the original page's progress tracking behaviour.
  function setActiveTab(id: TabId) {
    setActiveTabState(id);
    syncTabProgress(id);
  }

  // Restore saved/query tab after hydration and mark it in progress storage.
  useEffect(() => {
    const restoredTab = getSavedTab();
    const timer = window.setTimeout(() => {
      setActiveTab(restoredTab);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Accordion handlers — toggle the same CSS classes the original script did,
  // but scoped to the clicked DOM node so we don't have to mirror every card's
  // state in React. Simple and matches the original markup exactly.
  function toggleCard(head: HTMLElement) {
    head.classList.toggle("open");
    const body = head.nextElementSibling;
    if (body) body.classList.toggle("open");
  }
  function toggleTopic(band: HTMLElement) {
    band.classList.toggle("open");
  }

  // ─────── Final-project file upload (was initUpload in the original) ───────
  const uploadZoneRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const filePreviewRef = useRef<HTMLDivElement | null>(null);
  const fileCardIconRef = useRef<HTMLDivElement | null>(null);
  const fileCardNameRef = useRef<HTMLDivElement | null>(null);
  const fileCardSizeRef = useRef<HTMLDivElement | null>(null);
  const fileRemoveBtnRef = useRef<HTMLButtonElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const submitSuccessRef = useRef<HTMLDivElement | null>(null);
  const currentFileExtRef = useRef<HTMLSpanElement | null>(null);

  function openFileDialog() {
    fileInputRef.current?.click();
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    uploadZoneRef.current?.classList.add("dragover");
  }
  function handleDragLeave() {
    uploadZoneRef.current?.classList.remove("dragover");
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    uploadZoneRef.current?.classList.remove("dragover");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }
  function handleFile(file: File) {
    const allowedExts = ["pdf", "pptx", "ppt", "doc", "docx"];
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!allowedExts.includes(ext)) {
      alert("Please upload a PDF, PPTX, or Word document.");
      return;
    }
    const size = (file.size / 1024 / 1024).toFixed(1) + " MB";
    const icons: Record<string, string> = {
      pdf: "📄",
      pptx: "📊",
      ppt: "📊",
      doc: "📝",
      docx: "📝",
    };
    if (fileCardIconRef.current) fileCardIconRef.current.textContent = icons[ext] || "📎";
    if (fileCardNameRef.current) fileCardNameRef.current.textContent = file.name;
    if (fileCardSizeRef.current) fileCardSizeRef.current.textContent = size;
    if (filePreviewRef.current) filePreviewRef.current.style.display = "block";
    if (uploadZoneRef.current) uploadZoneRef.current.style.display = "none";
    if (submitBtnRef.current) submitBtnRef.current.disabled = false;
    if (currentFileExtRef.current)
      currentFileExtRef.current.textContent = ext.toUpperCase();
  }
  function handleRemove() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (filePreviewRef.current) filePreviewRef.current.style.display = "none";
    if (uploadZoneRef.current) uploadZoneRef.current.style.display = "block";
    if (submitBtnRef.current) submitBtnRef.current.disabled = true;
  }
  function handleSubmit() {
    const btn = submitBtnRef.current;
    if (!btn || btn.disabled) return;
    btn.textContent = "⏳ Submitting...";
    btn.disabled = true;
    setTimeout(() => {
      if (submitSuccessRef.current)
        submitSuccessRef.current.style.display = "block";
      btn.style.display = "none";
    }, 1800);
  }

  return (
    <>
      <nav className="brand-nav">
          <a className="bn-logo" href="https://www.thehrplayhousehub.org/">
            <div className="bn-pill">HR Playhouse</div>
            <div className="bn-text">Hub</div>
          </a>
          <div className="bn-sep"></div>
          <div className="bn-page" id="bn-page-title">HR Learning Module</div>
          <div className="bn-links">
            <a className="bn-link" href="https://thehrplayhousehub.org/dashboard/">Dashboard</a>
            <a className="bn-link" href="https://thehrplayhousehub.org/courses2/">Courses</a>
            <a className="bn-link" href="https://thehrplayhousehub.org/case-study-vault/">Case Studies</a>
            <a className="bn-link" href="https://thehrplayhousehub.org/playbook/">Playbook</a>
            <a className="bn-link" href="https://thehrplayhousehub.org/virtual-innovation-lab/">Innovation Lab</a>
            <a className="bn-link" href="https://thehrplayhousehub.org/hr-support/">AI Support</a>
          </div>
          <a className="bn-cta" href="https://www.thehrplayhousehub.org/">Main site</a>
        </nav>

        <div className="topbar">
          <div className="topbar-inner">
            <div className="logo">
              <div className="logo-icon">🏠</div>
              <div className="logo-text">HR <em>Playhouse</em> Hub</div>
            </div>
            <div className="nav-tabs">
              <button className={`nav-tab${activeTab === "home" ? " active" : ""}`} onClick={() => setActiveTab("home")}>🏠 Home</button>
              <button className={`nav-tab${activeTab === "l1" ? " active" : ""}`} onClick={() => setActiveTab("l1")}>L1 · Foundations</button>
              <button className={`nav-tab${activeTab === "l2" ? " active" : ""}`} onClick={() => setActiveTab("l2")}>L2 · Operational</button>
              <button className={`nav-tab${activeTab === "l3" ? " active" : ""}`} onClick={() => setActiveTab("l3")}>L3 · Strategic</button>
              <button className={`nav-tab${activeTab === "l4" ? " active" : ""}`} onClick={() => setActiveTab("l4")}>L4 · Innovation</button>
              <button className={`nav-tab${activeTab === "fp" ? " active" : ""}`} onClick={() => setActiveTab("fp")}>📋 Final Project</button>
            </div>
          </div>
        </div>
        <div id="tab-home" className={`panel${activeTab === "home" ? " active" : ""}`}>
          <div className="hero hero-home">
            <div className="hero-tag">The HR Playhouse Hub · Learning Module</div>
            <div className="hero-title">Your Complete HR Learning Journey</div>
            <div className="hero-sub">A research-backed, gamified, four-level learning module — from HR foundations to
              future-forward innovation. Each level contains detailed professional topic content, real-world case studies with
              reflection prompts, and fully embedded interactive game activities.</div>
            <div className="hero-note">📌 All content grounded in CIPD, SHRM, academic journals, and industry research</div>
          </div>
          <div className="wg-grid">
            <div className="wg-card wg-l1" onClick={() => setActiveTab("l1")}>
              <div className="wg-emoji">🧱</div>
              <div className="wg-level">Level 1</div>
              <div className="wg-title">HR Foundations</div>
              <div className="wg-desc">Mindset, professional identity, trust, the HR toolkit, workplace culture, and engagement
                fundamentals</div>
            </div>
            <div className="wg-card wg-l2" onClick={() => setActiveTab("l2")}>
              <div className="wg-emoji">⚙️</div>
              <div className="wg-level">Level 2</div>
              <div className="wg-title">Operational HR</div>
              <div className="wg-desc">Talent acquisition, performance management, retention, and employee well-being with DEIB
                embedded throughout</div>
            </div>
            <div className="wg-card wg-l3" onClick={() => setActiveTab("l3")}>
              <div className="wg-emoji">📊</div>
              <div className="wg-level">Level 3</div>
              <div className="wg-title">Strategic HR</div>
              <div className="wg-desc">HR strategy, data analytics, talent management, leadership development, and future
                workforce planning</div>
            </div>
            <div className="wg-card wg-l4" onClick={() => setActiveTab("l4")}>
              <div className="wg-emoji">🚀</div>
              <div className="wg-level">Level 4</div>
              <div className="wg-title">Future-Forward HR</div>
              <div className="wg-desc">AI in HR, digital transformation, gamification, gig economy, and the evolving workforce of
                tomorrow</div>
            </div>
          </div>
          <div className="hiw">
            <div className="hiw-icon">💡</div>
            <div>
              <div className="hiw-title">How this module works</div>
              <div className="hiw-text">Navigate between levels using the tabs at the top. Each level contains detailed,
                professional topic content with subtopics, a real-world case study with reflection prompts, and a fully
                embedded gamified activity suite — all three games are playable directly on the page with no external files
                required.</div>
              <div className="steps">
                <div className="step">
                  <div className="step-n">1</div>
                  <div className="step-t">Read each topic — expand sections to explore detailed subtopic content</div>
                </div>
                <div className="step">
                  <div className="step-n">2</div>
                  <div className="step-t">Study the case study — pause and reflect before reading the analysis</div>
                </div>
                <div className="step">
                  <div className="step-n">3</div>
                  <div className="step-t">Play the gamified activities — all games are fully embedded and playable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tab-l1" className={`panel${activeTab === "l1" ? " active" : ""}`}>
          <div className="hero hero-l1">
            <div className="hero-tag">Level 1 · HR Foundations · Awareness + Engagement</div>
            <div className="hero-title">Building the Mindset and Language of HR</div>
            <div className="hero-sub">This level starts with what HR truly is, why it is often misunderstood, and how trust,
              fairness, and professional identity shape the work from day one. You will move from myths to clarity, into the
              core HR toolkit, and finally into culture and engagement — understanding not just what HR does, but why it
              matters to people and performance.</div>
            <div className="hero-note">📌 Research-backed content designed to prepare learners for practical and strategic HR
              roles</div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-green">🎯</div>
              <div className="card-info">
                <div className="card-title">Learning Outcomes</div>
                <div className="card-sub">What you will be able to do by the end of Level 1</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="outcomes">
                <div className="oc ">
                  <div className="oc-n">1</div>
                  <div className="oc-text">Define the role and scope of HR in organizations, dispelling common myths and
                    understanding core responsibilities as a professional discipline</div>
                </div>
                <div className="oc ">
                  <div className="oc-n">2</div>
                  <div className="oc-text">Identify key HR functions — recruitment, training, compensation, policy — and explain
                    how they form an interconnected system across the employee lifecycle</div>
                </div>
                <div className="oc ">
                  <div className="oc-n">3</div>
                  <div className="oc-text">Recognize the importance of workplace culture and engagement, including how HR
                    influences employee motivation and commitment beyond pay and benefits</div>
                </div>
                <div className="oc ">
                  <div className="oc-n">4</div>
                  <div className="oc-text">Demonstrate introductory application of HR concepts through case-based scenarios,
                    reflection, and the gamified HR Quest activities</div>
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 1</span>
              <span className="topic-title">The Evolving Role of HR — Myths, Trust, and Professional Identity</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout green">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand what HR truly represents beyond popular stereotypes · Examine why HR
                    has historically struggled with trust · Explore how HR has evolved from administration to strategic
                    partnership · Recognise HR as a professional discipline · Begin forming a clear professional identity
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.1 — Why Understanding HR Properly Comes First</div>
                <div className="prose">
                  <p>Before learning what HR does, it is essential to understand what HR <em>is</em>. Many people enter HR
                    with assumptions shaped by workplace gossip, media portrayals, or limited exposure — framing HR as purely
                    administrative: payroll, hiring paperwork, and enforcing rules. While these activities are part of HR's
                    responsibilities, they represent only a fragment of the discipline.</p>
                  <p>Human Resource Management exists because organizations are not just systems and structures — they are
                    collections of people. HR is the function responsible for managing the employment relationship in a way
                    that allows both the organization and its people to function effectively. At foundation level, you begin
                    to see HR as <strong>the bridge between organizational goals and human needs</strong>, not a control
                    mechanism or support desk.</p>
                  <p>This distinction matters enormously. When HR is understood only as an administrative function, it is
                    marginalized from strategic conversations. When understood as a people-centred discipline that aligns
                    human capability with organizational purpose, HR becomes indispensable to performance, culture, and
                    sustainability.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.2 — HR Myths and Stereotypes: Where They Come From and Why They Persist</div>
                <div className="prose">
                  <p>HR has long been affected by persistent myths. Statements such as <em>"HR always sides with
                      management"</em> or <em>"HR is not approachable"</em> developed from historical practices where HR's
                    primary role was compliance-focused and authority-driven — positioned as the enforcer of rules rather than
                    as a partner in problem-solving.</p>
                  <p>A 2023 BambooHR report found that a significant proportion of employees avoid going to HR because they
                    believe HR will not keep their concerns confidential, or that HR will side with the organization
                    regardless of the situation. These perceptions are not always accurate, but they are deeply held and shape
                    behaviour in ways that limit HR's effectiveness.</p>
                  <p>These stereotypes matter because <strong>perception shapes interaction</strong>. When employees believe
                    HR is inaccessible or biased, they avoid engaging with HR even when support is genuinely needed —
                    weakening HR's ability to create fair and supportive workplaces. You are encouraged not to dismiss these
                    perceptions but to understand them critically, recognizing why HR is viewed this way allows you to
                    appreciate the responsibility HR professionals carry in reshaping that image through everyday practice.
                  </p>
                  <div className="callout amber">
                    <div className="callout-icon">💬</div>
                    <div>
                      <div className="callout-label">Common HR myths (BambooHR, 2022)</div>
                      <div className="callout-text">"HR only protects the company" · "HR is just there to hire and fire" · "HR
                        doesn't keep things confidential" · "You don't need qualifications for HR." Each myth has real
                        consequences for how employees engage — or fail to engage — with HR support.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.3 — Trust as a Foundational HR Tension</div>
                <div className="prose">
                  <p>Trust is one of the most complex and foundational challenges in HR practice. HR operates within an
                    inherent structural tension: it supports employees <em>while also</em> representing the organization. This
                    dual responsibility can create suspicion, especially when difficult decisions must be made — redundancies,
                    disciplinary processes, performance management.</p>
                  <p>At foundation level, you will understand that <strong>trust is not something HR automatically possesses —
                      it is something HR must earn and sustain</strong>. Trust is influenced by four core behaviours in HR
                    practice:</p>
                  <ul>
                    <li><strong>Transparency:</strong> Explaining processes, decisions, and their rationale openly and
                      honestly</li>
                    <li><strong>Consistency:</strong> Applying policies and practices in the same way across all employees and
                      situations</li>
                    <li><strong>Ethical behaviour:</strong> Acting in accordance with professional standards even under
                      organizational pressure</li>
                    <li><strong>Clear communication:</strong> Informing employees of what is happening, what their rights are,
                      and who they can turn to</li>
                  </ul>
                  <p>This topic introduces trust not as an abstract concept, but as a <strong>practical and ethical
                      responsibility embedded in daily HR actions</strong>. Each interaction HR has with an employee —
                    handling a grievance, explaining a policy, managing a redundancy process — either builds or erodes trust.
                    The accumulation of these small moments is what determines whether employees genuinely see HR as a partner
                    or an adversary.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.4 — HR as a Profession</div>
                <div className="prose">
                  <p>A critical shift introduced in this topic is understanding HR as a <strong>professional
                      discipline</strong>. HR is guided by established bodies of knowledge, competency frameworks, and ethical
                    standards developed through decades of research and practice. The <strong>Chartered Institute of Personnel
                      and Development (CIPD)</strong> Profession Map and the <strong>Society for Human Resource Management
                      (SHRM)</strong> competency model both emphasize that HR practice requires judgment, analytical thinking,
                    ethical reasoning, and continuous professional development.</p>
                  <p>The CIPD's core behaviours include: ethical practice, valuing people, professional courage and influence,
                    situational decision-making, passion for learning, insights-focused practice, and commercial drive. These
                    are not soft skills — they are professional competencies requiring deliberate development, the same way
                    medicine and law develop professional standards over time.</p>
                  <p>This framing challenges the idea that HR work is based on "common sense." Instead, HR applies
                    <strong>structured knowledge to complex human and organizational issues</strong>. This shapes how you
                    approach future learning — not as rule memorization, but as professional capability-building.
                  </p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.5 — Forming Your HR Professional Identity Early</div>
                <div className="prose">
                  <p>Entering HR means stepping into a role that requires balance, discretion, and integrity. HR professionals
                    are stewards of fairness, culture, and organizational sustainability. At this level, you are not expected
                    to have all the answers. What matters is developing the right lens: seeing people management as
                    intentional, ethical, and evidence-based.</p>
                  <p>HR professional identity is shaped by formative questions that you will carry throughout your career:</p>
                  <ul>
                    <li>What values guide my HR decision-making when facing competing organizational pressures?</li>
                    <li>How do I maintain professional integrity when organizational interests and employee interests
                      genuinely conflict?</li>
                    <li>How do I stay evidence-based in environments that prefer gut instinct?</li>
                    <li>How do I build trust with employees who are initially sceptical of HR?</li>
                  </ul>
                  <p>These are not questions with fixed answers — they are the questions that define the practice of HR at
                    every level, from graduate trainee to Chief People Officer.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR is a strategic and ethical discipline, not just an administrative function — it
                  manages the employment relationship in service of both organizational goals and human needs
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Trust is a central challenge in HR practice and must be actively built through
                  transparency, consistency, ethical behaviour, and clear communication
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR is a profession guided by CIPD and SHRM frameworks — it requires judgment,
                  analytical thinking, and continuous development, not just common sense
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Understanding HR's professional identity early shapes how you approach every
                  future learning topic — as a practitioner, not just a student
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 2</span>
              <span className="topic-title">Fundamental HR Functions and Policies — The HR Toolkit</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout green">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand the core functions that make up day-to-day HR practice · See how HR
                    operates across the full employee lifecycle · Recognise why HR policies are essential to fairness and
                    consistency · Appreciate the foundational importance of compliance and ethical responsibility</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.1 — HR Functions as an Interconnected System</div>
                <div className="prose">
                  <p>HR work is structured around core functions that guide how people are managed within organizations. These
                    are not random tasks — they are <strong>interdependent components of a system</strong> designed to ensure
                    that employees are treated fairly, supported effectively, and managed consistently.</p>
                  <p>Understanding interconnectedness is one of the most important conceptual shifts at foundation level:</p>
                  <ul>
                    <li><strong>Recruitment decisions affect performance outcomes</strong> — hiring without the right skills
                      or values creates problems no amount of training can fully resolve</li>
                    <li><strong>Training influences engagement</strong> — employees who feel invested in are more motivated,
                      productive, and loyal</li>
                    <li><strong>Poorly designed policies undermine trust</strong> — inconsistent or unclear policies create
                      confusion, resentment, and legal risk</li>
                    <li><strong>Compensation signals organizational values</strong> — pay equity and transparency affect how
                      employees perceive fairness across every other HR function</li>
                  </ul>
                  <p>When any one function fails, it creates ripple effects across the entire system. Effective HR
                    professionals see these connections and act accordingly — never treating a recruitment decision as
                    separate from retention, or a policy as separate from culture.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.2 — Recruitment and Onboarding</div>
                <div className="prose">
                  <p>Recruitment begins with <strong>workforce planning</strong> — understanding what roles are needed and
                    why, based on current and future organizational objectives — and continues through job analysis, candidate
                    sourcing, assessment, selection, and appointment.</p>
                  <p><strong>Key stages of effective recruitment:</strong></p>
                  <ol>
                    <li><strong>Workforce planning:</strong> Analysing current workforce capabilities and identifying gaps
                    </li>
                    <li><strong>Job analysis and design:</strong> Defining the role, responsibilities, required competencies,
                      and success criteria</li>
                    <li><strong>Sourcing and advertising:</strong> Selecting appropriate channels and creating accurate,
                      inclusive job advertisements</li>
                    <li><strong>Screening and shortlisting:</strong> Applying consistent criteria to identify candidates who
                      meet role requirements</li>
                    <li><strong>Assessment and selection:</strong> Using structured methods — interviews, assessments, work
                      samples — to evaluate candidates fairly</li>
                    <li><strong>Offer and appointment:</strong> Making and confirming the employment offer with clear terms
                      and expectations</li>
                  </ol>
                  <p><strong>Onboarding</strong> follows recruitment and plays a critical role in shaping early employee
                    experience. Research shows that structured onboarding programmes significantly improve early retention,
                    productivity, and engagement compared to informal or paperwork-only approaches. SHRM data indicates
                    organizations with a standard onboarding process experience 50% greater new hire productivity and 69%
                    higher retention at three years.</p>
                  <div className="callout green">
                    <div className="callout-icon">📌</div>
                    <div>
                      <div className="callout-label">Onboarding: three phases</div>
                      <div className="callout-text"><strong>Pre-boarding</strong> (before Day 1): welcome packs, IT access, role
                        confirmation · <strong>First week</strong>: orientation, introductions, role clarity, policy overview
                        · <strong>First 30–90 days</strong>: structured check-ins, buddy systems, feedback loops, and early
                        development conversations. Each phase serves a distinct retention and engagement purpose.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.3 — Training and Development</div>
                <div className="prose">
                  <p>Training and development refers to the full range of activities designed to improve employee knowledge,
                    skills, and competence over time. At foundation level, you are introduced to basic forms of learning
                    intervention:</p>
                  <ul>
                    <li><strong>Induction training:</strong> Mandatory learning covering safety, compliance, policies, and
                      role requirements</li>
                    <li><strong>On-the-job learning:</strong> Skill development through practice, observation, and guided
                      experience</li>
                    <li><strong>Workshops and seminars:</strong> Structured learning events for specific skills or knowledge
                      areas</li>
                    <li><strong>Mentoring and coaching:</strong> One-to-one guided development relationships focused on
                      professional growth</li>
                    <li><strong>Digital and modular learning:</strong> Self-paced online courses, microlearning, and blended
                      programmes</li>
                  </ul>
                  <p>Development is not only about improving current job performance — it is about <strong>preparing employees
                      to adapt, grow, and contribute over time</strong>. From an HR perspective, supporting learning
                    simultaneously improves performance, engagement, and retention. Employees who feel their organization
                    invests in their development are significantly more likely to remain committed and engaged.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.4 — HR Policies: Creating Structure, Fairness, and Legal Protection</div>
                <div className="prose">
                  <p>HR policies are the formal written guidelines that shape how people are managed across an organization.
                    They define acceptable behaviour, outline procedures, and set expectations for both employees and
                    management.</p>
                  <table>
                    <tr>
                      <th>Policy type</th>
                      <th>Purpose</th>
                      <th>Example content</th>
                    </tr>
                    <tr>
                      <td>Attendance and leave</td>
                      <td>Clarity on entitlements and procedures</td>
                      <td>Annual leave, sick leave, parental leave, flexible working</td>
                    </tr>
                    <tr>
                      <td>Code of conduct</td>
                      <td>Defines expected workplace behaviour</td>
                      <td>Professionalism, confidentiality, conflicts of interest</td>
                    </tr>
                    <tr>
                      <td>Disciplinary procedures</td>
                      <td>Fair and consistent response to misconduct</td>
                      <td>Stages of investigation, hearing process, appeals</td>
                    </tr>
                    <tr>
                      <td>Anti-harassment and equality</td>
                      <td>Legal compliance and cultural protection</td>
                      <td>Reporting mechanisms, investigation process, zero tolerance</td>
                    </tr>
                    <tr>
                      <td>Performance management</td>
                      <td>Fairness in evaluation and development</td>
                      <td>Goal-setting, appraisal process, PIP procedures</td>
                    </tr>
                  </table>
                  <p>HR's role is not only to draft policies but to <strong>communicate them clearly, apply them fairly, and
                      review them regularly</strong>. A policy that sits in a drawer and is never explained or consistently
                    applied creates legal risk and organizational confusion.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.5 — Compliance and Ethical Responsibility</div>
                <div className="prose">
                  <p>Compliance ensures that organizational practices align with employment law, regulations, and ethical
                    standards — covering working hours, health and safety, equality, pay, and employee rights. In the UK
                    context, this includes the Working Time Regulations, Health and Safety at Work Act, Equality Act 2010, and
                    National Minimum Wage legislation.</p>
                  <p>At foundation level, you will not be expected to master legal detail. Instead, you will understand
                    <strong>why compliance matters</strong>: non-compliance leads to Employment Tribunal claims, financial
                    penalties, reputational damage, and genuine harm to employees whose rights have been violated.
                  </p>
                  <p>Ethics goes beyond legal compliance. Ethical HR practice involves asking not only "Is this legal?" but
                    also "Is this right?" Fair treatment, transparency, and consistency are <strong>foundational principles
                      that guide all HR functions</strong>. The CIPD's Code of Professional Conduct makes clear that HR
                    professionals have ethical obligations that sometimes require professional courage — the willingness to
                    speak up when organizational decisions conflict with ethical standards.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR functions form an interconnected system — recruitment decisions affect
                  performance, training influences engagement, poorly designed policies undermine trust, and compensation
                  signals fairness
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Onboarding is a critical retention tool: structured onboarding programmes improve
                  new-hire retention by up to 69% at three years (SHRM)
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR policies create fairness, clarity, and legal protection — but only when
                  communicated clearly, applied consistently, and reviewed regularly
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Compliance ensures legal obligations are met; ethics ensures moral ones are too —
                  both are foundational responsibilities, not advanced add-ons
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 3</span>
              <span className="topic-title">Workplace Culture and Engagement — Beyond the Paycheck</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout green">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand workplace culture and why it shapes every HR system · Explain employee
                    engagement as more than motivation or satisfaction · Recognise non-financial factors that influence
                    attraction, retention, and performance · Appreciate recognition, communication, and inclusion as practical
                    and powerful HR tools</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.1 — What is Workplace Culture and Why Does It Matter?</div>
                <div className="prose">
                  <p>Organizations may have world-class recruitment processes, clear policies, and structured onboarding — and
                    still struggle if the workplace culture is unhealthy or if employees feel disconnected from their work.
                    Culture is not a "nice to have" — it is the environment in which every HR system either thrives or fails.
                  </p>
                  <p><strong>Workplace culture</strong> refers to the shared values, norms, behaviours, and expectations that
                    shape everyday interactions in an organization. Culture is often unspoken — reflected in how decisions are
                    made, how people are treated under pressure, what behaviours are rewarded or discouraged, and whether
                    people feel safe to speak up.</p>
                  <p>Edgar Schein's model of organizational culture describes three levels:</p>
                  <ul>
                    <li><strong>Artefacts (visible):</strong> Office layout, dress code, company rituals, communication style
                    </li>
                    <li><strong>Espoused values (stated):</strong> Mission statements, HR policies, leadership messaging</li>
                    <li><strong>Underlying assumptions (deepest level):</strong> The unconscious beliefs that actually drive
                      behaviour, often invisible until they are violated</li>
                  </ul>
                  <p>HR plays a critical role in shaping culture intentionally — through hiring decisions, onboarding
                    experiences, management development, recognition programmes, and the policies it designs and enforces.
                    <strong>Culture is something HR helps shape, not something that just happens.</strong>
                  </p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.2 — Employee Engagement: What It Really Means</div>
                <div className="prose">
                  <p>Employee engagement is one of the most discussed — and most misunderstood — concepts in HR. It is
                    frequently confused with employee satisfaction (how happy someone is) or employee motivation (how driven
                    someone feels at a given moment). Engagement is something deeper and more consequential.</p>
                  <p><strong>Employee engagement</strong> refers to the emotional and psychological connection an employee has
                    with their work, their team, and the organization's goals. An engaged employee is not just doing their job
                    — they are <strong>putting in discretionary effort</strong>: going beyond what is required because they
                    genuinely care about the outcome.</p>
                  <p>Gallup's research consistently demonstrates that engagement is one of the strongest predictors of
                    organizational performance. Highly engaged teams show:</p>
                  <ul>
                    <li>21% higher profitability</li>
                    <li>17% higher productivity</li>
                    <li>59% lower turnover in low-turnover industries</li>
                    <li>41% lower absenteeism</li>
                  </ul>
                  <p>Importantly, engagement is not static — it fluctuates based on management quality, organizational
                    fairness, workload, recognition, and alignment with values. This is why measuring and monitoring
                    engagement through pulse surveys, eNPS scores, and stay interviews is a core HR responsibility.</p>
                  <div className="callout blue">
                    <div className="callout-icon">📊</div>
                    <div>
                      <div className="callout-label">Gallup State of the Global Workplace (2023)</div>
                      <div className="callout-text">Only 23% of employees globally report being engaged at work. In the UK, the
                        figure is even lower. The cost of disengagement — through reduced productivity, higher absenteeism,
                        and voluntary turnover — is estimated at $8.8 trillion globally per year. HR has both the tools and
                        the responsibility to address this.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.3 — Beyond Pay: What Truly Motivates and Retains Employees</div>
                <div className="prose">
                  <p>The assumption that pay is the primary driver of employee motivation and retention is not supported by
                    evidence. While compensation must be fair and competitive, research consistently shows that pay alone is
                    neither sufficient to attract top talent nor to sustain long-term engagement.</p>
                  <p>A 2025 Melp industry report identified the following non-financial factors as most influential in
                    attracting and retaining employees:</p>
                  <ul>
                    <li><strong>Meaningful work:</strong> Employees want to feel their contribution matters and connects to a
                      larger purpose</li>
                    <li><strong>Career development:</strong> Clear progression pathways, access to learning, and regular
                      development conversations signal that the organization is invested in the individual's future</li>
                    <li><strong>Flexible working:</strong> Control over when and where work happens significantly increases
                      job satisfaction, particularly for caregivers</li>
                    <li><strong>Recognition:</strong> Timely, specific, and sincere recognition of contributions builds
                      belonging and reinforces valued behaviours</li>
                    <li><strong>Values alignment:</strong> Employees who share the organization's stated values and see those
                      values lived authentically by leadership are significantly more committed</li>
                    <li><strong>Manager quality:</strong> Gallup's research shows that managers account for up to 70% of
                      variance in employee engagement — making manager development one of HR's highest-leverage investments
                    </li>
                  </ul>
                  <p>HR contributes to these areas even without formal authority over compensation — by supporting flexible
                    work policies, designing recognition programmes, facilitating development conversations, and holding
                    leaders accountable for the culture they create.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.4 — Recognition and Communication as Engagement Tools</div>
                <div className="prose">
                  <p><strong>Recognition</strong> is one of the most practical and highest-impact engagement tools available
                    to HR, and one of the least expensive. It involves acknowledging employee contributions in ways that are
                    timely, sincere, specific, and aligned with organizational values. Recognition does not need to be complex
                    or costly — simple acknowledgements, public praise at team meetings, written appreciation messages, or
                    peer-to-peer nomination programmes can have meaningful and lasting impact.</p>
                  <p>Research cited in the 2025 Melp blog found that employees who feel regularly recognized are 45% less
                    likely to leave within two years. The key qualities of effective recognition are:</p>
                  <ul>
                    <li><strong>Timely:</strong> Recognition given close to the action it acknowledges has the most impact
                    </li>
                    <li><strong>Specific:</strong> "You handled that difficult client conversation with real composure and
                      professionalism" lands far better than "great job this week"</li>
                    <li><strong>Values-linked:</strong> Connecting recognition to company values reinforces culture and makes
                      the recognition feel meaningful</li>
                    <li><strong>Visible:</strong> Public recognition builds social belonging and models the behaviours the
                      organization wants to see more of</li>
                  </ul>
                  <p><strong>Communication</strong> is equally important. Employees are more engaged when they feel informed,
                    heard, and included in organizational decisions that affect them. HR plays a key role in supporting clear
                    two-way communication — not just delivering information top-down, but creating channels for employees to
                    provide feedback, raise concerns, and contribute ideas. When communication is poor, rumour fills the
                    vacuum — and rumour almost always creates more anxiety than the truth would have.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.5 — Introducing Inclusion at Foundation Level<span className="deib-tag">DEIB</span>
                </div>
                <div className="prose">
                  <p><strong>Inclusion</strong> is the practice of ensuring that all people feel respected, valued, and able
                    to participate fully in the workplace — regardless of their background, identity, or characteristics. At
                    foundation level, inclusion is understood through simple but powerful everyday practices:</p>
                  <ul>
                    <li><strong>Respectful language:</strong> Using language that includes rather than excludes, and being
                      open to learning when language causes unintended offence</li>
                    <li><strong>Consistent policy application:</strong> Ensuring the same policies are applied to all
                      employees without favouritism or informal exceptions</li>
                    <li><strong>Fair access to opportunity:</strong> Making sure development opportunities, stretch
                      assignments, and recognition are available to all employees — not just a visible or favoured few</li>
                    <li><strong>Acknowledging difference without exclusion:</strong> Recognising that employees have different
                      needs and circumstances — and that accommodating those differences is good management, not special
                      treatment</li>
                  </ul>
                  <p>Inclusive culture is not created through mission statements or one-off diversity training sessions. It is
                    created through the <strong>cumulative effect of hundreds of small everyday behaviours and
                      decisions</strong> — how a manager responds when someone raises a concern, whether a new employee is
                    genuinely welcomed into the team, whether flexible working requests are treated equally, whether feedback
                    is given consistently across employees of different backgrounds.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Workplace culture shapes how every HR system — policies, processes, rewards — is
                  actually experienced by employees; a strong culture makes good systems work, a weak culture undermines even
                  well-designed ones
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Employee engagement is driven by connection, recognition, and meaning — not pay
                  alone; Gallup research shows engaged teams are 21% more profitable and 59% less likely to leave
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Non-financial factors — meaningful work, career development, flexibility,
                  recognition, values alignment, and manager quality — are as important as compensation in attracting and
                  retaining talent
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Inclusion, recognition, and two-way communication are foundational HR
                  responsibilities that operate through everyday behaviours, not statements or one-off initiatives
                </div>
              </div>
            </div>
          </div>
          <div className="case-wrap">
            <div className="case-head" style={{ "background": "linear-gradient(135deg,#7a4500,#c97d1a)" }}>
              <div className="case-tag">Level 1 Case Study</div>
              <div className="case-title">HR's New Hire Dilemma — Earning Trust from Day One</div>
              <div className="case-sub">Anita at TechSolutions — building HR from scratch while rebuilding trust from 30% to 60%
              </div>
            </div>
            <div className="case-body">
              <div className="case-phase">
                <div className="case-phase-label">Scenario</div>
                <div className="prose">
                  <p>Anita, a recent graduate, is the first dedicated HR officer at TechSolutions, a growing tech startup.
                    From day one she senses unease — conversations become guarded when she introduces herself as HR. An
                    internal pulse survey reveals only <strong>30% of employees trust HR</strong>. Common feedback: "HR exists
                    only to protect management," "HR never communicates policy changes clearly," "HR is just about enforcing
                    rules." Anita must build trust while simultaneously creating basic HR systems from scratch — with no
                    budget for external consultants and no HR team to support her.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 1 — Addressing Perception Before Policies</div>
                <div className="prose">
                  <p>Rather than immediately drafting policies — which would reinforce the "HR enforces rules" stereotype —
                    Anita chooses to focus first on perception and relationship-building. She introduces informal <strong>"HR
                      Open House" sessions</strong>: casual 30-minute conversations where employees can speak freely. She
                    acknowledges common HR stereotypes directly, drawing on insights from a BambooHR report to validate
                    employee concerns. She shares anonymized survey findings and explains her commitment to confidentiality
                    and ethical practice moving forward.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">Why does Anita acknowledge stereotypes rather than defend against them?</div>
                  <div className="pause-q">How does transparency at this stage begin to rebuild HR credibility?</div>
                  <div className="pause-q">What risks does she take by being this open with employees?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 2 — Implementing Structure and Clarity</div>
                <div className="prose">
                  <p>With leadership support, Anita drafts a simple <strong>employee handbook</strong> covering code of
                    conduct, leave entitlements, flexible working, and complaint procedures. Critically, when rolling out
                    these policies, Anita does not simply distribute documents — she holds brief team sessions to explain
                    <em>why each policy exists</em>: "This leave policy exists so that everyone knows exactly what they're
                    entitled to, and decisions are made consistently and fairly — not based on who your manager likes." This
                    approach connects policy to fairness rather than to control.
                  </p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">How does explaining the purpose of a policy change how employees receive it?</div>
                  <div className="pause-q">What HR principle from Topic 2 is Anita demonstrating here?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 3 — A Simple Engagement Initiative</div>
                <div className="prose">
                  <p>Noticing persistent low morale in one department, Anita introduces a monthly <strong>recognition
                      initiative</strong>. Employees nominate a colleague who has demonstrated a company value —
                    collaboration, innovation, or customer focus. Recognitions are shared at all-hands meetings and on the
                    company Slack channel. Anita ensures recognitions are specific and meaningful, highlighting exactly what
                    the person did and why it mattered. Over time, employees begin to respond positively — seeing peers
                    publicly acknowledged creates visible shifts in workplace atmosphere and belonging.</p>
                </div>
              </div>
              <div className="outcome-box">
                <div className="ob-title">Outcome — Three Months Later</div>
                <div className="ob-item">Trust in HR rises from 30% to 60% — a 30-percentage-point improvement in 12 weeks</div>
                <div className="ob-item">Communication and approachability improve significantly across all departments</div>
                <div className="ob-item">New hires report smoother onboarding following a simple checklist covering IT access,
                  role clarity, and a buddy system</div>
                <div className="ob-item">Leadership notes fewer employee issues escalating directly to the CEO — Anita has become
                  a trusted first point of contact</div>
              </div>
              <div className="callout green">
                <div className="callout-icon">📋</div>
                <div>
                  <div className="callout-label">Case Analysis</div>
                  <div className="callout-text">This case illustrates all three Level 1 topics simultaneously: confronting
                    stereotypes through transparency (Topic 1), building structure through well-communicated policies (Topic
                    2), and strengthening engagement through recognition and belonging (Topic 3). Trust is rebuilt not through
                    authority — but through consistency, openness, and ethical practice.</div>
                </div>
              </div>
              <div className="appq-box">
                <div className="appq-title">Application Questions</div>
                <div className="appq-item">Which of Anita's three actions had the most impact on trust, and why?</div>
                <div className="appq-item">What would you have done differently in her first week?</div>
                <div className="appq-item">How would you measure whether trust had genuinely improved beyond just a survey score?
                </div>
              </div>
            </div>
          </div>
          <div className="game-zone">
            <div className="game-zone-header">
              <div className="game-zone-title">🎮 Gamified Activities — Level 1: HR Foundations</div>
              <div className="game-zone-sub">HR Quest Starter Pack · Engagement Pulse · Manager Impact Simulator</div>
              <div className="game-zone-note">Use the in-game menu to navigate between all three activities</div>
            </div>
            <iframe className="game-frame" src="/learning-module/games/level-1-hr-foundations.html" title="Gamified Activities — Level 1: HR Foundations" loading="lazy"></iframe>
          </div>
          <div className="review-wrap">
            <div className="review-head">
              <div className="review-head-title">Review & Practice — Level 1</div>
              <div className="review-head-sub">Deepening your thinking before Level 2</div>
            </div>
            <div className="review-body">
              <div className="review-q">
                <div className="review-q-num">Reflection 1</div>
                <div className="review-q-text">Think about a time you interacted with HR or observed HR practice. Using the
                  principles from Level 1, how might that experience have been different with better HR practice?</div>
                <div className="review-q-hint">Consider: Was trust built or damaged? Were policies explained clearly or simply
                  enforced? Was recognition or belonging present or absent? What would you have done differently as the HR
                  professional in that situation?</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Reflection 2</div>
                <div className="review-q-text">Identify one specific action you would take to build trust or engagement in the
                  situation you described. Be concrete — describe the action, the reasoning behind it, and the outcome you
                  would expect.</div>
                <div className="review-q-hint">Not "improve communication" — but specifically: what would you say, to whom, in
                  what format, and why would that particular action build trust?</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Critical Thinking</div>
                <div className="review-q-text">HR professionals sometimes face situations where employee needs and organizational
                  needs genuinely conflict. Based on Topic 1's discussion of professional identity, how would you navigate a
                  situation where what is "right" for an employee differs from what your manager is asking you to do?</div>
              </div>
              <div className="stretch-box">
                <div className="stretch-label">Optional Stretch Review</div>
                <div className="prose" style={{ "fontSize": "12.5px" }}>
                  <p>Level 2 moves from understanding HR to <em>doing</em> HR — with structured tools, checklists, and DEIB
                    embedded in every operational process. Before you begin Level 2, consider: What is the difference between
                    knowing that "recruitment should be fair" (Level 1 understanding) and actually designing a fair
                    recruitment process step by step (Level 2 practice)? This distinction — between conceptual knowledge and
                    operational skill — is what Level 2 will build.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-slate">📚</div>
              <div className="card-info">
                <div className="card-title">References</div>
                <div className="card-sub">All sources cited in this level</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="refs-list">
                <div className="ref-item">BambooHR. (2022). <em>Why employees don't trust HR.</em> BambooHR Research.</div>
                <div className="ref-item">BambooHR. (2023). <em>10 HR stereotypes we need to talk about.</em> BambooHR Research.
                </div>
                <div className="ref-item">Chartered Institute of Personnel and Development (CIPD). (2023). <em>HR policies:
                    Factsheets and guidance.</em> CIPD.</div>
                <div className="ref-item">Gallup. (2023). <em>State of the global workplace 2023 report.</em> Gallup Press.</div>
                <div className="ref-item">Melp. (2025). <em>Beyond pay: What truly attracts top talent in 2025.</em> Melp HR Blog.
                </div>
                <div className="ref-item">Melp. (2025). <em>How to write a great recognition post.</em> Melp HR Blog.</div>
                <div className="ref-item">Schein, E. H. (2010). <em>Organizational culture and leadership</em> (4th ed.).
                  Jossey-Bass.</div>
                <div className="ref-item">Society for Human Resource Management (SHRM). (2022). <em>Onboarding new employees:
                    Maximizing success.</em> SHRM Foundation.</div>
              </div>
            </div>
          </div><button className="continue-btn cb-amber" onClick={() => setActiveTab("l2")}>Continue to Level 2 — Operational HR →</button>
        </div>
        <div id="tab-l2" className={`panel${activeTab === "l2" ? " active" : ""}`}>
          <div className="hero hero-l2">
            <div className="hero-tag">Level 2 · Operational HR · Decision-making + Real-life Application</div>
            <div className="hero-title">Putting Principles into Practice</div>
            <div className="hero-sub">This level is where you start doing HR — not just describing it. You will learn how to run
              key HR processes including hiring, onboarding, performance management, development, and retention in a
              structured, fair, and consistent way. You will practice applying DEIB inside everyday decisions, using toolkits,
              checklists, and simple metrics to solve real workplace problems with confidence and evidence.</div>
            <div className="hero-note">📌 Research-backed content designed to prepare learners for practical and strategic HR
              roles</div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-amber">🎯</div>
              <div className="card-info">
                <div className="card-title">Learning Outcomes</div>
                <div className="card-sub">What you will be able to do by the end of Level 2</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="outcomes">
                <div className="oc amber">
                  <div className="oc-n">1</div>
                  <div className="oc-text">Implement core HR processes — recruitment, performance management, retention — in a
                    consistent, operational way, aligned with policy and best practice</div>
                </div>
                <div className="oc amber">
                  <div className="oc-n">2</div>
                  <div className="oc-text">Apply DEIB principles practically in routine HR tasks such as hiring, onboarding,
                    performance conversations, and engagement initiatives</div>
                </div>
                <div className="oc amber">
                  <div className="oc-n">3</div>
                  <div className="oc-text">Use practical HR tools — checklists, templates, scorecards, simple metrics — to improve
                    efficiency, fairness, documentation quality, and decision consistency</div>
                </div>
                <div className="oc amber">
                  <div className="oc-n">4</div>
                  <div className="oc-text">Analyze common operational HR problems and propose solutions grounded in toolkits and
                    evidence, demonstrating growing HR judgment</div>
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 1</span>
              <span className="topic-title">Talent Acquisition and Onboarding — Hiring the Right Way (with DEIB)</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout amber">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Execute a structured recruitment process from workforce planning to final
                    selection · Apply DEIB principles practically at each stage of hiring · Use operational tools — job
                    profiles, screening criteria, interview rubrics, onboarding checklists — to reduce bias · Design an
                    onboarding process that improves clarity, belonging, and early retention · Identify common recruitment
                    failures and know how to prevent them</div>
                </div>
              </div>
              <div className="callout amber">
                <div className="callout-icon">⚠️</div>
                <div>
                  <div className="callout-label">Why this topic matters</div>
                  <div className="callout-text">Hiring is one of the most visible and risky HR activities. A poorly run
                    recruitment process damages trust, increases turnover, and exposes the organization to bias and legal
                    risk. A well-run process sets expectations clearly, widens access to opportunity, and improves performance
                    long before the first appraisal. This topic treats recruitment and onboarding as a single operational
                    system — hiring does not end with an offer letter; it succeeds or fails in the first 90 days.</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.1 — Workforce Planning and Job Design<span className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Recruitment problems often begin before a vacancy is advertised. If a role is poorly defined, every later
                    decision becomes subjective. Start by clarifying: <strong>why the role exists</strong>, what problem it
                    solves, and what outcomes success should produce. This is translated into a <strong>job profile</strong> —
                    not just a job title:</p>
                  <ul>
                    <li>Key responsibilities (what the person will actually do)</li>
                    <li>Essential skills and knowledge (what is truly required on day one)</li>
                    <li>Desirable skills (what can be learned over time)</li>
                    <li>Reporting lines and collaboration points</li>
                  </ul>
                  <p><strong>DEIB in job design:</strong> Critically review requirements to avoid unnecessary barriers —
                    requiring "10 years' experience" when 5 would suffice, vague phrases like "must be a cultural fit,"
                    overemphasis on formal credentials when skills are more relevant. Inclusive job design widens the talent
                    pool without lowering standards — it <em>clarifies</em> standards.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.2 — Sourcing, Advertising, and Screening<span className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Once the role is defined, decide where and how to attract candidates. Select sourcing channels based on
                    the role (job boards, referrals, professional networks, social media, campus routes), and draft a job
                    advertisement that reflects the job profile accurately — using clear, neutral language, focusing on
                    essential requirements, and stating commitment to fairness and equal opportunity.</p>
                  <p><strong>Screening</strong> is where bias most easily enters if decisions rely on gut feeling. The
                    operational discipline is:</p>
                  <ul>
                    <li>Define screening criteria <em>before</em> reviewing applications</li>
                    <li>Apply the same criteria to all candidates using a simple scoring system</li>
                    <li>Focus on evidence, not assumptions — be aware of systemic disadvantages such as career breaks or
                      non-linear paths</li>
                    <li>Names, age indicators, and irrelevant personal details should not influence screening decisions</li>
                  </ul>
                  <p>Consistency protects both the candidate and the organization from bias and legal challenge.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.3 — Structured Interviews and Fair Selection<span className="deib-tag">DEIB</span>
                </div>
                <div className="prose">
                  <p>Interviews are assessment tools, not casual conversations. Structured interviews require planning in
                    advance, asking each candidate the same core questions, and using a shared scoring rubric.</p>
                  <ul>
                    <li><strong>Behavioural questions:</strong> "Tell me about a time when you had to manage a significant
                      conflict at work…"</li>
                    <li><strong>Situational questions:</strong> "What would you do if a colleague raised a concern about a
                      manager's behaviour?"</li>
                    <li><strong>Clarification questions:</strong> Tied to specific items in the candidate's application</li>
                  </ul>
                  <p>After each interview, scores are recorded <em>before</em> discussion to reduce the influence of dominant
                    voices on the panel. Hiring decisions must be explainable — comparing candidates against documented
                    criteria using scores and evidence, not memory. This protects the organization if decisions are questioned
                    later and reinforces fairness.</p>
                  <p><strong>DEIB in interviewing:</strong> Make reasonable accommodations where needed. Avoid inappropriate
                    or illegal questions. Be conscious that "communication style" or "confidence" can reflect cultural
                    differences rather than competence. The goal is to assess <strong>capability, not similarity</strong>.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.4 — Onboarding: Turning a Hire into a Contributor</div>
                <div className="prose">
                  <p>Recruitment success collapses without effective onboarding. Design onboarding across three phases:</p>
                  <ul>
                    <li><strong>Pre-boarding (before Day 1):</strong> Offer letter and role clarity, access setup (email,
                      systems, equipment), welcome communication introducing team members</li>
                    <li><strong>First Day and First Week:</strong> Orientation to role and expectations, introduction to team
                      and culture, clear explanation of policies and support channels, meeting with direct manager to agree
                      initial priorities</li>
                    <li><strong>First 30–90 Days:</strong> Structured check-ins with manager and HR, feedback loops in both
                      directions, buddy or mentoring support, progress review against agreed expectations</li>
                  </ul>
                  <p><strong>Common operational pitfalls to avoid:</strong> Rushing hires due to pressure · Changing criteria
                    mid-process · Over-reliance on referrals · Treating onboarding as paperwork · Assuming new hires will
                    "figure it out." Each of these increases turnover and reduces trust.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Hiring quality depends on structure, not speed or intuition — every stage from job
                  design to onboarding requires documented criteria and consistent application
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>DEIB becomes real when embedded into job design, screening, interviews, and
                  onboarding — not added as an afterthought or standalone policy statement
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Onboarding is a retention tool: structured 30/60/90-day programmes significantly
                  reduce early exits and build the belonging that keeps new hires committed beyond their first year
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 2</span>
              <span className="topic-title">Performance Management and Development — Driving Growth and Accountability</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout amber">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Set clear, measurable, and fair performance expectations · Operate a structured
                    appraisal process using standardized tools · Support managers in giving constructive evidence-based
                    feedback · Apply corrective actions such as Performance Improvement Plans fairly and consistently · Design
                    development plans that link performance to learning and career growth · Integrate DEIB into all
                    performance evaluation and development decisions</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.1 — Performance Management as a Continuous Cycle</div>
                <div className="prose">
                  <p>A common operational mistake is treating performance management as an annual form-filling exercise. In
                    reality, performance management is a <strong>continuous cycle</strong> made up of four linked stages:</p>
                  <ol>
                    <li><strong>Setting expectations:</strong> Translating team and organizational objectives into clear
                      individual goals at the start of the performance period</li>
                    <li><strong>Monitoring and feedback:</strong> Regular check-ins, timely feedback on observed behaviours,
                      documentation of key discussions</li>
                    <li><strong>Evaluation and documentation:</strong> Formal appraisal based on evidence from throughout the
                      performance period, not just recent memory</li>
                    <li><strong>Development and follow-up:</strong> Translating performance conversations into development
                      plans with clear actions, timelines, and support</li>
                  </ol>
                  <p>If any stage is weak, the entire system loses credibility. As an HR professional, you are responsible for
                    designing, coordinating, and protecting this cycle — even though managers carry out many of the
                    conversations.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.2 — Setting SMART Goals and Fair Expectations<span className="deib-tag">DEIB</span>
                </div>
                <div className="prose">
                  <p>Performance problems often begin with unclear or unfair goals. Help managers translate team objectives
                    into individual goals that are:</p>
                  <ul>
                    <li><strong>Specific:</strong> Describing what is expected in concrete, observable terms</li>
                    <li><strong>Measurable:</strong> Including criteria for how success will be assessed</li>
                    <li><strong>Achievable:</strong> Realistic given the employee's role, experience, and available resources
                    </li>
                    <li><strong>Relevant:</strong> Connected to team, department, and organizational objectives</li>
                    <li><strong>Time-bound:</strong> With clear review dates and milestones</li>
                  </ul>
                  <p>Clear goals answer three essential questions for employees: <em>What is expected of me? How will success
                      be measured? When will my performance be reviewed?</em></p>
                  <p><strong>DEIB in goal-setting:</strong> Watch for unequal distribution of challenging or visible goals,
                    assumptions about capability based on background or communication style, and goals that ignore access to
                    resources or support. <strong>Fair performance starts with fair expectations.</strong></p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.3 — Continuous Feedback and Constructive Conversations</div>
                <div className="prose">
                  <p>Waiting until appraisal time to discuss performance creates anxiety and defensiveness. Encourage regular
                    check-ins (monthly or quarterly), feedback that is timely and specific, and documentation of key
                    discussions and agreed actions.</p>
                  <p>Good feedback focuses on: observable behaviours, impact on work or team outcomes, and clear next steps.
                    Rather than saying "You're not proactive," effective feedback sounds like: <em>"Deadlines were missed on
                      two occasions last month. Let's discuss what support or adjustments would help you manage the workload
                      differently."</em></p>
                  <p>Ensure feedback standards are <strong>consistent across all employees</strong> — communication style
                    differences must not be mistaken for competence differences. Employees must be given equal opportunity to
                    respond and explain context. Consistency here protects both trust and legal defensibility.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.4 — Performance Improvement Plans and Managing Underperformance<span
                    className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Underperformance should be addressed early, clearly, and fairly — not left to accumulate until a formal
                    disciplinary process is unavoidable. Guide managers to identify performance gaps using evidence, have
                    structured respectful conversations, and agree on improvement actions and timelines before resorting to
                    formal processes.</p>
                  <p>When informal support is not sufficient, implement a <strong>Performance Improvement Plan (PIP)</strong>.
                    A PIP typically includes:</p>
                  <ul>
                    <li>Clear, specific performance expectations that define what "good" looks like</li>
                    <li>Support or training to be provided to help the employee achieve expectations</li>
                    <li>Review dates with milestones to assess progress</li>
                    <li>Consequences if improvement does not occur by the agreed dates</li>
                  </ul>
                  <p><strong>DEIB in corrective action:</strong> PIPs must be used consistently — not selectively applied to
                    employees from particular groups. Employees should never be disciplined for unclear expectations.
                    Documentation must reflect observable facts, not assumptions or subjective language that penalises
                    difference.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.5 — Development Planning: Linking Performance to Growth<span
                    className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Performance management is incomplete without development. Translate performance discussions into
                    development actions: training courses or workshops, coaching or mentoring relationships, stretch
                    assignments, and Individual Development Plans (IDPs).</p>
                  <p>Development planning answers: <em>What skills does this employee need to grow? What opportunities can the
                      organization realistically provide? How does development link to future roles or progression?</em></p>
                  <p><strong>DEIB in development:</strong> Ensure development opportunities are transparent and access is not
                    limited to a small "high-potential" group without clear, equitable criteria. Career pathways must be
                    visible and fair. Development builds engagement — <strong>but only if employees perceive it as equitable
                      and accessible to everyone</strong>.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Performance management works best as a continuous, documented cycle — not an
                  annual event; managers who only discuss performance at appraisal time damage trust and miss the opportunity
                  to support improvement
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Fairness depends on clear goals, evidence-based evaluation, and consistent
                  feedback — DEIB must be embedded in goal-setting, appraisal, corrective action, and development planning
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Development is not a reward — it is part of managing performance well;
                  transparent, equitable access to learning and career pathways is an operational HR responsibility
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 3</span>
              <span className="topic-title">Retention and Employee Well-being — Keeping and Engaging Your Talent</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout amber">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand and measure different types of employee turnover · Identify common
                    operational drivers of attrition and disengagement · Design practical retention strategies grounded in
                    evidence and feasibility · Embed DEIB principles into retention and engagement efforts · Recognise early
                    signs of burnout and respond with structural solutions · Use data and feedback tools to monitor retention
                    and well-being outcomes</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.1 — Understanding Turnover: What Retention Really Measures</div>
                <div className="prose">
                  <p>Retention is not about keeping everyone forever. It is about keeping the right people, for the right
                    reasons, for a reasonable period of time. Retention therefore begins with diagnostic thinking, not
                    knee-jerk solutions.</p>
                  <p>First, distinguish between:</p>
                  <ul>
                    <li><strong>Voluntary turnover:</strong> Employees choose to leave — the most important category for HR to
                      understand and address</li>
                    <li><strong>Involuntary turnover:</strong> Terminations, redundancies — organization-initiated departures
                    </li>
                  </ul>
                  <p>When analysing voluntary turnover, ask: <em>Who is leaving? When in their tenure? From which teams or
                      roles? For what stated reasons?</em> Patterns matter more than single exits. Early exits (within the
                    first year) often point to onboarding or expectation issues; exits among experienced staff often reflect
                    growth, workload, or leadership problems. Retention is therefore a <strong>diagnostic tool</strong>, not
                    just a score.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.2 — Why Employees Leave: Operational Drivers of Attrition</div>
                <div className="prose">
                  <p>Employees rarely leave for one reason. Most departures result from overlapping factors that accumulate
                    over time. Common operational drivers include:</p>
                  <ul>
                    <li><strong>Lack of growth or development opportunities</strong> — the most frequently cited reason in
                      exit interviews across industries</li>
                    <li><strong>Poor or inconsistent management</strong> — "people don't leave companies, they leave managers"
                      is supported by decades of Gallup data</li>
                    <li><strong>Excessive workload or burnout</strong> — chronic overwork without recovery time erodes even
                      highly engaged employees</li>
                    <li><strong>Perceived unfairness</strong> in pay, promotion, recognition, or treatment</li>
                    <li><strong>Weak sense of belonging or inclusion</strong> — employees who do not feel they belong leave
                      earlier and at higher rates</li>
                  </ul>
                  <p>Operational HR focuses on controllable drivers. While HR may not set pay alone, it can influence
                    transparency, development access, manager capability, and workload design. <strong>Retention improves when
                      employees feel valued, treated fairly, supported, and able to see a future within the
                      organization.</strong></p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.3 — Retention Strategies That Actually Work<span className="deib-tag">DEIB</span>
                </div>
                <div className="prose">
                  <p>Retention is not solved by a single perk. It requires a portfolio of consistently applied actions,
                    prioritized based on the organization's specific reality:</p>
                  <ul>
                    <li><strong>Career growth and development:</strong> Clear progression pathways, internal mobility
                      opportunities, access to learning and mentoring</li>
                    <li><strong>Recognition and appreciation:</strong> Regular, specific recognition tied to contribution;
                      transparent criteria for rewards and promotions</li>
                    <li><strong>Manager effectiveness:</strong> Training managers to give feedback and support well-being;
                      holding managers accountable for engagement outcomes</li>
                    <li><strong>Flexibility and work design:</strong> Flexible scheduling where possible, reasonable workload
                      expectations, respect for boundaries and recovery time</li>
                    <li><strong>Belonging and inclusion:</strong> ERGs, mentorship or sponsorship programs, transparent
                      promotion criteria, regular stay interviews to surface concerns early</li>
                  </ul>
                  <p>Retention improves most when these actions are <strong>consistent and integrated</strong> — not
                    occasional initiatives launched in response to a spike in turnover.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.4 — Employee Well-being: From Individual Coping to Structural Support</div>
                <div className="prose">
                  <p>Well-being is often misunderstood as personal resilience — the idea that employees simply need to manage
                    stress better individually. Operational HR reframes it as a <strong>system design issue</strong>. Burnout
                    is not caused by employee weakness; it is caused by organizational conditions that create chronic stress
                    without adequate recovery.</p>
                  <p>Identify structural drivers of poor well-being:</p>
                  <ul>
                    <li>Workload patterns that consistently exceed reasonable capacity</li>
                    <li>Role ambiguity or unrealistic expectations that create constant uncertainty</li>
                    <li>Cultural norms that reward overwork and penalise rest — e.g. responding to emails at midnight being
                      seen as dedication</li>
                    <li>Lack of autonomy or control over work methods and scheduling</li>
                  </ul>
                  <p>Structural well-being initiatives include: clear workload prioritization frameworks, adequate staffing,
                    explicit encouragement and modelling of time off by senior leaders, and access to Employee Assistance
                    Programs (EAPs). <strong>Burnout prevention works best when leaders model healthy behaviour and HR embeds
                      well-being into policies and expectations.</strong></p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.5 — Using Data and Feedback to Sustain Retention</div>
                <div className="prose">
                  <p>Retention efforts must be monitored with data, not opinion. Use:</p>
                  <ul>
                    <li><strong>Exit interviews:</strong> Structured conversations to understand departure reasons — ask about
                      development, management, workload, belonging, and perceived fairness</li>
                    <li><strong>Stay interviews:</strong> Proactive conversations with current employees to understand what
                      would make them leave — conducted before they have decided to go</li>
                    <li><strong>Engagement surveys:</strong> Regular pulse surveys or annual surveys to identify risk areas
                      and track trends</li>
                    <li><strong>Retention metrics by team, role, or tenure:</strong> Segmentation reveals patterns invisible
                      in aggregate turnover rates</li>
                  </ul>
                  <p>Data shifts conversations from opinions — <em>"people just don't want to work hard anymore"</em> — to
                    actionable insights: <em>"new hires are leaving after six months primarily citing unclear expectations and
                      infrequent manager contact."</em> <strong>Retention improves when employees see action taken in response
                      to feedback, not just the surveys themselves.</strong></p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Retention reflects the quality of everyday HR and management practices — not just
                  compensation; addressing the operational drivers of attrition requires a portfolio of consistently applied
                  actions, not one-off initiatives
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Belonging, fairness, and growth are as important as compensation in sustaining
                  long-term commitment — DEIB-informed retention strategies directly address the groups most likely to leave
                  earliest
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Well-being must be supported structurally, not left to individual resilience —
                  burnout is caused by organizational conditions, and HR has both the tools and responsibility to address them
                  through policy, workload design, and leadership accountability
                </div>
              </div>
            </div>
          </div>
          <div className="case-wrap">
            <div className="case-head" style={{ "background": "linear-gradient(135deg,#5c3a0a,#c97d1a)" }}>
              <div className="case-tag">Level 2 Case Study</div>
              <div className="case-title">From Hiring to Staying — Fixing the Retention Breakdown at HealthCo</div>
              <div className="case-sub">Maria, HR Operations Manager — 25% turnover, 600 employees, one year to reverse the trend
              </div>
            </div>
            <div className="case-body">
              <div className="case-phase">
                <div className="case-phase-label">Background</div>
                <div className="prose">
                  <p>HealthCo is a mid-sized healthcare organization with approximately 600 employees — nurses, clinicians,
                    and support staff. Despite competitive pay and strong demand for healthcare services, HealthCo has
                    struggled with high employee turnover. By end of 2024: annual turnover reached 25%, well above industry
                    averages. Exit interviews frequently mentioned: "Limited growth opportunities," "Burnout from long hours,"
                    "I didn't feel like I belonged." New hires were leaving within the first year at a concerning rate. Senior
                    leadership tasked <strong>Maria, the HR Operations Manager</strong>, with reversing the trend within one
                    year without significantly increasing payroll costs.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 1 — Diagnosing the Problem</div>
                <div className="prose">
                  <p>Maria began by reviewing: exit interview summaries, time-to-hire metrics, performance appraisal
                    completion rates, and engagement survey comments. Patterns emerged: hiring was fast but inconsistent;
                    interviews varied widely between managers; performance reviews were irregular and often undocumented;
                    development conversations were rare; burnout complaints concentrated in specific departments. Importantly,
                    <strong>turnover was highest among early-career staff and underrepresented groups</strong> — suggesting
                    inclusion and support issues beyond workload.
                  </p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">Is turnover primarily a hiring issue, a management issue, or a system issue?</div>
                  <div className="pause-q">Which data points matter most right now and why?</div>
                  <div className="pause-q">What risks exist if HealthCo focuses on retention without fixing hiring and performance
                    practices first?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 2 — Fixing Hiring and Onboarding</div>
                <div className="prose">
                  <p>Maria suspected retention problems began at entry. She redesigned recruitment and onboarding processes
                    using structured, inclusive practices: standardized interview questions tied to role competencies; diverse
                    interview panels where possible; clearer job previews honestly explaining workload realities; removal of
                    identifying details during early resume screening; a structured onboarding checklist covering role
                    clarity, buddy assignment, and 30/60/90-day check-ins. New hires reported feeling better prepared, more
                    confident about expectations, and more comfortable asking questions.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">How does structured hiring reduce early turnover?</div>
                  <div className="pause-q">Which DEIB elements are visible in these operational changes?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 3 — Repairing Performance Management</div>
                <div className="prose">
                  <p>Maria discovered that performance management was inconsistent and reactive — many employees had not
                    received meaningful feedback in over a year. She introduced: a bi-annual appraisal cycle using
                    standardized forms; manager training on SMART goal-setting; quarterly check-ins focused on development,
                    not just evaluation; Individual Development Plans (IDPs) for all staff; and a clinical career ladder
                    outlining progression criteria and associated skill development. One nurse, Jamal, shared: <em>"This was
                      the first time anyone discussed a career path with me in five years."</em></p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">How does development planning influence retention beyond pay?</div>
                  <div className="pause-q">What DEIB risks exist if development opportunities remain informal and
                    manager-discretionary?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 4 — Addressing Well-being and Belonging</div>
                <div className="prose">
                  <p>HR partnered with leadership to: introduce flexible self-scheduling where feasible; encourage managers to
                    normalise PTO usage; launch an Employee Assistance Program (EAP); and train managers to identify burnout
                    warning signs. To address disengagement: HR launched quarterly employee voice forums; anonymous feedback
                    was encouraged and responded to publicly; ERGs were supported; cultural events and inclusion initiatives
                    were formalized. Employees reported a stronger sense of being heard and respected.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">Which well-being actions here are structural rather than symbolic?</div>
                  <div className="pause-q">How does employee voice reduce silent disengagement?</div>
                </div>
              </div>
              <div className="outcome-box">
                <div className="ob-title">Outcomes — One Year Later (Early 2026)</div>
                <div className="ob-item">Turnover dropped from 25% to 15% — a 10-percentage-point improvement within 12 months
                </div>
                <div className="ob-item">Performance appraisals completed for 95% of staff — up from irregular and inconsistent
                </div>
                <div className="ob-item">Engagement survey showed increased trust in HR and improved perception of growth
                  opportunities</div>
                <div className="ob-item">Several former employees returned, citing visible improvements in culture and management
                  quality</div>
              </div>
              <div className="callout teal">
                <div className="callout-icon">📋</div>
                <div>
                  <div className="callout-label">Case Analysis</div>
                  <div className="callout-text">This case illustrates that retention is a system outcome, not a single initiative.
                    Hiring, performance, development, and well-being must all align. DEIB improves outcomes when embedded in
                    operations — not as a standalone programme. Data-driven diagnosis leads to targeted, effective action.
                    Most importantly, the case shows that operational HR decisions compound over time — either creating
                    disengagement or sustaining commitment.</div>
                </div>
              </div>
              <div className="appq-box">
                <div className="appq-title">Application Questions</div>
                <div className="appq-item">Which intervention would you prioritize first, and why?</div>
                <div className="appq-item">Which metric would you monitor monthly to ensure progress?</div>
                <div className="appq-item">What would you scale next if turnover plateaued at 15%?</div>
              </div>
            </div>
          </div>
          <div className="game-zone">
            <div className="game-zone-header">
              <div className="game-zone-title">🎮 Gamified Activities — Level 2: Operational HR</div>
              <div className="game-zone-sub">Burnout Detective · Total Rewards Builder · HR Scavenger Hunt</div>
              <div className="game-zone-note">Use the in-game menu to navigate between all three activities</div>
            </div>
            <iframe className="game-frame" src="/learning-module/games/level-2-operational-hr.html" title="Gamified Activities — Level 2: Operational HR" loading="lazy"></iframe>
          </div>
          <div className="review-wrap">
            <div className="review-head">
              <div className="review-head-title">Review & Practice — Level 2</div>
              <div className="review-head-sub">Connect a real experience to operational HR practice</div>
            </div>
            <div className="review-body">
              <div className="review-q">
                <div className="review-q-num">Question 1</div>
                <div className="review-q-text">Think about a real HR-related situation you have experienced or observed — a
                  confusing onboarding, a poorly handled performance review, a team struggling with burnout, or a case of
                  perceived unfairness. Briefly describe the context and the main issue.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Question 2</div>
                <div className="review-q-text">Which Level 2 principle applies most clearly to this situation?</div>
                <div className="review-q-hint">For example: structured interviewing, continuous feedback, development planning, or
                  structural well-being support.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Question 3</div>
                <div className="review-q-text">What would you do differently now? Describe one specific operational action.</div>
                <div className="review-q-hint">Example: introduce a 30/60/90-day onboarding check-in instead of relying on
                  informal catch-ups.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Question 4</div>
                <div className="review-q-text">What outcome would you expect from your action? Explain how it could improve
                  fairness, clarity, engagement, or retention.</div>
              </div>
              <div className="stretch-box">
                <div className="stretch-label">Optional Stretch Review</div>
                <div className="prose" style={{ "fontSize": "12.5px" }}>
                  <p>What constraints (time, budget, management resistance) might limit your proposed action? How would you
                    adapt the solution without abandoning fairness or inclusion? What metric or signal would tell you your
                    intervention is working?</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-slate">📚</div>
              <div className="card-info">
                <div className="card-title">References</div>
                <div className="card-sub">All sources cited in this level</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="refs-list">
                <div className="ref-item">Academy to Innovate HR (AIHR). (2022). <em>Inclusive hiring guide.</em> AIHR.</div>
                <div className="ref-item">Academy to Innovate HR (AIHR). (2023). <em>Employee evaluation template and guide.</em>
                  AIHR.</div>
                <div className="ref-item">Centre for Ageing Better & CIPD. (2023). <em>Good Recruitment for Older Workers
                    (GROW): A toolkit for employers.</em> Centre for Ageing Better.</div>
                <div className="ref-item">Ho, H. C. Y., Chan, C. H., & Chan, Y. C. (2025). A three-wave time-lagged study on
                  family-friendly employment practices and well-being in Hong Kong. <em>The International Journal of Human
                    Resource Management, 36</em>(18), 3375–3400.</div>
                <div className="ref-item">Melp. (2025). <em>Why retention is the most meaningful engagement metric.</em> Melp HR
                  Blog.</div>
              </div>
            </div>
          </div><button className="continue-btn cb-violet" onClick={() => setActiveTab("l3")}>Continue to Level 3 — Strategic HR →</button>
        </div>
        <div id="tab-l3" className={`panel${activeTab === "l3" ? " active" : ""}`}>
          <div className="hero hero-l3">
            <div className="hero-tag">Level 3 · Strategic & Advanced HR · Analysis + Strategy</div>
            <div className="hero-title">Aligning People Strategy with Organizational Performance</div>
            <div className="hero-sub">This level transitions you from managing HR operations to leading HR strategically. You will
              gain the tools and frameworks to align HR with organizational goals, build a data-driven HR function, develop
              leadership pipelines, and plan for the workforce demands of the future — with DEIB embedded as a strategic
              priority throughout.</div>
            <div className="hero-note">📌 Research-backed content designed to prepare learners for practical and strategic HR
              roles</div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-violet">🎯</div>
              <div className="card-info">
                <div className="card-title">Learning Outcomes</div>
                <div className="card-sub">What you will be able to do by the end of Level 3</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="outcomes">
                <div className="oc violet">
                  <div className="oc-n">1</div>
                  <div className="oc-text">Articulate HR's strategic role and develop an HR strategy aligned to business goals
                    using established frameworks including Ulrich's model, VRIO, and the Balanced Scorecard</div>
                </div>
                <div className="oc violet">
                  <div className="oc-n">2</div>
                  <div className="oc-text">Develop and interpret key HR metrics and analytics — turnover rates, engagement scores,
                    diversity metrics — to inform evidence-based strategic decisions</div>
                </div>
                <div className="oc violet">
                  <div className="oc-n">3</div>
                  <div className="oc-text">Design advanced HR initiatives in talent management, leadership development, and
                    succession planning using the 9-box grid and inclusive development principles</div>
                </div>
                <div className="oc violet">
                  <div className="oc-n">4</div>
                  <div className="oc-text">Apply DEIB at a strategic level — ensuring diversity, equity, and inclusion are
                    embedded in talent management, leadership pipelines, and all strategic HR planning</div>
                </div>
                <div className="oc violet">
                  <div className="oc-n">5</div>
                  <div className="oc-text">Anticipate and plan for future workforce trends — AI disruption, gig economy,
                    demographic shifts — to build organizational agility and resilience</div>
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 1</span>
              <span className="topic-title">HR Strategy and Business Alignment — HR as a Strategic Partner</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout violet">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Articulate HR's strategic role and how it drives organizational performance ·
                    Develop a comprehensive HR strategy using established frameworks · Apply Ulrich's Model, VRIO, and the
                    Balanced Scorecard · Understand vertical and horizontal alignment · Integrate DEIB into HR strategy and
                    link it to measurable outcomes</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.1 — Understanding Business Strategy and HR's Role</div>
                <div className="prose">
                  <p>Before HR can align itself with business strategy, it must understand what business strategy is. Strategy
                    includes: <strong>mission and vision</strong> (why the organization exists and its long-term goals),
                    <strong>competitive advantage</strong> (what makes it stand out), and <strong>objectives</strong> (what it
                    wants to achieve in the short and long term).
                  </p>
                  <p>Strategic HR translates these objectives into people initiatives. Examples:</p>
                  <ul>
                    <li>If the strategy is <strong>expansion into new markets</strong> — HR focuses on global talent
                      acquisition, cross-cultural leadership development, and inclusive hiring practices</li>
                    <li>If the strategy is <strong>innovation and R&D</strong> — HR emphasizes hiring top-tier research
                      talent, creating continuous learning programmes, and recognizing innovation</li>
                    <li>If the goal is <strong>improving customer service</strong> — HR recruits and trains customer-centric
                      employees and creates performance systems that reinforce customer satisfaction metrics</li>
                  </ul>
                  <p>This is known as <strong>vertical alignment</strong> — HR strategy directly supports business goals
                    rather than operating as a disconnected administrative function. <strong>Horizontal alignment</strong>
                    means all HR practices work coherently together: hiring, development, performance, and recognition all
                    reinforce the same outcomes.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.2 — Strategic Frameworks for HR Decision-Making</div>
                <div className="prose">
                  <p>Three frameworks are essential for strategic HR thinking at this level:</p>
                  <div className="fw-grid">
                    <div className="fw-card">
                      <div className="fw-card-title">Ulrich's HR Business Partner Model</div>
                      <div className="fw-card-body">HR operates across four interconnected roles: <strong>Strategic
                          Partner</strong> (aligning HR with business goals), <strong>Change Agent</strong> (leading
                        transformation), <strong>Administrative Expert</strong> (designing efficient processes), and
                        <strong>Employee Champion</strong> (advocating for employee needs). HR professionals must operate
                        across all four roles simultaneously.
                      </div>
                    </div>
                    <div className="fw-card">
                      <div className="fw-card-title">VRIO Framework</div>
                      <div className="fw-card-body">Asks whether HR's human capital creates sustainable competitive advantage:
                        <strong>V</strong>aluable (adds value?), <strong>R</strong>are (scarce in the market?),
                        <strong>I</strong>nimitable (hard for competitors to replicate?), and <strong>O</strong>rganized
                        (supported by HR systems and culture?). Helps HR justify strategic investment.
                      </div>
                    </div>
                    <div className="fw-card">
                      <div className="fw-card-title">Balanced Scorecard</div>
                      <div className="fw-card-body">Translates business goals into HR KPIs across four perspectives: financial
                        (cost-per-hire, ROI of training), customer (employee satisfaction driving CX), internal processes
                        (time-to-fill, appraisal completion), and learning & growth (% in development programmes,
                        leadership bench strength).</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.3 — Developing an HR Strategic Plan<span className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>A well-crafted HR strategy guides how HR will contribute to the business. The development process
                    involves five steps:</p>
                  <ol>
                    <li><strong>Environmental scan:</strong> Assess internal HR metrics (turnover, engagement, capability
                      gaps) and external labour market trends (talent availability, compensation benchmarks, regulatory
                      changes)</li>
                    <li><strong>Identify HR priorities</strong> directly supporting business goals — e.g. if the goal is
                      market expansion, HR priorities include global talent acquisition and cultural integration</li>
                    <li><strong>Set specific measurable HR objectives:</strong> "Increase leadership bench strength by 20%
                      over two years" · "Reduce turnover by 10% through enhanced engagement initiatives within 12 months"</li>
                    <li><strong>Determine initiatives:</strong> leadership development programmes, performance management
                      overhauls, targeted recruitment campaigns, capability-building</li>
                    <li><strong>Align to measurable outcomes:</strong> "Our engagement initiative should result in a 10%
                      increase in retention rates and £X reduction in recruitment costs"</li>
                  </ol>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">1.4 — Measuring HR Strategy Impact</div>
                <div className="prose">
                  <p>HR decisions must be data-driven to demonstrate strategic value to organizational leadership. Key metrics
                    and their strategic significance:</p>
                  <ul>
                    <li><strong>Turnover Rate:</strong> Signals workforce health — high turnover in key roles signals culture
                      or leadership problems affecting competitiveness</li>
                    <li><strong>Engagement Scores:</strong> Measures employee commitment — low engagement points to
                      insufficient development opportunities, reducing innovation capacity</li>
                    <li><strong>Diversity Metrics:</strong> Tracks representation of underrepresented groups at all levels —
                      essential for DEIB accountability and equitable outcomes</li>
                    <li><strong>Time-to-Fill:</strong> Tracks recruitment efficiency; high time-to-fill indicates difficulty
                      attracting qualified candidates or process bottlenecks</li>
                    <li><strong>Cost-per-Hire:</strong> Measures recruitment efficiency and highlights reliance on expensive
                      external channels</li>
                  </ul>
                  <p>HR strategy becomes truly impactful when metrics are linked to strategic business outcomes — not just
                    reported as HR activity data. The most compelling HR narrative connects people metrics to financial
                    performance, customer outcomes, and competitive positioning.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR must align itself with business strategy through vertical alignment (supporting
                  business goals) and horizontal alignment (all HR practices reinforcing each other) — strategic HR is a
                  contributor to organizational performance, not a support function
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Ulrich's model, VRIO, and the Balanced Scorecard connect people decisions to
                  competitive advantage and business outcomes — they give HR a language that leadership understands and
                  respects
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>DEIB is a central component of HR strategy — inclusive leadership, diverse hiring,
                  and equitable opportunity are strategic priorities with measurable business impact, not compliance
                  activities
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 2</span>
              <span className="topic-title">Data-Driven HR — Metrics, Analytics, and Strategic Decision-Making</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout violet">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Define and calculate key HR metrics · Move from descriptive metrics to predictive
                    analytics · Use HR dashboards to present actionable insights to business leadership · Ensure DEIB data is
                    embedded in all strategic HR analyses</div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.1 — Key HR Metrics and How to Calculate Them</div>
                <div className="prose">
                  <p>HR metrics form the foundation of data-driven practice. Understanding what to measure — and why it
                    matters strategically — is the first step.</p>
                  <div className="formula-box">
                    <div className="formula-label">Turnover Rate</div>
                    <div className="formula-expr">Leavers ÷ Average Headcount × 100</div>
                    <div className="formula-sub">Benchmark: below 10% generally healthy; above 20% signals systemic issues</div>
                    <div className="formula-example">Example: 15 leavers ÷ 200 average headcount × 100 = 7.5%</div>
                  </div>
                  <div className="formula-box">
                    <div className="formula-label">Retention Rate</div>
                    <div className="formula-expr">Employees who stayed ÷ Employees at start × 100</div>
                    <div className="formula-sub">High retention correlates with strong talent management and engagement</div>
                    <div className="formula-example">Example: 185 stayed ÷ 200 at start × 100 = 92.5%</div>
                  </div>
                  <div className="formula-box">
                    <div className="formula-label">Cost-per-Hire</div>
                    <div className="formula-expr">Total recruitment costs ÷ Number of hires</div>
                    <div className="formula-sub">Measures recruitment efficiency; highlights over-reliance on expensive external
                      channels</div>
                    <div className="formula-example">Example: £30,000 ÷ 10 hires = £3,000 per hire</div>
                  </div>
                  <div className="formula-box">
                    <div className="formula-label">Engagement Score</div>
                    <div className="formula-expr">Total engagement points ÷ Total respondents × 100</div>
                    <div className="formula-sub">Above 70% strong · below 50% at risk · track over time for trend signals</div>
                    <div className="formula-example">Example: 4,200 ÷ 100 respondents = 42/100 (signals significant disengagement)
                    </div>
                  </div>
                  <div className="formula-box">
                    <div className="formula-label">Diversity Representation</div>
                    <div className="formula-expr">Underrepresented employees ÷ Total employees × 100</div>
                    <div className="formula-sub">Track separately: by hire, promotion, leadership level, and department</div>
                    <div className="formula-example">Example: 25 women in leadership ÷ 100 leadership roles × 100 = 25% (vs 30%
                      target = gap identified)</div>
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.2 — From Metrics to Predictive Analytics<span className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Moving from <em>descriptive metrics</em> (what happened) to <em>predictive analytics</em> (what will
                    happen next) represents a fundamental shift in HR capability. Predictive analytics uses historical data
                    patterns to forecast future trends and enable proactive decision-making before problems become crises.</p>
                  <p><strong>Key applications in strategic HR:</strong></p>
                  <ul>
                    <li><strong>Turnover prediction:</strong> By analysing employee tenure, engagement scores, manager
                      effectiveness ratings, and exit interview themes, HR can identify employees at risk of leaving 3–6
                      months before they resign — enabling targeted retention interventions</li>
                    <li><strong>Talent gap analysis:</strong> By analysing current talent pools against projected business
                      needs — new markets, product launches, technology changes — HR can forecast skill shortages and plan
                      hiring or internal development 12–24 months in advance</li>
                    <li><strong>Performance forecasting:</strong> Historical performance trend analysis identifies future high
                      performers and leadership potential — enabling data-informed succession planning decisions rather than
                      subjective nominations</li>
                    <li><strong>Absenteeism and wellbeing:</strong> Patterns in unplanned absence can signal burnout hotspots
                      before formal disclosures, enabling proactive workload and management support</li>
                  </ul>
                  <p>Any predictive model must be <strong>regularly audited for bias</strong> — models trained on historical
                    data may perpetuate historical inequalities. For example, if promotions historically favoured one
                    demographic, a model predicting "promotion readiness" will replicate that pattern unless actively
                    corrected. DEIB-informed analytics requires both technical and ethical scrutiny.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">2.3 — Building HR Dashboards and Presenting to Leadership</div>
                <div className="prose">
                  <p>An HR dashboard displays key metrics in one view, enabling executives and HR professionals to quickly
                    assess workforce health and identify where action is needed. An effective dashboard:</p>
                  <ul>
                    <li>Summarises core metrics: turnover, retention, engagement, diversity, cost-per-hire, time-to-fill</li>
                    <li>Uses colour-coding (red/amber/green) to communicate urgency and priority</li>
                    <li>Includes DEIB metrics: representation in leadership, engagement broken down by demographic group, and
                      access to development opportunities across different employee groups</li>
                    <li>Is updated at least monthly — not once a year during annual reporting</li>
                  </ul>
                  <p>When presenting to leadership, <strong>translate data into business language</strong>. Rather than "our
                    turnover is 22%," say: "We lost an estimated £890,000 to avoidable turnover last year — here is the
                    initiative that can reduce that by 40% within 18 months." Connect HR metrics to financial outcomes,
                    customer satisfaction, and competitive positioning. This is the skill that earns HR a seat at the
                    strategic table.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>HR metrics — turnover, retention, engagement, cost-per-hire, diversity
                  representation — are only valuable when linked to business outcomes, not just reported as HR activity data
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Predictive analytics enables HR to move from reactive problem-solving to proactive
                  workforce strategy — forecasting attrition, talent gaps, and burnout risk before they become crises
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>DEIB data must be embedded in all strategic analyses — disparities across
                  demographic groups in engagement, turnover, promotion rates, and development access are strategic risks, not
                  just moral concerns
                </div>
              </div>
            </div>
          </div>
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 3</span>
              <span className="topic-title">Talent Management, Leadership Development, and Future Workforce Planning</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout violet">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Design a comprehensive talent management strategy across the full talent lifecycle
                    · Use succession planning tools including the 9-box grid to build leadership pipelines · Design inclusive
                    leadership development programmes · Plan for future workforce needs including skills forecasting and
                    flexible work models · Apply DEIB principles throughout talent identification, development, and planning
                  </div>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.1 — Strategic Talent Management: The Full Lifecycle<span
                    className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Talent management is a strategic approach to attracting, developing, and retaining top talent in
                    alignment with organizational goals. It encompasses the full talent lifecycle:</p>
                  <ul>
                    <li><strong>Workforce planning:</strong> Understanding current and future talent needs based on business
                      goals — not just replacing who has left, but anticipating what capabilities will be needed in 2–5 years
                    </li>
                    <li><strong>Strategic talent acquisition:</strong> Aligning recruiting efforts with diversity goals and
                      business needs; creating talent pipelines for critical and hard-to-fill positions</li>
                    <li><strong>Onboarding and engagement:</strong> Creating onboarding programmes that set the foundation for
                      long-term engagement and performance from Day 1</li>
                    <li><strong>Continuous learning:</strong> Offering development opportunities that build skills and advance
                      careers — making the organization a place where growth is visible and accessible</li>
                    <li><strong>Retention and succession:</strong> Identifying, developing, and retaining high-potential
                      talent to ensure organizational continuity and leadership pipeline strength</li>
                  </ul>
                  <p>DEIB must be at the forefront of every stage — removing biases from selection, creating equitable
                    development opportunities, and actively measuring and tracking diversity outcomes across talent processes.
                  </p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.2 — Succession Planning and the 9-Box Grid<span className="deib-tag">DEIB</span>
                </div>
                <div className="prose">
                  <p>Succession planning ensures organizational resilience and leadership continuity while providing
                    development opportunities for high-potential employees. It identifies who could fill critical roles in the
                    future and what development they need to get there.</p>
                  <p><strong>The 9-box grid</strong> is the most widely used succession planning tool. It plots employees on
                    two dimensions — current performance and future potential — creating nine talent categories that guide
                    development investment decisions:</p>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3,1fr)", "gap": "6px", "margin": "12px 0" }}>
                    <div style={{ "padding": "11px", "background": "#fef2f0", "borderRadius": "8px", "border": "1px solid #fca5a5" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "#991b1b", "marginBottom": "3px" }}>⚠️ At Risk</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Low performance, low potential — honest performance management
                        and development conversation required</div>
                    </div>
                    <div style={{ "padding": "11px", "background": "#fffbf0", "borderRadius": "8px", "border": "1px solid #ffd97d" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "#92400e", "marginBottom": "3px" }}>🔨 Needs Development</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Medium performance, low potential — support consistency and
                        stability; valued contributor</div>
                    </div>
                    <div
                      style={{ "padding": "11px", "background": "var(--canvas-2)", "borderRadius": "8px", "border": "1px solid rgba(201,80,30,.2)" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--navy-3)", "marginBottom": "3px" }}>💎 Core Contributor
                      </div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>High performance, medium potential — retain and reward;
                        expertise is highly valuable</div>
                    </div>
                    <div style={{ "padding": "11px", "background": "#fffbf0", "borderRadius": "8px", "border": "1px solid #ffd97d" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "#92400e", "marginBottom": "3px" }}>🌱 Inconsistent Player</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Low performance, medium potential — diagnose barriers; invest
                        in coaching and support</div>
                    </div>
                    <div
                      style={{ "padding": "11px", "background": "var(--canvas-2)", "borderRadius": "8px", "border": "1px solid rgba(201,80,30,.2)" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--navy-3)", "marginBottom": "3px" }}>✅ Solid Performer
                      </div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Medium performance, medium potential — backbone of the
                        organization; engage and develop</div>
                    </div>
                    <div style={{ "padding": "11px", "background": "var(--accent-pale)", "borderRadius": "8px", "border": "1px solid var(--navy-3)" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--navy-2)", "marginBottom": "3px" }}>⭐ High Potential</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Medium performance, high potential — invest in accelerated
                        development; succession track candidate</div>
                    </div>
                    <div style={{ "padding": "11px", "background": "#f5f3ff", "borderRadius": "8px", "border": "1px solid #c4b5fd" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "#4c3a8a", "marginBottom": "3px" }}>🔍 Enigma</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>Low performance, high potential — diagnose blockers; is this a
                        role fit, support, or motivation issue?</div>
                    </div>
                    <div style={{ "padding": "11px", "background": "#f5f3ff", "borderRadius": "8px", "border": "1px solid #c4b5fd" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "#4c3a8a", "marginBottom": "3px" }}>🚀 Rising Star</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>High performance, high potential — leadership programme
                        candidate; stretch assignments; early succession planning</div>
                    </div>
                    <div
                      style={{ "padding": "11px", "background": "linear-gradient(135deg,var(--accent-pale),#ede9fe)", "borderRadius": "8px", "border": "2px solid var(--navy-3)" }}>
                      <div style={{ "fontSize": "11px", "fontWeight": "700", "color": "var(--navy-2)", "marginBottom": "3px" }}>🏆 Star</div>
                      <div style={{ "fontSize": "11px", "color": "#374151" }}>High performance, high potential — top priority for retention,
                        development, and succession fast-tracking</div>
                    </div>
                  </div>
                  <p style={{ "fontSize": "11.5px", "color": "#6b7280", "fontStyle": "italic" }}>Note: The 9-box grid must be used with conscious
                    DEIB scrutiny — unconscious bias in "potential" assessments frequently disadvantages underrepresented
                    employees. Calibration conversations, structured criteria, and demographic audits of outcomes are
                    essential safeguards.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.3 — Leadership Development Programmes</div>
                <div className="prose">
                  <p>Leadership development ensures organizational capability grows in step with organizational ambition. A
                    comprehensive programme includes:</p>
                  <ul>
                    <li><strong>Formal leadership training:</strong> Strategic thinking, change management, financial acumen,
                      communication, and inclusive leadership skills</li>
                    <li><strong>Mentorship and coaching:</strong> Pairing emerging leaders with senior mentors for guidance,
                      perspective, and network access; executive coaching for senior leaders navigating complex strategic
                      challenges</li>
                    <li><strong>Leadership rotations:</strong> Cross-functional or cross-regional rotations build
                      well-rounded, organization-wide leadership capability</li>
                    <li><strong>Action learning:</strong> Leading real organizational projects as the primary development
                      vehicle — learning through doing, not just training</li>
                    <li><strong>Sponsorship:</strong> Senior leaders actively advocating for high-potential individuals from
                      underrepresented groups in talent discussions and promotion decisions</li>
                  </ul>
                  <p>Ensure programmes are <strong>inclusive and accessible to all high-potential employees</strong>
                    regardless of background. Research consistently shows that diverse leadership teams outperform homogeneous
                    ones on both innovation and financial performance. Sponsorship — not just mentorship — is essential for
                    breaking through structural barriers that limit advancement for underrepresented groups.</p>
                </div>
              </div>
              <div className="subtopic">
                <div className="subtopic-title">3.4 — Future Workforce Planning<span className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>Strategic HR must anticipate future workforce trends and adapt the talent strategy accordingly. Key
                    planning dimensions:</p>
                  <ul>
                    <li><strong>Skills forecasting:</strong> The World Economic Forum consistently identifies AI literacy,
                      data analytics, sustainability expertise, human-centred design, and cross-cultural collaboration as
                      critical future skills — HR must map current capability gaps and plan learning pathways to close them
                    </li>
                    <li><strong>Demographic shifts:</strong> The aging workforce, the rise of Gen Z as the largest working
                      generation, and increasing workforce diversity require rethinking career pathways, communication styles,
                      and benefits design</li>
                    <li><strong>Flexible and hybrid work:</strong> Hybrid and remote models are now mainstream expectations —
                      HR strategies must address equal access to opportunity, development, and belonging regardless of
                      location</li>
                    <li><strong>Gig economy and blended workforce:</strong> Integrating freelancers, contractors, and
                      project-based workers alongside permanent employees requires new HR policies covering inclusion,
                      compliance, and fair treatment</li>
                  </ul>
                  <p>Future workforce plans must be <strong>inclusive by design</strong> — flexible policies that accommodate
                    diverse needs, reskilling investments particularly for groups facing displacement by automation, and
                    ensuring that technology adoption does not amplify existing inequalities.</p>
                </div>
              </div>
              <div className="takeaways">
                <div className="tk-title">Key Takeaways</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Talent management is a strategic, ongoing process spanning the full talent
                  lifecycle — workforce planning, acquisition, development, retention, and succession must align coherently
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>The 9-box grid enables equitable succession planning when used with DEIB scrutiny
                  — structured calibration and demographic audits of outcomes protect against unconscious bias in potential
                  assessments
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Future workforce planning requires forecasting skills needs 2–5 years ahead,
                  designing inclusive flexible work models, and investing in reskilling — particularly for groups facing
                  displacement by technology and automation
                </div>
              </div>
            </div>
          </div>
          <div className="case-wrap">
            <div className="case-head" style={{ "background": "linear-gradient(135deg,#2d1b69,#4c3a8a)" }}>
              <div className="case-tag">Level 3 Case Study</div>
              <div className="case-title">GlobalTech's HR Transformation — Strategy, Data, and Talent in Action</div>
              <div className="case-sub">Elena (CHRO) — aligning HR strategy with a mandate to double global market share in 3
                years</div>
            </div>
            <div className="case-body">
              <div className="case-phase">
                <div className="case-phase-label">Background</div>
                <div className="prose">
                  <p>GlobalTech is a multinational technology company with 8,000 employees across 20 countries. In 2024, the
                    Board set an ambitious goal: <strong>double global market share within three years</strong> through
                    innovation leadership and expansion into emerging markets in Asia and Africa. The CHRO, Elena, was tasked
                    with crafting an HR strategy that would make this possible. Her challenge: HR had historically operated as
                    a transactional function. Leaders saw HR as a cost centre. People data was fragmented and rarely used
                    strategically. The leadership pipeline was thin, and diversity in senior roles was poor.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 1 — HR Strategy Alignment</div>
                <div className="prose">
                  <p>Elena began by facilitating a strategic alignment workshop with the executive team. The output was a
                    clear "People Vision 2027" — built around two strategic HR priorities: building an
                    <strong>innovation-ready workforce</strong> (recruiting and developing AI and data science talent) and
                    creating a <strong>global leadership pipeline</strong> (diverse, cross-culturally capable leaders ready
                    for regional expansion).
                  </p>
                  <p>Elena ensured HR was included in strategic planning meetings going forward, presenting data showing the
                    correlation between innovation, team diversity, and leadership development investment. This secured
                    board-level commitment to HR as a strategic function.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">How does HR strategy alignment change the conversation between HR and the executive
                    team?</div>
                  <div className="pause-q">What data would you use to build the business case for HR as a strategic investment?
                  </div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 2 — Data-Driven Workforce Decisions</div>
                <div className="prose">
                  <p>Elena introduced an HR analytics dashboard tracking: turnover by region and role type, diversity
                    representation at each leadership level, leadership programme completion rates, and manager effectiveness
                    scores. Exit data from Asia revealed a critical pattern: employees were leaving primarily due to
                    <strong>lack of career growth and cultural misalignment</strong> — not pay. This data shifted the
                    conversation from compensation to development.
                  </p>
                  <p>HR responded by launching a regional skills programme — reskilling internal employees in AI and machine
                    learning — and forming university partnerships in India and Nigeria to build external talent pipelines.
                    Mentorship programmes were introduced to support retention among underrepresented groups in technical
                    roles.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">How does disaggregated data by region and demographic reveal insights that aggregate
                    data hides?</div>
                  <div className="pause-q">What is the risk of making retention decisions based on aggregate turnover rates alone?
                  </div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">Phase 3 — Building the Leadership Pipeline</div>
                <div className="prose">
                  <p>A global talent review using the 9-box grid identified 50 high-potential employees across all regions.
                    Elena launched a 12-month Global Leadership Development Programme including international rotations,
                    executive mentoring, strategy workshops, and coaching. <strong>50% of programme participants were women or
                      from underrepresented regions</strong> — a deliberate decision to build a diverse leadership pipeline
                    aligned with GlobalTech's expansion markets. After 12 months, 10 of 50 participants were promoted to
                    senior positions in newly opened regional offices.</p>
                </div>
              </div>
              <div className="outcome-box">
                <div className="ob-title">Outcomes by 2027</div>
                <div className="ob-item">Doubled market share achieved through successful expansion into Asia and Africa</div>
                <div className="ob-item">Turnover among key technical talent decreased by 5 percentage points over two years</div>
                <div className="ob-item">Women in senior leadership rose from 15% to 30% — in line with DEIB strategy targets
                </div>
                <div className="ob-item">HR repositioned as a strategic partner — Elena joined the Board as Chief People Officer
                </div>
              </div>
              <div className="callout teal">
                <div className="callout-icon">📋</div>
                <div>
                  <div className="callout-label">Case Analysis</div>
                  <div className="callout-text">GlobalTech demonstrates that strategic HR drives measurable business outcomes when
                    people strategy is genuinely aligned with organizational goals. Data-driven decision-making identified the
                    real causes of attrition; inclusive talent management built the pipeline needed for expansion; and HR
                    leadership earned its strategic credibility through evidence, not assertion.</div>
                </div>
              </div>
              <div className="appq-box">
                <div className="appq-title">Application Questions</div>
                <div className="appq-item">Which element of Elena's strategy had the highest leverage impact, and why?</div>
                <div className="appq-item">How would you measure the ROI of the leadership development programme?</div>
                <div className="appq-item">What would your HR dashboard include if you were in Elena's role?</div>
              </div>
            </div>
          </div>
          <div className="game-zone">
            <div className="game-zone-header">
              <div className="game-zone-title">🎮 Gamified Activities — Level 3: Strategic HR</div>
              <div className="game-zone-sub">Engagement Strategy Lab · AI vs Human Decision · Data Insight Challenge</div>
              <div className="game-zone-note">Use the in-game menu to navigate between all three activities</div>
            </div>
            <iframe className="game-frame" src="/learning-module/games/level-3-strategic-hr.html" title="Gamified Activities — Level 3: Strategic HR" loading="lazy"></iframe>
          </div>
          <div className="review-wrap">
            <div className="review-head">
              <div className="review-head-title">Review & Practice — Level 3</div>
              <div className="review-head-sub">Thinking like a strategic HR leader</div>
            </div>
            <div className="review-body">
              <div className="review-q">
                <div className="review-q-num">Question 1</div>
                <div className="review-q-text">Imagine you are the Head of HR for an organization planning significant expansion
                  into a new market. Using Level 3 frameworks, outline the three most important HR priorities for the next 18
                  months.</div>
                <div className="review-q-hint">Think about: workforce planning, leadership pipeline, talent acquisition strategy,
                  and data you would need to make the case to the executive team.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Question 2</div>
                <div className="review-q-text">Your CEO asks you to demonstrate HR's strategic value in a 5-minute board
                  presentation. Which three metrics would you lead with, and what narrative would connect them to business
                  performance?</div>
                <div className="review-q-hint">Hint: connect HR metrics to revenue, customer satisfaction, or competitive
                  advantage — not just HR efficiency.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Question 3</div>
                <div className="review-q-text">A talent review reveals that 80% of your high-potential pool is from one
                  demographic group. What does this tell you, what risks does it create, and what would you do about it?</div>
              </div>
              <div className="stretch-box">
                <div className="stretch-label">Optional Stretch Review</div>
                <div className="prose" style={{ "fontSize": "12.5px" }}>
                  <p>Design a simple succession planning process for a team of 50 employees. Which roles are critical? How
                    would you run a 9-box calibration session fairly? What safeguards would you build in to prevent
                    unconscious bias from distorting the outcomes? How would you communicate succession plans to employees in
                    an inclusive and motivating way?</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head " onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-slate">📚</div>
              <div className="card-info">
                <div className="card-title">References</div>
                <div className="card-sub">All sources cited in this level</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body ">
              <div className="refs-list">
                <div className="ref-item">American Management Association (AMA). (2012). <em>Developing successful global
                    leaders.</em> AMA, i4cp & Training Magazine.</div>
                <div className="ref-item">Kasahara, T., Sekiguchi, T., & Pan, H. (2025). Global talent management as a
                  bridging mechanism. <em>The International Journal of Human Resource Management, 36</em>(18), 3181–3218.
                </div>
                <div className="ref-item">World Economic Forum. (2020). <em>HR 4.0: Shaping people strategies in the Fourth
                    Industrial Revolution.</em> WEF.</div>
                <div className="ref-item">Academy to Innovate HR (AIHR). (2025). <em>HR Trends Report 2025.</em> AIHR.</div>
                <div className="ref-item">Harvard Business School. (2025). <em>When does gamified training improve
                    performance?</em> (Working Paper 19-101). HBS Publishing.</div>
                <div className="ref-item">Melp. (2025). <em>Strategic HR: Aligning people strategy with business goals.</em> Melp
                  HR Blog.</div>
              </div>
            </div>
          </div><button className="continue-btn cb-red" onClick={() => setActiveTab("l4")}>Continue to Level 4 — Future-Forward HR →</button>
        </div>
        <div id="tab-l4" className={`panel${activeTab === "l4" ? " active" : ""}`}>
          <div className="hero hero-l4">
            <div className="hero-tag">Level 4 · Innovative / Future-Forward HR · Innovation + Systems Design</div>
            <div className="hero-title">Welcome, Innovator — Embracing the Future of Work</div>
            <div className="hero-sub">Level 4 is where HR thinking meets organizational transformation. You will explore
              cutting-edge technologies, emerging methodologies, and the evolving workforce landscape shaping the future of
              work. The central challenge of this level: how do you harness innovation — AI, gamification, agile structures,
              gig talent — while ensuring that technology enhances human experience rather than replacing it, and that
              innovation serves equity and inclusion, not just efficiency?</div>
            <div className="hero-note">📌 Level 4 is about vision — and about the responsibility that comes with it</div>
          </div>

          <div className="card">
            <div className="card-head" onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-red">🚀</div>
              <div className="card-info">
                <div className="card-title">Learning Outcomes</div>
                <div className="card-sub">What you will be able to do by the end of Level 4</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body">
              <div className="outcomes">
                <div className="oc red">
                  <div className="oc-n">1</div>
                  <div className="oc-text">Evaluate emerging HR technologies — AI, automation, blockchain, VR — and
                    their practical and ethical implications for HR practice</div>
                </div>
                <div className="oc red">
                  <div className="oc-n">2</div>
                  <div className="oc-text">Design innovative HR initiatives using gamification, continuous listening, and employee
                    experience design principles</div>
                </div>
                <div className="oc red">
                  <div className="oc-n">3</div>
                  <div className="oc-text">Analyse evolving workforce models including gig economy integration, agile
                    organizational structures, and remote-first design</div>
                </div>
                <div className="oc red">
                  <div className="oc-n">4</div>
                  <div className="oc-text">Apply DEIB principles to innovation — ensuring that new technologies and models
                    promote fairness and do not replicate or amplify existing inequalities</div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 1</span>
              <span className="topic-title">HR Technology and Digital Transformation — AI, Automation, and Beyond</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout red">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Identify current AI applications in HR recruitment, performance management, and
                    development · Evaluate the ethical risks of AI in people decisions · Understand emerging
                    tools including chatbots, blockchain, and VR/AR · Apply a governance framework for responsible AI
                    adoption in HR · Ensure DEIB is central to all technology evaluation and implementation</div>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">1.1 — Current AI Applications Across the HR Lifecycle</div>
                <div className="prose">
                  <h4>AI in Recruitment</h4>
                  <p>AI-driven recruitment tools analyse CVs at scale, identify patterns in successful hires, screen
                    applications for minimum requirements, and even conduct initial video interviews using natural language
                    processing and sentiment analysis. Platforms such as HireVue and Pymetrics have moved from pilot to
                    mainstream in large organizations. The operational benefit is speed and consistency at scale. The risk is
                    that <strong>AI models trained on historical hiring data will replicate historical biases</strong> —
                    if past hiring systematically favoured certain profiles, the AI will automate that preference.</p>
                  <h4>AI in Performance and Development</h4>
                  <p>AI-integrated learning management systems (LMS) analyse an employee's performance data, skills gaps,
                    and learning history to generate personalized development pathways. Platforms such as Workday, 15Five, and
                    Cornerstone use continuous data collection to surface insights about engagement risk and performance
                    trends in real time. AI-enhanced career pathing tools can visualize an employee's potential
                    progression routes and flag when development actions are overdue.</p>
                  <h4>AI in People Analytics</h4>
                  <p>People analytics platforms process large, multi-source datasets to generate predictive insights:
                    attrition risk scores, team health indicators, and workforce demand forecasts. These capabilities enable
                    HR to operate proactively — identifying and addressing workforce risks before they become visible as
                    organizational problems.</p>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">1.2 — Ethical Risks and Governance Framework <span
                    className="deib-tag">DEIB</span></div>
                <div className="prose">
                  <p>The ethical risks of AI in HR are significant and must be treated as strategic, not technical, concerns:
                  </p>
                  <ul>
                    <li><strong>Algorithmic bias:</strong> AI systems trained on historical data perpetuate historical
                      inequalities at speed and scale. An AI that learned to favour candidates from certain universities or
                      communication styles will systematically disadvantage others — often without the organization
                      being aware</li>
                    <li><strong>Explainability:</strong> HR decisions affecting people's careers — hiring,
                      promotion, performance ratings — must be explainable to the individuals affected. Black-box AI
                      decisions fail this test and create significant legal exposure under GDPR and employment law</li>
                    <li><strong>Data privacy:</strong> AI systems in HR collect vast amounts of sensitive personal data.
                      Consent, data minimization, and secure storage are not optional; they are legal requirements</li>
                    <li><strong>Automation of judgment:</strong> AI recommendations should inform human decisions, never
                      replace them. Any tool that automatically excludes candidates or generates performance ratings without
                      human review of individual cases is an unacceptable abdication of HR's ethical responsibility</li>
                  </ul>
                  <div className="callout red">
                    <div className="callout-icon">🚫</div>
                    <div>
                      <div className="callout-label">Governance principles for responsible AI adoption</div>
                      <div className="callout-text">Before deploying any AI tool in an HR context: conduct a bias audit on
                        training data and outputs · ensure every AI-influenced decision is explainable and subject to
                        human review · publish clear policies on how AI is used in people decisions · create
                        accessible appeal processes for employees affected by AI recommendations · review and re-audit
                        AI systems annually</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">1.3 — Emerging Tools: Chatbots, Blockchain, and VR/AR</div>
                <div className="prose">
                  <h4>HR Chatbots and Conversational AI</h4>
                  <p>HR chatbots handle high-volume routine queries — leave balances, payroll dates, policy FAQs,
                    onboarding guidance — freeing HR professionals to focus on complex, high-judgment work. Advanced
                    chatbots are moving toward personalized 24/7 HR guidance, conducting initial onboarding conversations, and
                    routing complex issues to the right human expert. DEIB consideration: chatbots must be tested across
                    linguistic diversity, cultural communication styles, and accessibility needs.</p>
                  <h4>Blockchain in HR</h4>
                  <p>Blockchain technology offers tamper-proof credential verification, enabling instant validation of
                    qualifications, work history, and professional certifications — reducing fraud and significantly
                    speeding up reference and background check processes. It also supports secure, cross-border payroll
                    management for global organizations with diverse workforce structures including gig workers and
                    contractors.</p>
                  <h4>VR and AR in Learning and Onboarding</h4>
                  <p>Walmart, Accenture, and Boeing use VR for immersive safety training, leadership scenario simulations, and
                    complex technical skill development. AR overlays provide real-time on-the-job guidance for technical
                    roles. Future applications include: virtual onboarding simulations that give new hires a lived experience
                    of company culture before Day 1; immersive cross-cultural training for globally mobile employees; and
                    accessible virtual workspaces that remove physical barriers for employees with disabilities.</p>
                </div>
              </div>

              <div className="takeaways">
                <div className="tk-title">Key Takeaways — Topic 1</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>AI enables speed and scale in recruitment, performance, and analytics — but
                  HR must govern AI deployment rigorously to prevent algorithmic bias, protect explainability, and preserve
                  human judgment in all decisions that affect individuals' careers
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>DEIB is not a constraint on technology adoption — it is the standard against
                  which every new HR tool must be evaluated before, during, and after deployment
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Emerging tools — blockchain, chatbots, VR/AR — offer genuine
                  capability advances in HR operations, but their value depends entirely on intentional, ethical
                  implementation that keeps human experience at the centre
                </div>
              </div>
            </div>
          </div>

          
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 2</span>
              <span className="topic-title">Gamification, Engagement 2.0, and the New Employee Experience</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout red">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand how gamification mechanics drive learning, engagement, and performance
                    · Distinguish Engagement 2.0 tools from traditional annual surveys · Design an employee
                    experience (EX) using human-centred design principles · Evaluate the accessibility and inclusivity
                    of gamified approaches · Apply continuous listening strategies to surface employee voice in real
                    time</div>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">2.1 — Gamification in HR: Mechanics, Applications, and Evidence</div>
                <div className="prose">
                  <p>Gamification applies game design mechanics — points, badges, leaderboards, challenges, progress
                    tracking, narrative arcs — in non-game contexts to drive engagement, motivation, and behaviour
                    change. The underlying psychology draws on self-determination theory: autonomy (player agency), mastery
                    (visible skill progression), and purpose (meaningful stakes) are the three drivers that make gamified
                    experiences intrinsically motivating.</p>
                  <h4>Current HR Applications</h4>
                  <ul>
                    <li><strong>Gamified onboarding:</strong> Deloitte's onboarding programme uses interactive challenges
                      and scenario-based activities that teach company values through doing rather than reading. Completion
                      rates and knowledge retention both improve significantly compared to traditional induction sessions</li>
                    <li><strong>Gamified learning:</strong> Progress bars, micro-certification badges, scenario challenges,
                      and spaced repetition mechanics improve completion rates in mandatory compliance training —
                      historically one of the lowest-engagement HR activities</li>
                    <li><strong>Gamified performance:</strong> Some organizations use peer recognition platforms with point
                      systems, public leaderboards, and social feeds to make contribution visible and appreciated in real time
                    </li>
                  </ul>
                  <p><span className="deib-tag">DEIB</span> Gamification must be designed for inclusivity: ensure rewards are
                    accessible to part-time, remote, and shift workers; avoid competitive mechanics that disadvantage
                    employees managing workload disparities; test for cultural appropriateness; and ensure that visual design,
                    language, and navigation are accessible to employees with different abilities and digital literacy levels.
                  </p>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">2.2 — Engagement 2.0: Continuous Listening and Real-Time Voice</div>
                <div className="prose">
                  <p>The annual engagement survey — once the standard HR tool for understanding employee sentiment
                    — is structurally inadequate for the pace of modern organizations. By the time results are analysed,
                    acted upon, and communicated, the organization has changed and the data is stale. Engagement 2.0 replaces
                    the annual survey cycle with <strong>always-on, multi-channel listening infrastructure:</strong></p>
                  <ul>
                    <li><strong>Pulse surveys:</strong> Short (3–5 question) weekly or bi-weekly check-ins that track
                      sentiment trends in near-real time, enabling HR to identify deterioration quickly and intervene before
                      disengagement becomes resignation</li>
                    <li><strong>AI sentiment analysis:</strong> Natural language processing tools that analyse anonymized
                      communication patterns in collaboration platforms (Teams, Slack, email) to flag team-level stress
                      signals, collaboration breakdowns, or enthusiasm patterns — without reading individual messages
                    </li>
                    <li><strong>Employee Net Promoter Score (eNPS):</strong> A single-question benchmark (“How likely
                      are you to recommend this organization as a place to work?”) that provides a fast, comparable
                      engagement indicator tracked over time</li>
                    <li><strong>Manager listening sessions:</strong> Structured monthly team conversations that give employees
                      a channel to raise concerns, share ideas, and give feedback in a psychologically safe format</li>
                  </ul>
                  <p>The critical rule of continuous listening: <strong>feedback without visible action destroys trust faster
                      than no feedback mechanism at all.</strong> Every listening channel must have a clear commitment to how
                    feedback will be reviewed, which themes will be acted upon, and how decisions will be communicated back to
                    employees.</p>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">2.3 — Employee Experience (EX) Design</div>
                <div className="prose">
                  <p>Employee Experience (EX) is the discipline of intentionally designing every interaction an employee has
                    with the organization — from the moment they encounter a job advertisement to their final day and
                    beyond. EX draws directly from customer experience (CX) design methodology, applying journey mapping,
                    persona development, and human-centred design principles to the employee relationship.</p>
                  <h4>Key EX Design Principles</h4>
                  <ul>
                    <li><strong>Journey mapping:</strong> Document every significant moment in the employee lifecycle —
                      application, offer, onboarding, first performance review, promotion, departure — and assess the
                      experience from the employee's perspective at each point</li>
                    <li><strong>Moment-of-truth identification:</strong> Identify the interactions that have the highest
                      emotional impact on employee commitment (positive or negative) and prioritize these for design
                      investment</li>
                    <li><strong>Personalization:</strong> Use data to tailor the experience to individual needs where possible
                      — development pathways, communication preferences, benefits choices, flexible work arrangements
                    </li>
                    <li><strong>Feedback loops:</strong> Build mechanisms to continuously measure EX quality and iterate based
                      on what employees tell you is working or not</li>
                  </ul>
                  <p><span className="deib-tag">DEIB</span> EX design must be explicitly inclusive: use diverse personas in
                    journey mapping (not just the majority experience), test designs with employees from underrepresented
                    groups before launch, ensure accessibility in all digital interfaces, and design for the full range of
                    life circumstances — caregivers, employees with disabilities, remote workers, those navigating
                    multiple identity dimensions simultaneously.</p>
                </div>
              </div>

              <div className="takeaways">
                <div className="tk-title">Key Takeaways — Topic 2</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Gamification drives engagement through autonomy, mastery, and purpose mechanics
                  — but must be designed for accessibility and inclusivity to avoid creating a two-tier experience
                  between different employee groups
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Engagement 2.0 replaces the annual survey cycle with continuous listening
                  infrastructure — pulse surveys, sentiment analysis, and eNPS — but only creates value when
                  feedback is visibly acted upon and communicated back
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Employee experience design treats every touchpoint in the employee lifecycle as a
                  deliberate design opportunity — using journey mapping, personalization, and feedback loops to create
                  experiences that attract, engage, and retain diverse talent
                </div>
              </div>
            </div>
          </div>

          
          <div className="topic">
            <div className="topic-band" onClick={(e) => toggleTopic(e.currentTarget)}>
              <span className="topic-badge">Topic 3</span>
              <span className="topic-title">The Evolving Workforce — Agility, Gig Economy, and Organizational Futures</span>
              <span className="topic-chev">▼</span>
            </div>
            <div className="topic-body">
              <div className="callout red">
                <div className="callout-icon">🎯</div>
                <div>
                  <div className="callout-label">Topic Objectives</div>
                  <div className="callout-text">Understand the gig economy's implications for HR strategy, culture, and legal
                    compliance · Design HR approaches for agile and self-organizing structures · Build inclusive
                    remote and hybrid work strategies · Plan for the intersection of AI automation and human capability
                    · Apply DEIB in all evolving workforce contexts</div>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">3.1 — The Gig Economy and the Blended Workforce</div>
                <div className="prose">
                  <p>The gig economy has grown from a fringe labour market phenomenon to a structural feature of the global
                    workforce. Platforms such as Upwork, Toptal, and specialized industry marketplaces now provide
                    organizations with access to specialist expertise on a project-by-project basis, fundamentally changing
                    what it means to plan and manage a workforce.</p>
                  <h4>HR Implications of Gig Workforce Integration</h4>
                  <ul>
                    <li><strong>Worker classification:</strong> The legal distinction between employees, workers, and
                      independent contractors has significant HR and legal implications. Misclassification exposes
                      organizations to employment tribunal risk and reputational harm. HR must work closely with legal and
                      finance to ensure all workforce categories are correctly classified and treated accordingly</li>
                    <li><strong>Culture and belonging:</strong> Gig workers are often invisible in engagement surveys,
                      excluded from recognition programmes, and disconnected from team culture. This affects both their
                      experience and the organization's ability to leverage their capabilities fully</li>
                    <li><strong>Knowledge management:</strong> When project-based workers leave after each engagement, they
                      take institutional knowledge with them. HR must design handover processes and knowledge-capture
                      mechanisms that protect organizational learning</li>
                  </ul>
                  <p><span className="deib-tag">DEIB</span> Gig economy structures can entrench inequalities: workers in less
                    privileged positions may have little choice but to accept gig contracts that lack benefits, security, or
                    career progression. HR must advocate for fair gig worker practices — equitable pay, safe working
                    conditions, transparent contracts, and wherever possible, pathways to more secure employment.</p>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">3.2 — Agile Organizational Structures and HR's Role</div>
                <div className="prose">
                  <p>Traditional hierarchical structures — where authority flows down through clear management chains
                    and roles are fixed — are increasingly being replaced or augmented by agile models that prioritize
                    adaptability, cross-functional collaboration, and decentralized decision-making.</p>
                  <h4>Models in Practice</h4>
                  <ul>
                    <li><strong>Spotify's Squad Model:</strong> Cross-functional self-managing teams
                      (“squads”) aligned to specific products or customer journeys, with chapter leads providing
                      functional expertise across squads. HR's role shifts from managing individuals in roles to enabling
                      team effectiveness and facilitating culture across fluid team boundaries</li>
                    <li><strong>OKR (Objectives and Key Results) Frameworks:</strong> Replacing traditional annual performance
                      management with quarterly goal cycles that align individual, team, and organizational objectives in a
                      cascading, transparent system</li>
                    <li><strong>Flattened hierarchies:</strong> Reducing management layers to increase speed of
                      decision-making — which requires managers to develop broader spans of control and employees to
                      develop greater autonomy and self-management capability</li>
                  </ul>
                  <p>HR's role in agile organizations is to: facilitate the cultural shift from hierarchy to
                    collaboration; design performance systems that evaluate contribution rather than compliance; support
                    managers moving from directive to coaching leadership styles; and maintain legal and ethical guardrails
                    even as formal structures become more fluid.</p>
                </div>
              </div>

              <div className="subtopic">
                <div className="subtopic-title">3.3 — Remote, Hybrid, and the Future of Work</div>
                <div className="prose">
                  <p>Remote and hybrid work have moved from emergency adaptation to permanent workforce expectation for a
                    significant proportion of knowledge workers globally. The organizations that thrive in this landscape are
                    those that intentionally design for distributed work — rather than treating it as a compromise
                    version of office work.</p>
                  <h4>Key HR Design Challenges</h4>
                  <ul>
                    <li><strong>Equal access to opportunity:</strong> Research consistently shows that remote workers are
                      disadvantaged in promotion decisions, informal sponsorship, and visibility compared to their
                      office-based counterparts — the “proximity bias.” HR must design performance and
                      promotion processes that are outcome-based, not presence-based</li>
                    <li><strong>Culture and belonging at distance:</strong> Organizational culture does not transmit
                      automatically in distributed settings. HR must be intentional about creating connection rituals, shared
                      practices, and belonging experiences that work across geographies and time zones</li>
                    <li><strong>Manager capability:</strong> Managing remote teams requires different skills than managing
                      co-located teams — more explicit communication, structured check-ins, and deliberate
                      trust-building. Investing in manager capability for distributed leadership is one of the
                      highest-leverage HR interventions in a hybrid world</li>
                    <li><strong>Equity of digital experience:</strong> Not all employees have access to high-quality home
                      working environments. HR must advocate for equity in technology provision, ergonomic support, and
                      connectivity — ensuring that hybrid work does not become a privilege of those with larger homes
                      and better circumstances</li>
                  </ul>
                  <p><span className="deib-tag">DEIB</span> Hybrid work is a major equity lever when designed inclusively —
                    enabling caregivers, people with disabilities, and employees in locations far from offices to participate
                    fully in organizational life. HR must ensure that flexibility is genuinely available to all, not just
                    senior employees, and that performance measurement reflects contribution rather than visibility.</p>
                </div>
              </div>

              <div className="takeaways">
                <div className="tk-title">Key Takeaways — Topic 3</div>
                <div className="tk-item">
                  <div className="tk-dot"></div>The gig economy requires HR to rethink workforce planning, culture design, and
                  legal compliance — gig workers must be integrated fairly into organizational culture, not treated as
                  invisible or disposable assets
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Agile structures shift HR's role from managing roles to enabling team
                  effectiveness — performance systems, manager capabilities, and culture must all evolve to support
                  decentralized, collaborative work models
                </div>
                <div className="tk-item">
                  <div className="tk-dot"></div>Remote and hybrid work must be intentionally designed for equity: proximity bias,
                  unequal access to technology, and performance measurement by presence rather than outcomes are all HR
                  responsibilities to actively address and eliminate
                </div>
              </div>
            </div>
          </div>

          
          <div className="case-wrap">
            <div className="case-head" style={{ "background": "linear-gradient(135deg,#7a1a1a,#c9352a)" }}>
              <div className="case-tag">Level 4 Case Study</div>
              <div className="case-title">FutureCorp 2030 — A Glimpse into Tomorrow's HR</div>
              <div className="case-sub">Priya (Chief People Officer) — AI-augmented HR, agile teams, VR workspaces, and
                hyper-personalized employee experience</div>
            </div>
            <div className="case-body">
              <div className="case-phase">
                <div className="case-phase-label">The Context</div>
                <div className="prose">
                  <p>It is 2030. FutureCorp is a global technology and professional services firm with 12,000 employees across
                    40 countries — 35% of whom are blended workforce (a mix of full-time employees, contractors, and gig
                    specialists). <strong>Priya, the Chief People Officer</strong>, leads an HR function that is fully
                    AI-augmented, data-driven, and human-centred. This case study is a forward projection of where the best
                    elements of Levels 1–4 converge.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">1 — The AI-Augmented HR Team</div>
                <div className="prose">
                  <p><strong>Athena</strong> (AI recruitment assistant): sources globally, screens applications, and conducts
                    structured initial video interviews with sentiment and competency analysis — trained on diverse
                    datasets and regularly audited for differential impact across demographic groups. All shortlisting
                    decisions require human review before progressing. <strong>ARIA</strong> (AI people analytics): generates
                    weekly attrition risk scores, team health indicators, and performance trend summaries — flagging
                    risks to HR business partners for human-led intervention. Every AI recommendation is explainable and
                    contestable by the employee affected.</p>
                </div>
                <div className="pause-box">
                  <div className="pause-label">Pause & Reflect</div>
                  <div className="pause-q">What governance safeguards make AI use in Priya's organization ethically credible?
                  </div>
                  <div className="pause-q">What would go wrong if the “human review” step was removed from
                    Athena's shortlisting process?</div>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">2 — Hyper-Personalized Employee Experience</div>
                <div className="prose">
                  <p>Every employee at FutureCorp has an AI career companion that maps their skills, identifies development
                    opportunities, and generates a personalized growth pathway updated quarterly. Employees earn digital
                    recognition tokens (redeemable for learning experiences, flexible time, or charitable donations in their
                    name) through peer recognition and project contributions. Benefits are fully flexible — employees
                    choose from a menu of options aligned to their life stage: new parents choose extended parental support,
                    employees approaching retirement choose phased working, those with caring responsibilities choose premium
                    healthcare access.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">3 — Fluid Teams and Global Gig Integration</div>
                <div className="prose">
                  <p>FutureCorp operates a talent cloud: an internal and external marketplace through which project teams
                    assemble dynamically based on skill requirements. Gig workers are onboarded to the talent cloud with the
                    same cultural onboarding as permanent employees, paired with an internal FutureCorp ambassador, and
                    included in recognition programmes. Approximately 30% of FutureCorp's gig alumni have returned as
                    full-time employees — the talent cloud has become a talent pipeline, not just a capacity buffer.</p>
                </div>
              </div>
              <div className="case-phase">
                <div className="case-phase-label">4 — VR, Metaverse, and Accessible Work</div>
                <div className="prose">
                  <p>Remote employees attend immersive quarterly all-hands gatherings in a virtual environment accessible from
                    any location. Employees with disabilities that limit physical travel participate with full capability
                    parity. New hires onboard through a VR simulation of FutureCorp's culture, values, and key teams
                    before their formal first day — arriving with meaningful context and connection rather than
                    information overload.</p>
                </div>
              </div>
              <div className="outcome-box">
                <div className="ob-title">FutureCorp's Outcomes</div>
                <div className="ob-item">Voluntary turnover at 6% globally — less than half the industry average</div>
                <div className="ob-item">48% women and 34% underrepresented groups in senior leadership</div>
                <div className="ob-item">Engagement score consistently above 78% across all regions and workforce categories</div>
                <div className="ob-item">Named top 3 global employer for five consecutive years</div>
              </div>
              <div className="callout red" style={{ "marginTop": "12px" }}>
                <div className="callout-icon">📋</div>
                <div>
                  <div className="callout-label">Case Analysis</div>
                  <div className="callout-text">FutureCorp demonstrates that the future of HR is neither fully automated nor
                    unchanged from today. The organizations that thrive will be those where <strong>technology amplifies human
                      judgment rather than replacing it</strong> — where AI handles routine complexity and humans handle
                    the relationships, ethics, and context that no algorithm can replicate. DEIB is not a separate initiative
                    in FutureCorp; it is the standard against which every system, process, and decision is evaluated.</div>
                </div>
              </div>
              <div className="appq-box">
                <div className="appq-title">Application Questions</div>
                <div className="appq-item">Which element of FutureCorp's HR model would you implement first in your current or
                  target organization, and why?</div>
                <div className="appq-item">What risk does over-reliance on AI for people decisions create — for employees,
                  for HR, and for the organization's legal standing?</div>
                <div className="appq-item">How would you ensure that FutureCorp's hyper-personalization does not inadvertently
                  sort employees into narrow tracks that limit rather than expand opportunity?</div>
              </div>
            </div>
          </div>

          <div className="game-zone">
            <div className="game-zone-header">
              <div className="game-zone-title">🎮 Gamified Activities — Level 4: Future-Forward HR</div>
              <div className="game-zone-sub">Build Your HR System · Future of Work Simulation · Team Quest Challenge</div>
              <div className="game-zone-note">Use the in-game menu to navigate between all three activities</div>
            </div>
            <iframe className="game-frame" src="/learning-module/games/level-4-future-forward-hr.html" title="Gamified Activities — Level 4: Future-Forward HR" loading="lazy"></iframe>
          </div>
          <div className="review-wrap">
            <div className="review-head">
              <div className="review-head-title">Review & Practice — “Workplace Visionaries”</div>
              <div className="review-head-sub">Reflecting on the innovation you would champion as an HR leader in 2035</div>
            </div>
            <div className="review-body">
              <div className="callout red" style={{ "marginBottom": "12px" }}>
                <div className="callout-icon">🎙</div>
                <div>
                  <div className="callout-label">The scenario</div>
                  <div className="callout-text">Imagine it is 2035 and you are being featured in a HR industry article titled
                    <em>“Workplace Visionaries: The HR Leaders Who Transformed Their Organizations.”</em> The
                    journalist asks: <strong>“What is one innovation you championed in HR that significantly improved
                      your organization — and what lesson can you share with the next generation of HR leaders about
                      driving innovation responsibly and inclusively?”</strong>
                  </div>
                </div>
              </div>
              <div className="review-q">
                <div className="review-q-num">The Innovation</div>
                <div className="review-q-text">Describe the HR innovation you championed. What was the problem it solved? How did
                  it align with your organization's strategic goals? What specifically changed as a result?</div>
                <div className="review-q-hint">Be specific — “we introduced AI-powered career pathing” is a
                  stronger answer than “we used more technology in HR.” What was the actual impact on real people?
                </div>
              </div>
              <div className="review-q">
                <div className="review-q-num">Ethics and Inclusion</div>
                <div className="review-q-text">How did you ensure that the innovation was implemented ethically and inclusively?
                  What safeguards did you build in? Who might have been disadvantaged by the innovation if you hadn't been
                  deliberate about DEIB?</div>
                <div className="review-q-hint">Think about: AI bias auditing, accessibility for different employee groups,
                  equitable access, consent and transparency.</div>
              </div>
              <div className="review-q">
                <div className="review-q-num">The Leadership Lesson</div>
                <div className="review-q-text">What is the most important lesson you learned about driving innovation responsibly
                  in HR? What advice would you give to an HR professional starting their innovation journey today?</div>
                <div className="review-q-hint">The best answers balance ambition with humility — what went wrong, what
                  you'd do differently, and what you'd never compromise on.</div>
              </div>
              <div className="stretch-box">
                <div className="stretch-label">Example Opening</div>
                <div className="prose" style={{ "fontSize": "12.5px" }}>
                  <p><em>“In 2030, as Chief People Officer at FutureTech, I championed the integration of an AI career
                      companion that gave every employee a personalized development roadmap updated quarterly. The challenge
                      we'd had before was that informal sponsorship and manager discretion meant that career development
                      happened for some people and not others. The AI surfaced opportunities systematically — and by
                      pairing it with mandatory human review and a quarterly diversity audit, we saw internal mobility
                      increase by 40% and representation in senior technical roles improve significantly within 18 months. The
                      lesson: technology is a fairness tool when you design it to be — and a discrimination machine when
                      you don't.”</em></p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head" onClick={(e) => toggleCard(e.currentTarget)}>
              <div className="card-icon ci-slate">📚</div>
              <div className="card-info">
                <div className="card-title">References — Level 4</div>
                <div className="card-sub">All sources cited in Level 4 content</div>
              </div>
              <div className="card-chev">▼</div>
            </div>
            <div className="card-body">
              <div className="refs-list">
                <div className="ref-item">Gamification Nation. (2025). <em>Gamification trends for 2025.</em> Gamification Nation
                  Blog.</div>
                <div className="ref-item">HubEngage. (2025). <em>Employee engagement trends to watch in 2025.</em> HubEngage
                  Research.</div>
                <div className="ref-item">Ideo. (2019). <em>The field guide to human-centered design.</em> Design Thinking
                  Framework.</div>
                <div className="ref-item">International Labour Organization (ILO). (2023). <em>Policy framework for decent work in
                    the digital age.</em> ILO.</div>
                <div className="ref-item">Innowise Group. (2024). <em>11 examples of gamification in HR.</em> Innowise.</div>
                <div className="ref-item">World Economic Forum. (2023). <em>Future of Jobs Report 2023.</em> WEF.</div>
              </div>
            </div>
          </div>

          <button className="continue-btn cb-green" onClick={() => setActiveTab("fp")}>Continue to Final Project →</button>
        </div>

        <div id="tab-fp" className={`panel${activeTab === "fp" ? " active" : ""}`}>
          <div className="hero hero-fp">
            <div className="hero-tag">Final Project · Integration Across All Four Levels</div>
            <div className="hero-title">HR Strategy Proposal</div>
            <div className="hero-sub">Your Final Project asks you to synthesize learning from all four levels into a comprehensive
              HR Strategy Proposal. This is your opportunity to demonstrate not just knowledge, but judgment: the ability to
              align people strategy with organizational ambition, use data to build a compelling business case, embed DEIB
              throughout every recommendation, and present your thinking with the clarity and conviction of a senior HR
              professional.</div>
            <div className="hero-note">📌 This is a professional deliverable — write it as you would present to a real executive
              team</div>
          </div>

          
          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">📋</div> Project Overview
            </div>
            <div className="prose">
              <p>You will develop a comprehensive HR Strategy Proposal for an organization of your choice — real or
                hypothetical — facing future challenges including technological change, workforce evolution, DEIB
                imperatives, and competitive pressure. Your proposal should demonstrate integrated thinking across all four
                levels of the module.</p>
              <p><strong>Format:</strong> Written report (1,500–2,000 words) <em>or</em> slide deck (12–18 slides
                with speaker notes). Both formats are equally valid — choose the one that best demonstrates your
                thinking. <strong>Deadline:</strong> Two days after completing Level 4.</p>
            </div>
          </div>

          
          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">1</div> Organizational Overview
            </div>
            <div className="prose">
              <p>Describe your chosen organization: industry and sector, size and workforce composition (global, remote,
                hybrid, local), and its current strategic goals or challenges. This provides the context within which your HR
                strategy must operate. If using a hypothetical organization, make it specific enough to ground your
                recommendations in realistic constraints.</p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">2</div> Strategic HR Objectives
            </div>
            <div className="prose">
              <p>Identify 3–4 key HR objectives that directly support your organization's strategic goals. Each
                objective must be measurable and clearly linked to the business's mission or competitive position.
                Example: <em>“Attract and develop 50 employees with advanced AI and data science skills within 18 months
                  to support the organization's digital transformation programme.”</em></p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">3</div> Innovative HR Initiatives
            </div>
            <div className="prose">
              <p>Propose 2–3 specific HR initiatives that leverage technology, gamification, or emerging workforce
                models from Level 4. For each initiative, explain: the problem it addresses, how it works in practice, the
                expected impact on employees and the business, and how you would measure success. Be specific — describe
                the tool, the process, and the people it affects.</p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">4</div> DEIB Integration
            </div>
            <div className="prose">
              <p>Demonstrate how DEIB principles are embedded throughout your HR strategy — not as a standalone section,
                but woven into every recommendation. Address: how your hiring strategy widens access to diverse talent; how
                performance and development processes ensure equitable opportunity; how your culture and recognition
                initiatives create belonging for all employee groups; and how you will measure and report on DEIB outcomes.
              </p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">5</div> Ethical Considerations
            </div>
            <div className="prose">
              <p>Where your initiatives involve technology — especially AI — address: how you will prevent
                algorithmic bias, protect employee data and privacy, ensure transparency in how technology is used in people
                decisions, and maintain meaningful human oversight. Demonstrate that you understand the ethical
                responsibilities that come with technological power in HR.</p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">6</div> Metrics and Success Measurement
            </div>
            <div className="prose">
              <p>Define at least five KPIs for your HR strategy, drawing from the metrics framework in Level 3. For each KPI,
                specify: the current baseline (estimated or actual), your target, the timeline, and how data will be
                collected. Include at least one financial impact metric, one DEIB metric, and one employee experience metric.
              </p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">7</div> Implementation Plan
            </div>
            <div className="prose">
              <p>Provide a phased implementation timeline (e.g. 30/90/180 days and Year 1). Identify the key stakeholders
                whose buy-in you need and how you will secure it. Specify the resources required (budget range, technology
                platforms, internal vs. external expertise) and the top three risks to successful implementation with your
                mitigation strategies.</p>
            </div>
          </div>

          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">8</div> Conclusion and Reflection
            </div>
            <div className="prose">
              <p>Summarize how your HR strategy creates sustainable competitive advantage for the organization and improves
                the working lives of its employees. Reflect on how your thinking has evolved across all four levels of this
                module, and articulate the values and principles that will guide your practice as an HR professional going
                forward.</p>
            </div>
          </div>

          
          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">⭐</div> Evaluation Criteria
            </div>
            <div className="eval-grid">
              <div className="eval-item">
                <div className="eval-title">🔮 Strategic Alignment</div>
                <div className="eval-desc">Does the HR strategy directly support the organization's stated goals? Is vertical
                  and horizontal alignment clearly demonstrated? Are recommendations evidence-based rather than generic?</div>
              </div>
              <div className="eval-item">
                <div className="eval-title">💡 Innovation and Practicality</div>
                <div className="eval-desc">Are the proposed initiatives forward-thinking while remaining realistically
                  implementable? Are Level 4 concepts applied with nuance rather than uncritically adopted?</div>
              </div>
              <div className="eval-item">
                <div className="eval-title">🌎 DEIB Integration</div>
                <div className="eval-desc">Are DEIB principles genuinely embedded throughout — in every recommendation,
                  metric, and governance decision — rather than addressed in a separate standalone section?</div>
              </div>
              <div className="eval-item">
                <div className="eval-title">📋 Evidence and Research</div>
                <div className="eval-desc">Are recommendations supported by research, data, or credible case studies from the
                  module? Are all sources cited in APA format? Is the evidence used critically, not just cited?</div>
              </div>
              <div className="eval-item" style={{ "gridColumn": "1/-1" }}>
                <div className="eval-title">📈 Metrics and Impact</div>
                <div className="eval-desc">Are KPIs specific, measurable, and linked to business outcomes? Does the proposal
                  include financial impact estimates alongside people metrics? Is success defined in a way the
                  organization's leadership would find compelling?</div>
              </div>
            </div>
          </div>

          
          <div className="fp-section">
            <div className="fp-sec-title">
              <div className="fp-num-badge">📤</div> Submit Your Final Project
            </div>
            <div className="prose" style={{ "marginBottom": "16px" }}>
              <p>Upload your completed HR Strategy Proposal below. Accepted formats: PDF, Word document (.docx), or PowerPoint
                presentation (.pptx / .ppt). Ensure your file is named <strong>Firstname_Lastname_HRStrategyProposal</strong>
                before uploading.</p>
            </div>

            <div id="upload-zone" className="upload-zone" ref={uploadZoneRef} onClick={openFileDialog} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <div className="upload-icon">📤</div>
              <div className="upload-title">Drag & drop your file here</div>
              <div className="upload-sub">or click to browse your files<br />Accepted: PDF, DOCX, PPTX — Max 25 MB</div>
              <label className="upload-label">
                📄 Browse Files
                <input type="file" id="fp-file-input" accept=".pdf,.doc,.docx,.ppt,.pptx"  ref={fileInputRef} onChange={handleInputChange} />
              </label>
            </div>

            <div id="file-preview" className="file-preview" ref={filePreviewRef}>
              <div className="file-card">
                <div id="file-card-icon" className="file-card-icon" ref={fileCardIconRef}></div>
                <div>
                  <div id="file-card-name" className="file-card-name" ref={fileCardNameRef}></div>
                  <div style={{ "fontSize": "11px", "color": "#6b7280", "marginTop": "2px" }}>Ready to submit — <span id="current-file-ext" ref={currentFileExtRef}>PDF</span></div>
                </div>
                <div id="file-card-size" className="file-card-size" ref={fileCardSizeRef}></div>
                <button id="file-remove-btn" className="file-card-remove" title="Remove file" ref={fileRemoveBtnRef} onClick={handleRemove}>✕</button>
              </div>
            </div>

            <button id="submit-btn" className="submit-btn"  ref={submitBtnRef} onClick={handleSubmit} disabled>
              📤 Submit Final Project
            </button>

            <div id="submit-success" className="submit-success" ref={submitSuccessRef}>
              <div style={{ "fontSize": "48px", "marginBottom": "8px" }}>🎉</div>
              <div style={{ "fontSize": "16px", "fontWeight": "700", "color": "var(--navy-3)", "marginBottom": "6px" }}>Submission received!</div>
              <div style={{ "fontSize": "13px", "color": "#4b5563", "lineHeight": "1.6" }}>Your HR Strategy Proposal has been submitted
                successfully. You will receive feedback within five working days. Congratulations on completing the HR
                Playhouse Hub Learning Module — all four levels.</div>
            </div>
          </div>

          <div className="deadline-banner">
            <div className="db-icon">⌛</div>
            <div>
              <div className="db-title">Submission details</div>
              <div className="db-sub">Complete and submit your proposal to finish the HR Playhouse Hub module</div>
              <div className="db-pills">
                <div className="db-pill">📅 Due 2 days after Level 4</div>
                <div className="db-pill">📄 PDF, DOCX, or PPTX</div>
                <div className="db-pill">📝 1,500–2,000 words or 12–18 slides</div>
                <div className="db-pill">📖 APA citations required</div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
