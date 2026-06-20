/**
 * Typed data model for the 32 HR Playhouse Hub Case Study Vault cases.
 *
 * Source data for the case-study cards and modals. Each case has
 * an id, topic, difficulty, industry, title, organisation, short preview,
 * a "featured" flag, the modal-topic label, plus the six body sections
 * (scenario, challenge, pauseQs, outcomes, lessons, appqs). Rendered by
 * the real React components in case-study-vault-content.tsx — there is no
 * injected HTML anywhere.
 *
 * Text content is byte-faithful to the source HTML (HTML entities such as
 * &middot; are stored as their real characters). The single scenario
 * paragraph in r2 that contains an inline <em>"..."</em> quote is
 * represented via a paragraph-segment shape so we can render the italic
 * cleanly in JSX.
 */

export type Difficulty = "beginner" | "intermediate" | "expert";

export type ScenarioSegment = { text: string; italic?: boolean };
/**
 * A scenario paragraph is normally a plain string. When the paragraph
 * contains inline emphasis (only r2 in the current source), we use an
 * array of segments instead so the <em> can render as real JSX.
 */
export type ScenarioParagraph = string | ScenarioSegment[];

export type ChallengeBody =
  | { kind: "list"; items: string[] }
  | { kind: "paragraphs"; paragraphs: string[] };

export type CaseStudy = {
  id: string;
  topic: TopicKey;
  topicLabel: string; // e.g. "Recruitment & Onboarding"
  difficulty: Difficulty;
  industry: string;       // display label, e.g. "Technology"
  industryKey: string;    // lowercase value used by the industry filter, e.g. "technology"
  title: string;          // includes the surrounding "double-quotes" exactly as source
  org: string;            // e.g. "TechNova"
  orgLine: string;        // org + size, e.g. "TechNova · 200 employees"
  preview: string;        // plain card preview
  searchTitle: string;    // lowercase, source data-title
  searchOrg: string;      // lowercase, source data-org
  searchPreview: string;  // lowercase, source data-preview (truncated as in source)
  featured: boolean;
  scenario: ScenarioParagraph[];
  challenge: ChallengeBody;
  pauseQs: string[];
  outcomes: string[];
  lessons: string[];
  appqs: string[];
};

export type TopicKey =
  | "recruitment"
  | "performance"
  | "retention"
  | "deib"
  | "strategy"
  | "er"
  | "wellbeing"
  | "fow";

export type Topic = {
  key: TopicKey;
  label: string;
  icon: string;       // emoji
  iconClass: string;  // ti-rec / ti-perf / …
};

export const TOPICS: Topic[] = [
  { key: "recruitment", label: "Recruitment & Onboarding",     icon: "🔍", iconClass: "ti-rec"  },
  { key: "performance", label: "Performance Management",        icon: "📊", iconClass: "ti-perf" },
  { key: "retention",   label: "Retention & Engagement",        icon: "💙", iconClass: "ti-ret"  },
  { key: "deib",        label: "DEIB",                          icon: "🌍", iconClass: "ti-deib" },
  { key: "strategy",    label: "HR Strategy & Analytics",       icon: "🎯", iconClass: "ti-stra" },
  { key: "er",          label: "Employee Relations & Conflict", icon: "🤝", iconClass: "ti-er"   },
  { key: "wellbeing",   label: "Well-being & Mental Health",    icon: "🌱", iconClass: "ti-wb"   },
  { key: "fow",         label: "Future of Work & Innovation",   icon: "🚀", iconClass: "ti-fow"  },
];

export const INDUSTRY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "business process outsourcing", label: "Business Process Outsourcing" },
  { value: "construction",                 label: "Construction" },
  { value: "creative agency",              label: "Creative Agency" },
  { value: "data services",                label: "Data Services" },
  { value: "education",                    label: "Education" },
  { value: "energy",                       label: "Energy" },
  { value: "fashion / retail",             label: "Fashion / Retail" },
  { value: "financial services",           label: "Financial Services" },
  { value: "healthcare",                   label: "Healthcare" },
  { value: "healthcare (nhs)",             label: "Healthcare (NHS)" },
  { value: "insurance",                    label: "Insurance" },
  { value: "legal services",               label: "Legal Services" },
  { value: "logistics",                    label: "Logistics" },
  { value: "manufacturing",                label: "Manufacturing" },
  { value: "marketing / creative",         label: "Marketing / Creative" },
  { value: "media / creative",             label: "Media / Creative" },
  { value: "pharmaceuticals",              label: "Pharmaceuticals" },
  { value: "professional services",        label: "Professional Services" },
  { value: "recruitment / hr technology",  label: "Recruitment / HR Technology" },
  { value: "retail",                       label: "Retail" },
  { value: "saas",                         label: "SaaS" },
  { value: "software / technology",        label: "Software / Technology" },
  { value: "staffing / workforce solutions", label: "Staffing / Workforce Solutions" },
  { value: "sustainability / clean tech",  label: "Sustainability / Clean Tech" },
  { value: "technology",                   label: "Technology" },
  { value: "technology (startup)",         label: "Technology (Startup)" },
];

