/**
 * Typed data model for the 10 Everyday HR Playbook entries.
 *
 * Faithful port of the entry markup in everyday_hr_playbook_v3.html
 * (lines 288–497). Each entry is described as structured data and rendered
 * by the real <Entry> React component in playbook-content.tsx — there is no
 * injected HTML. Text content is byte-faithful to the source; HTML entities
 * are stored as their real characters (— ✓ ✗ ▼ ↓ etc.).
 */

export type EsLabel = { icon: string; text: string };

export type StepItem = { n: number; title: string; desc: string };
export type TemplateBlock = { label: string; text: string; note?: string };

/**
 * Legal items may contain an inline <strong> prefix. `strongLabel` is the
 * bolded portion, `text` is the remaining (non-bold) text. Rendered as
 * `<strong>{strongLabel}</strong> {text}`.
 */
export type LegalItem = { icon: string; strongLabel: string; text: string };

export type JurTab = { code: string; flag: string; name: string };
export type JurPanel = { code: string; legalItems: LegalItem[]; note: string };

export type StepsSection = {
  type: "steps";
  label: EsLabel;
  steps: StepItem[];
};

export type TemplatesSection = {
  type: "templates";
  label: EsLabel;
  blocks: TemplateBlock[];
};

export type DontsSection = {
  type: "donts";
  label: EsLabel;
  doTitle: string;
  dontTitle: string;
  do: string[];
  dont: string[];
};

export type LegalSection = {
  type: "legal";
  label: EsLabel;
  tabs: JurTab[];
  panels: JurPanel[];
};

export type MvhrItem = { title: string; items: string[] };
export type MvhrSection = {
  type: "mvhr";
  label: EsLabel;
  manager: MvhrItem;
  hr: MvhrItem;
};

export type EscalationSection = {
  type: "escalation";
  label: EsLabel;
  items: string[];
};

export type ChecklistSection = {
  type: "checklist";
  /** Hidden #cl-XXX payload, pipe-delimited exactly as in source. */
  payload: string;
  buttonLabel: string;
};

export type PlaybookSection =
  | StepsSection
  | TemplatesSection
  | DontsSection
  | LegalSection
  | MvhrSection
  | EscalationSection
  | ChecklistSection;

export type PlaybookEntry = {
  id: string;
  catClass: string;
  dataTitle: string;
  dataCat: string;
  dataSearch: string;
  icon: string;
  catBadge: string;
  title: string;
  summary: string;
  pills: string[];
  sections: PlaybookSection[];
};

const JUR_TABS: JurTab[] = [
  { code: "gb", flag: "🇬🇧", name: "UK" },
  { code: "ng", flag: "🇳🇬", name: "Nigeria" },
  { code: "us", flag: "🇺🇸", name: "USA" },
  { code: "sg", flag: "🇸🇬", name: "Singapore" },
  { code: "cn", flag: "🇨🇳", name: "China" },
  { code: "hk", flag: "🇭🇰", name: "Hong Kong" },
];

const JUR_NOTE =
  "This is general guidance only and does not constitute legal advice. Always consult a qualified employment lawyer in the relevant jurisdiction for specific situations.";

const STEPS_LABEL: EsLabel = { icon: "📋", text: "Step-by-Step Guide" };
const TEMPLATES_LABEL: EsLabel = {
  icon: "💬",
  text: "What to Say — Template Language",
};
const DONTS_LABEL: EsLabel = { icon: "✗", text: "Common Mistakes to Avoid" };
const LEGAL_LABEL: EsLabel = {
  icon: "⚖️",
  text: "Legal & Compliance — Select Jurisdiction",
};
const MVHR_LABEL: EsLabel = { icon: "👥", text: "Manager vs HR Responsibilities" };
const ESC_LABEL: EsLabel = { icon: "🚨", text: "When to Escalate" };
const DO_TITLE = "✓ Do this";
const DONT_TITLE = "✗ Never do this";
const MGR_TITLE = "👥 Manager responsible for";
const HR_TITLE = "📋 HR responsible for";

