"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import "./innovation-lab.css";

type BoardKey = "new-members" | "ideas" | "feedback" | "mentorship";

type Board = {
  key: BoardKey;
  label: string;
  emoji: string;
  bg: string;
  col: string;
  avbg: string;
};

type Reply = {
  author: string;
  initials?: string;
  avbg?: string;
  body: string;
  ts?: string;
};

type Post = {
  id: number;
  board: BoardKey;
  author: string;
  initials: string;
  avbg: string;
  title: string;
  pinned: boolean;
  body: string;
  ts: string;
  replies: Reply[];
};

type FilterKey = "all" | BoardKey;

type Grade = { min: number; label: string; sub: string; color: string };

type Dim = "reach" | "urgency" | "feasibility" | "innovation" | "evidence";

const BOARDS: Record<BoardKey, Board> = {
  "new-members": { key: "new-members", label: "New Members Area", emoji: "👋", bg: "#E8ECF4", col: "#1E3560", avbg: "#1E3560" },
  ideas: { key: "ideas", label: "Idea Submission Board", emoji: "💡", bg: "#FAF0EB", col: "#A8400F", avbg: "#C9501E" },
  feedback: { key: "feedback", label: "Feedback & Discussion", emoji: "🗣", bg: "#FDF4DD", col: "#78350f", avbg: "#C4830A" },
  mentorship: { key: "mentorship", label: "Mentorship Requests", emoji: "🤝", bg: "#e8f7ee", col: "#1a7a4a", avbg: "#1a7a4a" },
};

const BOARD_LABEL_TO_KEY: Record<string, BoardKey> = Object.fromEntries(
  Object.values(BOARDS).flatMap((b) => [
    [b.label, b.key],
    [b.label.replace("&", "and"), b.key],
  ])
) as Record<string, BoardKey>;

function boardByLabel(label: string): Board {
  const key = BOARD_LABEL_TO_KEY[label] ?? BOARD_LABEL_TO_KEY[label.replace("&", "and")];
  return key ? BOARDS[key] : BOARDS["new-members"];
}

const SEED_POSTS: Post[] = [
  {
    id: 1,
    board: "new-members",
    author: "Dr. Marvellous Gberevbie",
    initials: "MA",
    avbg: "#C9501E",
    title: "Welcome to the HR Playhouse Hub Innovation Lab 👋",
    pinned: true,
    body: "Welcome to our community space for HR professionals. Introduce yourself below — tell us your name, where you are in your HR career, and one thing you're working on or thinking about right now. This is a space for genuine exchange, not corporate speak. Looking forward to meeting you all.",
    ts: "Just now",
    replies: [
      { author: "Innovation Lab", initials: "IL", avbg: "#0D1F3C", body: "This is a pinned welcome post. Reply below to introduce yourself to the community!", ts: "Just now" },
    ],
  },
  {
    id: 2,
    board: "ideas",
    author: "Innovation Lab",
    initials: "IL",
    avbg: "#C9501E",
    title: "AI in HR: Opportunities & Risks",
    pinned: false,
    body: "What are the most exciting opportunities you see for AI in HR practice — and what are the biggest risks? Share your perspective, experience, or a case you have encountered. This board is for ideas that challenge the status quo.",
    ts: "Just now",
    replies: [],
  },
  {
    id: 3,
    board: "feedback",
    author: "Innovation Lab",
    initials: "IL",
    avbg: "#C4830A",
    title: "Ethical Dilemmas in HR Practice",
    pinned: false,
    body: "Share an ethical dilemma you have faced in HR — or one you have seen handled well (or badly). What was the situation? What did you decide? What would you do differently? No names or identifying details — just the learning.",
    ts: "Just now",
    replies: [],
  },
  {
    id: 4,
    board: "mentorship",
    author: "Innovation Lab",
    initials: "IL",
    avbg: "#1a7a4a",
    title: "Career Transition into HR",
    pinned: false,
    body: "Are you transitioning into HR from another career? Or have you made that journey already? Share your experience, your challenges, and what you wish you had known. This board connects those asking with those who have been there.",
    ts: "Just now",
    replies: [],
  },
];

const GRADES: Grade[] = [
  { min: 0, label: "Early-stage Idea", sub: "More development needed before sharing", color: "#9BABC0" },
  { min: 30, label: "Developing Idea", sub: "Has potential — refine and test further", color: "#C4830A" },
  { min: 50, label: "Good Idea", sub: "Worth exploring with the community", color: "#C9501E" },
  { min: 70, label: "Strong Idea", sub: "Well-formed — ready for peer feedback", color: "#1E3560" },
  { min: 86, label: "Exceptional Idea 🚀", sub: "Highly actionable — submit to the Lab", color: "#1a7a4a" },
];

const DIMS: Dim[] = ["reach", "urgency", "feasibility", "innovation", "evidence"];

const DIM_TICKS: Record<Dim, string[]> = {
  reach: ["1–10", "11–50", "50–200", "200–1k", "1k+"],
  urgency: ["Low", "Mild", "Moderate", "High", "Crisis"],
  feasibility: ["Very hard", "Hard", "Moderate", "Easy", "Very easy"],
  innovation: ["Standard", "Adapted", "Fresh", "Bold", "Pioneering"],
  evidence: ["Intuition", "Experience", "Some data", "Research", "Proven"],
};

const DIM_LABELS: Record<Dim, { label: string; question: string }> = {
  reach: { label: "Reach", question: "How many people does this idea affect?" },
  urgency: { label: "Urgency", question: "How urgent is this problem?" },
  feasibility: { label: "Feasibility", question: "How feasible is implementation?" },
  innovation: { label: "Innovation", question: "How innovative is the approach?" },
  evidence: { label: "Evidence", question: "Is it evidence-based or tested?" },
};