// All 32 cases. Order matches the source HTML (4 cases per topic × 8 topics).
export const CASES: CaseStudy[] = [
  // ── Recruitment & Onboarding ─────────────────────────────────
  {
    id: "r1",
    topic: "recruitment",
    topicLabel: "Recruitment & Onboarding",
    difficulty: "intermediate",
    industry: "Technology",
    industryKey: "technology",
    title: "“The Biased Shortlist”",
    org: "TechNova",
    orgLine: "TechNova · 200 employees",
    preview:
      "A structured hiring process reveals that three interviewers have been unconsciously filtering out candidates based on university prestige and communication style.",
    searchTitle: "the biased shortlist",
    searchOrg: "technova",
    searchPreview:
      "a structured hiring process reveals that three interviewers have been unconsciou",
    featured: true,
    scenario: [
      "TechNova, a 200-person software company, is hiring a Senior Product Manager. The hiring panel consists of three managers — all male, all from elite universities. After the first round of interviews, the shortlist of six candidates is entirely male and shares strikingly similar educational backgrounds. An HR Business Partner, Kezia, reviews the scoring sheets and notices something troubling: candidates with non-linear career paths or accents different from the panel's own have consistently received lower scores on “communication” and “culture fit” — despite equally strong technical answers.",
      "Kezia has the data to show a pattern, but the hiring managers believe their process was fair. The final decision is due in 48 hours.",
    ],
    challenge: {
      kind: "list",
      items: [
        "How does Kezia present bias findings to a panel that believes it acted fairly, without creating defensiveness that shuts down the conversation?",
        "Should the process be paused, restarted, or corrected mid-stream?",
        "How does TechNova prevent this pattern from recurring in future hires?",
      ],
    },
    pauseQs: [
      "What evidence would you need to prove bias occurred — and what evidence would be sufficient to pause the process?",
      "How do you raise bias concerns with hiring managers who are more senior than you?",
    ],
    outcomes: [
      "Kezia facilitates a calibration session using anonymous scoring data — patterns become visible without blame attribution",
      "The shortlist is expanded to eight candidates; two previously low-scored finalists are re-evaluated with structured scoring",
      "The final hire is a candidate who had scored poorly on “fit” but highest on every technical criterion",
      "TechNova introduces structured interviewing, blind CV screening, and diverse panel requirements within 60 days",
    ],
    lessons: [
      "Bias in hiring is rarely malicious — it is structural, and the solution must be structural too: standardized scoring rubrics, diverse panels, and criteria defined before reviewing applications",
      "'Culture fit' is one of the most common vehicles for unconscious bias in hiring — replacing it with specific, observable, role-relevant criteria is an operational HR responsibility",
      "HR has both the right and the responsibility to pause or challenge a hiring process when the data suggests fairness has been compromised",
    ],
    appqs: [
      "How would you approach the calibration session differently if the hiring manager became defensive?",
      "What structural changes would you prioritize first if you only had two weeks and no budget?",
      "How do you balance urgency to fill a role with the time needed to correct a biased process?",
    ],
  },
  {
    id: "r2",
    topic: "recruitment",
    topicLabel: "Recruitment & Onboarding",
    difficulty: "beginner",
    industry: "Logistics",
    industryKey: "logistics",
    title: "“Onboarding in the Dark”",
    org: "Greenfield Logistics",
    orgLine: "Greenfield Logistics · 500 employees",
    preview:
      "Greenfield Logistics is losing 40% of new hires within their first six months. Exit interviews point to a single cause: nobody helped them succeed from day one.",
    searchTitle: "onboarding in the dark",
    searchOrg: "greenfield logistics",
    searchPreview:
      "greenfield logistics is losing 40% of new hires within their first six months. e",
    featured: false,
    scenario: [
      "Greenfield Logistics, a fast-growing logistics company with 500 employees, is puzzled by its revolving door. Despite competitive salaries and a strong employer brand, 40% of new hires are leaving within six months. The CEO believes it is a “generational attitude problem.” The HR Manager, Priscilla, suspects something very different.",
      [
        { text: "When Priscilla reviews the last 20 exit interviews, the pattern is clear: new hires felt confused about expectations, unsupported by their managers, and disconnected from the team. Several mention that their IT access wasn't ready on day one. Most say their manager seemed too busy to help them settle in. One leaver, a warehouse supervisor hired from a competitor, says: " },
        { text: "“I had more support in my first week at my last company ten years ago.”", italic: true },
      ],
    ],
    challenge: {
      kind: "list",
      items: [
        "Onboarding at Greenfield is entirely manager-dependent — some managers run good onboarding informally, most don't. There is no standard process, no checklist, no defined timeline.",
        "Priscilla has limited budget and no dedicated L&D team. She needs a solution that is simple, scalable, and doesn't require significant manager training before it can be rolled out.",
        "She also needs to shift the CEO's framing from “attitude problem” to “system problem.”",
      ],
    },
    pauseQs: [
      "What data would you use to shift the CEO's mindset from blaming new hires to addressing the system?",
      "What are the three most important things a new hire needs in their first week — and who is responsible for each?",
    ],
    outcomes: [
      "Priscilla introduces a 30/60/90-day onboarding checklist co-designed with managers — simple, practical, and role-specific",
      "A buddy system is launched: every new hire is paired with a peer (not their manager) for the first 90 days",
      "IT pre-boarding checklist introduced — all access provisioned before Day 1",
      "Six-month retention improves from 60% to 82% within two cohorts",
    ],
    lessons: [
      "Poor onboarding is almost always a system failure, not an individual failure — the solution must be structural, consistent, and manager-independent",
      "The first week of employment has a disproportionate impact on long-term retention and engagement — investment here pays back many times over",
      "Buddy systems and peer support are low-cost, high-impact onboarding tools that reduce manager dependency and build belonging simultaneously",
    ],
    appqs: [
      "Design a one-page onboarding checklist for a new hire's first week. What would absolutely have to be on it?",
      "How would you make the business case to the CEO for investing in a formal onboarding process?",
      "What would you measure to confirm that the new onboarding programme is working?",
    ],
  },
  {
    id: "r3",
    topic: "recruitment",
    topicLabel: "Recruitment & Onboarding",
    difficulty: "intermediate",
    industry: "Financial Services",
    industryKey: "financial services",
    title: "“The Overlooked Candidate”",
    org: "ClearPath Finance",
    orgLine: "ClearPath Finance · 1,200 employees",
    preview:
      "A 58-year-old highly qualified applicant is rejected at the screening stage. The data suggests age may have been a factor — and ClearPath's exposure is significant.",
    searchTitle: "the overlooked candidate",
    searchOrg: "clearpath finance",
    searchPreview:
      "a 58-year-old highly qualified applicant is rejected at the screening stage. the",
    featured: false,
    scenario: [
      "ClearPath Finance, a 1,200-person financial services firm, is recruiting for a Senior Risk Analyst. Among the applicants is Margaret, 58, with 25 years of directly relevant experience, a strong track record, and impeccable references. She is rejected at the initial screening stage — never reaching interview. Three male candidates in their early 30s with fewer years of experience are shortlisted instead.",
      "Margaret writes a formal letter querying the decision. The HR team reviews the screening notes. The screener — a junior recruiter — has written next to Margaret's application: “overqualified, may not adapt to our systems.” No specific evidence is cited. Meanwhile, the three shortlisted candidates' notes include phrases like “great energy,” “ambitious,” and “long-term potential.”",
    ],
    challenge: {
      kind: "list",
      items: [
        "ClearPath faces potential age discrimination liability under the Equality Act 2010. The screening language used is not explicitly age-based, but the pattern is clear and the subjectivity is indefensible.",
        "HR must respond to Margaret's letter fairly and honestly, manage the legal exposure, and fix the process that allowed this to happen.",
        "The business wants the role filled quickly. HR must balance urgency against doing this properly.",
      ],
    },
    pauseQs: [
      "At what point does subjective screening language become discriminatory — and who is responsible for policing this?",
      "How would you respond to Margaret's letter honestly without admitting liability prematurely?",
    ],
    outcomes: [
      "HR invites Margaret to interview — she is assessed against the same criteria as the shortlisted candidates and ultimately offered the role",
      "The screener receives coaching and retraining; screening criteria are redefined to be skills-based and objective",
      "ClearPath introduces a structured screening rubric requiring evidence-based notes for every decision",
      "Age, gender, and background distribution data is now reviewed monthly across the recruitment funnel",
    ],
    lessons: [
      "Subjective language in screening notes — 'overqualified,' 'great energy,' 'long-term potential' — is where discrimination most commonly enters a recruitment process undetected",
      "HR has a legal and ethical responsibility to audit recruitment decisions for bias patterns, not just respond when complaints arise",
      "Speed of hire is never a justification for a discriminatory process — a fast unfair hire creates more cost than a slower fair one",
    ],
    appqs: [
      "What changes to your screening process would prevent this pattern from occurring?",
      "How would you draft a response to Margaret's letter that is honest, fair, and legally appropriate?",
      "What DEIB metrics would you track monthly across your recruitment funnel?",
    ],
  },
  {
    id: "r4",
    topic: "recruitment",
    topicLabel: "Recruitment & Onboarding",
    difficulty: "expert",
    industry: "Technology (Startup)",
    industryKey: "technology (startup)",
    title: "“Hiring at Speed”",
    org: "RapidScale",
    orgLine: "RapidScale · 80 employees",
    preview:
      "A Series B startup doubles headcount in 8 months with no HR function. The culture collapses. The founders blame 'the wrong hires.' HR says the wrong process is to blame.",
    searchTitle: "hiring at speed",
    searchOrg: "rapidscale",
    searchPreview:
      "a series b startup doubles headcount in 8 months with no hr function. the cultur",
    featured: false,
    scenario: [
      "RapidScale, a venture-backed SaaS startup, raises a Series B and is instructed by its investors to scale from 40 to 90 employees within eight months. The founders hire aggressively, relying primarily on founder networks and referrals. There is no structured interview process, no defined values-based hiring criteria, and no onboarding programme. Speed is the only metric that matters.",
      "By month seven, the cracks are visible: three senior hires are in open conflict with founding team members, two departments have developed entirely different working cultures, and eNPS has dropped from +42 to -8. The founders ask the newly appointed HR Director, Dami, to “fix the culture problem.” Dami's assessment: the problem was built, hire by hire, over the last eight months.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Dami must diagnose which hires and hiring decisions created the cultural fractures — without scapegoating individuals or destabilising an already fragile team.",
        "The founders want a fast cultural fix. Dami knows that what is broken in eight months cannot be repaired in four weeks.",
        "RapidScale needs a hiring process that can move fast enough to satisfy investor pressure while being structured enough to prevent a repeat of the current situation.",
      ],
    },
    pauseQs: [
      "When a culture problem is traced back to hiring decisions, how do you address the existing team without creating blame or exit anxiety?",
      "How do you design a hiring process that is both fast enough for a startup and rigorous enough to prevent cultural damage?",
    ],
    outcomes: [
      "Dami facilitates a values clarification workshop with the founding team — defining what RapidScale's culture actually is, not what it should be on a poster",
      "A 4-stage interview process is introduced: screening, technical, values/culture-add, and leadership review — designed to take 10 working days maximum",
      "Three senior hires are placed in a structured mediation and team effectiveness process — two are retained with role adjustments, one exits by mutual agreement",
      "eNPS recovers to +18 within six months; referral hiring is capped at 30% of total hires",
    ],
    lessons: [
      "Hypergrowth hiring without structure does not just risk bad individual hires — it risks building multiple incompatible micro-cultures that fracture the organization permanently",
      "Referral-heavy hiring creates cultural homogeneity and in-group bias at scale — networks hire people like themselves, which limits diversity and creates insularity",
      "Speed and rigour in hiring are not opposites — a well-designed four-stage process can be completed in 10 days and still identify cultural misalignment before it becomes organizational damage",
    ],
    appqs: [
      "How would you design a fast, fair, and culture-conscious hiring process for a startup scaling rapidly?",
      "What is the minimum viable HR infrastructure a 50-person startup should have in place before beginning hypergrowth hiring?",
      "How do you make the business case to founders who see HR process as a brake on speed?",
    ],
  },

  // ── Performance Management ───────────────────────────────────
  {
    id: "p1",
    topic: "performance",
    topicLabel: "Performance Management",
    difficulty: "beginner",
    industry: "Healthcare",
    industryKey: "healthcare",
    title: "“The Silent Performer”",
    org: "MediCore Hospital",
    orgLine: "MediCore Hospital · 800 employees",
    preview:
      "A consistently high-performing nurse receives no feedback for two years, then fails a performance review she didn't know was coming. HR investigates why the system failed her.",
    searchTitle: "the silent performer",
    searchOrg: "medicore hospital",
    searchPreview:
      "a consistently high-performing nurse receives no feedback for two years, then fa",
    featured: true,
    scenario: [
      "Amara is a senior nurse at MediCore Hospital, consistently rated highly by colleagues and patients. For two years, she receives no formal performance review, no development conversation, and no feedback from her line manager — who is overstretched managing a team of 22. Then, in a department restructure, all staff are assessed for a new banding framework. Amara receives an “unsatisfactory” rating, citing documentation gaps and a lack of evidence of leadership behaviours — things nobody had ever told her to demonstrate or develop.",
      "Amara raises a grievance. HR discovers that 68% of the department has not had a performance review in over 18 months. The managers are not lazy — they are drowning. The system has failed everyone.",
    ],
    challenge: {
      kind: "list",
      items: [
        "HR must respond to Amara's grievance fairly — acknowledging that the system, not Amara, failed.",
        "A performance management process exists on paper but is almost never used. The gap between policy and practice is systemic, not individual.",
        "The new banding framework has real career and pay implications. Decisions made using a broken process must be reviewed or reversed.",
      ],
    },
    pauseQs: [
      "When a performance rating is based on an incomplete or unfair process, is the rating valid? What are HR's obligations?",
      "How do you fix a performance management system that managers aren't using — without blaming them?",
    ],
    outcomes: [
      "Amara's rating is suspended pending a proper review conducted with full context and manager input",
      "HR audits all banding decisions across the department and identifies 14 cases requiring review",
      "Manager span of control is reviewed — three team leads are appointed to reduce direct reports from 22 to 8 per manager",
      "A simplified digital check-in tool replaces the annual review form — quarterly conversations take 20 minutes and are tracked centrally",
    ],
    lessons: [
      "A performance management process that exists only on paper provides no protection — and actively harms employees when it is suddenly applied without warning or preparation",
      "Manager overload is one of the most common root causes of performance management failure — addressing span of control is as important as redesigning the appraisal form",
      "When a broken process has caused real harm to real people, HR must be willing to review and reverse decisions, not just fix the process going forward",
    ],
    appqs: [
      "How would you respond to Amara's grievance in a way that acknowledges system failure without undermining the organization's legal position?",
      "What would a realistic, manager-friendly performance check-in process look like in a healthcare setting?",
      "How do you convince senior leadership that manager span of control is a performance management problem, not just a resourcing problem?",
    ],
  },
  {
    id: "p2",
    topic: "performance",
    topicLabel: "Performance Management",
    difficulty: "intermediate",
    industry: "Professional Services",
    industryKey: "professional services",
    title: "“The Unfair PIP”",
    org: "Atlas Consulting",
    orgLine: "Atlas Consulting · 300 employees",
    preview:
      "Three employees placed on PIPs in the same quarter share a demographic profile. HR must determine whether the process was applied fairly — or used as a managed exit strategy.",
    searchTitle: "the unfair pip",
    searchOrg: "atlas consulting",
    searchPreview:
      "three employees placed on pips in the same quarter share a demographic profile. ",
    featured: false,
    scenario: [
      "Atlas Consulting, a 300-person professional services firm, places three employees on Performance Improvement Plans in the same quarter. All three are women of colour. All three are in the same department, managed by the same director. The PIP documentation is identical in structure across all three cases — the same generic language, the same 60-day timeline, the same vague performance targets. None of the three employees were aware of performance concerns before the PIPs were issued.",
      "One of the three, Fatima, contacts HR directly: “I have never had a negative performance review in four years here. Nobody has ever raised a concern with me. Now I have 60 days to prove I deserve my job.” HR Business Partner Yemi begins an investigation.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Yemi must determine whether the PIPs reflect genuine, documented performance concerns or whether they are being used as a structured exit mechanism — potentially constituting constructive dismissal and race discrimination.",
        "The managing director is a long-tenured, high-revenue partner. Any challenge to his management decisions will require significant courage and organizational backing.",
        "The three employees are at immediate risk of unjust termination. Yemi must act quickly, carefully, and with full documentation.",
      ],
    },
    pauseQs: [
      "At what point does a PIP cross the line from performance support to managed exit — and what evidence would you look for?",
      "How do you investigate a senior partner's management conduct without triggering a defensive response that makes the situation worse?",
    ],
    outcomes: [
      "Yemi's review finds no prior performance documentation for any of the three employees — the PIPs are suspended immediately",
      "HR commissions an independent review of the director's team — patterns of differential treatment are confirmed across 18 months of management records",
      "All three employees receive formal apologies, their PIPs are withdrawn, and career development conversations are initiated",
      "The director receives a formal warning and mandatory management coaching; HR introduces PIP authorization requirements including prior documentation review",
    ],
    lessons: [
      "PIPs must always be preceded by documented, communicated performance concerns — a PIP issued without prior feedback is not a performance tool, it is a termination strategy",
      "Demographic patterns in disciplinary or performance actions are a serious DEIB red flag that HR must proactively monitor, not wait to be reported",
      "HR's duty of care to employees includes the courage to challenge senior leaders when evidence of discriminatory treatment exists — regardless of seniority or commercial value",
    ],
    appqs: [
      "What authorization and documentation requirements would you build into a PIP process to prevent misuse?",
      "How would you approach the conversation with the director when presenting the findings of your review?",
      "Design a monitoring system that would flag demographic patterns in performance actions before they reach crisis point.",
    ],
  },
  {
    id: "p3",
    topic: "performance",
    topicLabel: "Performance Management",
    difficulty: "intermediate",
    industry: "Construction",
    industryKey: "construction",
    title: "“Goals Nobody Agreed To”",
    org: "NovaBuild",
    orgLine: "NovaBuild · 600 employees",
    preview:
      "NovaBuild's annual goal-setting process runs on a cascade model — goals arrive in employees' inboxes, pre-written, two weeks before the review period ends. Unsurprisingly, nobody is meeting them.",
    searchTitle: "goals nobody agreed to",
    searchOrg: "novabuild",
    searchPreview:
      "novabuild's annual goal-setting process runs on a cascade model — goals arrive i",
    featured: false,
    scenario: [
      "NovaBuild, a 600-person construction company, conducts annual performance reviews in March. Goals for the year are supposed to be agreed in January. In practice, the goal-setting process works as follows: senior leadership sets organizational targets in December, these are broken down by department heads in January, and individual goals are emailed to employees in mid-February — four weeks before the review period ends. Employees have never been asked to contribute to or discuss their goals. When reviews arrive, 74% of employees are rated “partially meets expectations” — primarily because goals were set too late to be meaningfully worked toward.",
      "HR Manager Jerome identifies the problem immediately. The review scores are being used to justify withholding annual pay increases. Jerome has two weeks before the pay round is finalized.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Jerome must make the case that the review scores are structurally invalid and should not be used to drive pay decisions this cycle.",
        "He must also redesign a goal-setting process that works within NovaBuild's hierarchical, project-based operational structure — and get leadership buy-in within weeks.",
        "74% of employees are awaiting pay decisions. The cost of getting this wrong in both directions is significant.",
      ],
    },
    pauseQs: [
      "When a performance review process is structurally flawed, are the scores it produces valid? What are the ethical obligations of HR?",
      "How do you pause a pay round that leadership is committed to without creating an organizational crisis?",
    ],
    outcomes: [
      "Jerome presents data showing goals were issued an average of 26 days before the review period ended — leadership agrees to suspend pay decisions pending a review",
      "A supplementary mid-year review is conducted using revised, agreed goals — pay decisions are delayed by eight weeks",
      "A new goal-setting calendar is introduced: organizational goals set in November, team goals agreed in December, individual goals co-created with employees in January",
      "Employee satisfaction with the performance process improves from 31% to 67% in the following cycle",
    ],
    lessons: [
      "Goals that employees have not participated in setting are not motivational targets — they are imposed standards that undermine trust and engagement when used as the basis for pay decisions",
      "A performance management system must be evaluated on its own integrity before its outputs are used to make consequential decisions about people's careers and pay",
      "HR has a professional responsibility to identify and flag when a process is structurally unfair — even when this requires delaying or challenging decisions that leadership wants to make quickly",
    ],
    appqs: [
      "Design a goal-setting calendar for NovaBuild's next cycle. What happens at each stage and who is responsible?",
      "How would you facilitate a goal-setting conversation between a manager and an employee who has never been asked to set their own goals before?",
      "What is the right balance between organizational top-down goals and individual bottom-up goals in a construction business?",
    ],
  },
  {
    id: "p4",
    topic: "performance",
    topicLabel: "Performance Management",
    difficulty: "expert",
    industry: "Creative Agency",
    industryKey: "creative agency",
    title: "“The Star Who Stopped Shining”",
    org: "Vertex Digital",
    orgLine: "Vertex Digital · 150 employees",
    preview:
      "Vertex's highest-performing designer begins missing deadlines and disengaging. The management response is a PIP. HR identifies a very different problem — and a very different solution.",
    searchTitle: "the star who stopped shining",
    searchOrg: "vertex digital",
    searchPreview:
      "vertex's highest-performing designer begins missing deadlines and disengaging. t",
    featured: false,
    scenario: [
      "Marcus has been Vertex Digital's top Creative Director for six years. His work has won industry awards. Clients request him by name. Then, over a three-month period, things change: deadlines are missed, client feedback becomes mixed, he declines creative direction meetings, and colleagues notice he seems distant. His line manager escalates immediately, recommending a PIP. HR Director Sasha intervenes before the PIP is issued.",
      "In a confidential conversation, Sasha learns that Marcus was passed over for the newly created Chief Creative Officer role six months ago, with no explanation given. He also discloses that he has been experiencing symptoms of depression, has not sought help, and does not know how to raise it at work because “senior people aren't supposed to struggle.”",
    ],
    challenge: {
      kind: "list",
      items: [
        "Sasha must navigate three intersecting issues: a performance problem that is a symptom, not a cause; a potential disability under the Equality Act (clinical depression); and a talent retention crisis involving Vertex's most valuable creative asset.",
        "The PIP would be legally and ethically inappropriate in this context. But the performance issues are real and affecting client relationships.",
        "Marcus has a right to privacy. Sasha cannot share what she knows with the line manager without his consent.",
      ],
    },
    pauseQs: [
      "When declining performance appears linked to a mental health condition, what are HR's legal obligations under the Equality Act — and what changes to the management approach are required?",
      "How do you support an employee's wellbeing and maintain their confidentiality while also addressing real performance impacts?",
    ],
    outcomes: [
      "Marcus is referred to the company's EAP and given a four-week phased return to reduced responsibilities — with full confidentiality maintained",
      "With Marcus's consent, the line manager is briefed that there are health-related circumstances affecting performance — no clinical detail shared",
      "The CCO appointment process is reviewed — Marcus is given a structured development conversation about what the role required and what a pathway looks like",
      "Vertex introduces mandatory mental health first aid training for all managers and a senior leadership mental health awareness programme",
    ],
    lessons: [
      "Performance decline in a previously high-performing employee is almost always a symptom of something else — curiosity and a confidential conversation should precede any formal process",
      "Mental health conditions can constitute a disability under the Equality Act — employers have a duty to make reasonable adjustments, and a PIP without adjustment may be discriminatory",
      "HR's role in performance management includes protecting employees from processes that are wrong for their situation, even when those processes are technically available",
    ],
    appqs: [
      "What reasonable adjustments might be appropriate for Marcus — and how would you document and communicate them?",
      "How would you redesign Vertex's approach to internal promotions to prevent the transparency failure that contributed to Marcus's disengagement?",
      "What does a genuinely psychologically safe performance conversation look like — and how do you train managers to have it?",
    ],
  },

  // ── Retention & Engagement ───────────────────────────────────
  {
    id: "re1",
    topic: "retention",
    topicLabel: "Retention & Engagement",
    difficulty: "beginner",
    industry: "Retail",
    industryKey: "retail",
    title: "“The Great Exit”",
    org: "SunRise Retail",
    orgLine: "SunRise Retail · 2,000 employees",
    preview:
      "SunRise Retail's 35% annual turnover is costing £2.1m per year. The board blames pay. HR's data tells a completely different story.",
    searchTitle: "the great exit",
    searchOrg: "sunrise retail",
    searchPreview:
      "sunrise retail's 35% annual turnover is costing £2.1m per year. the board blames",
    featured: true,
    scenario: [
      "SunRise Retail operates 40 stores across the UK with approximately 2,000 employees, predominantly part-time store associates and supervisors. Annual turnover has reached 35%, with the highest concentration among employees in their first six months. The board has approved a 4% pay increase to address what it believes is a compensation problem. HR Director Blessing has been asked to communicate the pay rise and “solve the turnover problem.”",
      "Blessing runs a rapid analysis of the last 18 months of exit interview data before doing anything else. The findings are striking: only 14% of leavers cited pay as their primary reason for leaving. The top three reasons given were: poor relationship with immediate manager (42%), lack of schedule predictability (38%), and feeling invisible or unappreciated (31%).",
    ],
    challenge: {
      kind: "list",
      items: [
        "Blessing must present findings to a board that has already committed to a pay solution — and shift the conversation toward the actual drivers of attrition without undermining their decision.",
        "The three identified drivers require very different interventions: manager capability development, operational scheduling reform, and a recognition culture shift.",
        "At 2,000 employees across 40 stores, any solution must be scalable and consistent to work.",
      ],
    },
    pauseQs: [
      "How do you present data that contradicts a decision leadership has already made — and do so in a way that creates action rather than defensiveness?",
      "Which of the three drivers (manager quality, schedule unpredictability, recognition) would you address first, and why?",
    ],
    outcomes: [
      "Pay increase is retained — Blessing frames it as necessary but not sufficient, and secures budget for three additional interventions",
      "All store managers complete a 6-week practical people management programme; managers are now measured on team retention as part of their own performance review",
      "A rolling 4-week schedule system is introduced across all 40 stores — 78% of associates report improved satisfaction with schedule predictability within 3 months",
      "A peer recognition programme — “SunRise Spotlight” — is launched; turnover drops to 22% within 12 months, saving an estimated £800K annually",
    ],
    lessons: [
      "Pay is rarely the primary driver of turnover — HR must do the diagnostic work to identify real drivers before designing or endorsing interventions",
      "The quality of the immediate manager is consistently the most powerful predictor of whether an employee stays or leaves — manager development is a retention strategy, not just an L&D activity",
      "Making manager effectiveness a performance metric for managers themselves creates direct accountability for retention outcomes at the team level",
    ],
    appqs: [
      "How would you calculate the cost of 35% annual turnover to build the business case for investment in retention interventions?",
      "Design a 30-minute manager effectiveness survey that could be run quarterly across 40 retail stores.",
      "What would a scalable peer recognition programme look like for a dispersed retail workforce?",
    ],
  },
  {
    id: "re2",
    topic: "retention",
    topicLabel: "Retention & Engagement",
    difficulty: "intermediate",
    industry: "Financial Services",
    industryKey: "financial services",
    title: "“The Invisible Middle”",
    org: "PrimeBank",
    orgLine: "PrimeBank · 3,500 employees",
    preview:
      "PrimeBank's graduate programme and senior leadership pipeline both receive significant investment. The 800 mid-career employees between them have been almost entirely overlooked — and they're starting to notice.",
    searchTitle: "the invisible middle",
    searchOrg: "primebank",
    searchPreview:
      "primebank's graduate programme and senior leadership pipeline both receive signi",
    featured: false,
    scenario: [
      "PrimeBank invests heavily in its graduate programme (cohort of 60 per year, two-year structured development) and its senior leadership pipeline (top 5%, bespoke executive development). In between sits approximately 800 mid-career employees — Analysts, Senior Analysts, and Managers — who receive no structured development, minimal recognition, and unclear progression criteria. This group averages 4–7 years' tenure and represents PrimeBank's deepest reservoir of institutional knowledge and operational capability.",
      "When engagement survey results arrive, this cohort's scores are the lowest in the organization: engagement at 38%, intent to stay at 44%. HR Director Kwame is alarmed. The cost of losing this group is not just financial — it is organizational.",
    ],
    challenge: {
      kind: "list",
      items: [
        "PrimeBank has invested its development budget at the two ends of the career spectrum and neglected the middle. Fixing this requires both budget reallocation and a culture shift in how mid-career talent is valued.",
        "The mid-career group is heterogeneous: some want promotion, others want lateral growth, others want flexibility. A single programme will not work.",
        "Kwame must make the business case for mid-career investment to a leadership team that is instinctively drawn to the glamour of graduate development and executive leadership programmes.",
      ],
    },
    pauseQs: [
      "Why do organizations systematically underinvest in mid-career employees — and what does this cost them?",
      "How do you design development for a group with highly varied career aspirations and life circumstances?",
    ],
    outcomes: [
      "Kwame quantifies the replacement cost of the mid-career cohort: average £28K per exit × projected 180 exits = £5M annual cost — this number secures leadership attention",
      "A Mid-Career Growth Programme is launched: three pathways (Promotion Track, Deep Expertise Track, Portfolio/Flexible Track) — employees self-select based on their own aspirations",
      "Internal mobility is formalized: all mid-career roles must be advertised internally for 5 days before external posting",
      "Mid-career engagement rises to 58% within 18 months; projected exit rate falls from 23% to 14%",
    ],
    lessons: [
      "Mid-career employees are often the most organizationally costly to lose — they hold institutional knowledge, client relationships, and operational depth that cannot be quickly replaced",
      "One-size-fits-all development programmes fail mid-career cohorts because career aspirations in the middle of a working life are more varied than at entry or senior level — effective programmes offer pathways, not tracks",
      "Internal mobility is a retention tool as much as a talent development tool — giving mid-career employees access to new challenges within the organization reduces the incentive to seek them elsewhere",
    ],
    appqs: [
      "How would you calculate the full cost of mid-career attrition at PrimeBank — beyond recruitment costs?",
      "Design a conversation guide for managers to use in mid-career development conversations — what questions should they ask?",
      "How would you pitch the Mid-Career Growth Programme to a CFO who is already satisfied with the graduate and senior leadership investment?",
    ],
  },
  {
    id: "re3",
    topic: "retention",
    topicLabel: "Retention & Engagement",
    difficulty: "intermediate",
    industry: "Sustainability / Clean Tech",
    industryKey: "sustainability / clean tech",
    title: "“Stay Interview Surprise”",
    org: "EcoTech",
    orgLine: "EcoTech · 400 employees",
    preview:
      "EcoTech introduces stay interviews expecting to hear about pay and promotion. What employees actually reveal surprises the HR team — and reshapes the entire retention strategy.",
    searchTitle: "stay interview surprise",
    searchOrg: "ecotech",
    searchPreview:
      "ecotech introduces stay interviews expecting to hear about pay and promotion. wh",
    featured: false,
    scenario: [
      "EcoTech, a 400-person clean technology company, has enjoyed strong growth and a values-driven culture. But in the last 12 months, voluntary turnover has increased from 9% to 17% — concentrated among employees with 2–4 years' tenure and driven primarily by women and employees from underrepresented backgrounds. HR Manager Ifeoma decides to run structured stay interviews rather than wait for exit data that arrives too late.",
      "She interviews 60 employees across departments. The findings are not what leadership expected. Pay and promotion are mentioned — but the dominant themes are different: lack of autonomy in how and where work is done (56%), feeling that their ideas are heard but never acted upon (51%), and a sense that the organization's values are lived at the top but not in day-to-day management (48%).",
    ],
    challenge: {
      kind: "list",
      items: [
        "The issues identified are cultural and structural, not transactional. They require leadership behaviour change, not just policy updates.",
        "The concentration of disengagement among women and underrepresented groups suggests DEIB dimensions that need to be carefully explored and addressed.",
        "Ifeoma must communicate the findings honestly to a leadership team that is proud of EcoTech's culture and may be resistant to the idea that it has DEIB problems.",
      ],
    },
    pauseQs: [
      "Stay interview data is valuable only if it leads to visible action — what commitment should HR secure from leadership before running stay interviews?",
      "How do you present findings that challenge leadership's self-perception without triggering denial?",
    ],
    outcomes: [
      "Leadership acknowledges the findings and commits to a 90-day action plan with monthly progress updates shared to all staff",
      "A “You Said, We Did” communications framework is introduced — every stay interview theme is matched with a visible organizational response within 60 days",
      "Flexible working policy is substantially expanded; team-level autonomy over working patterns is formalized",
      "Three managers with consistently low team sentiment scores receive targeted coaching; one exits after coaching does not produce change",
      "Turnover returns to 11% within 12 months; representation of women in leadership increases from 28% to 37%",
    ],
    lessons: [
      "Stay interviews are significantly more valuable than exit interviews because they arrive in time to act — but they only work if leadership commits in advance to visible action on findings",
      "The gap between stated organizational values and lived management behaviour is one of the most powerful and underappreciated drivers of attrition — particularly among employees from underrepresented groups who feel the hypocrisy most acutely",
      "Communicating back to employees what you heard and what you did about it is not a nice-to-have — it is the mechanism that makes feedback systems credible and self-reinforcing",
    ],
    appqs: [
      "Design a 6-question stay interview guide. What would you ask — and why those questions specifically?",
      "How would you structure the 'You Said, We Did' communication to be credible and not feel like corporate spin?",
      "What would you do if stay interview findings pointed to a specific manager but that manager was high-performing commercially?",
    ],
  },
  {
    id: "re4",
    topic: "retention",
    topicLabel: "Retention & Engagement",
    difficulty: "expert",
    industry: "Business Process Outsourcing",
    industryKey: "business process outsourcing",
    title: "“The Returning Talent”",
    org: "GlobalServe",
    orgLine: "GlobalServe · 1,800 employees",
    preview:
      "GlobalServe loses 300 employees per year to competitors. A radical idea — building a formal alumni network and boomerang hiring strategy — transforms former leavers into a talent pipeline.",
    searchTitle: "the returning talent",
    searchOrg: "globalserve",
    searchPreview:
      "globalserve loses 300 employees per year to competitors. a radical idea — buildi",
    featured: false,
    scenario: [
      "GlobalServe, an 1,800-person BPO company, loses approximately 300 employees annually to competitors, clients, and career changes. The standard response has always been exit interviews, handshake goodbyes, and moving on. HR Director Adannaya challenges this orthodoxy when she notices that 14% of new hires in the last three years were former employees — and that these boomerang hires had significantly higher performance ratings and shorter time-to-productivity than external hires.",
      "Adannaya proposes building a formal alumni strategy: treat departing employees as future candidates, maintain relationships post-exit, and create a structured pathway for rehiring. The idea meets resistance from managers who feel that “if they chose to leave, we shouldn't reward it.”",
    ],
    challenge: {
      kind: "list",
      items: [
        "The cultural resistance to boomerang hiring is significant — it is perceived as rewarding disloyalty and undermining employees who stayed.",
        "Building an alumni network requires investment in technology, relationship management, and a cultural shift in how GlobalServe thinks about the employment lifecycle.",
        "Adannaya must also address the root causes of departure — otherwise a boomerang strategy just creates an expensive revolving door.",
      ],
    },
    pauseQs: [
      "What are the arguments for and against boomerang hiring — and how would you address the 'rewarding disloyalty' objection?",
      "How do you build an alumni network on a BPO budget without dedicated alumni relations staff?",
    ],
    outcomes: [
      "GlobalServe Alumni Network launches — LinkedIn group, quarterly newsletter, exclusive early access to internal vacancies",
      "Exit process redesigned: every leaver receives a “future colleague” conversation rather than a standard exit interview",
      "Boomerang hire rate increases from 14% to 23% within 18 months; boomerang hires show 31% faster performance ramp-up than external hires",
      "Root cause analysis identifies three structural issues driving exits — flexible scheduling, internal promotion transparency, and manager quality — all addressed within 12 months",
    ],
    lessons: [
      "The employment relationship does not have to end at the exit interview — organizations that treat departing employees with respect and maintain genuine relationships create a talent pipeline that competitors cannot access",
      "Boomerang hires consistently outperform equivalent external hires because they arrive with organizational knowledge, cultural fluency, and a clear-eyed view of what the organization offers",
      "A boomerang strategy is only sustainable when paired with genuine improvements to the underlying reasons employees left — otherwise it simply recycles dissatisfaction",
    ],
    appqs: [
      "Design a 'future colleague' exit conversation — what would you say and what would you ask?",
      "What would a GlobalServe alumni network look like at 12 months — what content, events, and touchpoints would it include?",
      "How would you measure the ROI of a boomerang hiring strategy to justify continued investment?",
    ],
  },

  // ── DEIB ─────────────────────────────────────────────────────
  {
    id: "d1",
    topic: "deib",
    topicLabel: "DEIB",
    difficulty: "beginner",
    industry: "Legal Services",
    industryKey: "legal services",
    title: "“Numbers Without Belonging”",
    org: "Pinnacle Law",
    orgLine: "Pinnacle Law · 250 employees",
    preview:
      "Pinnacle Law hits its diversity targets for three consecutive years. Then an anonymous survey reveals that employees from underrepresented groups feel more excluded than ever.",
    searchTitle: "numbers without belonging",
    searchOrg: "pinnacle law",
    searchPreview:
      "pinnacle law hits its diversity targets for three consecutive years. then an ano",
    featured: true,
    scenario: [
      "Pinnacle Law, a 250-person law firm, has invested significantly in diversity recruitment. Over three years, the proportion of employees from ethnic minority backgrounds has increased from 12% to 28%. The HR Director presents these numbers proudly at the AGM. Two weeks later, anonymous culture survey results arrive. Among employees from ethnic minority backgrounds: 61% report feeling excluded from informal networks, 57% say their ideas are less likely to be credited in meetings, and 49% say they have experienced microaggressions in the last 12 months. The overall satisfaction score for this group is 31% — compared to 74% for white employees.",
      "The diversity numbers went up. The inclusion experience got worse.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Pinnacle Law has confused diversity (representation) with inclusion (belonging and equity of experience). The two are not the same, and one does not automatically produce the other.",
        "The survey data reveals a deeply uncomfortable truth: increasing diverse representation without changing the culture and power dynamics of the organization may have made the inclusion experience worse, not better.",
        "HR must present these findings honestly to a leadership team that is proud of its diversity achievements and may be defensive about the inclusion data.",
      ],
    },
    pauseQs: [
      "What is the difference between diversity and inclusion — and why does increasing representation sometimes make the inclusion experience worse?",
      "How do you present uncomfortable DEIB data to a leadership team without triggering a defensive response that shuts down action?",
    ],
    outcomes: [
      "Leadership acknowledges the gap between representation and inclusion; the firm's DEIB strategy is reframed around belonging, equity of experience, and systemic culture change",
      "Microaggression training is made mandatory for all staff; a clear reporting and resolution framework is introduced",
      "A Sponsorship Programme is launched: every employee from an underrepresented group is paired with a senior sponsor who actively advocates for their visibility and progression",
      "Meeting facilitation protocols are introduced to ensure equitable contribution — ideas are attributed, interruptions are named, and participation is actively managed",
      "Inclusion survey scores for underrepresented groups improve from 31% to 54% within 18 months",
    ],
    lessons: [
      "Diversity without inclusion is not progress — it is a numbers exercise that may actually harm the people it claims to help by placing them in environments that are not designed for their success",
      "Inclusion requires active, intentional design at every level of organizational life: how meetings are run, how ideas are credited, how informal networks operate, how microaggressions are named and addressed",
      "Representation metrics are a starting point, not an endpoint — organizations that stop at the numbers and do not measure the inclusion experience have fundamentally misunderstood what DEIB requires",
    ],
    appqs: [
      "Design an inclusion measurement framework that goes beyond representation numbers. What would you measure and how?",
      "What practical interventions would you prioritize to improve the meeting experience for underrepresented employees?",
      "How would you design the Sponsorship Programme at Pinnacle Law — what would sponsors be expected to do?",
    ],
  },
  {
    id: "d2",
    topic: "deib",
    topicLabel: "DEIB",
    difficulty: "intermediate",
    industry: "Healthcare",
    industryKey: "healthcare",
    title: "“The Promotion Gap”",
    org: "CityMed",
    orgLine: "CityMed · 5,000 employees",
    preview:
      "CityMed's workforce is 62% women. Its senior leadership team is 78% men. A systematic analysis of five years of promotion data reveals exactly how the gap was built.",
    searchTitle: "the promotion gap",
    searchOrg: "citymed",
    searchPreview:
      "citymed's workforce is 62% women. its senior leadership team is 78% men. a syste",
    featured: false,
    scenario: [
      "CityMed, a 5,000-person healthcare organization, employs 3,100 women — 62% of its total workforce. Yet its Senior Leadership Team is 78% male, and the gap widens at every level above Band 7. HR Director Philippa commissions a five-year promotion analysis. The findings are stark: women are promoted at the same rate as men up to Band 6. Above Band 6, the promotion rate for women drops to 34% of the male rate. The most commonly cited reason in promotion panel notes: “not yet ready for senior leadership.”",
      "Further analysis reveals that “not yet ready” is applied more than twice as often to female candidates as to male candidates with equivalent tenure, performance ratings, and development feedback.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The data shows a systemic pattern, not isolated incidents. Addressing it requires changing the promotion process, the criteria used, and the composition and training of promotion panels.",
        "The organization has a legal obligation under the Equality Act and a growing reputational risk as gender pay gap reporting becomes more scrutinized.",
        "Philippa must design a credible, sustained response — not a one-off initiative — that actually changes outcomes, not just intentions.",
      ],
    },
    pauseQs: [
      "'Not yet ready' — what makes a promotion criterion legitimate, and what makes it a vehicle for bias?",
      "How do you redesign a promotion process so that it evaluates potential fairly across gender, without introducing reverse discrimination?",
    ],
    outcomes: [
      "Promotion criteria above Band 6 are redefined to be specific, observable, and evidence-based — removing vague language like “executive presence” and “leadership gravitas”",
      "All promotion panels are required to include at least two women and complete structured bias training before each cycle",
      "A Women in Leadership Programme is launched: 18-month cohort, sponsorship, executive coaching, stretch assignments",
      "Women's promotion rate above Band 6 improves from 34% to 67% of the male rate within two years; SLT representation improves from 22% to 34% women",
    ],
    lessons: [
      "Promotion gaps are almost never caused by capability differences — they are caused by biased criteria, biased panel composition, and biased assessment language that systematically disadvantages women",
      "Vague promotion criteria ('executive presence,' 'gravitas,' 'not yet ready') are a primary vehicle for gender bias in senior promotions — replacing them with specific, evidence-based criteria is one of the most impactful interventions available",
      "Promotion data disaggregated by gender and level is essential for identifying where the pipeline breaks — organizations that do not track this cannot claim to be addressing gender equity seriously",
    ],
    appqs: [
      "Rewrite the promotion criteria for a Band 7 to Band 8 transition at CityMed — removing all language that could be applied subjectively or differentially by gender.",
      "Design the promotion panel training programme. What would participants learn and practice?",
      "How would you communicate the Women in Leadership Programme to avoid it being perceived as positive discrimination?",
    ],
  },
  {
    id: "d3",
    topic: "deib",
    topicLabel: "DEIB",
    difficulty: "intermediate",
    industry: "Technology",
    industryKey: "technology",
    title: "“Whose Culture Is It?”",
    org: "FusionTech",
    orgLine: "FusionTech · 900 employees",
    preview:
      "FusionTech expands into Southeast Asia and East Africa. The UK headquarters assumes everyone will adapt. The result is a silent exodus of local talent who feel their cultures are being erased.",
    searchTitle: "whose culture is it?",
    searchOrg: "fusiontech",
    searchPreview:
      "fusiontech expands into southeast asia and east africa. the uk headquarters assu",
    featured: false,
    scenario: [
      "FusionTech, a UK-headquartered technology company with 900 employees, opens regional offices in Singapore and Nairobi. The expansion is operationally successful — the new offices hit their targets. But 14 months in, HR notices a pattern: voluntary turnover in both regional offices is running at 34%, driven almost entirely by local hires. Exit interviews from departing Singapore and Nairobi employees share consistent themes: “UK culture is imposed, not shared”; “recognition only happens in UK formats”; “career conversations happen in UK time zones at UK times”; “my management style is described as 'indirect' — it's actually called 'respectful' where I come from.”",
      "HRBP Chisom is asked to investigate and recommend a path forward before the expansion is abandoned.",
    ],
    challenge: {
      kind: "list",
      items: [
        "FusionTech has exported its organizational culture as if it were universal — it is not. The company must decide whether it wants a monoculture or a genuinely multicultural global organization.",
        "Changing this requires changes to processes (performance management, recognition, career conversations), leadership behaviours, and organizational mindset — not just a cultural awareness e-learning module.",
        "The UK headquarters may resist changes that challenge what it has always seen as its cultural identity and competitive advantage.",
      ],
    },
    pauseQs: [
      "What is the difference between organizational culture consistency and cultural imperialism — and where is the line?",
      "How do you build an inclusive global culture that has shared values but diverse cultural expressions?",
    ],
    outcomes: [
      "FusionTech conducts a global culture audit — discovering that 11 of 14 core processes were designed exclusively for the UK context",
      "Performance management, career conversations, and recognition frameworks are redesigned with regional input from Singapore and Nairobi teams",
      "A Global Culture Council is established — equal representation from all three regions, with authority to shape people practices globally",
      "Turnover in regional offices drops from 34% to 16% within 12 months; both regional offices exceed targets for the second consecutive year",
    ],
    lessons: [
      "Organizational culture exported without adaptation is not inclusion — it is cultural imposition that signals to local employees that their backgrounds, communication styles, and ways of working are deficits rather than assets",
      "Global HR processes must be designed with, not for, the people they serve — regional input at the design stage is not a luxury, it is a quality requirement",
      "Cultural humility — the recognition that there are multiple valid ways of leading, communicating, and building relationships — is a leadership competency that must be actively developed, not assumed",
    ],
    appqs: [
      "Redesign FusionTech's recognition programme to work across three cultural contexts without losing coherence.",
      "What would the Global Culture Council's terms of reference look like — what decisions would it have authority over?",
      "How would you train UK-based managers to lead effectively across cultural contexts — what would the programme include?",
    ],
  },
  {
    id: "d4",
    topic: "deib",
    topicLabel: "DEIB",
    difficulty: "expert",
    industry: "SaaS",
    industryKey: "saas",
    title: "“Disability and the Digital Workplace”",
    org: "StreamLine",
    orgLine: "StreamLine · 600 employees",
    preview:
      "StreamLine's shift to a remote-first model is celebrated as a flexibility win. For three employees with disabilities, it has created new barriers that nobody anticipated — and nobody is taking responsibility for.",
    searchTitle: "disability and the digital workplace",
    searchOrg: "streamline",
    searchPreview:
      "streamline's shift to a remote-first model is celebrated as a flexibility win. f",
    featured: false,
    scenario: [
      "StreamLine, a 600-person SaaS company, transitions to a remote-first model in 2023. Leadership celebrates the move as a win for flexibility, environmental impact, and talent access. Twelve months later, HR Business Partner Nadia receives three separate, unconnected complaints from employees with disabilities. Each describes a different problem: a screen reader user whose accessibility adaptations were not transferred to the new collaboration platform; a deaf employee whose captions in video calls are consistently inadequate; and an employee with severe anxiety whose reasonable adjustment (no mandatory camera-on) is being quietly overridden by their manager, who has told the team that cameras must be on for all calls.",
      "Three different employees, three different disabilities, three different failures — all in a model that was supposed to make work more accessible.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Each case is legally serious — potential Equality Act breaches, potential constructive dismissal risk, and real harm to real people happening in plain sight.",
        "The failures are systemic: no accessibility audit was conducted before the remote-first transition, no reasonable adjustments review was carried out, and managers have not been trained on their obligations.",
        "Nadia must respond to three live cases urgently while simultaneously building the systemic response that prevents future occurrences.",
      ],
    },
    pauseQs: [
      "What are StreamLine's legal obligations when transitioning to a new work model — and what should have happened before go-live?",
      "How do you address the manager who overrode a reasonable adjustment — is this a conduct issue, a training issue, or both?",
    ],
    outcomes: [
      "All three employees receive immediate corrective action on their specific adjustments; all three receive a formal apology and a review of whether any other adjustments have been affected",
      "A retrospective accessibility audit of the remote-first model is conducted; 14 additional issues are identified and addressed",
      "The manager who overrode the reasonable adjustment receives a formal warning and mandatory Equality Act training",
      "An Accessibility-by-Design checklist is introduced as a mandatory step in all future technology and process changes",
      "StreamLine appoints a part-time Workplace Accessibility Coordinator — the first dedicated accessibility role in the company's history",
    ],
    lessons: [
      "Accessibility must be designed in from the start of any workplace model change — retrofitting accessibility after go-live creates harm, legal risk, and significantly higher costs than getting it right first time",
      "Reasonable adjustments are a legal requirement, not a manager's discretionary choice — overriding a documented adjustment is a potential Equality Act breach and must be treated as a conduct matter",
      "Digital transformation creates new accessibility barriers if technology is selected and deployed without systematic accessibility evaluation — HR must be at the table in technology decisions, not just informed after the fact",
    ],
    appqs: [
      "Design an Accessibility-by-Design checklist for StreamLine to use before any future technology or workplace model change.",
      "How would you approach the conversation with the manager who overrode the reasonable adjustment — what framework would you use?",
      "What would the Workplace Accessibility Coordinator role look like — what would their responsibilities and authority be?",
    ],
  },

  // ── HR Strategy & Analytics ──────────────────────────────────
  {
    id: "s1",
    topic: "strategy",
    topicLabel: "HR Strategy & Analytics",
    difficulty: "beginner",
    industry: "Manufacturing",
    industryKey: "manufacturing",
    title: "“HR at the Table”",
    org: "OmniGroup",
    orgLine: "OmniGroup · 4,000 employees",
    preview:
      "OmniGroup's HR Director discovers her function has been excluded from a major restructure that affects 800 people. She finds out the same week the announcement is made.",
    searchTitle: "hr at the table",
    searchOrg: "omnigroup",
    searchPreview:
      "omnigroup's hr director discovers her function has been excluded from a major re",
    featured: true,
    scenario: [
      "OmniGroup is a 4,000-person manufacturing company preparing to restructure three of its five UK divisions. The plan — involving 800 role changes, 120 redundancies, and a significant shift to shift-working patterns — is designed by the Operations Director and CFO over six months. The HR Director, Lorraine, discovers the plan when the announcement slide deck is shared with her for “communication review” five days before the all-staff email goes out.",
      "Lorraine's function has not been involved in the design of the restructure at all. There has been no assessment of employment law obligations, no collective consultation planning, no analysis of the human impact, and no consideration of how to retain key talent through the transition. Lorraine has five days and a crisis to manage.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The immediate crisis: OmniGroup is potentially walking into significant legal liability (failure to consult, unfair redundancy process) and a serious employee relations risk if the announcement goes ahead as planned.",
        "The structural problem: HR has been positioned as a communication function, not a strategic partner. This restructure is a symptom of a much deeper problem.",
        "Lorraine must address both — the immediate legal and employee risk, and the longer-term repositioning of HR's role in organizational decision-making.",
      ],
    },
    pauseQs: [
      "What are the immediate legal and employee relations risks Lorraine must address before any announcement can go out?",
      "How does HR make the case for a seat at the strategic table after an incident like this — without it sounding self-serving?",
    ],
    outcomes: [
      "Lorraine secures a two-week delay to the announcement — collective consultation requirements are identified and a legally compliant process is designed",
      "A talent risk assessment identifies 34 key individuals at high flight risk during the transition; specific retention interventions are put in place",
      "The restructure is successfully delivered with 94% of key talent retained and no employment tribunal claims",
      "Lorraine presents a post-mortem to the board — quantifying the cost that was avoided and the risk that was created by HR's exclusion; HR is formally added to the executive planning process going forward",
    ],
    lessons: [
      "HR's exclusion from strategic decision-making is not just an HR problem — it is an organizational risk management failure with legal, financial, and human consequences",
      "The most compelling argument for HR's seat at the strategic table is a rigorous post-mortem that quantifies what the exclusion cost — and what it would have cost if HR had not intervened",
      "Collective consultation is a legal requirement, not a courtesy — any restructure affecting 20 or more employees within 90 days requires a minimum 30-day consultation period in the UK; failure to comply creates significant Employment Tribunal exposure",
    ],
    appqs: [
      "Design a 'People Impact Assessment' framework that HR could use to evaluate any major organizational change before it is announced.",
      "How would you present the business case for HR's involvement in strategic planning to a CFO who sees HR as a cost centre?",
      "What are the UK legal requirements for collective consultation in a redundancy situation — and what does a compliant process look like?",
    ],
  },
  {
    id: "s2",
    topic: "strategy",
    topicLabel: "HR Strategy & Analytics",
    difficulty: "intermediate",
    industry: "Data Services",
    industryKey: "data services",
    title: "“The Turnover Myth”",
    org: "DataFirst",
    orgLine: "DataFirst · 700 employees",
    preview:
      "DataFirst has spent £400K on retention bonuses in 18 months. Turnover has not changed. HR's data investigation reveals the retention bonuses were solving the wrong problem.",
    searchTitle: "the turnover myth",
    searchOrg: "datafirst",
    searchPreview:
      "datafirst has spent £400k on retention bonuses in 18 months. turnover has not ch",
    featured: false,
    scenario: [
      "DataFirst, a 700-person data services company, has been struggling with 28% voluntary turnover among its data engineers for 18 months. The leadership response: retention bonuses paid at 12 months and 24 months of service. The cost: £400K in the last 18 months. The impact: turnover is unchanged at 27%. HR Analyst Tamsin is asked to find out why the bonuses are not working.",
      "Tamsin pulls 24 months of exit interview data, anonymized performance records, engagement survey results, and manager feedback. Her analysis reveals something counterintuitive: the data engineers who are leaving are not primarily motivated by money. They are leaving because of project monotony (61%), limited technical challenge (54%), and — critically — 43% are leaving within the first 8 months, before any retention bonus kicks in.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The retention bonuses are structurally misaligned: they target long-tenured employees who were already going to stay, while the highest-risk period (0–8 months) receives no intervention.",
        "The real drivers of attrition require different solutions: project rotation, technical challenge, and a better early-career experience — none of which are addressed by financial incentives.",
        "Tamsin must present an analysis that tells leadership their £400K investment has been misdirected — without making them feel foolish for having made it.",
      ],
    },
    pauseQs: [
      "What are the risks of acting on a perceived solution (retention bonuses) before diagnosing the actual problem?",
      "How do you present data that shows a significant investment has not worked — in a way that creates action rather than defensiveness?",
    ],
    outcomes: [
      "Retention bonuses are restructured: 6-month milestone bonus (addressing early attrition), 18-month technical achievement bonus (addressing development), no 24-month golden handcuff",
      "A Technical Rotation Programme is introduced: engineers rotate between project types on 6-month cycles",
      "An Engineering Career Framework is published — five defined technical pathways with clear criteria for progression",
      "Turnover among data engineers drops from 28% to 14% within 12 months; the rotation programme is rated as the most valued development initiative in the next engagement survey",
    ],
    lessons: [
      "Data analysis is only as useful as the questions it asks — turnover data without diagnostic depth (when are people leaving, what are their real reasons, what do the patterns show?) leads to expensive, ineffective interventions",
      "Retention bonuses are a blunt tool that delay attrition for financially motivated leavers while doing nothing for the majority of leavers who are driven by development, challenge, and meaning",
      "Presenting data that challenges existing decisions requires framing — acknowledge the intention behind the original decision, show the data clearly, and pivot immediately to what the evidence suggests doing instead",
    ],
    appqs: [
      "Design a 90-day data diagnostic for a company experiencing unexplained high turnover. What data would you pull, what would you look for, and what questions would you ask?",
      "How would you redesign DataFirst's total reward package for data engineers if the goal was development and challenge rather than tenure?",
      "What is the difference between a correlation and a cause in HR data analysis — and why does this matter for intervention design?",
    ],
  },
  {
    id: "s3",
    topic: "strategy",
    topicLabel: "HR Strategy & Analytics",
    difficulty: "intermediate",
    industry: "Pharmaceuticals",
    industryKey: "pharmaceuticals",
    title: "“People Vision 2026”",
    org: "Horizon Pharma",
    orgLine: "Horizon Pharma · 2,500 employees",
    preview:
      "Horizon Pharma has never had a formal HR strategy. A new CHRO has six months to build one from scratch — with a workforce spanning five countries, three generations, and two major pending acquisitions.",
    searchTitle: "people vision 2026",
    searchOrg: "horizon pharma",
    searchPreview:
      "horizon pharma has never had a formal hr strategy. a new chro has six months to ",
    featured: false,
    scenario: [
      "Horizon Pharma appoints its first CHRO, Daniela, as part of a broader professionalization of the business ahead of a planned IPO. Daniela joins to find: no documented HR strategy, no people data infrastructure, no succession plan for any of the top 40 roles, and a collection of HR policies varying significantly across five country offices. The CEO expects a “People Vision 2026” to be presented to the board in six months.",
      "The business context is complex: two acquisitions are pending that will add approximately 600 employees from very different organizational cultures. The workforce spans Baby Boomers (28%), Gen X (34%), and Millennials/Gen Z (38%). The IPO is expected within 18 months, at which point investor scrutiny of people risk and ESG obligations will intensify significantly.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Daniela must build a coherent HR strategy for a complex, multi-country business in six months without the data infrastructure, team, or organizational history that would normally inform such work.",
        "The pending acquisitions must be integrated into the strategy — people risk in M&A is one of the most commonly underestimated factors in deal success or failure.",
        "The IPO timeline means the strategy must be investor-credible as well as operationally sound — it will face scrutiny from audiences who know what good people risk management looks like.",
      ],
    },
    pauseQs: [
      "What are the most important things Daniela must understand about an organization before she can design an HR strategy for it?",
      "How does M&A activity change the priorities of an HR strategy — what people risks does it create that must be addressed explicitly?",
    ],
    outcomes: [
      "Daniela conducts a rapid 60-day diagnostic: 40 stakeholder interviews, people data audit, culture assessment across all five offices, and benchmarking against four comparable pharma companies",
      "People Vision 2026 is built on four pillars: Build (talent development and succession), Attract (employer brand and pipeline), Retain (culture, engagement, and total reward), Protect (compliance, governance, and ESG)",
      "A people integration playbook for both pending acquisitions is completed before deal close",
      "Board presentation is rated as “best people strategy presentation we have seen from any comparable company” by lead IPO advisor",
    ],
    lessons: [
      "A strong HR strategy begins with deep organizational diagnosis — strategy built without understanding the specific context, history, culture, and commercial realities of the business will be generic, not actionable",
      "M&A people risk is consistently one of the most significant factors in deal success or failure — cultural integration, retention of key talent, and harmonization of policies and reward must be planned before deal close, not after",
      "An HR strategy presented to a board or investor audience must demonstrate commercial credibility — connecting people decisions to risk mitigation, financial outcomes, and organizational resilience in language that financial decision-makers understand",
    ],
    appqs: [
      "Design Daniela's 60-day diagnostic plan — what would she do in each of the three 20-day phases?",
      "What does a people integration playbook for an M&A deal include — walk through the key sections.",
      "How would you present people risk to an IPO investor audience — what metrics and frameworks would you use?",
    ],
  },
  {
    id: "s4",
    topic: "strategy",
    topicLabel: "HR Strategy & Analytics",
    difficulty: "expert",
    industry: "Energy",
    industryKey: "energy",
    title: "“The Dashboard That Changed Everything”",
    org: "VoltEnergy",
    orgLine: "VoltEnergy · 8,000 employees",
    preview:
      "VoltEnergy's HR function produces 140-page quarterly reports that nobody reads. A data transformation project compresses this to one dashboard — and suddenly HR becomes the most-referenced function in the C-suite.",
    searchTitle: "the dashboard that changed everything",
    searchOrg: "voltenergy",
    searchPreview:
      "voltenergy's hr function produces 140-page quarterly reports that nobody reads. ",
    featured: false,
    scenario: [
      "VoltEnergy, an 8,000-person energy company, has an HR reporting function that produces quarterly people reports averaging 140 pages. The reports are technically thorough but strategically useless: by the time they are compiled, reviewed, and distributed, the data is 6–8 weeks old. C-suite members confirm in interviews that they rarely read beyond page three, and that they cannot identify the top three workforce risks from the report in under two minutes.",
      "CHRO Kofi is given a mandate to transform HR's data function. The goal: one real-time dashboard that gives C-suite leaders instant clarity on workforce health, updated weekly, accessible on any device, and requiring no interpretation to understand.",
    ],
    challenge: {
      kind: "list",
      items: [
        "VoltEnergy's people data sits in seven different systems — payroll, HRIS, LMS, engagement platform, recruitment ATS, absence management, and a legacy succession planning tool. None of them talk to each other.",
        "The transformation requires both technical investment (data integration) and a cultural shift in how HR thinks about its role — from reporter to strategic sensor.",
        "Kofi must secure significant technology investment at a time when the business is under cost pressure — the business case must be compelling and conservative.",
      ],
    },
    pauseQs: [
      "What are the five most important metrics that should be on the VoltEnergy people dashboard — and how would you choose them?",
      "How do you make the business case for data infrastructure investment to a CFO who sees the current reporting as 'good enough'?",
    ],
    outcomes: [
      "A people data integration project is completed in four months — all seven systems feeding into a single analytics platform",
      "The VoltEnergy People Dashboard goes live: seven headline metrics, RAG status, trend arrows, and drill-down by division — updating every Friday",
      "Within six months, the dashboard is referenced in every ExCo meeting; Kofi is invited to present at two board meetings that had never previously included an HR agenda item",
      "Three workforce risks identified by the dashboard (talent concentration risk in engineering, rising absence in operations, leadership succession gap in Asia) are addressed proactively before becoming crises",
    ],
    lessons: [
      "HR data that is not used is not an asset — it is a cost; the measure of a people analytics function is not the volume of data it produces but the quality of decisions it enables",
      "A single, well-designed, real-time dashboard communicates more strategic value than 140 pages of quarterly reporting — because it makes the right information findable in 30 seconds",
      "Data integration across disparate HR systems is a strategic investment, not an IT project — without it, HR cannot claim to be a data-driven function regardless of how many data points it collects",
    ],
    appqs: [
      "Design the VoltEnergy People Dashboard — what seven metrics would you include, how would you display each, and what drill-down would each allow?",
      "Build the business case for the data integration investment. What would the financial model look like — costs, savings, and value created?",
      "What governance framework should sit behind a real-time people dashboard — who can access what, how is data quality maintained, and who is accountable for acting on red indicators?",
    ],
  },

  // ── Employee Relations & Conflict ────────────────────────────
  {
    id: "e1",
    topic: "er",
    topicLabel: "Employee Relations & Conflict",
    difficulty: "beginner",
    industry: "Media / Creative",
    industryKey: "media / creative",
    title: "“The Team That Fell Apart”",
    org: "CreativeHub",
    orgLine: "CreativeHub · 180 employees",
    preview:
      "CreativeHub's best-performing design team loses five of eight members in four months. What started as a personality clash becomes a case study in conflict left unmanaged.",
    searchTitle: "the team that fell apart",
    searchOrg: "creativehub",
    searchPreview:
      "creativehub's best-performing design team loses five of eight members in four mo",
    featured: true,
    scenario: [
      "CreativeHub's eight-person design team has won three industry awards in two years. Six months ago, a new team lead, Jordan, was appointed internally. Within two months, two team members submit informal complaints about Jordan's management style — described as dismissive, credit-taking, and inconsistent. HR is informed but decides to “monitor the situation.” Over the next four months, five of the eight team members resign, citing Jordan. By the time HR intervenes formally, the team has lost 62% of its members, two major client projects are at risk, and the remaining three employees are actively looking.",
    ],
    challenge: {
      kind: "list",
      items: [
        "HR's decision to “monitor” rather than intervene when the first complaints arrived has accelerated the damage. The case study is also a study in what happens when HR mistakes monitoring for management.",
        "Jordan is still in post. Whether Jordan stays, is moved, or exits requires a fair process and clear evidence — neither of which were gathered during the monitoring period.",
        "The three remaining team members are at high flight risk. CreativeHub needs an urgent containment strategy alongside the formal process.",
      ],
    },
    pauseQs: [
      "At what point should 'monitoring' a conflict situation cross the threshold to formal intervention — and who decides?",
      "When HR's earlier inaction has contributed to the damage, how do you acknowledge this without undermining HR's current authority to resolve the situation?",
    ],
    outcomes: [
      "A formal investigation is conducted: all remaining team members and three of the five leavers are interviewed; a pattern of management conduct is documented",
      "Jordan receives a formal written warning and is moved to a non-people-management role; a structured performance improvement plan is agreed",
      "An interim team lead is appointed; all three remaining members are offered retention conversations and one-to-one HR support",
      "Two of the five leavers agree to return after the management change; the team is rebuilt over six months",
      "HR introduces an early escalation protocol: any two or more informal complaints about the same individual within 90 days triggers a mandatory informal mediation",
    ],
    lessons: [
      "Unmanaged workplace conflict does not resolve itself — it escalates, and each week of delay increases the damage exponentially; 'monitoring' without intervention is not a strategy, it is avoidance",
      "HR's obligation when informal complaints are received is not surveillance — it is early, proportionate, and skilled intervention that prevents escalation",
      "The cost of replacing experienced creative talent is significantly higher than the cost of early conflict resolution — the business case for intervention is always strongest before the exits begin",
    ],
    appqs: [
      "Design an early escalation protocol for CreativeHub. What triggers mandatory intervention and what does that intervention look like?",
      "How would you approach the retention conversation with each of the three remaining team members — what would you say, what would you offer, and what would you ask?",
      "What training would you recommend for Jordan — and how would you structure the performance improvement plan?",
    ],
  },
  {
    id: "e2",
    topic: "er",
    topicLabel: "Employee Relations & Conflict",
    difficulty: "intermediate",
    industry: "Insurance",
    industryKey: "insurance",
    title: "“The Whistleblower”",
    org: "SafeGuard Insurance",
    orgLine: "SafeGuard Insurance · 1,100 employees",
    preview:
      "An employee raises a protected disclosure about data handling irregularities. The investigation is handled clumsily, the whistleblower is informally ostracized, and SafeGuard suddenly faces both a regulatory and an employment law crisis.",
    searchTitle: "the whistleblower",
    searchOrg: "safeguard insurance",
    searchPreview:
      "an employee raises a protected disclosure about data handling irregularities. th",
    featured: false,
    scenario: [
      "Martina, a compliance analyst at SafeGuard Insurance, raises a formal concern about data handling practices she believes breach GDPR regulations. She uses the company's whistleblowing hotline, which guarantees anonymity. Within three weeks, despite the anonymity guarantee, Martina believes her identity has been disclosed — she is excluded from meetings she previously attended, her manager has become distant, and a promotion she was shortlisted for is quietly withdrawn. Martina contacts an employment solicitor.",
      "SafeGuard's HR Director, Raymond, receives a letter before action citing detriment following a protected disclosure under the Public Interest Disclosure Act 1998 (PIDA). The potential liability: uncapped compensation at Employment Tribunal. The investigation into the original data handling concern has meanwhile stalled.",
    ],
    challenge: {
      kind: "list",
      items: [
        "SafeGuard faces simultaneous crises: a live employment tribunal risk (PIDA detriment), a potential regulatory breach (the original GDPR concern), and a broken whistleblowing culture that will discourage future disclosures.",
        "The anonymity breach — whether intentional or inadvertent — must be investigated, and the individuals responsible identified and held accountable.",
        "Raymond must also respond to Martina's legal letter in a way that does not prejudice the position further while genuinely addressing the harm done.",
      ],
    },
    pauseQs: [
      "What obligations does an employer have when a protected disclosure is made — and what constitutes 'detriment' under PIDA?",
      "How do you investigate an anonymity breach within a whistleblowing process without causing further harm to the whistleblower?",
    ],
    outcomes: [
      "Raymond appoints an external investigator to review both the anonymity breach and the original GDPR concern — internal investigation is avoided given the conflict of interest",
      "The anonymity breach is traced to an administrative process failure, not malicious disclosure; two managers involved in the ostracization receive formal warnings",
      "Martina's employment solicitor receives a without-prejudice offer that includes the withdrawn promotion, a written apology, and agreed management changes",
      "The original GDPR concern is confirmed as substantive — remediation is undertaken and the ICO is notified proactively, resulting in a formal guidance notice rather than a fine",
      "SafeGuard overhauls its whistleblowing policy, introduces a dedicated external hotline, and conducts mandatory PIDA training for all managers",
    ],
    lessons: [
      "Protected disclosures under PIDA carry significant legal protection — any detriment suffered by a whistleblower, whether intentional or inadvertent, creates uncapped employment tribunal liability",
      "Anonymity in whistleblowing processes must be technically enforced, not just promised — process design must make accidental disclosure impossible, not merely unlikely",
      "Whistleblowing is a governance asset, not a threat — organizations that treat disclosures as opportunities for improvement rather than problems to manage build stronger cultures and face significantly lower regulatory and legal risk",
    ],
    appqs: [
      "Design a whistleblowing process for SafeGuard that genuinely protects anonymity at every stage. What are the design requirements?",
      "How would you train managers on their obligations under PIDA — what must they understand about what constitutes detriment?",
      "Write a without-prejudice settlement letter outline to Martina's solicitor. What would the key terms be?",
    ],
  },
  {
    id: "e3",
    topic: "er",
    topicLabel: "Employee Relations & Conflict",
    difficulty: "intermediate",
    industry: "Logistics",
    industryKey: "logistics",
    title: "“Manager vs Manager”",
    org: "ProLogis",
    orgLine: "ProLogis · 2,200 employees",
    preview:
      "Two senior operations managers have been in open conflict for eight months. Both are high performers. Both have supporters. The conflict is now affecting their combined teams of 140 people.",
    searchTitle: "manager vs manager",
    searchOrg: "prologis",
    searchPreview:
      "two senior operations managers have been in open conflict for eight months. both",
    featured: false,
    scenario: [
      "ProLogis, a 2,200-person logistics company, has two senior operations managers — Dion and Carla — who have been in escalating conflict since a restructure eight months ago merged their previously separate departments. The conflict began as a disagreement about decision-making authority and has escalated to a point where: they communicate only through their PAs, their team meetings are held separately despite shared objectives, their combined team of 140 people is split into two informal factions, and absenteeism in both teams is 40% above the company average. Both managers have made formal complaints about each other.",
      "HR Director Selina has received complaints from both sides, three informal complaints from team members, and a request from the Operations Director to “sort it out before Q4 peak season.”",
    ],
    challenge: {
      kind: "list",
      items: [
        "Both Dion and Carla are high performers with strong track records. Neither is clearly 'in the wrong' — the conflict has legitimate organizational origins (structural ambiguity following the merger) as well as personality and style dimensions.",
        "A formal investigation into both sets of complaints will take weeks and may make the conflict worse. Mediation requires both parties to agree voluntarily — and neither has shown willingness to engage.",
        "The Operations Director wants resolution before Q4. Selina must manage the urgency without cutting corners on fairness or due process.",
      ],
    },
    pauseQs: [
      "When two equally senior employees are in formal conflict with each other, what process framework gives HR both fairness and timeliness?",
      "How do you use mediation effectively when both parties believe they are the wronged party?",
    ],
    outcomes: [
      "Selina conducts individual investigation interviews with both managers and eight team members — a pattern of structural ambiguity (unclear authority boundaries) is identified as the primary cause",
      "An external mediator is engaged: both managers agree after Selina frames it as a leadership capability conversation rather than a conflict resolution process",
      "Role boundaries are formally redefined; a shared decision-making protocol for the merged department is agreed and documented",
      "Both managers complete a 360-feedback process and individual coaching; the formal complaints are withdrawn by both parties",
      "Absenteeism in both teams returns to company average within 90 days; Q4 peak is successfully delivered",
    ],
    lessons: [
      "Many workplace conflicts between senior colleagues have structural, not personal, roots — authority ambiguity, unclear role boundaries, and competing accountabilities create conflict that looks interpersonal but is actually organizational",
      "Mediation is significantly more effective when framed as professional development rather than conflict resolution — 'leadership effectiveness' lands differently than 'dispute'",
      "HR must investigate the organizational conditions that created the conflict, not just the behaviours that resulted from it — resolving the behaviour without fixing the structure creates repeat conflict",
    ],
    appqs: [
      "Design a role boundary clarity framework for a merged department. What elements would it cover and how would boundaries be agreed?",
      "How would you brief an external mediator for this case — what context would you provide, what would you ask them to achieve, and what would you ask them not to do?",
      "What early warning indicators would tell you that a conflict between two managers is beginning to affect their teams — and what would be your first intervention?",
    ],
  },
  {
    id: "e4",
    topic: "er",
    topicLabel: "Employee Relations & Conflict",
    difficulty: "expert",
    industry: "Education",
    industryKey: "education",
    title: "“The Misconduct Accusation”",
    org: "BrightMinds Academy",
    orgLine: "BrightMinds Academy · 350 employees",
    preview:
      "A safeguarding allegation is made against a popular and respected teacher. The investigation finds the accusation was fabricated. HR must now navigate the aftermath for everyone involved.",
    searchTitle: "the misconduct accusation",
    searchOrg: "brightminds academy",
    searchPreview:
      "a safeguarding allegation is made against a popular and respected teacher. the i",
    featured: false,
    scenario: [
      "Leighton, a secondary school teacher at BrightMinds Academy with 12 years of exemplary service and multiple teaching awards, is the subject of a formal safeguarding allegation made by a student. Under safeguarding protocols, Leighton is immediately suspended on full pay pending investigation. The investigation — conducted by an external specialist over six weeks — finds the allegation to be fabricated: CCTV footage, witness statements, and documentary evidence comprehensively disprove the claim.",
      "Leighton returns to work. But the damage is profound: colleagues know about the suspension, some parents have heard rumours, Leighton's confidence is severely impacted, and the student who made the false allegation remains in Leighton's class. HR Director Priya must manage the aftermath for Leighton, the school community, and the student.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Leighton has been profoundly harmed by a fair process — suspension was legally correct and necessary, but the impact on reputation and psychological wellbeing is real and significant.",
        "The student who made the false allegation is a minor with their own welfare considerations — the situation requires a careful, proportionate response that does not itself breach duty of care.",
        "The rumour environment at BrightMinds must be managed without breaching confidentiality — Priya cannot publicly clear Leighton's name in a way that identifies the student.",
      ],
    },
    pauseQs: [
      "When a fair process causes real harm to an innocent person, what obligations does the employer have — legally, ethically, and in terms of practical support?",
      "How do you manage the return to work of an employee who has been through a traumatic investigation — particularly when some colleagues may retain doubts?",
    ],
    outcomes: [
      "Leighton receives a formal written statement from the Principal confirming full exoneration; a planned staff briefing is agreed with Leighton's input",
      "Leighton is offered occupational health counselling, a phased return, a temporary class reassignment until the situation stabilizes, and a named HR contact for ongoing support",
      "The student is referred to the school's pastoral and welfare team; a safeguarding-aware response is designed that addresses the behaviour without criminalizing a young person",
      "Priya reviews BrightMinds' suspension protocol: communication templates, support mechanisms, and timelines are all updated to minimize harm to suspended employees while maintaining legal compliance",
    ],
    lessons: [
      "A legally correct process can still cause significant harm — the duty of care to an employee subject to investigation does not end with the suspension letter; it requires active support throughout and after the process",
      "Returning to work after a false or unproven allegation requires a structured, supported, and colleague-managed reintegration — the organizational response in the first two weeks shapes whether the employee recovers or exits",
      "Safeguarding processes involving students require HR to hold multiple welfare considerations simultaneously — the welfare of the accused adult employee and the welfare of the student cannot be treated as mutually exclusive",
    ],
    appqs: [
      "Design a 'Returning Employee Support Plan' for Leighton's first four weeks back at work. What would it include?",
      "How would you brief the staff team about Leighton's return without disclosing the nature of the allegation or identifying the student?",
      "Review BrightMinds' suspension protocol — what communication, support, and timeline standards should a best-practice protocol include?",
    ],
  },

  // ── Well-being & Mental Health ───────────────────────────────
  {
    id: "w1",
    topic: "wellbeing",
    topicLabel: "Well-being & Mental Health",
    difficulty: "beginner",
    industry: "Marketing / Creative",
    industryKey: "marketing / creative",
    title: "“The Burnout Nobody Saw”",
    org: "Momentum Agency",
    orgLine: "Momentum Agency · 220 employees",
    preview:
      "Momentum's busiest quarter ends with three simultaneous mental health crises among account managers. HR discovers a culture that celebrated overwork and penalized rest.",
    searchTitle: "the burnout nobody saw",
    searchOrg: "momentum agency",
    searchPreview:
      "momentum's busiest quarter ends with three simultaneous mental health crises amo",
    featured: true,
    scenario: [
      "Momentum Agency, a 220-person marketing agency, ends its most commercially successful quarter with three account managers signed off with stress and anxiety simultaneously. All three are high performers. All three had been working 60–70 hour weeks for three months. All three had received praise from their line managers for “going above and beyond.” None had raised concerns. None had used the agency's EAP. None had felt they could.",
      "When HR Manager Yewande conducts confidential conversations with the broader account management team, the picture becomes clear: working evenings and weekends is an informal norm; taking time off during peak periods is seen as uncommitted; the most burned-out employees are also the most publicly praised. The agency has accidentally built a culture that rewards self-destruction.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The three employees are on sick leave. They need appropriate support, a safe return pathway, and assurance that the culture that burned them out is changing.",
        "The cultural problem is systemic and leadership-modelled — the Managing Director works 70-hour weeks and is visibly proud of it. Changing the culture requires changing leadership behaviour.",
        "Momentum is entering its next busy period in six weeks. Yewande must make immediate structural changes without disrupting client delivery.",
      ],
    },
    pauseQs: [
      "When a toxic culture is leadership-modelled from the top, how do you create change without the leadership themselves understanding their role in the problem?",
      "What is the difference between supporting resilience and designing systems that do not require employees to be resilient?",
    ],
    outcomes: [
      "All three employees receive occupational health referrals, phased return-to-work plans, and a commitment that workload will be redistributed before they return",
      "Yewande presents a 'Culture Audit' to the MD: data showing correlation between praised employees and highest burnout risk — the MD has a genuine and difficult revelation",
      "Leadership team commits to: no emails after 7pm, mandatory minimum 2 days off per weekend during peak periods, and public praise for sustainable working as much as high output",
      "A workload monitoring system is introduced: any account manager working more than 50 hours in a week triggers an automatic check-in with their manager",
      "EAP uptake increases from 2% to 14% following a destigmatization campaign featuring the MD sharing their own experience of burnout",
    ],
    lessons: [
      "Burnout is not caused by individual weakness — it is caused by organizational systems, cultural norms, and leadership behaviours that make sustained overwork the path to recognition and progression",
      "The most effective well-being intervention is not an EAP, it is a workload management system that prevents the conditions that create the need for an EAP in the first place",
      "Leaders model the culture they lead — when the MD works 70-hour weeks and is publicly energized by it, the message to every employee is that this is what success looks like here; only the MD can change that message",
    ],
    appqs: [
      "Design a workload monitoring system for Momentum that is simple, respected by account managers, and actually prevents overwork rather than just recording it.",
      "How would you structure the conversation with the MD that presents the culture audit findings — what evidence would you use and how would you frame the ask?",
      "Write a well-being policy for Momentum that reflects the changes made. What commitments would it include from the organization, from managers, and from employees?",
    ],
  },
  {
    id: "w2",
    topic: "wellbeing",
    topicLabel: "Well-being & Mental Health",
    difficulty: "intermediate",
    industry: "Healthcare (NHS)",
    industryKey: "healthcare (nhs)",
    title: "“Return to Work”",
    org: "CareFirst NHS Trust",
    orgLine: "CareFirst NHS Trust · 6,000 employees",
    preview:
      "A CareFirst nurse returns from a six-month absence for clinical depression. Her manager's response on the first day back undoes six months of occupational health work in ten minutes.",
    searchTitle: "return to work",
    searchOrg: "carefirst nhs trust",
    searchPreview:
      "a carefirst nurse returns from a six-month absence for clinical depression. her ",
    featured: false,
    scenario: [
      "Zara, a band 6 nurse at CareFirst NHS Trust, has been on sick leave for six months following a diagnosis of severe depression. Her occupational health-supported return-to-work plan specifies: phased return over four weeks (starting 50% of contracted hours), no night shifts for the first six weeks, a dedicated buddy, fortnightly check-ins with her line manager, and no discussion of her absence or diagnosis with colleagues without her consent.",
      "On her first day back, her line manager — who has not read the return plan — tells Zara in front of two colleagues that she “needs to pull her weight this shift” and that the team “has had to cover a lot for her.” Zara leaves the ward in distress and does not return the following day.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Zara's carefully designed return-to-work plan has been sabotaged on day one by a manager who was not properly briefed or held accountable for implementing it.",
        "The comments made in front of colleagues may constitute disability discrimination under the Equality Act — Zara has been treated detrimentally due to her health condition.",
        "CareFirst must now manage: Zara's immediate wellbeing and potential second absence, the legal exposure created by the manager's conduct, and the systemic failure that allowed an unread return plan to be the standard.",
      ],
    },
    pauseQs: [
      "What are the manager's obligations under a return-to-work plan — and how should accountability for those obligations be structured?",
      "When a manager makes comments that may constitute disability discrimination, what are HR's immediate obligations — and what process must follow?",
    ],
    outcomes: [
      "HR contacts Zara within 24 hours — apology, assurance, and immediate restatement of the full return plan with a different line manager for the return period",
      "The comments are formally investigated; the manager receives a first written warning and mandatory Equality Act training",
      "CareFirst introduces a Return-to-Work Manager Briefing: a mandatory 30-minute meeting between HR and the line manager before any long-term absence return, with a signed agreement on plan obligations",
      "Zara returns three weeks later with a new manager lead; she completes the phased return successfully and remains employed at CareFirst two years later",
    ],
    lessons: [
      "A return-to-work plan that is not read, understood, and actively implemented by the line manager is not a support tool — it is a document that creates false assurance while the employee remains at risk",
      "Line managers must be briefed, trained, and held accountable for implementing reasonable adjustments and return-to-work plans — this does not happen automatically, and HR must build the mechanism that makes it happen",
      "Comments about a disabled employee's absence or performance that cause detriment — especially in front of colleagues — can constitute both disability discrimination and harassment under the Equality Act, regardless of the manager's intention",
    ],
    appqs: [
      "Design the Return-to-Work Manager Briefing. What does the manager need to know before the employee's first day back — and what commitments do you need from them?",
      "What return-to-work monitoring system would you put in place to catch plan failures in real time rather than after damage has been done?",
      "How would you support Zara specifically in rebuilding confidence and trust in her workplace — what would the next three months look like?",
    ],
  },
  {
    id: "w3",
    topic: "wellbeing",
    topicLabel: "Well-being & Mental Health",
    difficulty: "intermediate",
    industry: "Fashion / Retail",
    industryKey: "fashion / retail",
    title: "“The Wellbeing Washing”",
    org: "TrendCo",
    orgLine: "TrendCo · 800 employees",
    preview:
      "TrendCo launches a wellbeing programme with meditation apps, mindfulness sessions, and a mental health ambassador. Engagement is high. The sickness absence rate is unchanged. Something is deeply wrong.",
    searchTitle: "the wellbeing washing",
    searchOrg: "trendco",
    searchPreview:
      "trendco launches a wellbeing programme with meditation apps, mindfulness session",
    featured: false,
    scenario: [
      "TrendCo, an 800-person fashion retail company, invests £180K in a wellbeing programme: a meditation app subscription for all employees, 12 mental health ambassadors trained and deployed, monthly mindfulness sessions, and a wellbeing committee. The launch is enthusiastic. Engagement with the app is high for three months. The CEO is delighted.",
      "Twelve months later, HR Analyst Diana presents the outcomes data: sickness absence is unchanged at 8.4%; stress-related absence has increased by 11%; the mental health ambassadors report that the conversations they are having are largely about workload, management behaviour, and job insecurity — none of which the wellbeing programme addresses. Three ambassadors have resigned in the last six months, citing their own burnout.",
    ],
    challenge: {
      kind: "list",
      items: [
        "TrendCo has invested in wellbeing optics rather than wellbeing outcomes. The programme treats symptoms (stress, anxiety) without addressing the organizational conditions (workload, insecurity, management quality) that generate them.",
        "The mental health ambassadors — employees who volunteered to support their colleagues — have burned out in the process. HR has a duty of care to them specifically.",
        "Diana must present findings that effectively tell the CEO that £180K has been spent on the wrong things — and propose a credible alternative direction.",
      ],
    },
    pauseQs: [
      "What is the difference between individual well-being interventions and organizational well-being? Why does one work and the other typically doesn't?",
      "When well-being programme data shows no impact on absence, what diagnostic questions should HR be asking?",
    ],
    outcomes: [
      "The ambassador programme is redesigned: capped at 2 hours per month, with structured supervision, and explicit scope boundaries (support, not therapy)",
      "A Workload Health Audit is commissioned across all departments — identifying three teams with chronically unsustainable workloads",
      "Manager effectiveness training is introduced as the primary well-being investment: managers are accountable for team absence rates in their own reviews",
      "The meditation app subscription is discontinued; budget is reallocated to two additional FTE in the two most overloaded departments",
      "Stress-related absence falls by 24% within 18 months; overall sickness absence falls to 6.1%",
    ],
    lessons: [
      "Well-being programmes that focus on individual coping without addressing organizational causes of distress are wellbeing washing — they may improve engagement metrics while leaving the underlying conditions unchanged",
      "Mental health ambassadors carry a burden of emotional labour that requires active management — peer support roles without scope limits, supervision, and self-care support produce additional burnout, not less",
      "The most effective well-being investment is addressing the primary organizational drivers of stress: unsustainable workload, poor management, and insecurity — individual interventions are supportive, not curative",
    ],
    appqs: [
      "Design a workload health audit for TrendCo. What data would you gather, how would you gather it, and what thresholds would trigger action?",
      "How would you redesign the ambassador programme to protect the ambassadors' own wellbeing while maintaining the peer support function?",
      "How would you present the programme's failure data to the CEO in a way that preserves the momentum of investment while redirecting it to the right interventions?",
    ],
  },
  {
    id: "w4",
    topic: "wellbeing",
    topicLabel: "Well-being & Mental Health",
    difficulty: "expert",
    industry: "Financial Services",
    industryKey: "financial services",
    title: "“Stress, Silence, and Severance”",
    org: "CapitalEdge",
    orgLine: "CapitalEdge · 1,500 employees",
    preview:
      "CapitalEdge's high-performance culture has a price: a pattern of mental health disclosures followed by managed exits that HR has not previously connected into a systemic picture.",
    searchTitle: "stress, silence, and severance",
    searchOrg: "capitaledge",
    searchPreview:
      "capitaledge's high-performance culture has a price: a pattern of mental health d",
    featured: false,
    scenario: [
      "CapitalEdge, a 1,500-person investment management firm, operates a demanding, high-stakes culture where performance pressure is intense and visible. Over 18 months, HR Business Partner Nneka notices a pattern while processing case files: seven employees have followed an almost identical trajectory — disclosure of a mental health condition, followed by a period of reduced performance, followed by a settlement agreement and departure. In six of the seven cases, the employee was managing a physical or psychological condition that could constitute a disability under the Equality Act.",
      "Nneka brings the pattern to the HR Director. The response: “These were all handled individually and correctly.” Nneka disagrees — and she believes the pattern, taken together, constitutes systemic discrimination.",
    ],
    challenge: {
      kind: "list",
      items: [
        "Nneka is facing both a professional courage challenge (challenging a senior colleague's assessment) and a complex legal analysis (is a pattern of individually-handled cases evidence of systemic discrimination?)",
        "Each of the seven cases was individually settled — confidentiality clauses are in place. The pattern is only visible because Nneka connected the data.",
        "If the pattern constitutes systemic discrimination, CapitalEdge has significant legal exposure and a culture that is actively harming disabled employees.",
      ],
    },
    pauseQs: [
      "When individual cases are handled correctly but the aggregate pattern suggests discrimination, what are HR's obligations — and to whom?",
      "How does Nneka escalate her concern effectively when her direct line of escalation has already dismissed it?",
    ],
    outcomes: [
      "Nneka escalates to the General Counsel, presenting the pattern analysis with legal framework — the General Counsel agrees the pattern requires independent review",
      "An external legal review concludes that the aggregate pattern is consistent with disability discrimination — CapitalEdge is advised to conduct a voluntary remediation process",
      "A confidential outreach process to all seven former employees results in three settlements being renegotiated; four former employees choose not to take further action",
      "CapitalEdge introduces a Disability Disclosure and Support Protocol: structured assessment of reasonable adjustments before any performance management action; mandatory HR Director sign-off before any settlement involving a disclosed health condition",
      "Mental health stigma programme launched at senior leadership level; the firm's approach to performance management during periods of ill health is fundamentally redesigned",
    ],
    lessons: [
      "HR professionals have an obligation to look at the aggregate pattern of decisions, not just individual cases — systemic discrimination is often only visible when data is connected across cases",
      "Professional courage — the willingness to escalate a concern past a line manager who has dismissed it — is a core CIPD professional competency, not an act of insubordination",
      "Settlement agreements and confidentiality clauses resolve individual disputes but do not resolve the underlying cultural and systemic conditions that created them — organizations that settle without systemic change simply accumulate future liability",
    ],
    appqs: [
      "Design a Disability Disclosure and Support Protocol for CapitalEdge. What are the key stages and safeguards?",
      "How would you present the pattern analysis to the General Counsel — what legal framework would you reference and how would you structure the argument?",
      "What does a genuinely mentally healthy high-performance culture look like — is there an inherent tension between the two, and if so, how is it managed?",
    ],
  },

  // ── Future of Work & Innovation ──────────────────────────────
  {
    id: "f1",
    topic: "fow",
    topicLabel: "Future of Work & Innovation",
    difficulty: "beginner",
    industry: "Financial Services",
    industryKey: "financial services",
    title: "“The Reluctant Return”",
    org: "FinServe",
    orgLine: "FinServe · 3,000 employees",
    preview:
      "FinServe's mandatory return-to-office policy triggers a resignation crisis. HR discovers the policy was designed without any employee input — and is now undoing three years of talent investment.",
    searchTitle: "the reluctant return",
    searchOrg: "finserve",
    searchPreview:
      "finserve's mandatory return-to-office policy triggers a resignation crisis. hr d",
    featured: true,
    scenario: [
      "FinServe, a 3,000-person financial services firm, announces in January that all employees are required to return to the office five days per week, effective from the following month. The announcement is made via email from the CEO, with a single line of justification: “collaboration and culture are best built in person.” Within four weeks: 47 resignation letters are received, predominantly from high-performing women and employees with caring responsibilities; employee relations raises 23 formal flexible working requests; engagement scores drop 18 points; and a HR Director, Beatrice, is fielding daily escalations from managers whose best people are threatening to leave.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The policy has been set at CEO level. Beatrice does not have authority to reverse it unilaterally — but she has data suggesting it is causing disproportionate harm to specific employee groups, creating Equality Act exposure.",
        "The flexible working requests must be processed legally and fairly — but processing 23 requests without a clear framework risks inconsistency and further legal risk.",
        "Beatrice must build a rapid business case for policy revision that the CEO will actually engage with — and she has, at most, two weeks before the resignation wave accelerates.",
      ],
    },
    pauseQs: [
      "When a senior leader's decision creates disproportionate impact on protected groups, what are HR's obligations — and how do you raise this?",
      "How do you build a business case for reversing a CEO decision without making it feel like a challenge to leadership authority?",
    ],
    outcomes: [
      "Beatrice presents the CEO with a 'Talent Risk Report': 47 resignations, £2.3M estimated replacement cost, disproportionate impact on women (73% of leavers) flagged as Equality Act exposure",
      "The policy is revised to 3 days in-office, 2 days remote — announced within three weeks of the original mandate",
      "A Hybrid Working Framework is co-designed with employees: departmental flexibility within clear organizational norms",
      "41 of 47 resignation letters are withdrawn; the 23 flexible working requests are processed under the new framework",
      "FinServe introduces a People Impact Assessment as a mandatory step before any future workforce policy change",
    ],
    lessons: [
      "Workforce policies designed without employee input — particularly those affecting working patterns — generate resistance, resentment, and attrition that far exceeds the cost of co-designing them",
      "Disproportionate impact on protected groups is not just an ethical concern — it is an Equality Act risk that must be identified and communicated to decision-makers before policies go live",
      "The business case for flexible working is not about accommodation — it is about talent retention, diversity of workforce, and organizational resilience; framing it in these terms is significantly more persuasive to commercially-focused leadership",
    ],
    appqs: [
      "Design a People Impact Assessment framework that FinServe could use before any future workforce policy change. What questions must it answer?",
      "How would you structure the Hybrid Working Framework — what would be organizational standards and what would be departmental flexibilities?",
      "If the CEO had refused to revise the policy despite the Talent Risk Report, what options would Beatrice have had — and what would you have done?",
    ],
  },
  {
    id: "f2",
    topic: "fow",
    topicLabel: "Future of Work & Innovation",
    difficulty: "intermediate",
    industry: "Staffing / Workforce Solutions",
    industryKey: "staffing / workforce solutions",
    title: "“Gig or Employee?”",
    org: "FlexForce",
    orgLine: "FlexForce · 500 employees",
    preview:
      "FlexForce classifies 800 delivery workers as self-employed contractors. A tribunal ruling — and a media investigation — expose the reality: these workers are employees in all but name.",
    searchTitle: "gig or employee?",
    searchOrg: "flexforce",
    searchPreview:
      "flexforce classifies 800 delivery workers as self-employed contractors. a tribun",
    featured: false,
    scenario: [
      "FlexForce, a workforce solutions company with 500 core employees, operates a network of approximately 800 delivery workers classified as self-employed contractors. The classification means FlexForce pays no employer NIC, provides no sick pay, holiday pay, or pension contributions, and imposes no minimum hours guarantee. Workers are required to wear FlexForce uniforms, use FlexForce equipment, follow FlexForce scheduling, and work exclusively for FlexForce. An employment tribunal, ruling on a test case brought by three workers, concludes that the workers meet the legal definition of 'workers' (and possibly employees) under UK law.",
      "The ruling is covered by the national press. HR Director Kwame has 72 hours before an all-staff communication is required.",
    ],
    challenge: {
      kind: "list",
      items: [
        "The tribunal ruling creates immediate legal and financial exposure: potential backdated holiday pay, sick pay, and pension contributions for 800 workers across multiple years.",
        "Kwame must communicate to both core employees and the contract workforce simultaneously — with different messages, different legal implications, and different emotional stakes.",
        "The business model may need to change structurally. Some of what FlexForce has built depends on the contractor classification — Kwame must work with legal and finance to understand what is now viable.",
      ],
    },
    pauseQs: [
      "What are the tests for employment status in UK law — and why did FlexForce's contractor model fail them?",
      "How do you communicate a legally significant ruling to a workforce of 800 affected workers in a way that is honest, fair, and does not create panic?",
    ],
    outcomes: [
      "Kwame commissions an immediate workforce audit: all 800 workers are assessed against the tribunal's criteria; 720 are reclassified as workers, 80 as genuinely self-employed",
      "Holiday pay, sick pay, and pension contributions are implemented immediately for the 720 reclassified workers",
      "A backdated compensation fund is established; workers are proactively contacted with an offer rather than waiting for individual claims",
      "FlexForce's business model is revised: the cost increase is absorbed partly through operational efficiency and partly through revised client pricing",
      "FlexForce publishes a 'Good Work Charter' committing to fair employment practices across its entire workforce — the media narrative shifts from scandal to reform",
    ],
    lessons: [
      "Employment status is determined by the reality of the working relationship, not the label on the contract — the greater the control, exclusivity, and integration into the organization, the more likely a contractor is a worker or employee in law",
      "Proactive remediation — identifying liability and addressing it before it is forced — is significantly less costly than defending tribunal claims and more credible with both the workforce and the public",
      "The gig economy creates genuine flexibility for some workers but genuine precariousness for others — HR professionals have an ethical responsibility to advocate for fair treatment of all people working in and through their organizations, regardless of formal employment status",
    ],
    appqs: [
      "What are the three key tests UK law uses to determine employment status — and apply each to FlexForce's delivery workers?",
      "Design a 'Good Work Charter' for FlexForce. What commitments would it include — and how would compliance be monitored?",
      "How would you communicate the reclassification decision to the 720 affected workers — what would you say, in what format, and through which channels?",
    ],
  },
  {
    id: "f3",
    topic: "fow",
    topicLabel: "Future of Work & Innovation",
    difficulty: "intermediate",
    industry: "Recruitment / HR Technology",
    industryKey: "recruitment / hr technology",
    title: "“AI in the Interview Room”",
    org: "NextGen Talent",
    orgLine: "NextGen Talent · 200 employees",
    preview:
      "NextGen Talent deploys an AI video interview platform for a major client. Six months in, the bias audit reveals the AI has been systematically disadvantaging candidates from non-native English-speaking backgrounds.",
    searchTitle: "ai in the interview room",
    searchOrg: "nextgen talent",
    searchPreview:
      "nextgen talent deploys an ai video interview platform for a major client. six mo",
    featured: false,
    scenario: [
      "NextGen Talent, a recruitment technology company with 200 employees, sells an AI-powered video interview platform to a major retail client. The platform assesses candidates using natural language processing and sentiment analysis, generating a suitability score that is used to shortlist for the second round. Six months after launch, a routine bias audit commissioned by the retail client produces alarming findings: candidates from non-native English-speaking backgrounds are scoring 23 percentage points lower on average than native English speakers with equivalent responses — even when their answers are transcribed and rated identically by human assessors. The AI has developed a systematic accent bias.",
      "NextGen's CHRO, Simone, receives the audit findings at the same time as the retail client's legal team.",
    ],
    challenge: {
      kind: "list",
      items: [
        "NextGen is simultaneously the technology provider and the party advising clients on fair recruitment practice — this creates a profound conflict of interest and reputational risk.",
        "The clients who used the platform during the six-month period may have made discriminatory hiring decisions without knowing — NextGen may have unknowingly facilitated race and national origin discrimination at scale.",
        "Simone must manage the immediate client relationship, the legal exposure, and the product integrity crisis — while also publicly responding to questions about AI fairness in recruitment.",
      ],
    },
    pauseQs: [
      "When AI produces biased outputs, who is responsible — the algorithm, the company that deployed it, or the organization that used it to make decisions?",
      "How do you manage a public AI bias disclosure that affects both your own organization and multiple clients?",
    ],
    outcomes: [
      "The platform is immediately suspended for all clients pending a full technical review",
      "Affected clients are proactively notified; NextGen offers to fund re-assessment of all candidates scored by the AI during the six-month period",
      "The AI model is retrained on a linguistically diverse dataset with mandatory quarterly bias audits going forward",
      "NextGen publishes a public 'AI Ethics Commitment' including independent bias auditing, explainability standards, and human-in-the-loop requirements for all hiring decisions",
      "Simone presents at three industry conferences on responsible AI in recruitment — NextGen's transparency transforms a crisis into a market differentiation",
    ],
    lessons: [
      "AI bias in recruitment is not a hypothetical risk — it is a documented, measurable, and legally actionable reality; any organization deploying AI in hiring has a responsibility to audit for differential impact before, during, and after deployment",
      "Transparency about AI failures, handled with speed and genuine remediation, builds more trust than concealment — the organizations that recover from AI bias incidents most credibly are those that disclose proactively and act comprehensively",
      "The responsibility for AI-facilitated discrimination cannot be deflected to the algorithm — the organization that deploys AI in decisions affecting people's livelihoods is accountable for its outputs",
    ],
    appqs: [
      "Design a bias audit framework for an AI recruitment tool. What would be tested, how often, and by whom?",
      "NextGen must write to clients whose candidates were affected. Draft the key elements of that communication.",
      "What does a responsible AI deployment policy for recruitment look like — what must it require before go-live and during operation?",
    ],
  },
  {
    id: "f4",
    topic: "fow",
    topicLabel: "Future of Work & Innovation",
    difficulty: "expert",
    industry: "Software / Technology",
    industryKey: "software / technology",
    title: "“The Org That Went Agile”",
    org: "SprintCo",
    orgLine: "SprintCo · 1,200 employees",
    preview:
      "SprintCo adopts an agile operating model across the entire organization in six months. HR is told to 'adapt HR to agile.' Two years later, the agile transformation has failed — and HR is partially to blame.",
    searchTitle: "the org that went agile",
    searchOrg: "sprintco",
    searchPreview:
      "sprintco adopts an agile operating model across the entire organization in six m",
    featured: false,
    scenario: [
      "SprintCo, a 1,200-person software company, announces a full organization-wide agile transformation. Squads, tribes, chapters, and guilds replace traditional departments. Hierarchy is flattened. Managers become 'coaches' or 'chapter leads.' The transformation is designed by an external consultancy and implemented over six months. HR is told to “align HR to the agile model.” HR's response: rename job titles, update the org chart, and remove most formal management layers from the HRIS.",
      "Two years later, the post-implementation review is damning: performance management has collapsed (nobody knows who is responsible for giving feedback), career progression is opaque (the chapter lead structure has no formal authority over development), DEIB representation in the self-organizing teams has worsened (teams have clustered by demographics), and 38% of employees describe their manager relationship as “unclear or absent.”",
    ],
    challenge: {
      kind: "list",
      items: [
        "HR adapted the org chart to agile but failed to adapt the people systems — performance, development, progression, and inclusion — that make an org chart functional.",
        "Agile structures create real HR challenges that are not solved by renaming roles: who gives performance feedback in a self-organizing team? Who makes promotion decisions when hierarchy is flat? How do you prevent demographic clustering in self-selecting teams?",
        "SprintCo must decide whether to continue with the agile model, modify it, or revert — and HR must provide evidence-based input into that decision.",
      ],
    },
    pauseQs: [
      "What are the specific HR systems that must be redesigned when an organization moves to agile — and what happens when they are not?",
      "How do you make promotion and career development decisions fairly in a structure without formal management hierarchy?",
    ],
    outcomes: [
      "HR commissions a comprehensive people systems audit: 14 specific failures are identified across performance, development, progression, and inclusion",
      "A 'People in Agile' framework is designed: chapter leads are given explicit people management responsibilities; performance conversations move to a peer-plus-chapter-lead model; promotion criteria are published transparently",
      "Team formation protocols are introduced to prevent demographic clustering — squads are formed with diversity composition targets and HR review before finalization",
      "An agile career framework is developed: five lateral and vertical progression pathways with explicit skills evidence requirements",
      "Employee satisfaction with the agile model improves from 31% to 58% within 18 months; the model is sustained",
    ],
    lessons: [
      "Agile organizational transformation requires agile HR transformation — the people systems that make traditional hierarchies function (performance accountability, career progression, development ownership) must be redesigned for agile, not just relabelled",
      "Self-organizing teams do not automatically produce diverse and inclusive team compositions — in fact, without active facilitation, they tend to produce homogeneous clusters; DEIB requires explicit design in agile as much as in hierarchical structures",
      "HR's role in an organizational transformation is not to adapt the org chart — it is to ensure that every decision-making, development, and accountability mechanism works in the new structure; HR that only updates the diagram has not done its job",
    ],
    appqs: [
      "Design the 'People in Agile' framework for SprintCo. What are the key elements — performance, development, progression, and inclusion — and how does each work?",
      "How would you design a team formation protocol that ensures diverse squad composition without being prescriptive about individual placements?",
      "What would the agile career framework look like at SprintCo — draw the pathways and define what evidence is required for progression along each one?",
    ],
  },
];