export const PLAYBOOK_ENTRIES: PlaybookEntry[] = [
  {
    id: "dc1",
    catClass: "cat-green",
    dataTitle: "conducting a difficult conversation",
    dataCat: "dc1",
    dataSearch:
      "conducting a difficult conversation people management a structured approach for hr professionals and managers to prepare for, conduct, and follow up on conversations that feel uncomfortable — covering performance concerns, behaviour issues, personal impacts, and sensitive disclosures.",
    icon: "💬",
    catBadge: "People Management",
    title: "Conducting a Difficult Conversation",
    summary:
      "A structured approach for HR professionals and managers to prepare for, conduct, and follow up on conversations that feel uncomfortable — covering performance concerns, behaviour issues, personal impacts, and sensitive disclosures.",
    pills: ["Preparation", "Active listening", "Follow-up", "Documentation"],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Clarify your purpose before anything else",
            desc: "Define what outcome you need from this conversation. Is it to share a concern and agree a change? To give feedback? To understand something? Clarity of purpose prevents conversations from drifting into vague, unhelpful territory. Write one sentence: 'By the end of this conversation, I want to have…'",
          },
          {
            n: 2,
            title: "Prepare your facts, not your verdict",
            desc: "Gather specific, observable evidence — dates, incidents, witnessed behaviours, impacts on team or work. Do not prepare a list of judgements. Prepare a list of observations. The difference: 'You're negative' (verdict) vs 'In three team meetings this month, you challenged every suggestion made by colleagues without offering an alternative' (observation).",
          },
          {
            n: 3,
            title: "Choose the right time, place, and format",
            desc: "Private room. No surprises — give at least 24 hours notice where possible ('I'd like to talk through something with you — can we find 30 minutes this week?'). Not on a Friday. Not at the end of a long day. Not immediately after an incident while emotions are high. Face-to-face wherever possible; video as a second option.",
          },
          {
            n: 4,
            title: "Open with intent, not attack",
            desc: "State your purpose clearly and without accusation in the first minute. 'I wanted to talk because I've noticed X and I'm concerned about Y. I want to understand your perspective and agree how we move forward.' This signals honesty, not ambush.",
          },
          {
            n: 5,
            title: "Listen more than you talk",
            desc: "After opening, ask an open question and stop talking. 'Can you help me understand what's been happening from your side?' The employee's response often changes everything — context you didn't have, personal circumstances, a different view of the facts. Don't fill silence. Let them speak.",
          },
          {
            n: 6,
            title: "Acknowledge before responding",
            desc: "Even when you disagree, acknowledge what you heard. 'I can hear this has been a difficult period for you.' This is not agreement — it is respect. It keeps the conversation collaborative rather than adversarial.",
          },
          {
            n: 7,
            title: "Agree clear next steps, in writing",
            desc: "Before closing, agree specific actions, timeframes, and who is responsible for what. Do not close a difficult conversation with 'let's see how things go.' Vague endings create anxiety and ambiguity. Confirm the agreed next steps in a follow-up email the same day.",
          },
          {
            n: 8,
            title: "Document promptly",
            desc: "Write a brief factual record of what was discussed and agreed within 24 hours. This protects both parties and creates a foundation for any future formal process if needed.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Opening the conversation",
            text: '"I wanted to talk with you because I\'ve noticed [specific observation] and I\'m concerned about [specific impact]. I\'d like to understand your perspective and agree together how we move forward."',
            note: "Avoid: 'I need to talk to you about a problem.' This creates defensiveness before the conversation begins.",
          },
          {
            label: "When you're receiving unexpected emotion",
            text: '"I can see this is bringing up a lot for you and I want to hear it. Can you help me understand what\'s been happening from your side?"',
            note: "Pause. Let them speak. Do not rush to reassure or problem-solve in the moment.",
          },
          {
            label: "Redirecting if the conversation derails",
            text: '"I hear what you\'re saying about [X] and I want to come back to that. For now, can we focus on [specific topic]? I want to make sure we get through the most important things today."',
          },
          {
            label: "Closing and confirming next steps",
            text: '"To summarise — we\'ve agreed [action 1] by [date], and [action 2] by [date]. I\'ll send you a summary email today. Is there anything you want to add before we close?"',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Prepare specific observations, not judgements",
          "Give at least 24 hours notice",
          "Open with your purpose and invite their perspective",
          "Confirm next steps in writing the same day",
          "Allow silence — it creates space for honesty",
        ],
        dont: [
          "Ambush someone with a 'can I have a quick word now?'",
          "Use sweeping generalisations like 'you always' or 'you never'",
          "Have the conversation when you or they are emotionally heightened",
          "Close without agreed, specific next steps",
          "Share the conversation content with colleagues",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Right to be accompanied (ERA 1996 s.10):",
                text: "Applies to formal disciplinary and grievance hearings — employee can bring a trade union rep or colleague. Informal conversations do not carry this right but good practice is to offer it",
              },
              {
                icon: "📋",
                strongLabel: "Data protection (UK GDPR):",
                text: "Notes from conversations involving personal or sensitive data must be stored securely with a defined retention period",
              },
              {
                icon: "📋",
                strongLabel: "Equality Act 2010:",
                text: "If the conversation relates to performance and a health condition is involved, reasonable adjustment duties may apply before any formal step",
              },
              {
                icon: "📋",
                strongLabel: "ACAS Code of Practice:",
                text: "Formal disciplinary and grievance conversations must follow the ACAS Code — failure to do so can result in tribunal awards being uplifted by up to 25%",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Labour Act Cap L1 LFN 2004:",
                text: "Employers must follow fair procedures before any disciplinary action — verbal warnings, written warnings, and hearing opportunities are expected before dismissal",
              },
              {
                icon: "📋",
                strongLabel: "Right to fair hearing:",
                text: "Constitutional principle enshrined in Section 36 CFRN 1999 — employees facing formal action must be given adequate notice and opportunity to respond",
              },
              {
                icon: "📋",
                strongLabel: "Documentation:",
                text: "Nigerian courts and tribunals expect written records of disciplinary conversations and warnings — undocumented processes are vulnerable to challenge",
              },
              {
                icon: "📋",
                strongLabel: "Industrial Training Fund / NSITF:",
                text: "HR professionals should ensure formal conversations and outcomes comply with sector-specific guidelines where applicable",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "At-will employment:",
                text: "Most US states allow termination without cause, but formal conversations must still avoid any language that could be construed as discrimination under Title VII, ADA, ADEA, or state equivalents",
              },
              {
                icon: "📋",
                strongLabel: "NLRA (National Labor Relations Act):",
                text: "Employees have the right to engage in concerted protected activity — conversations that could chill this right create NLRB liability",
              },
              {
                icon: "📋",
                strongLabel: "Weingarten rights:",
                text: "Unionized employees have the right to union representation at investigatory interviews they reasonably believe could lead to discipline",
              },
              {
                icon: "📋",
                strongLabel: "State variations:",
                text: "California, New York, and New Jersey have additional protections beyond federal minimums — always check state law before formalizing a conversation",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Employment Act (Cap. 91A):",
                text: "Covers most employees earning up to SGD 4,500/month. Disciplinary conversations must follow the Act's provisions — inquiry before dismissal for misconduct",
              },
              {
                icon: "📋",
                strongLabel: "Tripartite Guidelines on Wrongful Dismissal:",
                text: "MOM guidelines require that employees are informed of grounds and given opportunity to explain before dismissal — formal conversations must be documented",
              },
              {
                icon: "📋",
                strongLabel: "PDPA (Personal Data Protection Act):",
                text: "Notes containing personal data from conversations must be handled in compliance with PDPA — limited collection, secure storage, defined retention",
              },
              {
                icon: "📋",
                strongLabel:
                  "Tripartite Alliance for Fair Employment Practices (TAFEP):",
                text: "All employment decisions must be free from discrimination on grounds of age, race, gender, religion, or disability",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Labour Contract Law 2008:",
                text: "Employers must have written disciplinary procedures in their internal rules (rules and regulations) before they can be enforced — verbal warnings unsupported by documented policy are difficult to uphold",
              },
              {
                icon: "📋",
                strongLabel: "Democratic consultation:",
                text: "Internal rules must be approved through democratic consultation with employee representatives or trade union before implementation",
              },
              {
                icon: "📋",
                strongLabel:
                  "Labour Dispute Mediation and Arbitration Law:",
                text: "Employees can refer disputes to Labour Dispute Arbitration Committees — documentation of all formal conversations is essential",
              },
              {
                icon: "📋",
                strongLabel: "Data protection (PIPL 2021):",
                text: "Employee personal data collected in the course of HR conversations is subject to China's Personal Information Protection Law — consent and purpose limitation apply",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Employment Ordinance (Cap. 57):",
                text: "Dismissal must follow a fair process — summary dismissal for gross misconduct requires a reasonable belief in guilt after an adequate investigation",
              },
              {
                icon: "📋",
                strongLabel: "Employees' Compensation Ordinance:",
                text: "If a workplace conversation relates to a work injury or stress-related condition, compensation obligations may be triggered",
              },
              {
                icon: "📋",
                strongLabel:
                  "Personal Data (Privacy) Ordinance (PDPO):",
                text: "Notes and records from HR conversations must comply with PDPO data handling principles — purpose limitation, data security, and retention limits",
              },
              {
                icon: "📋",
                strongLabel: "Labour Tribunal:",
                text: "Hong Kong employees can refer dismissal disputes to the Labour Tribunal — documented, fair processes are the primary defence",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Lead and conduct the conversation",
            "Prepare the factual observations",
            "Follow up with agreed actions",
            "Document immediately after",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on framing, process, and legal obligations",
            "Review documentation before filing",
            "Coach the manager before the conversation if needed",
            "Escalate if conversation reveals something requiring formal process",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The employee discloses a safeguarding concern, serious misconduct, or a protected disclosure (whistleblowing) — stop the conversation, do not probe further, and contact HR immediately",
          "The employee becomes significantly distressed, discloses a mental health crisis, or mentions self-harm — pause the meeting, offer support, and involve HR and/or occupational health before continuing",
          "The conversation reveals information that changes the nature of the situation (e.g. performance concerns that are actually linked to a disability) — formal process may need to be redesigned before proceeding",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — DIFFICULT CONVERSATIONS CHECKLIST||BEFORE THE CONVERSATION|[ ] Purpose defined in one clear sentence|[ ] Specific, factual observations prepared (not judgements)|[ ] Time, place and format confirmed — private, no surprises|[ ] At least 24 hours notice given where possible|[ ] Right to be accompanied considered if formal meeting||DURING THE CONVERSATION|[ ] Opened with intent and purpose, not accusation|[ ] Open question asked and space given to respond|[ ] Employee's perspective acknowledged before responding|[ ] Conversation steered back to topic if it derailed|[ ] Specific, time-bound next steps agreed before closing||AFTER THE CONVERSATION|[ ] Summary email sent same day confirming agreed actions|[ ] Brief factual record documented within 24 hours|[ ] HR notified if anything requiring formal process emerged|[ ] Next check-in date diarised||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "mh1",
    catClass: "cat-teal",
    dataTitle: "supporting an employee with mental health concerns",
    dataCat: "mh1",
    dataSearch:
      "supporting an employee with mental health concerns employee wellbeing how to respond when an employee discloses a mental health condition, shows signs of distress, or is struggling — covering your legal duties, practical support actions, confidentiality obligations, and the boundary between support and management.",
    icon: "🌱",
    catBadge: "Employee Wellbeing",
    title: "Supporting an Employee with Mental Health Concerns",
    summary:
      "How to respond when an employee discloses a mental health condition, shows signs of distress, or is struggling — covering your legal duties, practical support actions, confidentiality obligations, and the boundary between support and management.",
    pills: [
      "Equality Act",
      "Reasonable adjustments",
      "Confidentiality",
      "Duty of care",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title:
              "Create a safe, private space for the initial conversation",
            desc: "If you notice signs of distress or an employee approaches you, your first priority is a private, unhurried conversation — not an immediate solution. Find a quiet room. Allow time. 'I've noticed you haven't seemed yourself recently and I wanted to check in. How are you doing?' is often all it takes to open the door.",
          },
          {
            n: 2,
            title: "Listen without jumping to fix",
            desc: "When an employee discloses mental health difficulties, the instinct to immediately offer solutions, reassurances, or referrals can shut the conversation down. First, listen fully. Acknowledge what you're hearing. 'Thank you for telling me. That sounds really difficult.' Then — and only then — ask what support they're looking for.",
          },
          {
            n: 3,
            title: "Ask what they need — do not assume",
            desc: "Some employees want practical adjustments. Some want signposting to support. Some want nothing except to be heard and to know it won't affect their standing. Ask: 'What would feel most helpful to you right now?' Respecting their agency is both the ethical and the practically effective approach.",
          },
          {
            n: 4,
            title:
              "Assess whether the condition may constitute a disability",
            desc: "Under the Equality Act 2010, a mental health condition that has a substantial and long-term adverse effect on normal day-to-day activities is a disability. If an employee's mental health condition meets this test, you have a legal duty to make reasonable adjustments. Consult HR immediately if you are uncertain.",
          },
          {
            n: 5,
            title: "Identify and implement reasonable adjustments",
            desc: "Reasonable adjustments are individual — there is no standard list. Common examples: temporary workload reduction, adjusted working hours, working from home, removal from a specific team or project, phased return after absence, regular check-ins with a named contact. Document all adjustments agreed and review them regularly.",
          },
          {
            n: 6,
            title: "Refer to appropriate support channels",
            desc: "Signpost to EAP (Employee Assistance Programme) if available — a confidential counselling and support service. Occupational Health for clinical assessment and formal fit-for-work advice. GP referral for formal diagnosis and treatment. Mental health first aider if the organization has one. Never refer directly to a clinical service without the employee's consent.",
          },
          {
            n: 7,
            title: "Agree a check-in rhythm and maintain it",
            desc: "Regular, low-pressure check-ins — weekly 10-minute catch-ups — provide continuity of support and signal that the employee is not forgotten. Ask how they are, not how their output is. Do not make check-ins feel like performance monitoring.",
          },
          {
            n: 8,
            title:
              "Manage performance concerns separately and carefully",
            desc: "If performance has been affected, do not address it in the same conversation as mental health support. Seek HR advice before initiating any formal performance process for an employee with a disclosed mental health condition — doing so without assessing reasonable adjustments first may constitute disability discrimination.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Opening a wellbeing check-in",
            text: '"I wanted to check in with you — I\'ve noticed you\'ve seemed a bit under the weather recently and I just wanted to make sure you\'re okay. There\'s no pressure here, I just care about how you\'re doing."',
          },
          {
            label: "Responding to a disclosure",
            text: '"Thank you for trusting me with that. I can hear how much you\'ve been carrying and I\'m glad you told me. I\'m not going to make any assumptions about what you need — can you tell me what would feel most helpful right now?"',
          },
          {
            label: "Explaining reasonable adjustments",
            text: '"Based on what you\'ve told me, I\'d like to put some adjustments in place to make things more manageable. These aren\'t permanent changes — we\'ll review them together in [timeframe]. Nothing about this affects your standing here."',
          },
          {
            label: "When the employee wants no formal support",
            text: '"I completely respect that. I just want you to know the door is open whenever you want to talk, and if anything changes — if you do want to explore some support options — come and find me."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Listen before problem-solving or referring",
          "Ask what support they want rather than assuming",
          "Keep disclosures strictly confidential",
          "Assess reasonable adjustment obligations before any performance action",
          "Maintain regular check-ins that are supportive, not surveillance",
        ],
        dont: [
          "Tell the employee 'everyone feels like this sometimes'",
          "Share the disclosure with their wider team or other managers",
          "Initiate formal performance action without HR advice first",
          "Assume the employee wants to be signed off or referred",
          "Let the check-ins lapse once things appear to improve",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Equality Act 2010:",
                text: "Mental health conditions with substantial and long-term (12+ months) adverse effects on day-to-day activities are protected disabilities — reasonable adjustments are mandatory",
              },
              {
                icon: "⚖️",
                strongLabel: "Duty of care:",
                text: "Common law and Health and Safety at Work Act 1974 — employers must take reasonable steps to protect employee mental health, including addressing foreseeable stress",
              },
              {
                icon: "⚖️",
                strongLabel: "Confidentiality:",
                text: "Health disclosures are special category data under UK GDPR — must be stored securely, accessed only on need-to-know basis, and not shared without explicit consent",
              },
              {
                icon: "⚖️",
                strongLabel: "Fit notes:",
                text: "Statutory Sick Pay and fit note obligations apply during any mental health absence — follow the fit note's recommendations to avoid Equality Act exposure",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "National Health Insurance Act 2022:",
                text: "Employers above a certain threshold must provide health insurance — mental health treatment should be covered; check plan scope",
              },
              {
                icon: "⚖️",
                strongLabel: "Employees' Compensation Act 2010:",
                text: "Work-related mental health conditions (stress, workplace trauma) may be compensable — document all employer support actions",
              },
              {
                icon: "⚖️",
                strongLabel: "Labour Act Cap L1:",
                text: "Employees cannot be dismissed for reasons related to illness without fair process — mental health conditions must be handled with documented support before any disciplinary or capability action",
              },
              {
                icon: "⚖️",
                strongLabel: "Cultural context:",
                text: "Mental health stigma remains significant in many Nigerian workplaces — HR must lead sensitively and create psychological safety before employees will disclose; written confidentiality commitments help",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "ADA (Americans with Disabilities Act):",
                text: "Mental health conditions qualifying as disabilities require reasonable accommodation — interactive process obligation applies; employers must engage in good-faith dialogue",
              },
              {
                icon: "⚖️",
                strongLabel: "FMLA (Family and Medical Leave Act):",
                text: "Eligible employees (12+ months service, 50+ employee companies) may take up to 12 weeks unpaid leave for serious mental health conditions",
              },
              {
                icon: "⚖️",
                strongLabel: "HIPAA:",
                text: "Employee health information from EAP, occupational health, or medical leave must be kept strictly confidential and separate from standard HR files",
              },
              {
                icon: "⚖️",
                strongLabel: "State laws:",
                text: "California (FEHA), New York (NYCHRL), and others provide broader protections than ADA — check state-specific reasonable accommodation obligations",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Work Injury Compensation Act (WICA):",
                text: "Work-related mental health conditions (occupational stress, trauma) may be compensable — document employer support measures",
              },
              {
                icon: "⚖️",
                strongLabel: "WSH Act (Workplace Safety and Health):",
                text: "Employers have a duty to manage psychosocial risks at work — MOM's guidelines on managing mental well-being in the workplace apply",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Tripartite Advisory on Mental Well-Being at Workplaces (2020):",
                text: "Recommends a structured approach including risk assessment, intervention, and support — voluntary but increasingly expected",
              },
              {
                icon: "⚖️",
                strongLabel: "PDPA:",
                text: "Mental health disclosures are sensitive personal data — access must be restricted, storage must be secure, and purpose must be disclosed to the employee",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "Law on the Protection of Rights and Interests of Women / Disabled Persons Protection Law:",
                text: "Mental health conditions qualifying as disabilities attract legal protections — dismissal without accommodation process creates significant legal risk",
              },
              {
                icon: "⚖️",
                strongLabel: "Labour Contract Law:",
                text: "Employees on medical leave (病假/医疗期) have statutory protection periods based on service length — cannot be dismissed during 医疗期 (medical treatment period)",
              },
              {
                icon: "⚖️",
                strongLabel: "Medical treatment period (医疗期):",
                text: "Ranges from 3 to 24 months depending on service length — employers must pay sick leave wages during this period per local regulations",
              },
              {
                icon: "⚖️",
                strongLabel: "Work-related mental injury:",
                text: "If mental health condition is attributable to workplace causes, it may qualify as a work-related injury under the Work Injury Insurance Regulations — specialist legal advice required",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Disability Discrimination Ordinance (DDO):",
                text: "Mental illness is a protected disability under the DDO — employers must make reasonable accommodation and cannot dismiss or disadvantage an employee because of mental illness",
              },
              {
                icon: "⚖️",
                strongLabel: "Occupational Safety and Health Ordinance:",
                text: "Employers have a duty to ensure the safety and health (including mental health) of employees at work — psychosocial risk management is expected",
              },
              {
                icon: "⚖️",
                strongLabel: "Sick leave under Employment Ordinance:",
                text: "Employees are entitled to paid sickness allowance after 1 month of service (4 days per month for first 24 months) — ensure compliance during mental health absence",
              },
              {
                icon: "⚖️",
                strongLabel: "PDPO:",
                text: "Mental health information is sensitive personal data — purpose limitation and data security obligations are heightened",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Conduct initial wellbeing check-in",
            "Implement and review agreed adjustments",
            "Maintain regular check-ins",
            "Notify HR when a disclosure is made",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on Equality Act obligations and reasonable adjustments",
            "Commission occupational health referral if needed",
            "Advise on any performance action and ensure adjustments are in place first",
            "Maintain secure records of disclosures and adjustments",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The employee expresses thoughts of self-harm or suicide — do not leave them alone, contact HR and/or occupational health immediately, and ensure they are safe before the conversation ends",
          "The employee's condition appears to be deteriorating despite adjustments — escalate to occupational health for clinical assessment rather than continuing to manage informally",
          "You are unsure whether a performance concern is linked to a mental health condition — stop any formal process and seek HR and occupational health advice before proceeding",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — MENTAL HEALTH SUPPORT CHECKLIST||DISCLOSURE & INITIAL RESPONSE|[ ] Private, unhurried conversation held|[ ] Listened fully before offering solutions or referrals|[ ] Thanked the employee for sharing and acknowledged the difficulty|[ ] Asked what support they need rather than assuming||LEGAL & REASONABLE ADJUSTMENTS|[ ] Assessed whether condition may constitute disability under Equality Act|[ ] HR consulted on reasonable adjustment obligations|[ ] Reasonable adjustments identified, agreed, and documented|[ ] Review date for adjustments diarised||SUPPORT ACTIONS|[ ] EAP / occupational health signposted (with employee consent)|[ ] Check-in rhythm agreed and diarised|[ ] Disclosure kept strictly confidential||PERFORMANCE CONCERNS (if applicable)|[ ] HR consulted before initiating any formal process|[ ] Occupational health assessment obtained|[ ] Reasonable adjustments reviewed and in place||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "ab1",
    catClass: "cat-amber",
    dataTitle: "managing absence and return to work",
    dataCat: "ab1",
    dataSearch:
      "managing absence and return to work absence management a practical guide to managing short-term and long-term absence fairly, legally, and consistently — including return-to-work interviews, fit notes, phased returns, and the trigger points that require formal action.",
    icon: "🏥",
    catBadge: "Absence Management",
    title: "Managing Absence and Return to Work",
    summary:
      "A practical guide to managing short-term and long-term absence fairly, legally, and consistently — including return-to-work interviews, fit notes, phased returns, and the trigger points that require formal action.",
    pills: [
      "Short-term absence",
      "Long-term absence",
      "Phased return",
      "Fit notes",
      "Trigger points",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Establish clear absence reporting expectations",
            desc: "Every employee should know: who to contact, by when, and how, on each day of absence. This is not bureaucracy — it is the foundation of consistent, fair absence management. Communicate the process at induction and refresh it annually.",
          },
          {
            n: 2,
            title:
              "Conduct a return-to-work interview for every absence",
            desc: "A return-to-work interview is a brief (10–15 minute), informal, private conversation held on the first day back, regardless of absence length. It signals that absences are noticed, provides an opportunity to surface underlying issues, and is one of the most effective absence management tools available. Ask: 'How are you feeling? Is there anything work-related that contributed to your absence? Is there anything we can do to support you?'",
          },
          {
            n: 3,
            title: "Monitor for short-term absence patterns",
            desc: "Track absence frequency and duration by employee. Common triggers for formal review: Bradford Factor score threshold, three or more separate absences in a rolling 12-month period, or a pattern of specific days (always Monday/Friday). Patterns do not automatically mean abuse — they may indicate an underlying condition. Investigate before assuming.",
          },
          {
            n: 4,
            title: "Manage long-term absence proactively",
            desc: "For absences exceeding four weeks, maintain regular (fortnightly) contact with the employee — not to pressure return, but to stay connected, provide support, and gather information needed for planning. Commission an occupational health assessment at 4–6 weeks to advise on prognosis, likely return date, and recommended adjustments.",
          },
          {
            n: 5,
            title: "Obtain and act on fit notes",
            desc: "A fit note from a GP certifies either that the employee is not fit for any work, or that they may be fit for some work with adjustments. When a fit note specifies adjusted duties, HR and manager must consider these seriously — refusing to accommodate fit note recommendations without a valid reason creates legal risk.",
          },
          {
            n: 6,
            title: "Design and implement phased return",
            desc: "A phased return allows an employee to return gradually — starting on reduced hours, lighter duties, or fewer days, building up over an agreed period. It must be documented: what hours/duties will be worked each week, the planned build-up, and the expected full-return date. Review at each phase point.",
          },
          {
            n: 7,
            title:
              "Hold a formal absence management meeting when triggers are met",
            desc: "When absence triggers are met, a formal (but not disciplinary) absence management meeting should be held. The purpose: to understand the reasons for absence, explore what support the organization can provide, and agree a way forward. The tone is supportive, not accusatory.",
          },
          {
            n: 8,
            title:
              "Take formal action only when all support has been exhausted",
            desc: "Dismissal for ill-health capability is legally possible but must follow a fair process: sufficient warnings, consideration of reasonable adjustments, medical evidence, and a genuine belief that the employment relationship cannot be sustained. Always seek HR and legal advice before capability dismissal.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Return-to-work interview opener",
            text: '"Welcome back — it\'s good to see you. I just wanted to have a quick chat to make sure you\'re feeling okay and to check whether there\'s anything work-related we should be aware of or anything we can do to support you."',
            note: "Keep it conversational. It is not an interrogation.",
          },
          {
            label: "Requesting an occupational health referral",
            text: '"Given the length of your absence, I\'d like to refer you to our occupational health provider — they can give us some independent advice on how best to support your return and what adjustments might be helpful. You\'ll receive a copy of any report they produce."',
            note: "Always explain the purpose and confirm the employee will see the report.",
          },
          {
            label: "Explaining a phased return",
            text: '"We\'d like to support you back to work gradually. We\'re proposing [specific hours/days] for the first two weeks, building up to full hours by [date]. We\'ll review at each stage and adjust if needed."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Hold a return-to-work interview for every absence",
          "Document all absence conversations and agreements",
          "Commission occupational health at 4–6 weeks of long-term absence",
          "Review and act on fit note recommendations",
        ],
        dont: [
          "Assume absence patterns mean misconduct without investigation",
          "Contact employees on sick leave too frequently or pressure early return",
          "Skip return-to-work interviews for 'short' or 'familiar' absences",
          "Ignore fit note recommendations — this creates Equality Act risk",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Statutory Sick Pay (SSP):",
                text: "Payable from day 4 of absence for employees above the lower earnings limit (currently £123/week) — currently £116.75/week for up to 28 weeks",
              },
              {
                icon: "⚖️",
                strongLabel: "Fit notes:",
                text: "Required after 7 calendar days — GP can certify 'not fit for work' or 'may be fit for work with adjustments.' Fit note recommendations must be considered seriously",
              },
              {
                icon: "⚖️",
                strongLabel: "Equality Act:",
                text: "Long-term conditions (likely to last 12+ months) may be disabilities — reasonable adjustments required before any capability action; failure to adjust is unlawful discrimination",
              },
              {
                icon: "⚖️",
                strongLabel: "ACAS guidance:",
                text: "Capability dismissal for ill-health requires: medical evidence, reasonable adjustments explored, genuine consultation, and adequate warning. Consult ACAS Code before any dismissal",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Act Cap L1:",
                text: "Employees are entitled to sick leave (typically 12 days per year on full pay under the Act — contracts may provide more). Check contract terms and applicable collective agreements",
              },
              {
                icon: "⚖️",
                strongLabel: "Employees' Compensation Act (ECA) 2010:",
                text: "Work-related illness and injury is covered — employer must report qualifying injuries within 7 days to the Nigeria Social Insurance Trust Fund (NSITF)",
              },
              {
                icon: "⚖️",
                strongLabel: "Termination for ill-health:",
                text: "Nigerian courts expect employers to demonstrate adequate medical evidence, consultation, and that the employee cannot be reasonably redeployed before dismissal for incapacity",
              },
              {
                icon: "⚖️",
                strongLabel: "Collective agreements:",
                text: "Many Nigerian sectors have collective bargaining agreements (especially oil & gas, banking, manufacturing) — check whether enhanced sick leave or absence procedures apply",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "FMLA:",
                text: "Eligible employees may take 12 weeks' unpaid protected leave per year for serious health conditions — employer must provide FMLA notice within 5 business days of becoming aware of qualifying absence",
              },
              {
                icon: "⚖️",
                strongLabel: "ADA:",
                text: "Leave itself may be a reasonable accommodation even after FMLA is exhausted — interactive process obligation continues; indefinite leave is generally not required but additional leave often is",
              },
              {
                icon: "⚖️",
                strongLabel: "State paid leave laws:",
                text: "California, New York, New Jersey, Washington, Connecticut, Massachusetts, and others have state-mandated paid sick leave / family leave — check state requirements",
              },
              {
                icon: "⚖️",
                strongLabel: "Workers' Compensation:",
                text: "Work-related injuries require workers' comp claim processing — keep absence management and workers' comp processes clearly separate",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Employment Act sick leave entitlement:",
                text: "Employees with 3+ months' service: 14 days outpatient sick leave and 60 days hospitalisation leave per year (inclusive). Paid if employee has been with employer 3+ months",
              },
              {
                icon: "⚖️",
                strongLabel: "Work Injury Compensation Act (WICA):",
                text: "Work-related injuries and occupational diseases require WICA claim — report to MOM within 10 days for injuries resulting in incapacity >3 days or hospitalisation",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Tripartite guidelines on managing excess manpower:",
                text: "Retrenchment (including for incapacity) must follow MOM/TAFEP advisory guidelines — consultation and redeployment consideration expected",
              },
              {
                icon: "⚖️",
                strongLabel: "Termination during illness:",
                text: "Cannot terminate solely because employee is on sick leave — must be able to demonstrate genuine operational reason beyond the absence itself",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Medical treatment period (医疗期):",
                text: "Statutory protection period during which employee cannot be dismissed — length varies from 3 to 24 months based on continuous service. Local regulations add further specificity",
              },
              {
                icon: "⚖️",
                strongLabel: "Sick leave pay:",
                text: "Employees on sick leave are entitled to sick leave wages (病假工资) — minimum 80% of local minimum wage in most regions during 医疗期; check local regulations",
              },
              {
                icon: "⚖️",
                strongLabel: "Post-medical period:",
                text: "After 医疗期 expires, if employee cannot return to original or adjusted role, employer may terminate with 30 days' notice or payment in lieu — requires documented capability assessment",
              },
              {
                icon: "⚖️",
                strongLabel: "Work injury (工伤):",
                text: "Injuries arising from work are covered by Work Injury Insurance — separate from non-occupational illness. Employer must report to local authorities within 30 days",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Employment Ordinance sick leave:",
                text: "After 1 month's service: 2 paid sickness days per month (first 24 months), then 4 per month (capped at 120 days). Payable at 4/5 of daily wages",
              },
              {
                icon: "⚖️",
                strongLabel: "Medical certificate requirement:",
                text: "Employer can require medical certificate for absences of 2+ consecutive days — cannot require it for single-day absences under the Ordinance",
              },
              {
                icon: "⚖️",
                strongLabel: "Prohibition on dismissal during sick leave:",
                text: "Cannot dismiss an employee on a day when they are on paid sick leave — to do so treats the dismissal as invalid under the Employment Ordinance",
              },
              {
                icon: "⚖️",
                strongLabel: "Employees' Compensation Ordinance:",
                text: "Work-related injuries must be reported to the Labour Department within 14 days — compensation is payable regardless of employer fault",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Conduct return-to-work interviews",
            "Maintain regular contact during long-term absence",
            "Implement adjustments agreed with occupational health",
            "Monitor and flag when triggers are met",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on process and legal obligations",
            "Commission occupational health referral",
            "Attend formal absence management meetings",
            "Advise on capability process if required",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "Absence is linked to a workplace dispute, grievance, or stress claim — manage through a separate process; do not treat as straightforward ill-health absence",
          "Occupational health advises that the employee is unlikely to return to their current role within a reasonable timeframe — capability process should be considered with full HR and legal input",
          "The employee raises a disability or Equality Act concern during absence management — pause the process and seek HR and legal advice before any further steps",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — ABSENCE MANAGEMENT CHECKLIST||SHORT-TERM ABSENCE|[ ] Absence reporting process communicated clearly|[ ] Return-to-work interview conducted on first day back|[ ] Absence recorded accurately|[ ] Pattern monitoring in place (Bradford Factor or equivalent)||LONG-TERM ABSENCE (4+ WEEKS)|[ ] Fortnightly welfare contact maintained|[ ] Occupational health referral commissioned at 4–6 weeks|[ ] Employee notified they will receive copy of OH report|[ ] Fit note recommendations reviewed and acted on||PHASED RETURN|[ ] Written phased return plan agreed and documented|[ ] Hours, duties, and build-up timeline specified|[ ] Review points diarised|[ ] Adjustments confirmed with payroll||FORMAL PROCESS|[ ] Absence trigger met and documented|[ ] Formal absence management meeting held|[ ] Minutes and agreed actions recorded|[ ] HR advised if capability process may be required||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "rd1",
    catClass: "cat-red",
    dataTitle: "handling a redundancy process",
    dataCat: "rd1",
    dataSearch:
      "handling a redundancy process employment law a step-by-step guide to running a legally compliant, fair, and humane redundancy process — including pooling, selection criteria, collective consultation obligations, notice, redundancy pay, and the conversations that matter most.",
    icon: "📦",
    catBadge: "Employment Law",
    title: "Handling a Redundancy Process",
    summary:
      "A step-by-step guide to running a legally compliant, fair, and humane redundancy process — including pooling, selection criteria, collective consultation obligations, notice, redundancy pay, and the conversations that matter most.",
    pills: [
      "Collective consultation",
      "Selection criteria",
      "Statutory redundancy pay",
      "Notice periods",
      "Right to appeal",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Establish a genuine redundancy situation",
            desc: "Redundancy is legally defined: the business is closing, a workplace is closing, or the requirement for work of a particular kind has diminished. Redundancy must be genuine — using it to remove an unwanted employee without a real business reason is unfair dismissal and creates significant tribunal risk.",
          },
          {
            n: 2,
            title: "Determine collective consultation obligations",
            desc: "If 20 or more redundancies are proposed within 90 days at one establishment: 30-day minimum consultation period (100+ redundancies = 45 days). Notify the Secretary of State via HR1 form before consultation begins. Failure to comply creates automatic awards of up to 90 days' pay per employee at tribunal.",
          },
          {
            n: 3,
            title: "Define the pooling and selection criteria",
            desc: "Identify which roles are at risk — the redundancy pool. Apply objective, measurable, non-discriminatory selection criteria: skills and qualifications relevant to future needs, performance record, attendance, disciplinary record. Never use protected characteristics, pregnancy, or trade union activity as criteria. Document every scoring decision.",
          },
          {
            n: 4,
            title: "Hold individual 'at risk' consultation meetings",
            desc: "Each employee at risk must be individually consulted — informed of the risk, the selection criteria, their provisional score, and given a genuine opportunity to propose alternatives (reduced hours, redeployment, voluntary redundancy). Consultation must be meaningful, not a formality.",
          },
          {
            n: 5,
            title: "Explore suitable alternative employment",
            desc: "Before confirming any redundancy, genuinely search for and offer any suitable alternative employment across the organization. If a suitable role is offered and unreasonably refused, the employee may lose their statutory redundancy pay entitlement. Document all alternatives offered and the employee's response.",
          },
          {
            n: 6,
            title: "Confirm redundancy in writing",
            desc: "Once the process is complete, issue a written notice of redundancy confirming: the reason, notice period, redundancy pay calculation, right of appeal, and final working day. Redundancy letters must be clear, factual, and treated with the dignity the situation deserves.",
          },
          {
            n: 7,
            title: "Calculate and pay statutory redundancy pay",
            desc: "Employees with 2+ years' continuous employment are entitled to statutory redundancy pay calculated by: age × years of service × weekly pay (capped at current weekly pay limit). Pay on or before the last day of employment. Check whether your organization has an enhanced scheme.",
          },
          {
            n: 8,
            title: "Hold exit and support conversations",
            desc: "The final days matter as much as the process. Offer outplacement support, reference letters, extended access to EAP, and a genuine conversation about what the organization can do to support the transition. How employees experience the end of employment is what they tell others.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Opening the 'at risk' meeting",
            text: '"I need to share some difficult news with you today. [Explain business reason.] As a result, your role is at risk of redundancy. I want to be clear — this is not a decision that has been made. It is the start of a consultation process and your input matters."',
          },
          {
            label: "Explaining the selection process",
            text: '"We\'ve identified a pool of roles for consideration. We\'ll be using the following criteria to assess suitability for any available roles: [criteria]. I\'ll share your provisional scores with you and you\'ll have the opportunity to respond before any decisions are made."',
          },
          {
            label: "Confirming redundancy",
            text: '"I need to confirm today that unfortunately your role has been made redundant. I want to say how much we value everything you have contributed. Your notice period begins today, and we will provide [support details]. You have the right to appeal this decision within [timeframe]."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Establish a genuine business reason before beginning the process",
          "Consult meaningfully — not as a formality after a decision is made",
          "Apply objective, documented selection criteria",
          "Offer and document all suitable alternative employment",
          "Pay correct statutory or enhanced redundancy pay",
        ],
        dont: [
          "Select for redundancy based on subjective criteria or personal preference",
          "Use redundancy to manage out a poor performer — this is unfair dismissal",
          "Forget collective consultation obligations for 20+ redundancies",
          "Ignore the HR1 notification requirement",
          "Skip the individual consultation meetings, even for small redundancies",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Collective consultation:",
                text: "20–99 redundancies in 90 days = min 30-day consultation; 100+ = min 45 days. Elect employee reps. File HR1 with BEIS before consultation starts",
              },
              {
                icon: "⚖️",
                strongLabel: "Statutory Redundancy Pay:",
                text: "2+ years' service. Age 22–40: 1 week per year; under 22: 0.5 week; 41+: 1.5 weeks. Weekly pay capped at current limit (£643 in 2024/25). Max 20 years",
              },
              {
                icon: "⚖️",
                strongLabel: "Selection criteria:",
                text: "Must be objective and non-discriminatory. Cannot use pregnancy, maternity, trade union activity, or whistleblowing as criteria — automatic unfair dismissal if applied",
              },
              {
                icon: "⚖️",
                strongLabel: "TUPE:",
                text: "If the business or function is transferring, TUPE Regulations 2006 may apply — redundancy in connection with a transfer is automatically unfair unless an ETO reason exists",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Act Cap L1:",
                text: "Minimum one month notice (or payment in lieu) required for monthly-paid employees. Contracts may provide more — check and comply with the higher standard",
              },
              {
                icon: "⚖️",
                strongLabel: "Retrenchment procedures:",
                text: "Federal Ministry of Labour guidelines require employers to notify the Ministry before implementing mass retrenchments, and to engage with trade unions where they exist",
              },
              {
                icon: "⚖️",
                strongLabel: "Last-in-first-out (LIFO):",
                text: "Nigerian courts have generally upheld LIFO as the expected selection method in the absence of a written and communicated alternative — departing from LIFO requires documented justification",
              },
              {
                icon: "⚖️",
                strongLabel: "Terminal benefits:",
                text: "Beyond statutory notice, the National Industrial Court has increasingly awarded gratuity and other terminal benefits — review contracts and collective agreements carefully before calculating final payments",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "WARN Act (Worker Adjustment and Retraining Notification Act):",
                text: "100+ employees: 60 days' advance notice required for plant closings or mass layoffs affecting 50+ employees. State mini-WARN laws may apply at lower thresholds",
              },
              {
                icon: "⚖️",
                strongLabel: "No statutory severance:",
                text: "The US has no federal statutory redundancy/severance pay. Severance is contractual — check employment agreements, offer letters, and severance plans",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "ADEA (Age Discrimination in Employment Act):",
                text: "Layoff selection disproportionately impacting employees aged 40+ creates ADEA exposure — adverse impact analysis is essential before selection decisions are finalised",
              },
              {
                icon: "⚖️",
                strongLabel: "COBRA:",
                text: "Employees losing health coverage due to redundancy must be offered COBRA continuation coverage — notice must be issued within 14 days of the qualifying event",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Retrenchment notification:",
                text: "Employers with 10+ employees must notify MOM of any retrenchment of 5 or more employees within 5 working days — via the MOM online portal",
              },
              {
                icon: "⚖️",
                strongLabel: "Retrenchment benefit:",
                text: "No statutory minimum, but Tripartite Advisory recommends 2 weeks per year of service (minimum) for employees with 2+ years' service — deviating below this without justification attracts MOM scrutiny",
              },
              {
                icon: "⚖️",
                strongLabel: "Fair consideration framework:",
                text: "All retrenchments should consider redeployment first — MOM expects evidence of genuine consideration of alternatives before headcount reduction",
              },
              {
                icon: "⚖️",
                strongLabel: "Re-employment obligation:",
                text: "For employees aged 63–68 who would otherwise reach retirement, employer must offer re-employment before any retrenchment decision — Retirement and Re-employment Act applies",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Economic redundancy (经济性裁员):",
                text: "Redundancy of 20+ employees or 10%+ of workforce requires: 30-day consultation with trade union or all employees, report to local labour authority, and severance pay",
              },
              {
                icon: "⚖️",
                strongLabel: "Statutory severance (经济补偿金):",
                text: "1 month's salary per year of service (half month for service under 6 months) — salary capped at 3× local average monthly wage for those earning above this threshold",
              },
              {
                icon: "⚖️",
                strongLabel: "Protected employees:",
                text: "Cannot be included in economic redundancy: employees on 医疗期, pregnant/nursing/maternity leave employees, those with 15+ years' service and within 5 years of retirement — requires separate legal process",
              },
              {
                icon: "⚖️",
                strongLabel: "Labour Union:",
                text: "Must notify and consult the enterprise trade union (or employee representatives) before economic redundancy — failure to do so invalidates the dismissal",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Severance payment (Employment Ordinance):",
                text: "Employees with 24+ months' continuous service dismissed by reason of redundancy are entitled to severance pay — 2/3 of last month's wages per year of service, capped at HKD 390,000 total",
              },
              {
                icon: "⚖️",
                strongLabel: "Long service payment:",
                text: "Employees with 5+ years' service who leave (not by misconduct or resignation without good reason) may be entitled to long service payment — offsets against severance payment",
              },
              {
                icon: "⚖️",
                strongLabel: "Notice / payment in lieu:",
                text: "Contractual notice or PILON required — cannot use accrued annual leave to cover notice period without agreement",
              },
              {
                icon: "⚖️",
                strongLabel: "No collective consultation law:",
                text: "Hong Kong does not have statutory collective consultation requirements — but best practice and reputational considerations suggest proactive communication with employee representatives",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Communicate business rationale to the team",
            "Conduct individual consultation meetings with HR support",
            "Explore redeployment opportunities within their remit",
            "Support employees through the process with empathy",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Design and own the legal process",
            "Ensure collective consultation obligations are met",
            "Calculate and verify redundancy pay",
            "Draft and review all formal written communications",
            "Advise on selection criteria and scoring",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "An employee at risk is pregnant, on maternity leave, or has recently raised a grievance or whistleblowing concern — enhanced protections apply and specialist HR/legal advice is needed before proceeding",
          "An employee challenges their selection score or the fairness of the pool — pause the process, review the scoring with HR, and respond formally before proceeding",
          "The number of proposed redundancies reaches 20+ in a 90-day period and collective consultation has not been set up — stop all individual consultations and seek urgent legal advice",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — REDUNDANCY PROCESS CHECKLIST||PRE-PROCESS|[ ] Genuine business reason established and documented|[ ] Number of redundancies confirmed|[ ] Collective consultation obligations assessed (20+ = notify BEIS, elect reps)|[ ] HR1 filed if 20+ redundancies||POOLING & SELECTION|[ ] Redundancy pool defined and documented|[ ] Selection criteria agreed: objective, measurable, non-discriminatory|[ ] Criteria scored and documented for each at-risk employee|[ ] Scores reviewed for any disparate impact on protected groups||CONSULTATION|[ ] Individual 'at risk' letters issued|[ ] Individual consultation meetings held (minimum two)|[ ] Selection scores shared with employees|[ ] Employee responses considered and recorded|[ ] Suitable alternative employment searched for and documented||CONFIRMATION|[ ] Redundancy confirmation letter issued|[ ] Statutory redundancy pay calculated and confirmed|[ ] Notice period confirmed (worked or paid in lieu)|[ ] Right of appeal included in letter|[ ] Appeal deadline and process confirmed||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "ob1",
    catClass: "cat-green",
    dataTitle: "onboarding a new employee",
    dataCat: "ob1",
    dataSearch:
      "onboarding a new employee talent management a structured guide to running a great onboarding experience — from pre-boarding through to 90 days — covering what to prepare before day 1, how to structure the first week, and the check-ins that prevent early exit.",
    icon: "🧱",
    catBadge: "Talent Management",
    title: "Onboarding a New Employee",
    summary:
      "A structured guide to running a great onboarding experience — from pre-boarding through to 90 days — covering what to prepare before Day 1, how to structure the first week, and the check-ins that prevent early exit.",
    pills: [
      "Pre-boarding",
      "Day 1",
      "30/60/90 days",
      "Buddy system",
      "Early retention",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Pre-boarding: prepare before Day 1",
            desc: "Send a welcome email within 48 hours of offer acceptance — introduce yourself, explain what to expect on Day 1, and confirm logistics. Ensure IT access is provisioned before Day 1 (not on the day). Share any reading materials, org charts, or team intros in advance. A new hire who arrives to find their laptop isn't set up has already had their first negative experience.",
          },
          {
            n: 2,
            title: "Day 1: belonging before information",
            desc: "Day 1 should create connection, not overwhelm. Introduce the new hire to the team personally. Ensure the manager (not a receptionist) greets them. Have their workspace ready. Share the plan for the first week. Do not spend Day 1 delivering HR information overload — spread compliance training over the first two weeks.",
          },
          {
            n: 3,
            title: "First week: role clarity and first wins",
            desc: "By the end of week one, the new hire should understand: who they report to and how they prefer to communicate, what their first 30 days should produce, who the key relationships in their role are, and where to go when they need help. Assign a first small task they can complete successfully within days — early wins build confidence and belonging.",
          },
          {
            n: 4,
            title: "Assign a buddy",
            desc: "A buddy is a peer (not their manager) who is available for informal questions, cultural orientation, and social connection. A good buddy answers the questions a new hire would never ask their manager. Brief the buddy on what the role involves and check in with both parties at the two-week mark.",
          },
          {
            n: 5,
            title: "30-day check-in with manager and HR",
            desc: "At 30 days: structured conversation covering how the role matches expectations, what has gone well, what is unclear or difficult, and whether any adjustments are needed. This is not a performance review — it is a support and retention conversation. Identify and address any concerns before they become reasons to leave.",
          },
          {
            n: 6,
            title: "60-day development conversation",
            desc: "At 60 days: transition from settling-in to growing. Discuss how the new hire wants to develop, what opportunities exist, and what their goals are for the remainder of probation. This conversation signals that the organization is invested in their future, not just their immediate output.",
          },
          {
            n: 7,
            title: "90-day review: probation decision",
            desc: "A structured review of performance against the expectations set at the start of the probation period. The outcome should not be a surprise — if concerns exist, they should have been raised and addressed during the 30 and 60-day conversations. Probation can be extended with valid reason and proper communication.",
          },
          {
            n: 8,
            title: "Confirm employment or manage probation exit",
            desc: "If confirming: issue a written confirmation letter. If ending employment during probation: follow a fair process — at least one formal meeting, written confirmation, and a notice period (contractual or statutory). Even during probation, dismissal for discriminatory reasons is unlawful from day one of employment.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Pre-boarding welcome email subject and opener",
            text: '"Subject: We\'re looking forward to welcoming you on [date] — Body: I wanted to reach out personally to say how excited we are to have you joining us. Here\'s what to expect on your first day…"',
          },
          {
            label: "Buddy introduction",
            text: '"I\'d like to introduce you to [Name] — they\'ve offered to be your go-to person for the first few months. No question is too small. Think of them as your unofficial guide to how things actually work around here."',
          },
          {
            label: "30-day check-in opener",
            text: '"Now that you\'ve had a chance to settle in, I wanted to check in properly. How are you finding things? What\'s clicked, and what\'s felt unclear or tricky? And is there anything we could do differently to support you?"',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Ensure IT access and workspace are ready before Day 1",
          "Have the manager personally greet the new hire",
          "Spread compliance training over the first two weeks",
          "Schedule 30/60/90 check-ins before Day 1",
          "Assign a buddy in advance, not on the day",
        ],
        dont: [
          "Overwhelm Day 1 with information and HR paperwork",
          "Assume the new hire will ask if they need help — they often won't",
          "Leave the 30-day check-in until week six",
          "Treat probation review as the first time concerns are raised",
          "Forget that Equality Act protections apply from day one",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Right to work checks:",
                text: "Mandatory before first day under the Immigration, Asylum and Nationality Act 2006 — retain copies. Civil penalty up to £60,000 per illegal worker",
              },
              {
                icon: "📋",
                strongLabel: "Written statement of terms:",
                text: "Must be issued on or before Day 1 under ERA 1996 — covers pay, hours, holiday, notice, job title, and place of work",
              },
              {
                icon: "📋",
                strongLabel: "Equality Act from Day 1:",
                text: "Discrimination and harassment protections apply from the first moment of employment — probation does not postpone Equality Act coverage",
              },
              {
                icon: "📋",
                strongLabel: "National Minimum Wage:",
                text: "Applies from first day — confirm correct rate for age band and ensure payroll reflects any recent NLW/NMW uprating",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Labour Act / contract of employment:",
                text: "Written terms must be provided within 3 months of start — good practice is to issue on Day 1. Must cover: wages, hours, leave entitlement, notice periods",
              },
              {
                icon: "📋",
                strongLabel: "ITF (Industrial Training Fund):",
                text: "Employers with 5+ employees or annual payroll above the threshold must register and contribute to ITF — new hires increase headcount obligations",
              },
              {
                icon: "📋",
                strongLabel: "NSITF (Nigeria Social Insurance Trust Fund):",
                text: "Contributions required for all employees from the start of employment — register new hires promptly",
              },
              {
                icon: "📋",
                strongLabel: "Pension (Pension Reform Act 2014):",
                text: "Employer contribution of 10% and employee contribution of 8% of monthly emolument from first day of employment — register with a licensed PFA promptly",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "📋",
                strongLabel:
                  "Form I-9 (Employment Eligibility Verification):",
                text: "Must be completed by Day 1 (employee section) and by Day 3 (employer section) — retain for 3 years from hire date or 1 year after separation, whichever is later",
              },
              {
                icon: "📋",
                strongLabel: "W-4 / state tax forms:",
                text: "Must be completed on or before Day 1 for payroll tax withholding — update if employee circumstances change",
              },
              {
                icon: "📋",
                strongLabel: "New hire reporting:",
                text: "Federal and state law requires employers to report new hires to the state's new hire directory within 20 days — links to child support enforcement",
              },
              {
                icon: "📋",
                strongLabel: "Benefits notices:",
                text: "ERISA requires summary plan descriptions to be provided within 90 days of eligibility; ACA marketplace notice required within 14 days of hire",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Employment Act coverage:",
                text: "Confirm whether the new hire is covered by the Employment Act (employees earning up to SGD 4,500/month for core provisions) — different provisions apply to managers and executives",
              },
              {
                icon: "📋",
                strongLabel: "CPF (Central Provident Fund):",
                text: "Employer contributions for Singapore citizens and PRs begin from the first month of employment — register and set up payroll correctly on Day 1",
              },
              {
                icon: "📋",
                strongLabel: "Work pass compliance:",
                text: "For foreign employees, verify and retain copies of valid work pass (EP/SP/WP) — report any changes in employment terms to MOM within 7 days",
              },
              {
                icon: "📋",
                strongLabel: "PDPA consent:",
                text: "Collect employee personal data only for legitimate HR purposes — obtain consent at onboarding for data collection, use, and disclosure purposes",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Labour Contract Law:",
                text: "Written labour contract must be signed within 1 month of commencement — failure to sign triggers double wages liability from month 2. Fixed-term, open-term, and project-based contracts have different legal implications",
              },
              {
                icon: "📋",
                strongLabel: "Probation period limits:",
                text: "Probation cannot exceed: 1 month (contract <1 year), 2 months (1–3 years), 6 months (3+ years). Cannot have multiple probation periods under one contract",
              },
              {
                icon: "📋",
                strongLabel: "Social insurance and housing fund:",
                text: "Register new employees with social insurance (养老/医疗/失业/工伤/生育) and housing provident fund (住房公积金) from first month — employer and employee contributions required",
              },
              {
                icon: "📋",
                strongLabel: "Confidentiality / non-compete:",
                text: "Must be agreed in writing and supported by separate financial compensation to be enforceable — include if applicable at onboarding stage",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "📋",
                strongLabel: "Employment Ordinance written terms:",
                text: "Terms of employment should be recorded in writing — while not all terms must be in writing, key terms (wages, hours, leave) should be documented to avoid disputes",
              },
              {
                icon: "📋",
                strongLabel: "MPF (Mandatory Provident Fund):",
                text: "Employer must enrol employees in an MPF scheme within 60 days of joining — employer contributions of 5% (capped at HKD 1,500/month) from the first contribution period",
              },
              {
                icon: "📋",
                strongLabel: "PDPO compliance:",
                text: "Collect employee data only for lawful HR purposes — provide a Personal Information Collection Statement (PICS) at the time of collection explaining purpose and rights",
              },
              {
                icon: "📋",
                strongLabel: "Probation period:",
                text: "No statutory minimum probation length — but during probation, shorter notice periods may apply if specified in the contract. Equality protections still apply from Day 1",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Personally greet and welcome the new hire",
            "Set clear 30-day expectations in the first week",
            "Conduct 30/60/90 check-ins",
            "Raise and manage any performance concerns during probation",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Complete right-to-work checks before Day 1",
            "Ensure written statement of terms is issued on Day 1",
            "Coordinate IT access and logistics pre-boarding",
            "Support probation process and advise on any extension or exit",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The new hire discloses a disability, health condition, or pregnancy during onboarding — reasonable adjustment assessment and enhanced support should be initiated immediately",
          "Performance or conduct concerns arise during probation — document, address formally in a meeting, and seek HR advice before making any dismissal decision",
          "The new hire raises a concern about the role not matching what was described at interview — address this promptly; if substantiated, it may constitute a misrepresentation with legal implications",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — ONBOARDING CHECKLIST||PRE-BOARDING (BEFORE DAY 1)|[ ] Right to work documents checked and copied|[ ] Written statement of terms prepared|[ ] IT access and equipment provisioned|[ ] Workspace set up and ready|[ ] Welcome email sent within 48 hours of acceptance|[ ] Buddy identified and briefed|[ ] Day 1 plan confirmed with manager||DAY 1|[ ] Manager personally greets new hire|[ ] Team introductions made|[ ] Written statement of terms issued|[ ] Building/system access confirmed working|[ ] Day 1 and week 1 plan shared||FIRST 30 DAYS|[ ] Buddy check-in at 2 weeks|[ ] 30-day check-in scheduled and completed|[ ] Concerns identified and addressed|[ ] Compliance training completed||60 AND 90 DAYS|[ ] 60-day development conversation completed|[ ] 90-day probation review completed|[ ] Employment confirmed in writing OR extension/exit managed||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "pp1",
    catClass: "cat-amber",
    dataTitle: "managing poor performance",
    dataCat: "pp1",
    dataSearch:
      "managing poor performance performance management a structured, fair, and legally sound approach to addressing underperformance — from informal conversation through to formal capability process, pip design, and the documentation that protects both the employee and the organization.",
    icon: "📊",
    catBadge: "Performance Management",
    title: "Managing Poor Performance",
    summary:
      "A structured, fair, and legally sound approach to addressing underperformance — from informal conversation through to formal capability process, PIP design, and the documentation that protects both the employee and the organization.",
    pills: [
      "Informal stage",
      "Formal capability",
      "PIP design",
      "Documentation",
      "SMART goals",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Rule out external causes first",
            desc: "Before raising performance concerns formally, investigate whether the performance issue has an external cause: unclear expectations, inadequate training, personal circumstances, a health condition, team dynamics, or management factors. A PIP issued without this investigation is not only unjust — it is legally vulnerable.",
          },
          {
            n: 2,
            title: "Start with an informal, clear conversation",
            desc: "Raise concerns early and informally — before they become formal. Be specific: 'The last three project reports have been submitted late and with incomplete sections. I want to understand what's happening and what we can do to get things back on track.' Clear, factual, and forward-looking.",
          },
          {
            n: 3,
            title: "Set clear, agreed SMART expectations",
            desc: "Whether informal or formal, performance must be measured against specific, agreed, achievable standards. 'You need to improve' is not a performance standard. 'All project reports submitted by the agreed deadline with sections 1–5 fully completed, for the next four weeks' is. Write it down and share it.",
          },
          {
            n: 4,
            title: "Provide support alongside expectations",
            desc: "Every performance expectation must be paired with support: additional training, a coach or buddy, increased check-in frequency, revised workload, or clearer briefings. Holding someone to a standard without providing the means to reach it is not performance management — it is set-up to fail.",
          },
          {
            n: 5,
            title: "Document all informal conversations",
            desc: "Even informal performance conversations must be documented with a brief factual record: date, what was discussed, what was agreed, and by when. This is not punitive — it creates clarity for both parties and protection for both parties if the situation escalates.",
          },
          {
            n: 6,
            title: "Move to formal capability if informal stage fails",
            desc: "If the informal stage does not produce improvement within a reasonable timescale, escalate to a formal capability meeting. Issue written invitation with at least 5 working days' notice, confirming: the concerns, the basis for the formal process, and the right to be accompanied.",
          },
          {
            n: 7,
            title: "Issue a formal Performance Improvement Plan (PIP)",
            desc: "A PIP is not a punishment — it is a structured support document. It must include: specific performance standards, the support being provided, a review timeline (typically 4–8 weeks), what improvement is required by when, and what the consequences of failure to improve are. PIPs must be realistic, not designed to fail.",
          },
          {
            n: 8,
            title: "Review and conclude the process",
            desc: "At the end of the PIP period: if performance has improved, confirm this in writing and close the process formally. If not, hold a formal outcome meeting and issue an appropriate sanction (written warning, final warning, or — at formal stage — capability dismissal). Always confirm a right of appeal.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Informal performance conversation opener",
            text: '"I want to talk about [specific area] because I\'ve noticed [specific observation] and I\'m concerned about [specific impact]. I want to understand your perspective on this and then we can agree together what would help get things on track."',
          },
          {
            label: "Issuing a formal PIP",
            text: '"I\'m sharing this Performance Improvement Plan with you today. I want to be clear that the purpose of this is to support you — it sets out exactly what we need to see and what we\'re going to provide to help you get there. I hope we don\'t need to go beyond this stage."',
          },
          {
            label: "Closing a successful PIP",
            text: '"I wanted to formally confirm that you\'ve met the standards set out in your improvement plan. The concerns that led to this process have been addressed and I\'m closing this formally today. Let\'s focus on building from here."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Investigate underlying causes before any formal action",
          "Set specific, written, agreed performance standards",
          "Pair every expectation with genuine support",
          "Document all conversations, even informal ones",
          "Allow a meaningful improvement period with regular check-ins",
        ],
        dont: [
          "Issue a PIP without any prior informal conversation",
          "Set standards that are impossible to meet within the timeframe",
          "Use performance management as a managed exit when the real issue is redundancy",
          "Forget to investigate whether a health condition may be relevant",
          "Dismiss without a formal process, even during probation",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Equality Act 2010:",
                text: "If a health condition may be contributing to the performance concern, assess reasonable adjustments before any formal step — failure to do so before a PIP is issued may constitute disability discrimination",
              },
              {
                icon: "⚖️",
                strongLabel: "Right to be accompanied:",
                text: "ERA 1996 s.10 — formal capability hearings are disciplinary/grievance hearings for this purpose; employee has the right to a companion",
              },
              {
                icon: "⚖️",
                strongLabel: "ACAS Code:",
                text: "Performance dismissal without following the Code (investigation, hearing, right to appeal, adequate improvement opportunity) increases unfair dismissal award by up to 25%",
              },
              {
                icon: "⚖️",
                strongLabel: "Qualifying period:",
                text: "Employees need 2 years' continuous service for unfair dismissal protection — but Equality Act and whistleblowing claims have no qualifying period; take care with all dismissals",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Act and common law:",
                text: "Employers must follow fair procedures before dismissal for performance — verbal warning, written warning, final written warning, and a hearing before dismissal is the expected sequence",
              },
              {
                icon: "⚖️",
                strongLabel: "National Industrial Court (NIC):",
                text: "The NIC has consistently held that dismissal without fair hearing violates constitutional right to fair hearing (Section 36 CFRN) — always hold a hearing before capability dismissal",
              },
              {
                icon: "⚖️",
                strongLabel: "Wrongful dismissal vs unfair dismissal:",
                text: "Nigeria's primary claim is wrongful dismissal (breach of contract) rather than the UK/US statutory unfair dismissal — check contractual disciplinary procedures and comply with them strictly",
              },
              {
                icon: "⚖️",
                strongLabel: "Documentation:",
                text: "Nigerian courts require clear evidence of communicated standards, warnings given, and opportunity to improve — verbal performance management unsupported by documents will not withstand challenge",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "At-will employment:",
                text: "Performance dismissal is generally permissible without a statutory process in at-will states — but PIPs and documented processes protect against discrimination and retaliation claims",
              },
              {
                icon: "⚖️",
                strongLabel: "ADA interactive process:",
                text: "If performance decline may relate to a disability, the interactive process for reasonable accommodation must be completed before or during a PIP — skipping it creates ADA exposure",
              },
              {
                icon: "⚖️",
                strongLabel: "WARN Act:",
                text: "If PIPs are being run as part of a larger reduction that affects 50+ employees, WARN Act notice obligations may be triggered — keep performance and RIF processes clearly separate",
              },
              {
                icon: "⚖️",
                strongLabel: "State protections:",
                text: "Implied contract states (California, Montana, others) may impose procedural requirements even for at-will employees — review employment contracts and handbooks carefully",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Employment Act / wrongful dismissal:",
                text: "Employees covered by the Act can claim wrongful dismissal if dismissed without just cause or excuse — performance dismissal must be supported by documented warnings and genuine improvement opportunity",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "MOM's Tripartite Guidelines on Wrongful Dismissal:",
                text: "Require employers to: inform the employee of the performance issue, give a reasonable opportunity to improve, and conduct a fair inquiry before dismissal",
              },
              {
                icon: "⚖️",
                strongLabel: "TAFEP guidelines:",
                text: "Performance management must be free from discrimination — ensure PIP criteria and scoring are applied consistently across all employees regardless of age, race, gender, or disability",
              },
              {
                icon: "⚖️",
                strongLabel: "Notice period:",
                text: "Even for performance dismissal, contractual notice or payment in lieu must be given — dismissal with immediate effect (unless gross misconduct) creates wrongful dismissal liability",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Contract Law Article 40:",
                text: "Employer may terminate with 30 days' notice (or 1 month PILON) if: employee is incompetent after training or position adjustment. Both elements must be proven — documented training, adjustment, and continued underperformance",
              },
              {
                icon: "⚖️",
                strongLabel: "Internal rules compliance:",
                text: "Dismissal for performance must be based on standards set out in the company's democratically approved rules and regulations — standards not in the rulebook cannot be used as grounds",
              },
              {
                icon: "⚖️",
                strongLabel: "Severance pay:",
                text: "Termination under Article 40 (incapacity) requires statutory severance payment — 1 month per year of service. Cannot waive this obligation",
              },
              {
                icon: "⚖️",
                strongLabel: "Protected employees:",
                text: "Employees on 医疗期, pregnant employees, and near-retirement employees (15+ years service, 5 years from retirement) cannot be dismissed for performance — alternative management required",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Employment Ordinance:",
                text: "Dismissal for performance without following a fair process may constitute wrongful or unreasonable dismissal — employee can claim remedies at the Labour Tribunal",
              },
              {
                icon: "⚖️",
                strongLabel: "Disability Discrimination Ordinance:",
                text: "If the performance concern relates to a disability, employer must demonstrate that reasonable accommodation was considered and provided before dismissal",
              },
              {
                icon: "⚖️",
                strongLabel: "Notice requirements:",
                text: "Minimum 1 month's notice (or PILON) required — or as specified in contract if longer. Cannot dismiss with immediate effect unless summary dismissal grounds (gross misconduct) are met",
              },
              {
                icon: "⚖️",
                strongLabel: "Severance / long service:",
                text: "If the employee has 24+ months' service, performance dismissal may trigger severance payment entitlement — assess carefully before proceeding",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Identify and raise performance concerns early",
            "Conduct informal conversations and document them",
            "Implement and review the PIP in practice",
            "Provide agreed support and check in regularly",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on whether informal or formal process is appropriate",
            "Draft or review PIP content for fairness and legal compliance",
            "Chair or attend formal capability meetings",
            "Advise on outcome and any sanction including dismissal",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The employee discloses a health condition or disability during or before the performance process — pause formal action, assess reasonable adjustments with occupational health, and seek HR advice",
          "The employee raises a grievance during the performance process — the processes can run in parallel but must be kept separate; take HR advice on sequencing and management",
          "The performance issue may actually be a conduct issue (deliberate non-compliance vs capability) — the correct process is disciplinary, not capability; using the wrong process creates an unfair dismissal risk",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — PERFORMANCE MANAGEMENT CHECKLIST||BEFORE FORMAL ACTION|[ ] Underlying causes investigated (training, personal, health, management)|[ ] Informal conversation held and documented|[ ] Clear SMART standards communicated and agreed|[ ] Support identified and provided|[ ] Reasonable timescale given for improvement||FORMAL CAPABILITY|[ ] Written invitation issued with 5 working days notice|[ ] Right to be accompanied confirmed|[ ] Formal capability meeting held with notes|[ ] PIP issued: standards, support, timeline, consequences||PIP REVIEW|[ ] Mid-PIP check-in held and documented|[ ] End-of-PIP review held|[ ] Outcome confirmed in writing|[ ] Right of appeal included||IF DISMISSAL|[ ] HR and legal advice obtained|[ ] Written outcome letter issued|[ ] Notice period confirmed|[ ] Right of appeal provided within 5 working days||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "db1",
    catClass: "cat-violet",
    dataTitle: "responding to a deib concern or complaint",
    dataCat: "db1",
    dataSearch:
      "responding to a deib concern or complaint deib how to receive, investigate, and respond to concerns about discrimination, harassment, microaggressions, or exclusion — balancing fairness to all parties, legal obligations, and a genuine commitment to a more inclusive culture.",
    icon: "🌍",
    catBadge: "DEIB",
    title: "Responding to a DEIB Concern or Complaint",
    summary:
      "How to receive, investigate, and respond to concerns about discrimination, harassment, microaggressions, or exclusion — balancing fairness to all parties, legal obligations, and a genuine commitment to a more inclusive culture.",
    pills: [
      "Equality Act",
      "Protected characteristics",
      "Harassment",
      "Formal investigation",
      "Culture change",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Receive the concern with genuine openness",
            desc: "When a DEIB concern is raised — whether formally or informally — your first response sets the tone for everything that follows. Avoid: minimising ('are you sure they meant it that way?'), deflecting ('we have a policy for this'), or over-promising. Do: listen, thank them for raising it, and confirm what happens next.",
          },
          {
            n: 2,
            title: "Determine the nature and severity of the concern",
            desc: "DEIB concerns span a wide spectrum: a single microaggression, a pattern of exclusionary behaviour, direct discrimination, harassment under the Equality Act, or structural inequity in a process. The right response depends on the nature of the concern. A single comment warrants a different process than a systematic promotion gap.",
          },
          {
            n: 3,
            title: "Assess whether the Equality Act applies",
            desc: "Discrimination claims under the Equality Act cover: direct discrimination, indirect discrimination, harassment, and victimisation — across nine protected characteristics (age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation). Assess whether the concern may constitute a legal claim and involve HR immediately if so.",
          },
          {
            n: 4,
            title: "Separate immediate support from investigation",
            desc: "The person raising the concern needs support regardless of whether a formal investigation takes place. Confirm confidentiality (to the extent possible), ask what they need right now, and ensure they are not placed in contact with the subject of the complaint during any investigation.",
          },
          {
            n: 5,
            title: "Choose the right response level",
            desc: "Informal resolution: for lower-level concerns (a single microaggression, unintentional behaviour) — a facilitated conversation with an HR or DEIB lead, or a manager-led conversation with the individual. Formal investigation: for serious or repeated concerns, direct discrimination, or harassment — appoint an investigator, follow a fair process, and interview all parties.",
          },
          {
            n: 6,
            title: "Conduct the investigation fairly for all parties",
            desc: "The subject of a complaint has a right to know what is alleged against them (without necessarily knowing who raised it at the early stage), to respond, and to be treated as innocent until findings are established. Bias in the investigation process — in either direction — undermines both fairness and legal defensibility.",
          },
          {
            n: 7,
            title: "Act on findings and communicate outcomes",
            desc: "Where a concern is upheld: disciplinary action proportionate to the severity of the conduct, required training, monitoring, and a follow-up with the complainant. Where a concern is not upheld: still confirm the outcome in writing, still explore whether a cultural or process issue may be present, and never treat a complaint that is not upheld as automatically vexatious.",
          },
          {
            n: 8,
            title: "Address the systemic dimension",
            desc: "Individual complaints are data points. Recurring concerns in the same team, about similar behaviours, or from employees sharing a characteristic, signal a systemic issue that requires a cultural or structural response — not just case-by-case resolution.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Receiving the concern",
            text: '"Thank you for raising this with me — I know that wasn\'t easy and I want you to know it will be taken seriously. Can you tell me what happened? And while I\'m listening, I want to understand what you\'re hoping we can do as a result."',
          },
          {
            label: "Explaining next steps",
            text: '"I\'d like to look into this properly. Here\'s what that process involves and what you can expect at each stage. I\'ll keep you informed at every point. If at any point you want a different contact person or additional support, please let me know."',
          },
          {
            label: "Sharing an upheld outcome with the complainant",
            text: '"I wanted to confirm that following our investigation, your concern has been upheld. Action has been taken — I can\'t share the details of what that action is, but I want you to know the situation has been addressed. I\'d also like to ask how you\'re doing and whether there\'s anything further we can do to support you."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Receive all concerns with genuine openness, regardless of severity",
          "Separate support from investigation from the start",
          "Investigate fairly — all parties deserve due process",
          "Act on findings and confirm the outcome to the complainant",
          "Look for systemic patterns beyond individual complaints",
        ],
        dont: [
          "Minimise the concern ('I'm sure they didn't mean it that way')",
          "Share the complainant's identity with the subject before necessary",
          "Treat an unsubstantiated complaint as automatically vexatious",
          "Confuse unconscious bias with deliberate discrimination in your response",
          "Close the matter after individual action without asking if patterns exist",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Equality Act 2010:",
                text: "Nine protected characteristics — direct discrimination, indirect discrimination, harassment, and victimisation are unlawful. Employer liable for employees' acts unless all reasonable steps taken to prevent them",
              },
              {
                icon: "⚖️",
                strongLabel: "Vicarious liability:",
                text: "Employer is liable for discriminatory acts of employees in the course of employment — policies, training, and consistent enforcement are the defences",
              },
              {
                icon: "⚖️",
                strongLabel: "Protected disclosure / PIDA:",
                text: "A DEIB complaint may simultaneously be a protected disclosure — ensure detriment protections are not breached during or after the investigation",
              },
              {
                icon: "⚖️",
                strongLabel: "Gender Pay Gap Reporting:",
                text: "Employers with 250+ employees must publish annual gender pay gap data — DEIB complaints that reveal systemic pay disparities must be taken seriously",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Constitutional protections (CFRN 1999):",
                text: "Section 42 prohibits discrimination on grounds of community, ethnic group, place of origin, sex, religion, or political opinion — employment decisions must not be influenced by these characteristics",
              },
              {
                icon: "⚖️",
                strongLabel: "Labour Act:",
                text: "Does not comprehensively cover discrimination in employment — constitutional remedies via the National Industrial Court (NIC) are the primary route for DEIB claims in Nigeria",
              },
              {
                icon: "⚖️",
                strongLabel: "National Industrial Court jurisdiction:",
                text: "The NIC has exclusive jurisdiction over employment discrimination claims — it has applied international labour standards and increasingly interprets protections broadly",
              },
              {
                icon: "⚖️",
                strongLabel: "Religious and ethnic diversity:",
                text: "Nigeria's diversity requires HR to be especially attentive to religious observance, ethnic and tribal dynamics, and regional origin in workplace decisions — these are frequent grounds for discrimination claims",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Title VII (Civil Rights Act 1964):",
                text: "Prohibits employment discrimination based on race, colour, religion, sex, and national origin — applies to employers with 15+ employees",
              },
              {
                icon: "⚖️",
                strongLabel: "ADEA:",
                text: "Prohibits age discrimination (40+) — applies to employers with 20+ employees",
              },
              {
                icon: "⚖️",
                strongLabel: "ADA:",
                text: "Prohibits disability discrimination and requires reasonable accommodation — applies to employers with 15+ employees",
              },
              {
                icon: "⚖️",
                strongLabel: "State and local laws:",
                text: "Many states and cities provide broader protections (sexual orientation, gender identity, immigration status, height, weight, credit history, criminal record) — New York City Human Rights Law is one of the broadest in the country",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "TAFEP (Tripartite Alliance for Fair and Progressive Employment Practices):",
                text: "Employers must comply with TAFEP guidelines on fair employment — discriminatory practices are reportable to TAFEP and can result in work pass restrictions",
              },
              {
                icon: "⚖️",
                strongLabel: "Fair Consideration Framework (FCF):",
                text: "Employers with 10+ employees must advertise roles on MyCareersFuture.sg for 28 days before hiring Employment Pass holders — discriminatory shortlisting creates FCF compliance risk",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "No comprehensive anti-discrimination legislation (as of 2024):",
                text: "The Workplace Fairness Legislation is being introduced in phases — employers should prepare for statutory anti-discrimination protections covering key characteristics",
              },
              {
                icon: "⚖️",
                strongLabel: "Race, religion, and language protections:",
                text: "Singapore's Maintenance of Racial Harmony context means that race, religion, and language-based workplace discrimination is taken very seriously — TAFEP enforcement is active",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Law / Labour Contract Law:",
                text: "Prohibit discrimination in employment based on nationality, race, sex, religious belief — sex discrimination and discrimination against persons with hepatitis B are specifically prohibited",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Law on the Protection of Rights and Interests of Women:",
                text: "Comprehensive protections against gender discrimination — including in hiring, promotion, and dismissal. Specific protections for pregnancy, maternity, and breastfeeding",
              },
              {
                icon: "⚖️",
                strongLabel: "Disabled Persons Protection Law:",
                text: "Employers above certain thresholds must employ a proportion of disabled persons — discrimination against disabled employees in employment decisions is unlawful",
              },
              {
                icon: "⚖️",
                strongLabel: "Practical enforcement:",
                text: "Anti-discrimination enforcement through Chinese courts is developing — internal grievance procedures and documented, fair processes are the primary risk management tools",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Sex Discrimination Ordinance (SDO):",
                text: "Prohibits discrimination on grounds of sex, marital status, and pregnancy — applies to all stages of employment",
              },
              {
                icon: "⚖️",
                strongLabel: "Disability Discrimination Ordinance (DDO):",
                text: "Prohibits discrimination against persons with disabilities — both direct discrimination and failure to make reasonable accommodation are unlawful",
              },
              {
                icon: "⚖️",
                strongLabel: "Race Discrimination Ordinance (RDO):",
                text: "Prohibits discrimination on grounds of race — includes harassment and vilification. Applies to all employment decisions",
              },
              {
                icon: "⚖️",
                strongLabel: "Equal Opportunities Commission (EOC):",
                text: "Can investigate complaints, issue codes of practice, and take legal action — employer's best defence is a documented, consistently enforced anti-discrimination policy and genuine investigation process",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Receive informal concerns and refer to HR immediately",
            "Avoid taking unilateral action before HR advice",
            "Ensure the complainant and subject are not placed in direct conflict",
            "Follow HR guidance on communication during the process",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Lead all formal investigations or appoint investigator",
            "Advise on Equality Act obligations",
            "Manage the process, timelines, and communications",
            "Advise on outcome and any disciplinary action",
            "Identify and address systemic patterns",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The complaint involves a senior leader, a manager in the HR team, or someone with direct authority over the investigation — appoint an independent external investigator to avoid conflict of interest",
          "The complaint may involve criminal conduct (assault, serious harassment, hate crime) — contact legal counsel and consider whether a police report is appropriate",
          "The complaint reveals a systemic pattern affecting multiple employees — a single-case investigation is insufficient; a broader audit or culture review should be initiated",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — DEIB CONCERN CHECKLIST||RECEIVING THE CONCERN|[ ] Concern received with genuine openness and no minimisation|[ ] Nature and severity of the concern assessed|[ ] Equality Act protected characteristic(s) identified if applicable|[ ] Support offered to the complainant separate from investigation||INVESTIGATION|[ ] Response level determined: informal resolution or formal investigation|[ ] Investigator appointed (independent if senior leader involved)|[ ] Complainant rights confirmed: kept informed, confidentiality to extent possible|[ ] Subject's rights confirmed: knows allegations, can respond, due process|[ ] All parties interviewed and notes taken||OUTCOME|[ ] Findings documented clearly and factually|[ ] Outcome communicated to complainant in writing|[ ] Action taken if upheld (disciplinary/training/monitoring)|[ ] Complainant follow-up check-in completed|[ ] Systemic patterns reviewed beyond individual case||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "cf1",
    catClass: "cat-blue",
    dataTitle: "dealing with conflict between employees",
    dataCat: "cf1",
    dataSearch:
      "dealing with conflict between employees employee relations a practical guide to diagnosing, de-escalating, and resolving workplace conflict — from early-stage interpersonal friction to formal grievances and mediation, including the manager and hr roles at each stage.",
    icon: "🤝",
    catBadge: "Employee Relations",
    title: "Dealing with Conflict Between Employees",
    summary:
      "A practical guide to diagnosing, de-escalating, and resolving workplace conflict — from early-stage interpersonal friction to formal grievances and mediation, including the manager and HR roles at each stage.",
    pills: [
      "Early intervention",
      "Mediation",
      "Formal grievance",
      "Investigation",
      "Restoration",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Intervene early — do not wait for it to become formal",
            desc: "Most workplace conflicts are cheaper, faster, and less damaging to resolve early. When a manager or HR notices tension between employees — changed body language, communication breakdowns, complaints from others — the time to act is immediately, not after a formal grievance arrives. A 15-minute conversation now can prevent a three-month investigation later.",
          },
          {
            n: 2,
            title: "Diagnose before intervening",
            desc: "Before approaching either party, understand the nature of the conflict. Is it: personality/style clash, a specific incident or perceived injustice, competition over resources or recognition, a values difference, or a historical grievance that has compounded over time? The diagnosis shapes the intervention.",
          },
          {
            n: 3,
            title: "Meet with each party individually first",
            desc: "Speak to each party separately before bringing them together. Purpose: understand each person's perspective, establish what they want from the situation, and identify common ground. Approach: curious, neutral, listening. Do not share one party's account with the other at this stage.",
          },
          {
            n: 4,
            title:
              "Determine whether informal resolution or formal process is appropriate",
            desc: "Informal resolution (manager-facilitated conversation or HR-facilitated mediation): suitable for interpersonal conflict without a legal dimension. Formal grievance process: required when one or both parties allege a breach of policy, discrimination, harassment, or bullying. Do not push informal resolution when the concern has a formal legal dimension.",
          },
          {
            n: 5,
            title: "Facilitate mediation if both parties agree",
            desc: "Mediation is a voluntary, confidential process facilitated by a neutral third party (HR or external mediator) where both parties agree to explore resolution. It is significantly more effective than formal investigation for interpersonal conflict. Both parties must enter it voluntarily — mediation coerced is mediation that will not work.",
          },
          {
            n: 6,
            title: "Manage the formal grievance if raised",
            desc: "If a formal grievance is raised: acknowledge receipt within 5 working days, appoint an investigating manager, hold a grievance hearing, investigate the facts, and issue a written outcome within a reasonable timeframe. Both parties must be treated fairly throughout the process.",
          },
          {
            n: 7,
            title: "Address the team impact",
            desc: "Workplace conflict between two employees almost always affects the wider team — through changed dynamics, factional behaviour, and accumulated stress. Even after resolution, a team conversation (without discussing the specifics) may be needed to rebuild cohesion and clear the air.",
          },
          {
            n: 8,
            title:
              "Restore the working relationship — do not just end the process",
            desc: "A conflict that is 'resolved' on paper but leaves two people unable to work together has not been resolved. A restoration conversation — facilitated by HR or an independent manager — focused on agreeing professional working norms going forward is often the most important step, and the most commonly skipped.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Opening an individual conversation",
            text: '"I\'ve noticed there seems to be some tension between you and [colleague] and I wanted to check in. I\'m not making any assumptions about what\'s happened — I just want to understand your perspective. What\'s going on from your point of view?"',
          },
          {
            label: "Proposing mediation",
            text: '"I\'d like to suggest mediation — it\'s a voluntary, confidential conversation with a neutral facilitator where both of you can share your perspectives and work toward an understanding. There\'s no obligation, but it often helps. Would you be open to it?"',
          },
          {
            label: "Restoration conversation opener",
            text: '"Today isn\'t about revisiting what happened — that\'s been dealt with through a separate process. Today is about agreeing how you\'re both going to work together professionally going forward. What would need to be true for that to work?"',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Intervene early — conflict left unmanaged always escalates",
          "Meet both parties individually before any joint conversation",
          "Remain genuinely neutral — do not pre-judge",
          "Facilitate restoration, not just formal resolution",
          "Address team impact after individual resolution",
        ],
        dont: [
          "Tell one party what the other said before they've met jointly",
          "Pressure mediation — it only works when genuinely voluntary",
          "Confuse a personality clash with misconduct (different processes)",
          "Assume formal resolution = working relationship restored",
          "Ignore the conflict because 'they're both professionals'",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "ACAS Code on Grievance Procedures:",
                text: "Formal grievances must be acknowledged, investigated, and decided within a reasonable timeframe with a right of appeal — failure increases tribunal awards by up to 25%",
              },
              {
                icon: "⚖️",
                strongLabel: "Constructive dismissal:",
                text: "If an employee resigns due to an employer's breach of the implied term of mutual trust and confidence (e.g. ignoring harassment), they may claim constructive unfair dismissal — document all intervention steps",
              },
              {
                icon: "⚖️",
                strongLabel: "Mediation confidentiality:",
                text: "Without-prejudice communications in mediation cannot be referred to in subsequent tribunal proceedings — confirm this in writing at the start",
              },
              {
                icon: "⚖️",
                strongLabel: "Harassment (Equality Act):",
                text: "Conflict involving conduct related to a protected characteristic that violates dignity or creates a hostile environment is harassment — requires formal investigation, not just mediation",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Act grievance procedures:",
                text: "Employers are expected to have internal dispute resolution procedures — the National Industrial Court will assess whether fair internal procedures were followed before hearing a claim",
              },
              {
                icon: "⚖️",
                strongLabel: "Trade Disputes Act Cap T8:",
                text: "Collective disputes may be referred to conciliation and arbitration through the Ministry of Labour — individual disputes are handled through the NIC",
              },
              {
                icon: "⚖️",
                strongLabel: "Constitutional fair hearing:",
                text: "Where conflict leads to disciplinary action, employees retain their constitutional right to fair hearing under Section 36 — any hearing must give adequate notice and opportunity to respond",
              },
              {
                icon: "⚖️",
                strongLabel: "Documentation:",
                text: "Nigerian courts expect clear documented evidence of the conflict, the employer's response steps, and any outcomes — undocumented management of conflict will not withstand NIC scrutiny",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Title VII / EEOC:",
                text: "Workplace conflict involving protected characteristics (race, sex, religion, national origin) may constitute harassment — employer must investigate promptly and thoroughly or face EEOC liability",
              },
              {
                icon: "⚖️",
                strongLabel: "Retaliation protection:",
                text: "An employee who raises a complaint about discrimination or harassment is protected from retaliation — any adverse action after a complaint requires particular care and HR documentation",
              },
              {
                icon: "⚖️",
                strongLabel: "State anti-bullying laws:",
                text: "Several states (notably California with AB 2053 training requirement) impose training obligations around workplace bullying — check state requirements",
              },
              {
                icon: "⚖️",
                strongLabel: "Mediation and arbitration clauses:",
                text: "Many US employment contracts contain mandatory arbitration clauses — check whether these apply before recommending a litigation or tribunal route",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "Tripartite Guidelines on Workplace Harassment:",
                text: "Employers are expected to have in place a process for managing harassment complaints — MOM and TAFEP have issued detailed guidance on investigation procedures",
              },
              {
                icon: "⚖️",
                strongLabel: "Protection from Harassment Act (POHA):",
                text: "Workplace harassment may constitute a criminal offence or create civil liability under POHA — serious harassment should be assessed for POHA applicability",
              },
              {
                icon: "⚖️",
                strongLabel: "Employment Act wrongful dismissal:",
                text: "If conflict leads to dismissal or constructive resignation of either party, MOM wrongful dismissal provisions apply — document all management steps",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Mediation through Singapore Mediation Centre:",
                text: "MOM-accredited mediation is available for employment disputes — can be a fast and lower-cost resolution route for interpersonal conflict",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "Labour Dispute Mediation and Arbitration Law:",
                text: "All labour disputes must first go through mediation (enterprise level) before arbitration — having an effective internal mediation process is both legally expected and practically valuable",
              },
              {
                icon: "⚖️",
                strongLabel: "Labour dispute arbitration:",
                text: "Either party can apply to a Labour Dispute Arbitration Committee (LDAC) within 1 year of the dispute arising — LDAC decisions are binding unless appealed to court",
              },
              {
                icon: "⚖️",
                strongLabel: "Trade union role:",
                text: "Enterprise trade unions have a formal role in mediating labour disputes under Chinese law — involving the union in serious conflict situations is both legally required and tactically advisable",
              },
              {
                icon: "⚖️",
                strongLabel: "Workplace violence:",
                text: "Conduct constituting workplace violence may trigger criminal law provisions — serious physical altercations between employees must be reported to public security authorities",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Labour Tribunal:",
                text: "The fastest and most accessible forum for employment disputes in Hong Kong — handles claims up to HKD 500,000. Conflict that results in dismissal of either party may generate a Labour Tribunal claim",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Minor Employment Claims Adjudication Board (MECAB):",
                text: "For smaller claims (up to HKD 8,000) — provides a quick resolution pathway",
              },
              {
                icon: "⚖️",
                strongLabel: "Anti-discrimination ordinances:",
                text: "Conflict involving conduct covered by SDO, DDO, RDO, or Family Status Discrimination Ordinance requires formal investigation — refer to EOC guidance on investigation procedures",
              },
              {
                icon: "⚖️",
                strongLabel:
                  "Mediation through HKIAC or Hong Kong Mediation Centre:",
                text: "Professional mediation services are well-developed in Hong Kong — can be used for interpersonal disputes before formal legal proceedings",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Identify conflict early and notify HR",
            "Hold initial individual conversations",
            "Implement agreed working adjustments",
            "Lead the restoration conversation with HR support",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on whether informal or formal process is appropriate",
            "Facilitate or commission mediation",
            "Manage the formal grievance process if raised",
            "Advise on legal dimensions and documentation",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The conflict involves allegations of harassment, bullying, or discrimination under the Equality Act — formal investigation is required immediately; do not attempt informal resolution",
          "One or both parties is the manager of the other — the power dynamic requires HR to lead the process, not the manager above them",
          "The conflict has become public, factional, or is affecting the functioning of the wider team — HR must take active ownership; manager-led resolution is no longer sufficient",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — WORKPLACE CONFLICT CHECKLIST||EARLY INTERVENTION|[ ] Conflict identified and documented|[ ] Individual conversations held with both parties separately|[ ] Nature of conflict diagnosed (interpersonal / legal dimension)||INFORMAL RESOLUTION|[ ] Mediation offered and accepted (voluntary)|[ ] External or internal mediator identified|[ ] Mediation agreement documented||FORMAL GRIEVANCE (IF RAISED)|[ ] Grievance acknowledged in writing within 5 working days|[ ] Investigating manager appointed (independent of both parties)|[ ] Grievance hearing held|[ ] Investigation completed and outcome letter issued|[ ] Right of appeal included||RESTORATION|[ ] Team impact assessed and addressed|[ ] Restoration conversation held|[ ] Working agreement documented|[ ] Follow-up check-in diarised||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "fw1",
    catClass: "cat-green",
    dataTitle: "supporting a flexible working request",
    dataCat: "fw1",
    dataSearch:
      "supporting a flexible working request employment law a step-by-step guide to handling statutory and informal flexible working requests — covering the legal process, the eight grounds for refusal, how to avoid indirect discrimination, and how to have the conversation that leads to the best outcome for both parties.",
    icon: "⏰",
    catBadge: "Employment Law",
    title: "Supporting a Flexible Working Request",
    summary:
      "A step-by-step guide to handling statutory and informal flexible working requests — covering the legal process, the eight grounds for refusal, how to avoid indirect discrimination, and how to have the conversation that leads to the best outcome for both parties.",
    pills: [
      "Statutory request",
      "8 grounds for refusal",
      "Indirect discrimination",
      "Hybrid working",
      "Trial periods",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Know your legal obligations from day one",
            desc: "Since April 2024, employees have the right to request flexible working from their first day of employment (previously 26 weeks). They can make two statutory requests per year. The employer must respond within two months. There is no automatic right to flexible working — but there is an automatic right to have the request properly considered.",
          },
          {
            n: 2,
            title: "Meet with the employee before making any decision",
            desc: "Before deciding, hold a meeting with the employee to understand their proposal, explore whether alternatives might work, and discuss any operational concerns. This meeting is not a formality — it is often where creative solutions emerge. It also demonstrates that the request was genuinely considered.",
          },
          {
            n: 3,
            title: "Assess operational impact rigorously and honestly",
            desc: "Consider: the effect on the team's ability to deliver its work, customer service requirements, impact on other employees, ability to reorganise work, and whether a trial period would reduce the risk of a permanent commitment. Be specific — 'it won't work' is not a sufficient assessment and will not hold up if challenged.",
          },
          {
            n: 4,
            title:
              "Approve, agree a trial, or refuse on one of eight grounds only",
            desc: "A refusal must be based on one or more of eight statutory grounds: burden of additional costs; detrimental effect on ability to meet customer demand; inability to reorganise work among existing staff; inability to recruit additional staff; detrimental impact on quality; detrimental impact on performance; insufficiency of work during proposed hours; planned structural changes. Any other reason is unlawful.",
          },
          {
            n: 5,
            title: "Check for indirect discrimination before refusing",
            desc: "A refusal may be indirectly discriminatory if it disproportionately disadvantages a group sharing a protected characteristic — most commonly women (who are more likely to have caring responsibilities) or disabled employees (who may need flexibility for medical reasons). If the refusal has a disparate impact, it must be objectively justified. Seek HR advice.",
          },
          {
            n: 6,
            title: "Issue the decision in writing within two months",
            desc: "Provide a written response within two months of the request date (including the meeting). If approving: confirm the new arrangements and effective date. If refusing: state the specific statutory ground(s) relied on, with reasons. The reasons must be specific to the employee's role and situation — not generic statements.",
          },
          {
            n: 7,
            title: "Implement with a structured transition",
            desc: "If approved: plan the transition carefully — communicate to the team, adjust workload expectations, agree check-in points, and confirm IT/operational arrangements. Avoid presenting flexible working as a burden to the team — how it is communicated shapes how it is received.",
          },
          {
            n: 8,
            title: "Review and normalise",
            desc: "Review flexible working arrangements at 3 and 6 months. If working well, confirm permanently. If issues have emerged, address them through a structured conversation — not by unilaterally withdrawing the arrangement. Normalise flexible working across the team to avoid a two-tier culture.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Opening the flexible working discussion",
            text: '"Thank you for your request — I want to make sure we consider it properly. Can we meet to talk through your proposal? I\'d like to understand what you\'re asking for and what\'s driving it, and then we can explore together what might be possible."',
          },
          {
            label: "When the request can be approved",
            text: '"I\'m pleased to confirm that your flexible working request has been approved. The new arrangements will be: [details], starting from [date]. I\'ll confirm this in writing and we\'ll check in at 3 months to make sure it\'s working well for you and the team."',
          },
          {
            label: "When the request is refused",
            text: '"I\'ve given your request careful consideration and I\'m unable to approve it on the grounds of [specific statutory ground] because [specific, role-related reason]. I know this is disappointing. You have the right to appeal this decision within [timeframe] if you wish to do so."',
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Hold a meeting before deciding — do not refuse by email",
          "Apply one of the eight statutory grounds with specific written reasons",
          "Check for indirect discrimination before any refusal",
          "Respond within two months of the request date",
          "Include a right of appeal in any refusal letter",
        ],
        dont: [
          "Refuse without a substantive meeting and proper consideration",
          "Use reasons outside the eight statutory grounds",
          "Assume a refusal won't be challenged or is automatically fair",
          "Allow informal flexible working without confirming it in writing",
          "Create a two-tier culture where some roles 'can't' be flexible without evidence",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "Right from Day 1 (ERA 1996 as amended 2023):",
                text: "All employees can make 2 statutory flexible working requests per year from their first day. Must respond within 2 months. Refusal must rely on one of 8 statutory grounds",
              },
              {
                icon: "⚖️",
                strongLabel: "Indirect discrimination:",
                text: "Blanket refusals affecting women disproportionately (due to childcare) or disabled employees (who may need flexibility for medical reasons) may be indirectly discriminatory — objective justification required",
              },
              {
                icon: "⚖️",
                strongLabel: "Pregnancy and maternity:",
                text: "Refusing flexible working to a pregnant employee or new mother requires particularly strong justification — link to maternity discrimination creates heightened legal risk",
              },
              {
                icon: "⚖️",
                strongLabel: "Right to appeal:",
                text: "Any refusal must include a right of appeal — the appeal must be heard by someone different from the original decision-maker",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "No statutory flexible working right:",
                text: "Nigerian law does not currently provide a statutory right to request flexible working — terms are governed by contract and employer discretion",
              },
              {
                icon: "⚖️",
                strongLabel: "Maternity leave:",
                text: "Labour Act provides 12 weeks' maternity leave (6 weeks before, 6 weeks after) — many contracts exceed this. Flexible arrangements on return from maternity leave are increasingly common and expected in multinationals",
              },
              {
                icon: "⚖️",
                strongLabel: "Working hours:",
                text: "Labour Act limits working hours to 8 hours per day / 40 hours per week for most employees — flexible working arrangements must still comply with these limits or use contractual overtime provisions",
              },
              {
                icon: "⚖️",
                strongLabel: "Discrimination risk:",
                text: "Refusing flexible working requests in ways that disproportionately impact women with caring responsibilities could be challenged under the Constitution's non-discrimination provisions",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "No federal flexible working right:",
                text: "There is no federal statutory right to request flexible working — arrangements are at employer discretion, governed by contract and policy",
              },
              {
                icon: "⚖️",
                strongLabel: "ADA reasonable accommodation:",
                text: "Flexible scheduling may be required as a reasonable accommodation for a disability — failure to consider it in the interactive process creates ADA liability",
              },
              {
                icon: "⚖️",
                strongLabel: "FMLA intermittent leave:",
                text: "Eligible employees have the right to take FMLA leave on an intermittent or reduced schedule basis for qualifying medical conditions — this is a statutory right, not a discretionary flexible working arrangement",
              },
              {
                icon: "⚖️",
                strongLabel: "State laws:",
                text: "Several states and cities have enacted scheduling laws (especially for retail, hospitality) that require predictive scheduling and advance notice of shift changes — check state and local requirements",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel:
                  "Tripartite Advisory on Flexible Work Arrangements (FWAs):",
                text: "From December 2024, MOM's Tripartite Guidelines on FWA Requests require employers to have a process for considering FWA requests and to respond formally",
              },
              {
                icon: "⚖️",
                strongLabel: "Part-time employment:",
                text: "Employment Act applies to part-time employees (fewer than 35 hours per week) — pro-rated leave, CPF, and other entitlements apply from the first day of part-time employment",
              },
              {
                icon: "⚖️",
                strongLabel: "Caregiving responsibilities:",
                text: "Singapore's caregiving support framework encourages flexible arrangements for employees with caregiving responsibilities — refusals without genuine operational justification attract TAFEP attention",
              },
              {
                icon: "⚖️",
                strongLabel: "Work pass implications:",
                text: "Changes to employment terms including hours and location may require updates to MOM — check work pass conditions before approving significant changes for foreign employees",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Standard working hours system:",
                text: "Default is standard hours (8 hours/day, 40 hours/week) — flexible work arrangements require approval from the local labour authority under the Irregular/Comprehensive Working Hours system",
              },
              {
                icon: "⚖️",
                strongLabel: "Irregular working hours (不定时工作制):",
                text: "Applicable for employees in senior management, field sales, or roles requiring irregular scheduling — must be approved by local labour bureau and included in the labour contract",
              },
              {
                icon: "⚖️",
                strongLabel: "Comprehensive working hours (综合工时制):",
                text: "Allows calculation of working hours over a longer reference period (week/month/quarter/year) — must be approved by local labour bureau",
              },
              {
                icon: "⚖️",
                strongLabel: "Maternity / nursing flexibility:",
                text: "Female employees are entitled to daily nursing breaks (totalling 1 hour) until the child is one year old — flexible scheduling must accommodate this statutory right",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "No statutory flexible working right:",
                text: "Hong Kong does not have a statutory right to request flexible working — arrangements are contractual and at employer discretion",
              },
              {
                icon: "⚖️",
                strongLabel: "Part-time employment:",
                text: "Employment Ordinance applies to all employees regardless of hours — no minimum hours threshold for statutory employment rights (unlike many jurisdictions). Pro-rate leave entitlements for part-time employees",
              },
              {
                icon: "⚖️",
                strongLabel: "Disability reasonable accommodation (DDO):",
                text: "Flexible working may be required as a reasonable accommodation for an employee with a disability — consider carefully before refusing for disability-related requests",
              },
              {
                icon: "⚖️",
                strongLabel: "Changes to terms:",
                text: "Any material change to working hours or location requires the employee's agreement — unilateral imposition of new hours constitutes a breach of contract",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Hold the initial meeting with the employee",
            "Assess operational impact of the proposed arrangement",
            "Propose alternatives or trial periods if appropriate",
            "Implement and review approved arrangements",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Advise on statutory process and timelines",
            "Check for indirect discrimination risk before refusal",
            "Draft or review the written decision",
            "Advise on any appeal",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "A refusal may indirectly discriminate against a protected group — do not proceed without HR and, if necessary, legal advice on objective justification",
          "The employee has a disability and the flexible working request is related to a medical need — the request may also be a reasonable adjustment request under the Equality Act, which has a different and stronger legal framework",
          "The employee appeals a refusal — HR must manage the appeal with a different manager from the original decision-maker",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — FLEXIBLE WORKING REQUEST CHECKLIST||RECEIVING THE REQUEST|[ ] Request received in writing (or confirmed in writing if verbal)|[ ] Date received recorded — 2-month clock starts now|[ ] Check: does the request qualify as a statutory request?||MEETING|[ ] Meeting scheduled promptly|[ ] Employee's proposal and rationale understood|[ ] Alternatives and trial periods explored|[ ] Operational impact assessed with specifics||DECISION|[ ] Indirect discrimination risk assessed|[ ] Decision: approve / trial / refuse on statutory ground(s)|[ ] Written decision issued within 2 months|[ ] If refused: specific statutory ground(s) cited with role-specific reasons|[ ] Right of appeal included in any refusal||IMPLEMENTATION (IF APPROVED)|[ ] New arrangements confirmed in writing|[ ] Team communicated to appropriately|[ ] IT / operational arrangements confirmed|[ ] 3-month review diarised||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
  {
    id: "of1",
    catClass: "cat-red",
    dataTitle: "managing a resignation and offboarding",
    dataCat: "of1",
    dataSearch:
      "managing a resignation and offboarding talent management how to handle a resignation professionally — covering counter-offers, the exit interview, knowledge transfer, final pay, references, and the offboarding experience that determines what a leaver says about your organization.",
    icon: "🚪",
    catBadge: "Talent Management",
    title: "Managing a Resignation and Offboarding",
    summary:
      "How to handle a resignation professionally — covering counter-offers, the exit interview, knowledge transfer, final pay, references, and the offboarding experience that determines what a leaver says about your organization.",
    pills: [
      "Notice period",
      "Exit interview",
      "Knowledge transfer",
      "Reference",
      "Employer brand",
    ],
    sections: [
      {
        type: "steps",
        label: STEPS_LABEL,
        steps: [
          {
            n: 1,
            title: "Receive the resignation professionally",
            desc: "Your immediate response to a resignation shapes the rest of the process and the employee's final impression. Thank them for letting you know, acknowledge the decision with respect, confirm the process that will follow, and do not make the conversation awkward or create pressure. Even if you are disappointed, the professional response protects the relationship and the employer brand.",
          },
          {
            n: 2,
            title: "Confirm the resignation in writing",
            desc: "Request or issue a written confirmation of resignation including: the date given, the notice period, the last day of employment, and any conditions (e.g. garden leave, restrictive covenants). Confirm in writing even if the resignation was verbal — this protects both parties.",
          },
          {
            n: 3,
            title: "Consider whether a counter-offer is appropriate",
            desc: "Counter-offers sometimes work — but research consistently shows that more than 80% of employees who accept a counter-offer leave within 12 months, often for the same underlying reasons. Before making one, understand why the employee is leaving. If the reason is a fixable structural issue (pay, title, team), a counter may be worth exploring. If the reason is culture, management, or career trajectory, a counter-offer is rarely the answer.",
          },
          {
            n: 4,
            title: "Plan and execute knowledge transfer",
            desc: "For every departure, identify: what knowledge only this person holds, what documentation is missing, what relationships need transitioning, and what handover activity must happen before they leave. A structured handover plan with named tasks and deadlines prevents the inevitable post-departure scramble.",
          },
          {
            n: 5,
            title: "Conduct a genuine exit interview",
            desc: "An exit interview is a structured conversation (or survey) to understand why the employee is leaving and what the organization could improve. It is only valuable if: it is conducted by someone neutral (HR, not the line manager), responses are analysed in aggregate, and themes are fed back to leadership with action recommendations. An exit interview that generates data nobody reads is worse than no exit interview.",
          },
          {
            n: 6,
            title: "Manage the notice period professionally",
            desc: "The notice period is still employment. Maintain professional standards: do not isolate the leaver, exclude them from communications, or make the period uncomfortable. Garden leave (where the employee is asked to stay away from the office but remains employed and on pay) is an option where there are legitimate business reasons such as access to sensitive information.",
          },
          {
            n: 7,
            title: "Complete all final pay and administrative obligations",
            desc: "Final pay must include: all outstanding salary, holiday pay for any accrued but untaken leave, any contractual bonuses earned to date, and expenses. Issue a P45 promptly. Deductions from final pay require explicit contractual authority — do not deduct training costs or notice pay shortfalls without legal advice.",
          },
          {
            n: 8,
            title: "Provide a reference — do not ghost a former employee",
            desc: "A reference should be factual and accurate: confirming dates of employment, job title, and key responsibilities at minimum. You are not obliged to provide a glowing reference, but you cannot provide a deliberately unfair or misleading one — to do so creates a defamation and negligent misstatement risk. A standard factual reference is always safer than silence.",
          },
        ],
      },
      {
        type: "templates",
        label: TEMPLATES_LABEL,
        blocks: [
          {
            label: "Receiving the resignation",
            text: '"Thank you for letting me know — I\'m sorry to hear you\'re leaving, but I respect your decision. Can we find some time this week to talk through the handover plan and what the next few weeks will look like?"',
          },
          {
            label: "Exit interview opener",
            text: '"There are no right or wrong answers here — I\'m genuinely interested in understanding your experience and what we could do better. Everything you share will be anonymised when I report back. What\'s been the biggest factor in your decision to move on?"',
          },
          {
            label: "Reference confirmation to new employer",
            text: '"[Name] was employed with us as [job title] from [start date] to [end date]. During this time, their key responsibilities included [2–3 key areas]. We wish them well in their next role."',
            note: "Keep references factual. Only add more if you can substantiate it and are comfortable doing so.",
          },
        ],
      },
      {
        type: "donts",
        label: DONTS_LABEL,
        doTitle: DO_TITLE,
        dontTitle: DONT_TITLE,
        do: [
          "Receive the resignation professionally and without pressure",
          "Confirm resignation in writing with notice dates",
          "Plan knowledge transfer immediately",
          "Conduct exit interview with a neutral interviewer",
          "Complete all final pay obligations correctly and on time",
        ],
        dont: [
          "Make the leaver feel guilty, awkward, or excluded during notice",
          "Deduct from final pay without contractual authority",
          "Withhold a reference or provide a deliberately unfair one",
          "Leave knowledge transfer until the last week",
          "Lose the relationship — alumni are brand ambassadors and potential future hires",
        ],
      },
      {
        type: "legal",
        label: LEGAL_LABEL,
        tabs: JUR_TABS,
        panels: [
          {
            code: "gb",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Notice obligations:",
                text: "Statutory minimum: 1 week per year of service (max 12 weeks). Contract may specify longer — apply whichever is greater. PILON requires contractual authority",
              },
              {
                icon: "⚖️",
                strongLabel: "Holiday pay in final salary:",
                text: "All accrued but untaken statutory holiday (5.6 weeks per year for full-time) must be paid at termination — unlawful deduction claim if withheld",
              },
              {
                icon: "⚖️",
                strongLabel: "P45:",
                text: "Must be issued no later than the final day of employment — failure creates HMRC compliance risk",
              },
              {
                icon: "⚖️",
                strongLabel: "Restrictive covenants:",
                text: "Post-termination restrictions must be reasonable in scope, duration, and geography to be enforceable — remind the employee in writing of any that apply",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "ng",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Notice period:",
                text: "Labour Act minimum: 1 day (daily workers), 1 week (monthly-paid under 2 years), 1 month (2+ years). Contract often provides more — comply with whichever is higher",
              },
              {
                icon: "⚖️",
                strongLabel: "Terminal benefits / gratuity:",
                text: "Many Nigerian employers and collective agreements provide gratuity on resignation after a threshold period of service — check contract and CBA carefully before calculating final pay",
              },
              {
                icon: "⚖️",
                strongLabel: "Pension transfer:",
                text: "Employee's pension contributions are theirs — facilitate transfer to their new Retirement Savings Account (RSA) or provide Transfer Value statement promptly after departure",
              },
              {
                icon: "⚖️",
                strongLabel: "Non-compete enforceability:",
                text: "Nigerian courts apply a reasonableness test — restrictive covenants must be limited in scope and duration and must genuinely protect a legitimate business interest to be upheld",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "us",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Final pay timing:",
                text: "Varies by state — California requires final pay on last day for resignations with 72+ hours notice; most states require next regular payday. Do not delay final wages",
              },
              {
                icon: "⚖️",
                strongLabel: "COBRA notice:",
                text: "Within 14 days of the qualifying event (last day of employment), send COBRA notice to the employee and any covered dependants — failure creates ERISA liability",
              },
              {
                icon: "⚖️",
                strongLabel: "Non-compete enforceability:",
                text: "Varies enormously by state — California bans most non-competes entirely; many other states require geographic and time limits. FTC 2024 rule banning most non-competes is subject to ongoing litigation",
              },
              {
                icon: "⚖️",
                strongLabel: "Reference liability:",
                text: "Defamatory references create liability. Some states have reference immunity statutes for good-faith, truthful references — check state law and consider a factual-only policy",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "sg",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Notice period:",
                text: "Employment Act: 1 day (<26 weeks), 1 week (26 weeks–2 years), 2 weeks (2–5 years), 4 weeks (5+ years) — contract may provide more. PILON requires agreement or contractual authority",
              },
              {
                icon: "⚖️",
                strongLabel: "CPF final contributions:",
                text: "CPF contributions are due on all wages including those paid in the final month — calculate and remit by the 14th of the following month",
              },
              {
                icon: "⚖️",
                strongLabel: "Work pass cancellation:",
                text: "For Employment Pass / S Pass / Work Permit holders: cancel the work pass within 1 week of last day of employment — report to MOM. Employee must leave Singapore within 30 days unless they hold other valid status",
              },
              {
                icon: "⚖️",
                strongLabel: "Non-compete enforceability:",
                text: "Singapore courts apply a reasonableness test — protectable legitimate interest, reasonable scope and duration, reasonable geographic reach. Courts are generally supportive of enforcing reasonable restrictions",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "cn",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Resignation notice:",
                text: "Employee must give 30 days' notice (3 days during probation) — employer cannot prevent resignation but may claim damages if resignation during a critical period causes loss",
              },
              {
                icon: "⚖️",
                strongLabel: "Non-compete:",
                text: "Valid non-competes require monthly financial compensation during the restriction period (typically 20–60% of previous wages) — non-competes without compensation are unenforceable",
              },
              {
                icon: "⚖️",
                strongLabel: "Confidentiality:",
                text: "Statutory confidentiality obligations survive resignation under Labour Contract Law — employees cannot take or misuse trade secrets; document IP ownership and confidentiality obligations at offboarding",
              },
              {
                icon: "⚖️",
                strongLabel: "Social insurance and housing fund:",
                text: "Final month social insurance and housing fund contributions must be made — deregister the employee with relevant authorities promptly after departure",
              },
            ],
            note: JUR_NOTE,
          },
          {
            code: "hk",
            legalItems: [
              {
                icon: "⚖️",
                strongLabel: "Notice period:",
                text: "Employment Ordinance minimum: 7 days (1+ month service) — contract may specify more. Employer and employee can agree to shorten or waive notice with PILON",
              },
              {
                icon: "⚖️",
                strongLabel: "MPF final contributions:",
                text: "Employee's MPF contributions are due on all wages in the final month — submit to the MPF trustee within the required timeframe. Employer mandatory contributions are also due",
              },
              {
                icon: "⚖️",
                strongLabel: "Long service payment:",
                text: "Employees with 5+ years' service who resign with good reason (ill health, new terms) may be entitled to long service payment — assess before closing final pay",
              },
              {
                icon: "⚖️",
                strongLabel: "Certificate of Employment:",
                text: "While not legally required, providing a factual letter confirming employment dates and title is considered best practice and avoids reference disputes",
              },
            ],
            note: JUR_NOTE,
          },
        ],
      },
      {
        type: "mvhr",
        label: MVHR_LABEL,
        manager: {
          title: MGR_TITLE,
          items: [
            "Receive the resignation and acknowledge professionally",
            "Lead the knowledge transfer plan",
            "Manage the notice period professionally",
            "Conduct or delegate the handover tasks",
          ],
        },
        hr: {
          title: HR_TITLE,
          items: [
            "Confirm resignation and notice period in writing",
            "Conduct or coordinate the exit interview",
            "Calculate and verify final pay",
            "Issue P45 and confirm reference policy",
          ],
        },
      },
      {
        type: "escalation",
        label: ESC_LABEL,
        items: [
          "The employee raises concerns during resignation (grievance, discrimination, whistleblowing) — do not treat as part of the offboarding; manage through the appropriate separate process",
          "The employee has access to highly sensitive information or client relationships and you want to place them on garden leave — seek legal advice to confirm the garden leave clause is enforceable",
          "A counter-offer is being considered for a senior or specialist employee — involve HR and the relevant business leader to assess the business case honestly before proceeding",
        ],
      },
      {
        type: "checklist",
        payload:
          "EVERYDAY HR PLAYBOOK — RESIGNATION & OFFBOARDING CHECKLIST||IMMEDIATE RESPONSE|[ ] Resignation received professionally and acknowledged|[ ] Resignation confirmed in writing with notice dates|[ ] Counter-offer decision made (if relevant)||NOTICE PERIOD|[ ] Knowledge transfer plan agreed and documented|[ ] Garden leave decision made if applicable|[ ] Systems access review completed|[ ] Restrictive covenants reminder issued if relevant||EXIT INTERVIEW|[ ] Exit interview scheduled with neutral interviewer|[ ] Exit interview completed and themes documented|[ ] Data to be reviewed and fed back to leadership||FINAL PAY & ADMIN|[ ] Final pay calculated: salary, holiday pay, bonuses, expenses|[ ] Deductions checked for contractual authority|[ ] P45 prepared for issue on last day|[ ] Reference policy confirmed||RELATIONSHIP MAINTENANCE|[ ] Reference provided — factual and fair|[ ] Alumni contact maintained where appropriate||Source: HR Playhouse Hub — Everyday HR Playbook|learn.thehrplayhousehub.org",
        buttonLabel: "↓ Download Checklist",
      },
    ],
  },
];