const MENTORS = [
  {
    name: "Dr. Marvellous Gberevbie",
    displayName: "Dr. Marvellous Gberevbie",
    role: "Founder & CEO, HR Playhouse Hub",
    roleDisplay: "Founder & CEO · HR Playhouse Hub",
    initials: "MA",
    color: "#C9501E",
    tags: ["HR in HE", "Career development", "Academic HR"],
  },
  {
    name: "Senior HR Practitioner",
    displayName: "Senior Practitioner",
    role: "HR Business Partner · Nigeria",
    roleDisplay: "HR Business Partner · 12 years experience",
    initials: "SP",
    color: "#1E3560",
    tags: ["Employee relations", "Disciplinary", "HRBP"],
  },
  {
    name: "HR Director",
    displayName: "HR Director",
    role: "Multinational · UK & Nigeria",
    roleDisplay: "Multinational · UK & Nigeria · 20 years",
    initials: "HD",
    color: "#C4830A",
    tags: ["Leadership", "Strategy", "Global HR"],
  },
];

const BOARD_OPTIONS: { value: string; label: string }[] = [
  { value: "New Members Area", label: "👋 New Members Area" },
  { value: "Idea Submission Board", label: "💡 Idea Submission Board" },
  { value: "Feedback and Discussion", label: "🗣 Feedback & Discussion" },
  { value: "Mentorship Requests", label: "🤝 Mentorship Requests" },
];

const FILTER_BUTTONS: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All boards" },
  { id: "new-members", label: "👋 New Members" },
  { id: "ideas", label: "💡 Ideas" },
  { id: "feedback", label: "🗣 Discussion" },
  { id: "mentorship", label: "🤝 Mentorship" },
];

const MENTOR_TOPICS = [
  "Career transition into HR",
  "Leadership development",
  "Handling complex employee relations",
  "Building confidence as a new HR professional",
  "Performance management systems",
  "DEIB strategy",
  "HR in higher education",
  "Other — I will explain below",
];

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function gradeForScore(score: number): Grade {
  return [...GRADES].reverse().find((g) => score >= g.min) ?? GRADES[0];
}

function openMail(subject: string, body: string) {
  window.open(`mailto:contact@thehrplayhousehub.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

export default function InnovationLabContent() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [currentThread, setCurrentThread] = useState<number | null>(null);
  const [threadReplies, setThreadReplies] = useState<Record<number, Reply[]>>({});

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeSent, setComposeSent] = useState(false);
  const [cmName, setCmName] = useState("");
  const [cmEmail, setCmEmail] = useState("");
  const [cmBoard, setCmBoard] = useState(BOARD_OPTIONS[0].value);
  const [cmTitle, setCmTitle] = useState("");
  const [cmBody, setCmBody] = useState("");

  // Thread reply state
  const [trName, setTrName] = useState("");
  const [trEmail, setTrEmail] = useState("");
  const [trBody, setTrBody] = useState("");

  // Join modal state
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinSent, setJoinSent] = useState(false);
  const [jnFirst, setJnFirst] = useState("");
  const [jnLast, setJnLast] = useState("");
  const [jnEmail, setJnEmail] = useState("");
  const [jnRole, setJnRole] = useState("");

  // Mentor modal state
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorSent, setMentorSent] = useState(false);
  const [currentMentor, setCurrentMentor] = useState({ name: "", role: "" });
  const [mrName, setMrName] = useState("");
  const [mrEmail, setMrEmail] = useState("");
  const [mrRole, setMrRole] = useState("");
  const [mrTopic, setMrTopic] = useState("");
  const [mrMessage, setMrMessage] = useState("");

  // Calculator state
  const [calcUnlocked, setCalcUnlocked] = useState(false);
  const [dimValues, setDimValues] = useState<Record<Dim, number>>({
    reach: 3,
    urgency: 3,
    feasibility: 3,
    innovation: 3,
    evidence: 3,
  });

  const score = useMemo(() => {
    const total = DIMS.reduce((sum, d) => sum + dimValues[d], 0);
    return Math.round((total / 25) * 100);
  }, [dimValues]);
  const grade = useMemo(() => gradeForScore(score), [score]);
  const ringCircumference = 2 * Math.PI * 50;
  const ringOffset = ringCircumference - (score / 100) * ringCircumference;

  const visiblePosts = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.board === filter)),
    [filter, posts]
  );

  const setDim = useCallback((dim: Dim, value: number) => {
    setDimValues((prev) => ({ ...prev, [dim]: value }));
  }, []);

  // Body scroll lock when any modal open
  useEffect(() => {
    const anyOpen = composeOpen || joinOpen || mentorOpen;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [composeOpen, joinOpen, mentorOpen]);

  // ESC closes modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setComposeOpen(false);
        setJoinOpen(false);
        setMentorOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Thread open/close ----
  const openThread = useCallback(
    (postId: number) => {
      if (!posts.some((p) => p.id === postId)) return;
      setCurrentThread(postId);
    },
    [posts]
  );

  const closeThread = useCallback(() => {
    setCurrentThread(null);
    setTrName("");
    setTrEmail("");
    setTrBody("");
  }, []);

  // Filter ---- (closes thread if open)
  const changeFilter = useCallback(
    (key: FilterKey) => {
      setFilter(key);
      if (currentThread !== null) closeThread();
    },
    [currentThread, closeThread]
  );

  // Compose ----
  const openCompose = useCallback((topic?: string | null, boardLabel?: string | null) => {
    setCmTitle(topic ?? "");
    if (boardLabel) {
      const match = BOARD_OPTIONS.find((o) => o.value === boardLabel);
      if (match) setCmBoard(match.value);
    }
    setComposeSent(false);
    setComposeOpen(true);
  }, []);

  const closeCompose = useCallback(() => {
    setComposeOpen(false);
    setCmName("");
    setCmEmail("");
    setCmTitle("");
    setCmBody("");
  }, []);

  const submitPost = useCallback(() => {
    const name = cmName.trim();
    const email = cmEmail.trim();
    const board = cmBoard;
    const title = cmTitle.trim();
    const body = cmBody.trim();
    if (!name || !email || !body) {
      alert("Please fill in your name, email and post content.");
      return;
    }
    const b = boardByLabel(board);
    const newPost: Post = {
      id: Date.now(),
      board: b.key,
      author: name,
      initials: initialsFromName(name),
      avbg: b.avbg,
      title: title || `${board} post`,
      pinned: false,
      body,
      ts: "Just now",
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    openMail(
      `Innovation Lab Post: ${title || board} [${board}]`,
      `Name: ${name}\nEmail: ${email}\nBoard: ${board}\nTitle: ${title || "—"}\n\nPost:\n${body}`
    );
    setComposeSent(true);
  }, [cmName, cmEmail, cmBoard, cmTitle, cmBody]);

  // Thread reply ----
  const submitReply = useCallback(() => {
    if (currentThread === null) return;
    const name = trName.trim();
    const email = trEmail.trim();
    const body = trBody.trim();
    if (!name || !email || !body) {
      alert("Please fill in your name, email and reply.");
      return;
    }
    const reply: Reply = {
      author: name,
      initials: initialsFromName(name),
      avbg: "#5A6880",
      body,
      ts: "Just now",
    };
    setThreadReplies((prev) => ({
      ...prev,
      [currentThread]: [...(prev[currentThread] ?? []), reply],
    }));
    const post = posts.find((p) => p.id === currentThread);
    openMail(
      `Lab Reply: ${post ? post.title : "Post"}`,
      `Name: ${name}\nEmail: ${email}\nThread: ${post ? post.title : ""}\n\nReply:\n${body}`
    );
    setTrName("");
    setTrEmail("");
    setTrBody("");
  }, [currentThread, trName, trEmail, trBody, posts]);

  // Join ----
  const openJoin = useCallback(() => {
    setJoinSent(false);
    setJoinOpen(true);
  }, []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const submitJoin = useCallback(() => {
    const first = jnFirst.trim();
    const email = jnEmail.trim();
    if (!first || !email) {
      alert("Please enter your name and email.");
      return;
    }
    openMail(
      `Innovation Lab Join Request: ${first} ${jnLast.trim()}`,
      `Name: ${first} ${jnLast.trim()}\nEmail: ${email}\nRole: ${jnRole.trim()}`
    );
    setJoinSent(true);
    setTimeout(() => setCalcUnlocked(true), 500);
  }, [jnFirst, jnLast, jnEmail, jnRole]);

  // Mentor ----
  const openMentor = useCallback((name: string, role: string) => {
    setCurrentMentor({ name, role });
    setMrName("");
    setMrEmail("");
    setMrRole("");
    setMrTopic("");
    setMrMessage("");
    setMentorSent(false);
    setMentorOpen(true);
  }, []);
  const closeMentor = useCallback(() => setMentorOpen(false), []);
  const submitMentor = useCallback(() => {
    const name = mrName.trim();
    const email = mrEmail.trim();
    const message = mrMessage.trim();
    if (!name || !email || !message) {
      alert("Please fill in your name, email and your mentorship question.");
      return;
    }
    const subject = `Mentorship Request: ${mrTopic} to ${currentMentor.name}`;
    const bodyLines = [
      `Mentor requested: ${currentMentor.name} (${currentMentor.role})`,
      `Your name: ${name}`,
      `Email: ${email}`,
      `Your role: ${mrRole.trim() || "Not specified"}`,
      `Topic: ${mrTopic || "Not specified"}`,
      "",
      "Message:",
      message,
    ];
    openMail(subject, bodyLines.join("\n"));
    setMentorSent(true);
  }, [mrName, mrEmail, mrRole, mrTopic, mrMessage, currentMentor]);

  // ────────────────── RENDER ────────────────────────────────────────────────
  const threadPost = currentThread !== null ? posts.find((p) => p.id === currentThread) ?? null : null;
  const threadBoard = threadPost ? BOARDS[threadPost.board] : null;
  const threadAllReplies = threadPost
    ? [...threadPost.replies, ...(threadReplies[threadPost.id] ?? [])]
    : [];

  return (
    <>
      <nav className="topnav">
        <a className="nav-logo" href="/">
          <div className="nav-logo-pill">HR Playhouse</div>
          <div className="nav-logo-text">Hub</div>
        </a>
        <div className="nav-sep" />
        <div className="nav-title">Virtual Innovation Lab</div>
        <div className="nav-links">
          <a className="tnl" href="/dashboard">Dashboard</a>
          <a className="tnl" href="/courses/">Courses</a>
          <a className="tnl" href="/ai-support">AI Support</a>
        </div>
        <a
          className="nav-cta"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openJoin();
          }}
        >
          {" Join the lab → "}
        </a>
      </nav>

      <section className="lab-hero">
        <div className="lh-glow-1" />
        <div className="lh-glow-2" />
        <div className="lh-inner">
          <div>
            <div className="lh-tag">
              <div className="lh-tag-line" />
              Virtual Innovation Lab
            </div>
            <h1 className="lh-title">
              Where HR ideas
              <br />
              become <em>better ideas.</em>
            </h1>
            <p className="lh-sub">
              Collaborate on real-world HR challenges with peers, submit and refine ideas, get feedback from experienced practitioners, and request mentorship from HR leaders.
            </p>
            <div className="lh-actions">
              <a className="btn-accent" href="#forum"> Enter the Lab → </a>
              <a className="btn-outline-light" href="#how"> How it works </a>
            </div>
          </div>
          <div className="lh-stats">
            <div className="lh-stat-pair">
              <div className="lh-stat-card">
                <div className="lsc-n">16</div>
                <div className="lsc-l">Discussion boards across 4 topic areas</div>
              </div>
              <div className="lh-stat-card">
                <div className="lsc-n">6+</div>
                <div className="lsc-l">Active community members</div>
              </div>
            </div>
            <div className="lh-stat-card">
              <div className="lsc-n">4</div>
              <div className="lsc-l">Lab areas — New Members, Ideas, Feedback & Discussion, Mentorship Requests</div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-inner">
          <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
            <div className="eyebrow">
              <div className="eyebrow-rule" />
              How the Lab works
            </div>
            <div className="sec-title">
              Four steps to <em>better HR thinking.</em>
            </div>
          </div>
          <div className="how-grid">
            {[
              { n: "1", title: "Introduce yourself", body: "Join the New Members area, share who you are and what you're working on — and find peers at your career stage." },
              { n: "2", title: "Submit your ideas", body: "Bring a real HR challenge, a new approach, or an experimental idea to the Idea Submission Board for peer review." },
              { n: "3", title: "Discuss & debate", body: "The Feedback & Discussion boards are where ideas get stress-tested — by people who understand the complexity of HR decisions." },
              { n: "4", title: "Request mentorship", body: "The Mentorship Request boards connect you with experienced HR practitioners for guidance on specific challenges and career questions." },
            ].map((s) => (
              <div className="how-step" key={s.n}>
                <div className="hs-num">{s.n}</div>
                <div className="hs-title">{s.title}</div>
                <p className="hs-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BoardsSection openCompose={openCompose} openMentor={openMentor} />

      <section className="forum-section" id="forum">
        <div className="forum-inner">
          <div className="eyebrow">
            <div className="eyebrow-rule" />
            Live Forum
          </div>
          <div className="sec-title" style={{ marginBottom: "8px" }}>Jump straight in</div>
          <p className="sec-sub">The full forum lives below — browse, read, and post without leaving this page.</p>

          <div className="forum-frame-wrap">
            <div className="forum-frame-header">
              <span style={{ fontSize: "16px" }}>🔬</span>
              <div className="ffh-title">HR Playhouse Hub Innovation Lab Forum</div>
              <div className="ffh-live">
                <div className="live-dot" />
                Live
              </div>
              <button className="forum-hdr-btn" onClick={() => openCompose(null, null)}>+ New post</button>
            </div>

            <div className="forum-filter-bar">
              <div className="forum-filters">
                {FILTER_BUTTONS.map((b) => (
                  <button
                    key={b.id}
                    className={`filt-btn${filter === b.id ? " active" : ""}`}
                    onClick={() => changeFilter(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <button className="forum-post-btn" onClick={() => openCompose(null, null)}>+ Post in Lab</button>
            </div>

            {threadPost && threadBoard ? (
              <div>
                <div className="thread-back-bar">
                  <button className="thread-back-btn" onClick={closeThread}>← Back to forum</button>
                  <span
                    className="thread-board-pill"
                    style={{ background: threadBoard.bg, color: threadBoard.col }}
                  >
                    {threadBoard.emoji} {threadBoard.label}
                  </span>
                </div>
                <div className="thread-content">
                  <div className="thread-op">
                    <div className="thread-op-meta">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: threadPost.avbg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--f-display)",
                          fontSize: "13px",
                          fontWeight: 900,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {threadPost.initials}
                      </div>
                      <div>
                        <div className="thread-op-name">{threadPost.author}</div>
                        <div style={{ fontSize: "11px", color: "var(--ink-4)" }}>
                          {threadPost.ts}{threadPost.pinned ? " · 📌 pinned" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="thread-op-title">{threadPost.title}</div>
                    <div className="thread-op-body">{threadPost.body}</div>
                  </div>
                  {threadAllReplies.length > 0 ? (
                    <>
                      <div style={{ fontFamily: "var(--f-body)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--ink-4)", marginBottom: "12px" }}>
                        {threadAllReplies.length} {threadAllReplies.length === 1 ? "reply" : "replies"}
                      </div>
                      {threadAllReplies.map((r, idx) => (
                        <div className="thread-reply" key={idx}>
                          <div className="tr-avatar" style={{ background: r.avbg || "#0D1F3C" }}>
                            {r.initials || r.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="tr-body">
                            <div className="tr-name">
                              {r.author}
                              <span style={{ fontSize: "11px", color: "var(--ink-4)", fontWeight: 400, marginLeft: "8px" }}>
                                {r.ts || "Just now"}
                              </span>
                            </div>
                            <div className="tr-text">{r.body}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ padding: "20px 0", textAlign: "center", fontFamily: "var(--f-body)", fontSize: "13px", color: "var(--ink-4)" }}>
                      No replies yet — be the first to respond 👇
                    </div>
                  )}
                </div>
                <div className="thread-reply-bar">
                  <div style={{ fontFamily: "var(--f-display)", fontSize: "15px", fontWeight: 800, color: "var(--ink)", marginBottom: "14px" }}>
                    Leave a reply
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <input type="text" placeholder="Your name *" className="forum-input" value={trName} onChange={(e) => setTrName(e.target.value)} />
                    <input type="email" placeholder="Your email *" className="forum-input" value={trEmail} onChange={(e) => setTrEmail(e.target.value)} />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write your reply..."
                    className="forum-input"
                    style={{ minHeight: "80px", resize: "vertical", lineHeight: 1.6, width: "100%", marginBottom: "10px" }}
                    value={trBody}
                    onChange={(e) => setTrBody(e.target.value)}
                  />
                  <button className="forum-submit-btn" onClick={submitReply}>Post reply →</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ minHeight: "360px", maxHeight: "580px", overflowY: "auto" }}>
                  {visiblePosts.length === 0 ? (
                    <div style={{ padding: "56px 40px", textAlign: "center" }}>
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
                      <div style={{ fontFamily: "var(--f-display)", fontSize: "17px", fontWeight: 800, color: "var(--ink)", marginBottom: "7px" }}>Nothing here yet</div>
                      <div style={{ fontFamily: "var(--f-body)", fontSize: "13px", color: "var(--ink-3)", marginBottom: "18px" }}>Be the first to post in this board.</div>
                      <button className="forum-submit-btn" onClick={() => openCompose(null, null)}>Start the conversation →</button>
                    </div>
                  ) : (
                    visiblePosts.map((post) => {
                      const b = BOARDS[post.board];
                      const replyCount = (threadReplies[post.id]?.length ?? 0) + post.replies.length;
                      const preview = post.body.length > 110 ? `${post.body.slice(0, 110)}…` : post.body;
                      return (
                        <ForumPostRow
                          key={post.id}
                          post={post}
                          board={b}
                          preview={preview}
                          replyCount={replyCount}
                          onOpen={() => openThread(post.id)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <Calculator
            unlocked={calcUnlocked}
            dimValues={dimValues}
            setDim={setDim}
            score={score}
            grade={grade}
            ringCircumference={ringCircumference}
            ringOffset={ringOffset}
            onJoin={openJoin}
            onUnlock={() => setCalcUnlocked(true)}
            onSubmitIdea={() => openCompose("Share my scored idea", "Idea Submission Board")}
          />
        </div>

        {composeOpen && (
          <ComposeModal
            sent={composeSent}
            name={cmName}
            email={cmEmail}
            board={cmBoard}
            title={cmTitle}
            body={cmBody}
            setName={setCmName}
            setEmail={setCmEmail}
            setBoard={setCmBoard}
            setTitle={setCmTitle}
            setBody={setCmBody}
            onClose={closeCompose}
            onSubmit={submitPost}
          />
        )}

        {joinOpen && (
          <JoinModal
            sent={joinSent}
            first={jnFirst}
            last={jnLast}
            email={jnEmail}
            role={jnRole}
            setFirst={setJnFirst}
            setLast={setJnLast}
            setEmail={setJnEmail}
            setRole={setJnRole}
            onClose={closeJoin}
            onSubmit={submitJoin}
          />
        )}
      </section>

      <section className="community-section">
        <div className="community-inner">
          <div className="eyebrow" style={{ color: "rgba(255,255,255,.35)" }}>
            <div className="eyebrow-rule" />
            Our Community
          </div>
          <div className="community-grid">
            <div className="comm-left">
              <div className="comm-rule" />
              <div className="comm-headline">
                A community of HR
                <br />
                professionals who <em>think differently.</em>
              </div>
              <p className="comm-body">
                The Innovation Lab isn't just a forum. It's a thinking space for HR professionals who want to move beyond compliance and build the kind of people practice that actually changes organizations.
              </p>
              <a
                className="btn-accent"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openJoin();
                }}
              >
                {" Join the community → "}
              </a>
              <div className="comm-members" style={{ marginTop: "24px" }}>
                <div className="cm-avatar" style={{ background: "#C9501E", marginLeft: 0 }}>YE</div>
                <div className="cm-avatar" style={{ background: "#1E3560" }}>JA</div>
                <div className="cm-avatar" style={{ background: "#C4830A" }}>AO</div>
                <div className="cm-avatar" style={{ background: "#1a7a4a" }}>SC</div>
                <div className="cm-avatar" style={{ background: "#4c3a8a" }}>KT</div>
                <div className="cm-more">+1 member</div>
              </div>
            </div>
            <div className="comm-right">
              <div className="comm-stat">
                <div className="cs-n">16</div>
                <div className="cs-l">Active discussion boards across 4 areas</div>
              </div>
              <div className="comm-stat">
                <div className="cs-n">6</div>
                <div className="cs-l">Members and growing since launch</div>
              </div>
              <div className="comm-stat" style={{ gridColumn: "1/-1" }}>
                <div className="cs-n">∞</div>
                <div className="cs-l">Ideas, discussions, and mentorship connections waiting to happen — the Lab grows as the community does</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="cta-strip-inner">
          <div className="cs-text">
            <div className="cst-title">Ready to contribute your first idea?</div>
            <div className="cst-sub">Sign up free and join the conversation — your perspective matters in this community.</div>
          </div>
          <a
            className="btn-white"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openJoin();
            }}
          >
            {" Join the Innovation Lab → "}
          </a>
        </div>
      </section>

      {mentorOpen && (
        <MentorModal
          sent={mentorSent}
          mentor={currentMentor}
          name={mrName}
          email={mrEmail}
          role={mrRole}
          topic={mrTopic}
          message={mrMessage}
          setName={setMrName}
          setEmail={setMrEmail}
          setRole={setMrRole}
          setTopic={setMrTopic}
          setMessage={setMrMessage}
          onClose={closeMentor}
          onSubmit={submitMentor}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function ForumPostRow({
  post,
  board,
  preview,
  replyCount,
  onOpen,
}: {
  post: Post;
  board: Board;
  preview: string;
  replyCount: number;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="forum-post-row"
      style={{ background: hover ? "var(--canvas-2)" : "#fff" }}
      onClick={onOpen}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className="fpr-avatar" style={{ background: post.avbg }}>{post.initials}</div>
      <div className="fpr-body">
        <div className="fpr-meta">
          <span className="fpr-name">{post.author}</span>
          <span className="fpr-badge" style={{ background: board.bg, color: board.col }}>
            {board.emoji} {board.label}
          </span>
          {post.pinned ? <span className="fpr-time">📌 pinned</span> : <span className="fpr-time">{post.ts}</span>}
        </div>
        <div className="fpr-title">{post.title}</div>
        <div className="fpr-preview">{preview}</div>
        <div className="fpr-footer">
          <button
            className="fpr-action"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            💬 Reply
          </button>
          <span className="fpr-replies">{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
        </div>
      </div>
    </div>
  );
}

function BoardsSection({
  openCompose,
  openMentor,
}: {
  openCompose: (topic?: string | null, board?: string | null) => void;
  openMentor: (name: string, role: string) => void;
}) {
  const newMemberTopics = ["Introduce Yourself", "Forum Guidelines", "Forum FAQs", "Forum Announcements"];
  const ideaTopics = [
    "Innovative Approaches to Conflict Resolution",
    "Reimagining Performance Management",
    "AI in HR: Opportunities & Risks",
    "Improving Engagement in Remote Teams",
  ];
  const feedbackTopics = [
    "Reflections on Recent Case Studies",
    "What Would You Do Differently?",
    "Ethical Dilemmas in HR Practice",
    "Balancing Policy with Empathy",
  ];

  return (
    <section className="boards-section">
      <div className="section-inner">
        <div className="boards-header">
          <div>
            <div className="eyebrow">
              <div className="eyebrow-rule" />
              Discussion Boards
            </div>
            <div className="sec-title">
              Four lab areas.
              <br />
              One <em>community.</em>
            </div>
          </div>
          <p className="sec-sub">Each board has a specific purpose — find the right space for where you are and what you need right now.</p>
        </div>

        <div className="boards-grid">
          <div className="board-card">
            <div className="bc-header">
              <div className="bc-icon" style={{ background: "#E8ECF4" }}>👋</div>
              <div>
                <div className="bc-badge" style={{ background: "#E8ECF4", color: "#1E3560" }}>Starting point</div>
                <div className="bc-title">New Members Area</div>
                <div className="bc-sub">Introduce yourself, ask your first questions, and meet peers at every career stage.</div>
              </div>
            </div>
            <div className="bc-topics">
              {newMemberTopics.map((t, i) => (
                <a
                  key={t}
                  className="bc-topic"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openCompose(t, "New Members Area");
                  }}
                >
                  <div className="bt-dot" style={{ background: "#1E3560" }} />
                  <div className="bt-title">{t}</div>
                  <div className="bt-count">{i === 0 ? "1 post" : "0 posts"}</div>
                </a>
              ))}
            </div>
            <div className="bc-footer">
              <div className="bc-footer-stat">4 topics · 1 post total</div>
              <a
                className="bc-cta"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCompose("Introduce Yourself", "New Members Area");
                }}
              >
                Enter →
              </a>
            </div>
          </div>

          <div className="board-card">
            <div className="bc-header">
              <div className="bc-icon" style={{ background: "#FAF0EB" }}>💡</div>
              <div>
                <div className="bc-badge" style={{ background: "#FAF0EB", color: "#A8400F" }}>Submit ideas</div>
                <div className="bc-title">Idea Submission Board</div>
                <div className="bc-sub">Share unconventional HR approaches and get structured peer feedback before implementing.</div>
              </div>
            </div>
            <div className="bc-topics">
              {ideaTopics.map((t) => {
                const boardLabel = t === "AI in HR: Opportunities & Risks" ? "Innovation Lab" : "Idea Submission Board";
                const topicArg = t === "AI in HR: Opportunities & Risks" ? "General Discussion" : t;
                return (
                  <a
                    key={t}
                    className="bc-topic"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openCompose(topicArg, boardLabel);
                    }}
                  >
                    <div className="bt-dot" style={{ background: "var(--accent)" }} />
                    <div className="bt-title">{t}</div>
                    <div className="bt-count">0 posts</div>
                  </a>
                );
              })}
            </div>
            <div className="bc-footer">
              <div className="bc-footer-stat">4 topics · be the first to post</div>
              <a
                className="bc-cta"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCompose("Share Your Idea", "Idea Submission Board");
                }}
              >
                Post idea →
              </a>
            </div>
          </div>

          <div className="board-card">
            <div className="bc-header">
              <div className="bc-icon" style={{ background: "#FDF4DD" }}>🗣</div>
              <div>
                <div className="bc-badge" style={{ background: "#FDF4DD", color: "#78350f" }}>Debate & discuss</div>
                <div className="bc-title">Feedback & Discussion</div>
                <div className="bc-sub">Reflect on case studies, debate ethical dilemmas, and navigate complex people decisions together.</div>
              </div>
            </div>
            <div className="bc-topics">
              {feedbackTopics.map((t) => (
                <a
                  key={t}
                  className="bc-topic"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openCompose(t, "Feedback & Discussion");
                  }}
                >
                  <div className="bt-dot" style={{ background: "var(--gold)" }} />
                  <div className="bt-title">{t}</div>
                  <div className="bt-count">0 posts</div>
                </a>
              ))}
            </div>
            <div className="bc-footer">
              <div className="bc-footer-stat">4 topics · be the first to post</div>
              <a
                className="bc-cta"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCompose("Start a Discussion", "Feedback and Discussion");
                }}
              >
                Start discussion →
              </a>
            </div>
          </div>

          <div className="board-card">
            <div className="bc-header">
              <div className="bc-icon" style={{ background: "#e8f7ee" }}>🤝</div>
              <div>
                <div className="bc-badge" style={{ background: "#e8f7ee", color: "#1a7a4a" }}>Get guidance</div>
                <div className="bc-title">Mentorship Requests</div>
                <div className="bc-sub">Connect with experienced HR practitioners for guidance on career transitions, leadership, and complex situations.</div>
              </div>
            </div>
            <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 0 }}>
              {MENTORS.map((m) => (
                <div
                  key={m.name}
                  className="mentor-card"
                  onClick={() => openMentor(m.name, m.role)}
                >
                  <div className="mentor-avatar" style={{ background: m.color }}>{m.initials}</div>
                  <div className="mentor-info">
                    <div className="mentor-name">{m.displayName}</div>
                    <div className="mentor-role">{m.roleDisplay}</div>
                    <div className="mentor-tags">
                      {m.tags.map((tag) => (
                        <span key={tag} className="mentor-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className="mentor-btn">Request →</button>
                </div>
              ))}
              <div
                className="mentor-card"
                style={{ borderBottom: "none" }}
                onClick={() => openCompose("Mentorship Request", "Mentorship Requests")}
              >
                <div className="mentor-avatar" style={{ background: "#5A6880", fontSize: "16px" }}>+</div>
                <div className="mentor-info">
                  <div className="mentor-name" style={{ color: "var(--ink-3)" }}>Become a mentor</div>
                  <div className="mentor-role">Share your experience with the community</div>
                </div>
                <button
                  className="mentor-btn"
                  style={{ background: "transparent", color: "var(--accent)", borderColor: "var(--accent)" }}
                >
                  Join →
                </button>
              </div>
            </div>
            <div className="bc-footer">
              <div className="bc-footer-stat">3 mentors available · responding within 5 days</div>
              <a
                className="bc-cta"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCompose("Mentorship Request", "Mentorship Requests");
                }}
              >
                Request mentorship →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator({
  unlocked,
  dimValues,
  setDim,
  score,
  grade,
  ringCircumference,
  ringOffset,
  onJoin,
  onUnlock,
  onSubmitIdea,
}: {
  unlocked: boolean;
  dimValues: Record<Dim, number>;
  setDim: (d: Dim, v: number) => void;
  score: number;
  grade: Grade;
  ringCircumference: number;
  ringOffset: number;
  onJoin: () => void;
  onUnlock: () => void;
  onSubmitIdea: () => void;
}) {
  const [joinHover, setJoinHover] = useState(false);

  return (
    <div
      style={{
        marginTop: "40px",
        background: "var(--white)",
        borderRadius: "16px",
        border: "1px solid var(--border-light)",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(10,22,40,.06)",
      }}
    >
      <div style={{ background: "var(--navy-3)", padding: "20px 28px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "20px" }}>🧮</span>
        <div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "16px", fontWeight: 800, color: "#fff" }}>
            HR Idea Impact Calculator
          </div>
          <div style={{ fontFamily: "var(--f-body)", fontSize: "12px", color: "rgba(255,255,255,.5)" }}>
            Score your HR idea before you submit it to the community
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          {unlocked ? (
            <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", fontWeight: 600, color: "#22c55e", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Member access
            </div>
          ) : (
            <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", color: "rgba(255,255,255,.4)" }}>🔒 Join to use</div>
          )}
        </div>
      </div>
      <div style={{ padding: "28px 32px", position: "relative" }} className="calc-body-wrap">
        {!unlocked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248,249,252,.92)",
              backdropFilter: "blur(6px)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              borderRadius: "0 0 14px 14px",
            }}
          >
            <div style={{ fontSize: "36px" }}>🔒</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontWeight: 900, color: "var(--ink)", textAlign: "center" }}>
              Join the Lab to use the calculator
            </div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--ink-3)", textAlign: "center", maxWidth: "340px", lineHeight: 1.6 }}>
              The HR Idea Impact Calculator is free for Innovation Lab members. Create your account in under a minute.
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={onJoin}
                onMouseOver={() => setJoinHover(true)}
                onMouseOut={() => setJoinHover(false)}
                style={{
                  height: "44px",
                  padding: "0 28px",
                  borderRadius: "100px",
                  background: joinHover ? "var(--accent-2)" : "var(--accent)",
                  color: "#fff",
                  border: "none",
                  fontFamily: "var(--f-body)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                Join free →
              </button>
              <button
                onClick={onUnlock}
                style={{
                  height: "44px",
                  padding: "0 22px",
                  borderRadius: "100px",
                  background: "transparent",
                  color: "var(--ink-3)",
                  border: "1.5px solid var(--border)",
                  fontFamily: "var(--f-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Already a member? Sign in
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {DIMS.map((d) => (
              <div className="calc-row" key={d}>
                <div className="calc-label">{DIM_LABELS[d].question}</div>
                <div className="calc-slider-wrap">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={dimValues[d]}
                    onChange={(e) => setDim(d, parseInt(e.target.value, 10))}
                    className="calc-slider"
                  />
                  <div className="calc-ticks">
                    {DIM_TICKS[d].map((tick) => (
                      <span key={tick}>{tick}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center", padding: "24px", background: "var(--canvas-2)", borderRadius: "14px", border: "1px solid var(--border-light)" }}>
              <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 16px" }}>
                <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={60} cy={60} r={50} fill="none" stroke="var(--mist)" strokeWidth={10} />
                  <circle
                    cx={60}
                    cy={60}
                    r={50}
                    fill="none"
                    stroke={grade.color}
                    strokeWidth={10}
                    strokeDasharray={ringCircumference.toFixed(2)}
                    strokeDashoffset={ringOffset.toFixed(1)}
                    strokeLinecap="round"
                    style={{ transition: ".5s" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: "32px", fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>{score}</div>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", color: "var(--ink-4)" }}>/ 100</div>
                </div>
              </div>
              <div style={{ fontFamily: "var(--f-display)", fontSize: "18px", fontWeight: 900, color: grade.color, marginBottom: "4px" }}>
                {grade.label}
              </div>
              <div style={{ fontFamily: "var(--f-body)", fontSize: "12px", color: "var(--ink-3)" }}>{grade.sub}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {DIMS.map((d) => (
                <div className="calc-dim" key={d}>
                  <div className="calc-dim-label">{DIM_LABELS[d].label}</div>
                  <div className="calc-dim-bar-wrap">
                    <div
                      className="calc-dim-bar"
                      style={{ width: `${(dimValues[d] / 5) * 100}%`, background: grade.color }}
                    />
                  </div>
                  <div className="calc-dim-val">{dimValues[d]}/5</div>
                </div>
              ))}
            </div>
            <button className="forum-submit-btn" style={{ width: "100%" }} onClick={onSubmitIdea}>
              {" Submit this idea to the Lab → "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposeModal({
  sent,
  name,
  email,
  board,
  title,
  body,
  setName,
  setEmail,
  setBoard,
  setTitle,
  setBody,
  onClose,
  onSubmit,
}: {
  sent: boolean;
  name: string;
  email: string;
  board: string;
  title: string;
  body: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setBoard: (v: string) => void;
  setTitle: (v: string) => void;
  setBody: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="lab-modal-bg"
      style={{ display: "flex" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lab-modal">
        <div className="lab-modal-hdr">
          <div>
            <div className="modal-board-pill" />
            <div className="lab-modal-title">New post</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: "42px", marginBottom: "14px" }}>🎉</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontWeight: 900, color: "var(--ink)", marginBottom: "8px" }}>Post received!</div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "20px" }}>
              Your post will appear on the board shortly after a quick review by our team. Thank you for contributing.
            </div>
            <button className="forum-submit-btn" onClick={onClose}>Back to Lab</button>
          </div>
        ) : (
          <div className="lab-modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div className="field-wrap">
                <label className="field-label">Your name <span className="req">*</span></label>
                <input type="text" placeholder="e.g. Adaeze Okafor" className="forum-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field-wrap">
                <label className="field-label">Email <span className="req">*</span></label>
                <input type="email" placeholder="you@work.com" className="forum-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="field-wrap" style={{ marginBottom: "12px" }}>
              <label className="field-label">Board</label>
              <select className="forum-input" style={{ cursor: "pointer" }} value={board} onChange={(e) => setBoard(e.target.value)}>
                {BOARD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="field-wrap" style={{ marginBottom: "12px" }}>
              <label className="field-label">Post title</label>
              <input type="text" placeholder="Give your post a short title" className="forum-input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field-wrap" style={{ marginBottom: "20px" }}>
              <label className="field-label">Your post <span className="req">*</span></label>
              <textarea
                rows={5}
                placeholder="Share your thoughts, question, idea, or introduction..."
                className="forum-input"
                style={{ minHeight: "110px", resize: "vertical", lineHeight: 1.6, width: "100%" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="forum-submit-btn" style={{ flex: 1 }} onClick={onSubmit}>Submit post →</button>
              <button className="forum-cancel-btn" onClick={onClose}>Cancel</button>
            </div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", color: "var(--ink-4)", textAlign: "center", marginTop: "10px" }}>
              Sent to the HR Playhouse Hub team and published after a quick review.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function JoinModal({
  sent,
  first,
  last,
  email,
  role,
  setFirst,
  setLast,
  setEmail,
  setRole,
  onClose,
  onSubmit,
}: {
  sent: boolean;
  first: string;
  last: string;
  email: string;
  role: string;
  setFirst: (v: string) => void;
  setLast: (v: string) => void;
  setEmail: (v: string) => void;
  setRole: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="lab-modal-bg"
      style={{ display: "flex" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lab-modal">
        <div className="lab-modal-hdr">
          <div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.45)", marginBottom: "4px" }}>
              HR Playhouse Hub
            </div>
            <div className="lab-modal-title">Join the Innovation Lab</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: "42px", marginBottom: "14px" }}>✅</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontWeight: 900, color: "var(--ink)", marginBottom: "8px" }}>You&apos;re in!</div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "20px" }}>
              Welcome to the Innovation Lab. Check your email to confirm your account, then come back and start posting.
            </div>
            <button className="forum-submit-btn" onClick={onClose}>Explore the Lab</button>
          </div>
        ) : (
          <div className="lab-modal-body">
            <p style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--ink-3)", lineHeight: 1.65, marginBottom: "20px" }}>
              Create your free account to post in discussions, submit ideas, and request mentorship from HR leaders.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div className="field-wrap">
                <label className="field-label">First name <span className="req">*</span></label>
                <input type="text" placeholder="First name" className="forum-input" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div className="field-wrap">
                <label className="field-label">Last name <span className="req">*</span></label>
                <input type="text" placeholder="Last name" className="forum-input" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>
            <div className="field-wrap" style={{ marginBottom: "12px" }}>
              <label className="field-label">Email address <span className="req">*</span></label>
              <input type="email" placeholder="your@email.com" className="forum-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field-wrap" style={{ marginBottom: "20px" }}>
              <label className="field-label">Your HR role</label>
              <input type="text" placeholder="e.g. HR Manager, 5 years experience" className="forum-input" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="forum-submit-btn" onClick={onSubmit}>Create account &amp; join →</button>
              <div style={{ textAlign: "center", fontFamily: "var(--f-body)", fontSize: "13px", color: "var(--ink-4)" }}>
                Already have an account?{" "}
                <a href="/sign-in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                  Sign in →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MentorModal({
  sent,
  mentor,
  name,
  email,
  role,
  topic,
  message,
  setName,
  setEmail,
  setRole,
  setTopic,
  setMessage,
  onClose,
  onSubmit,
}: {
  sent: boolean;
  mentor: { name: string; role: string };
  name: string;
  email: string;
  role: string;
  topic: string;
  message: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setRole: (v: string) => void;
  setTopic: (v: string) => void;
  setMessage: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const initials = mentor.name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const firstName = mentor.name.split(" ")[0] || mentor.name;

  return (
    <div
      className="lab-modal-bg"
      style={{ display: "flex" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lab-modal">
        <div className="lab-modal-hdr">
          <div>
            <div className="modal-board-pill">🤝 Mentorship Requests</div>
            <div className="lab-modal-title">
              {mentor.name ? `Request mentorship from ${firstName}` : "Request Mentorship"}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: "42px", marginBottom: "14px" }}>🤝</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "20px", fontWeight: 900, color: "var(--ink)", marginBottom: "8px" }}>Request sent!</div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--ink-3)", lineHeight: 1.7, marginBottom: "20px" }}>
              Your mentorship request has been received. The mentor will be in touch within 5 working days at the email address you provided.
            </div>
            <button className="forum-submit-btn" onClick={onClose}>Back to Lab</button>
          </div>
        ) : (
          <div className="lab-modal-body">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--canvas-2)", borderRadius: "10px", marginBottom: "20px", border: "1px solid var(--border-light)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#C9501E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--f-display)",
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontFamily: "var(--f-display)", fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>{mentor.name}</div>
                <div style={{ fontFamily: "var(--f-body)", fontSize: "12px", color: "var(--ink-3)" }}>{mentor.role}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div className="field-wrap">
                <label className="field-label">Your name <span className="req">*</span></label>
                <input type="text" placeholder="e.g. Adaeze Okafor" className="forum-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field-wrap">
                <label className="field-label">Email <span className="req">*</span></label>
                <input type="email" placeholder="you@work.com" className="forum-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="field-wrap" style={{ marginBottom: "12px" }}>
              <label className="field-label">Your current HR role & experience</label>
              <input type="text" placeholder="e.g. HR Officer, 3 years, manufacturing sector" className="forum-input" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="field-wrap" style={{ marginBottom: "12px" }}>
              <label className="field-label">What would you like mentorship on? <span className="req">*</span></label>
              <select className="forum-input" style={{ cursor: "pointer" }} value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="">Select a topic</option>
                {MENTOR_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field-wrap" style={{ marginBottom: "20px" }}>
              <label className="field-label">Tell the mentor what you are working through <span className="req">*</span></label>
              <textarea
                rows={4}
                placeholder="Describe the challenge or question you want help with. Be specific — the more context you give, the better the guidance you will receive."
                className="forum-input"
                style={{ minHeight: "100px", resize: "vertical", lineHeight: 1.6, width: "100%" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="forum-submit-btn" style={{ flex: 1 }} onClick={onSubmit}>Send mentorship request →</button>
              <button className="forum-cancel-btn" onClick={onClose}>Cancel</button>
            </div>
            <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", color: "var(--ink-4)", textAlign: "center", marginTop: "10px" }}>
              Mentors respond within 5 working days. Your request goes directly to the mentor and to the HR Playhouse Hub team.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
