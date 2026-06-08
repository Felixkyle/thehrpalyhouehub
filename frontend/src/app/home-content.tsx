"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./home.css";

/**
 * HR Playhouse Hub — homepage.
 *
 * Faithful port of hrplayhousehub_v7.html. Behaviours rewritten:
 *  - `showQA(type)` becomes React state for the sample-question explanation block.
 *  - `showSnap(level)` becomes React state for the self-assessment result panel.
 *  - The original sticky-nav `.scrolled`/`.top` toggle and the IntersectionObserver
 *    scroll-reveal are reproduced in a single useEffect with proper cleanup.
 *  - The mobile hamburger menu (originally inline classList toggle) is React state.
 *  - The consulting form retains the original EmailJS submit; on this static
 *    marketing page EmailJS is not actually loaded, so the submit falls through
 *    to the mailto fallback exactly as the original code does.
 *  - The Cloudflare email-decode script is dropped because the page contains no
 *    `data-cfemail` attributes (the obfuscated direct-email anchor is replaced
 *    with a plain mailto:).
 */

type QaState = "default" | "correct" | "wrong";
type SnapState = "default" | "L1" | "L2" | "L3" | "L4";

const CONTACT_EMAIL = "contact@thehrplayhousehub.org";

export default function HomeContent() {
  const [qaState, setQaState] = useState<QaState>("default");
  const [snapState, setSnapState] = useState<SnapState>("default");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setNavScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    reveals.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav
        className={`nav ${navScrolled ? "scrolled" : "top"}`}
        id="nav"
      >
        <div className="nav-inner">
          <a className="nav-logo" href="/">
            <svg
              className="nav-logo-svg"
              viewBox="0 0 220 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* iHR. mark */}
              <circle cx="22" cy="10" r="8" fill="currentColor" />
              <rect x="17" y="23" width="10" height="62" fill="currentColor" />
              <rect x="38" y="4" width="16" height="82" fill="currentColor" />
              <rect x="38" y="32" width="52" height="14" fill="currentColor" />
              <rect x="74" y="4" width="16" height="82" fill="currentColor" />
              <path
                d="M90 4 Q122 4 122 26 Q122 48 90 48"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeLinejoin="miter"
              />
              <line
                x1="90"
                y1="46"
                x2="120"
                y2="86"
                stroke="currentColor"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle cx="122" cy="96" r="8" fill="currentColor" />
              {/* Wordmark */}
              <text
                x="0"
                y="118"
                fontFamily="'Cabinet Grotesk', sans-serif"
                fontSize="13"
                fontWeight="900"
                letterSpacing="2"
                fill="currentColor"
              >
                THE HR PLAYHOUSE
              </text>
              <text
                x="44"
                y="128"
                fontFamily="'Cabinet Grotesk', sans-serif"
                fontSize="10"
                fontWeight="400"
                letterSpacing="6"
                fill="currentColor"
              >
                HUB
              </text>
            </svg>
          </a>
          <div className={`nav-links${mobileMenuOpen ? " open" : ""}`}>
            <a className="nav-link" href="#story">
              Our Story
            </a>
            <a
              className="nav-link"
              href="/learn/my-courses"
            >
              Courses
            </a>
            <Link className="nav-link" href="/learn/case-study-vault">
              Case Studies
            </Link>
            <Link className="nav-link" href="/learn/playbook">
              Playbook
            </Link>
            <Link className="nav-link" href="/learn/resources">
              Resources
            </Link>
            <Link className="nav-link" href="/learn/ai-support">
              AI Support
            </Link>
            <a className="nav-link" href="#consulting">
              Consulting
            </a>
          </div>
          <button
            type="button"
            className="nav-hamburger"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
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
            }}
          >
            <span
              style={{
                width: 18,
                height: 2,
                background: "#fff",
                borderRadius: 1,
                display: "block",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "#fff",
                borderRadius: 1,
                display: "block",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "#fff",
                borderRadius: 1,
                display: "block",
              }}
            />
          </button>
          <a
            className="nav-cta"
            href="/learn/my-courses"
          >
            Start Learning <span>→</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grain" />
        <div className="hero-glow" />
        <div className="hero-bottom-rule" />
        <div className="hero-inner">
          <div className="hero-overline">
            The HR Learning Platform · Built Different
          </div>
          <h1 className="hero-title">
            The HR platform
            <br />
            <span className="hero-title-italic">
              that takes you all the way.
            </span>
          </h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px auto",
              gap: 48,
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,.15)",
              paddingTop: 32,
              marginTop: 40,
            }}
          >
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 18,
                color: "rgba(255,255,255,.7)",
                lineHeight: 1.7,
              }}
            >
              From your first HR role to the executive table — research-backed,
              gamified, and built for HR professionals who refuse to stay
              ordinary.
            </p>
            <div>
              <div
                style={{
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 12px",
                    background: "rgba(0,0,0,.25)",
                    borderBottom: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ff5f57",
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ffbd2e",
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#28ca41",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: 5,
                      borderRadius: 3,
                      background: "rgba(255,255,255,.07)",
                      marginLeft: 8,
                    }}
                  />
                </div>
                <div style={{ display: "flex", height: 155 }}>
                  <div
                    style={{
                      width: 40,
                      background: "rgba(0,0,0,.2)",
                      borderRight: "1px solid rgba(255,255,255,.06)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px 0",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#C9501E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 7,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      MA
                    </div>
                    <div
                      style={{
                        width: 18,
                        height: 3,
                        borderRadius: 2,
                        background: "#C9501E",
                      }}
                    />
                    <div
                      style={{
                        width: 18,
                        height: 3,
                        borderRadius: 2,
                        background: "rgba(255,255,255,.12)",
                      }}
                    />
                    <div
                      style={{
                        width: 18,
                        height: 3,
                        borderRadius: 2,
                        background: "rgba(255,255,255,.12)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 9,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                        color: "rgba(255,255,255,.4)",
                      }}
                    >
                      Level 1 · HR Foundations
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: "rgba(255,255,255,.1)",
                        }}
                      >
                        <div
                          style={{
                            width: "68%",
                            height: 4,
                            borderRadius: 2,
                            background: "#C9501E",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "rgba(255,255,255,.5)",
                        }}
                      >
                        68%
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <div
                        style={{
                          flex: 1,
                          padding: "5px 6px",
                          borderRadius: 5,
                          background: "rgba(40,202,65,.15)",
                          border: "1px solid rgba(40,202,65,.3)",
                          fontSize: 8,
                          fontWeight: 700,
                          color: "#6fcf97",
                          lineHeight: 1.4,
                        }}
                      >
                        Case Study
                        <br />
                        <span style={{ fontWeight: 400, opacity: 0.8 }}>
                          ✓ Done
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: "5px 6px",
                          borderRadius: 5,
                          background: "rgba(201,80,30,.2)",
                          border: "1px solid rgba(201,80,30,.4)",
                          fontSize: 8,
                          fontWeight: 700,
                          color: "#f4a87c",
                          lineHeight: 1.4,
                        }}
                      >
                        Quiz
                        <br />
                        <span style={{ fontWeight: 400, opacity: 0.8 }}>
                          Active
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: "5px 6px",
                          borderRadius: 5,
                          background: "rgba(255,255,255,.04)",
                          border: "1px solid rgba(255,255,255,.08)",
                          fontSize: 8,
                          fontWeight: 700,
                          color: "rgba(255,255,255,.3)",
                          lineHeight: 1.4,
                        }}
                      >
                        Game
                        <br />
                        <span style={{ fontWeight: 400 }}>Locked</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 8px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,.05)",
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <span style={{ fontSize: 10 }}>🤖</span>
                      <span
                        style={{
                          fontSize: 8,
                          color: "rgba(255,255,255,.3)",
                          fontStyle: "italic",
                        }}
                      >
                        AI HR Support — ask anything...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  marginTop: 7,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.55)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  🎓 4 Levels
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.55)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  📚 32 Cases
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,.08)",
                    color: "rgba(255,255,255,.55)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  🆓 Free ACU
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flexShrink: 0,
              }}
            >
              <a
                className="btn-cream"
                href="/learn/my-courses"
              >
                Begin your journey →
              </a>
              <a className="btn-ghost-light" href="#story">
                Our story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="hero-proof-strip">
        <div className="hero-proof-inner">
          <div className="hero-proof-item">
            <div className="hp-n">4</div>
            <div className="hp-l">
              Career levels — Foundations to Innovation
            </div>
          </div>
          <div className="hero-proof-item">
            <div className="hp-n">32+</div>
            <div className="hp-l">
              Original case studies across 8 HR topics
            </div>
          </div>
          <div className="hero-proof-item">
            <div className="hp-n">12</div>
            <div className="hp-l">
              Live gamified activities embedded in the module
            </div>
          </div>
          <div className="hero-proof-item">
            <div className="hp-n">6</div>
            <div className="hp-l">
              Jurisdictions — UK, Nigeria, USA, Singapore &amp; more
            </div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <section
        id="story"
        style={{
          background: "#fff",
          padding: "44px 40px",
          borderTop: "1px solid rgba(10,22,40,.06)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{ width: 20, height: 1.5, background: "#0D1F3C" }}
                />
                <span
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#0D1F3C",
                  }}
                >
                  Our Story
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(38px,4.5vw,54px)",
                  fontWeight: 900,
                  color: "#0A1628",
                  lineHeight: 1.05,
                  letterSpacing: "-1px",
                }}
              >
                Not another
                <br />
                <em
                  style={{
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "#C9501E",
                  }}
                >
                  HR course.
                </em>
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "flex-start",
                paddingTop: 8,
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  background: "#F0F2F8",
                  borderRadius: 100,
                  textAlign: "center",
                  border: "1px solid rgba(10,22,40,.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#C9501E",
                    lineHeight: 1,
                  }}
                >
                  ACU
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 10,
                    color: "#5A6880",
                    marginTop: 2,
                  }}
                >
                  Grant-backed
                </div>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  background: "#F0F2F8",
                  borderRadius: 100,
                  textAlign: "center",
                  border: "1px solid rgba(10,22,40,.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#0D1F3C",
                    lineHeight: 1,
                  }}
                >
                  150+
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 10,
                    color: "#5A6880",
                    marginTop: 2,
                  }}
                >
                  Pilot users
                </div>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  background: "#F0F2F8",
                  borderRadius: 100,
                  textAlign: "center",
                  border: "1px solid rgba(10,22,40,.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#0D1F3C",
                    lineHeight: 1,
                  }}
                >
                  56
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 10,
                    color: "#5A6880",
                    marginTop: 2,
                  }}
                >
                  Commonwealth nations
                </div>
              </div>
            </div>
          </div>

          {/* Two columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              marginBottom: 40,
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <p
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 21,
                  fontWeight: 400,
                  color: "#0A1628",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                &quot;Why are HR professionals still being trained the same way
                they were in 2005?&quot;
              </p>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 15.5,
                  color: "#5A6880",
                  lineHeight: 1.8,
                }}
              >
                That question haunted Dr. Marvellous Gberevbie for years. As a
                faculty member at Covenant University, Nigeria, she watched
                talented HR professionals leave training programmes with
                certificates — and return to their desks exactly as they had
                left them. Armed with knowledge but not instinct. Equipped with
                frameworks but not confidence.
              </p>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 15.5,
                  color: "#5A6880",
                  lineHeight: 1.8,
                }}
              >
                She explored every platform available. She found the same
                formula everywhere: slides, videos, multiple-choice questions.
                Content about HR, delivered to passive recipients. Safe.
                Generic. Built for completion rates, not capability.
              </p>
              <div
                style={{
                  padding: "24px 28px",
                  background: "#0D1F3C",
                  borderRadius: 14,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.45,
                    fontStyle: "italic",
                    marginBottom: 12,
                  }}
                >
                  &quot;The best HR professionals are not the ones who know the
                  most policies. They are the ones who can think clearly, act
                  ethically, and lead with confidence in the moments that
                  matter.&quot;
                </p>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,.45)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  Dr. Marvellous A. C. Gberevbie · Founder
                </div>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 15.5,
                  color: "#5A6880",
                  lineHeight: 1.8,
                }}
              >
                So she built what did not exist. Not a content library. Not a
                quiz platform. Something genuinely different — a professional
                development experience that put HR practitioners inside real
                decisions, forced them to think under pressure, and gave them
                the tools, the language and the confidence to handle the
                hardest moments of the job.
              </p>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 15.5,
                  color: "#5A6880",
                  lineHeight: 1.8,
                }}
              >
                The first version was built at Covenant University under the
                ACU HR in Higher Education Community Grant, tested with over
                150 HR and administrative staff. The feedback was unanimous:
                this felt like real professional development, not another box
                to tick.
              </p>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 15.5,
                  color: "#5A6880",
                  lineHeight: 1.8,
                }}
              >
                HR Playhouse Hub is now growing beyond Nigeria — reaching
                practitioners in the UK, Singapore, the Caribbean and across
                the Commonwealth.{" "}
                <em style={{ color: "#0A1628", fontStyle: "normal" }}>
                  Playhouse
                </em>{" "}
                because the best learning is active, not passive.{" "}
                <em style={{ color: "#0A1628", fontStyle: "normal" }}>Hub</em>{" "}
                because no HR professional should figure this out alone.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    n: "01",
                    title: "Evidence, not opinion",
                    body: "CIPD, SHRM, Gallup and multi-jurisdiction law throughout.",
                  },
                  {
                    n: "02",
                    title: "Learning by doing",
                    body: "32 case studies, 12 games, a final project you actually use.",
                  },
                  {
                    n: "03",
                    title: "Built for the world",
                    body: "UK, Nigeria, USA, Singapore, China and Hong Kong law.",
                  },
                  {
                    n: "04",
                    title: "DEIB throughout",
                    body: "In every level, case and checklist — not a standalone module.",
                  },
                ].map((p) => (
                  <div
                    key={p.n}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "#F0F2F8",
                      border: "1px solid rgba(10,22,40,.06)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--f-display)",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "#1E3560",
                        marginBottom: 4,
                      }}
                    >
                      {p.n}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--f-display)",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#0A1628",
                        marginBottom: 3,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--f-body)",
                        fontSize: 11,
                        color: "#5A6880",
                        lineHeight: 1.5,
                      }}
                    >
                      {p.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive QA */}
          <div
            style={{
              background: "#0D1F3C",
              borderRadius: 16,
              padding: "32px 36px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  color: "rgba(255,255,255,.4)",
                  marginBottom: 10,
                }}
              >
                Try a sample question from the platform
              </div>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.45,
                  marginBottom: 20,
                }}
              >
                An employee raises a grievance the day before their performance
                review. What should you do first?
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <button
                  type="button"
                  onClick={() => setQaState("wrong")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.75)",
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: ".15s",
                  }}
                >
                  A. Postpone the review until the grievance is resolved
                </button>
                <button
                  type="button"
                  onClick={() => setQaState("correct")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.75)",
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: ".15s",
                  }}
                >
                  B. Acknowledge the grievance formally, keep the two processes
                  separate
                </button>
                <button
                  type="button"
                  onClick={() => setQaState("wrong")}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.75)",
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: ".15s",
                  }}
                >
                  C. Proceed with the review and address the grievance
                  afterwards
                </button>
              </div>
            </div>
            <div>
              {qaState === "default" && (
                <div
                  id="qa-default"
                  style={{
                    padding: "32px 24px",
                    background: "rgba(255,255,255,.04)",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 12,
                    height: "100%",
                    minHeight: 160,
                  }}
                >
                  <div style={{ fontSize: 28 }}>👈</div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 14,
                      color: "rgba(255,255,255,.35)",
                    }}
                  >
                    Select an answer to see the explanation
                  </div>
                </div>
              )}
              {qaState === "correct" && (
                <div
                  id="qa-correct"
                  style={{
                    padding: 24,
                    background: "rgba(40,202,65,.12)",
                    borderRadius: 12,
                    border: "1px solid rgba(40,202,65,.3)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#6fcf97",
                      marginBottom: 8,
                    }}
                  >
                    ✓ Correct — well done
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 14,
                      color: "rgba(255,255,255,.65)",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    The grievance and the review are separate processes.
                    Acknowledging the grievance formally protects both parties
                    and avoids any perception of victimisation. The review can
                    proceed on its original date.
                  </div>
                  <a
                    href="/learn/my-courses"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      height: 38,
                      padding: "0 18px",
                      background: "#C9501E",
                      color: "#fff",
                      borderRadius: 100,
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Try the full platform →
                  </a>
                </div>
              )}
              {qaState === "wrong" && (
                <div
                  id="qa-wrong"
                  style={{
                    padding: 24,
                    background: "rgba(201,80,30,.15)",
                    borderRadius: 12,
                    border: "1px solid rgba(201,80,30,.35)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f4a87c",
                      marginBottom: 8,
                    }}
                  >
                    Not quite — the answer is B
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 14,
                      color: "rgba(255,255,255,.65)",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    The grievance and the review must be treated as entirely
                    separate processes. Acknowledging the grievance formally in
                    writing protects both parties. The review proceeds —
                    postponing it could be seen as a management response to the
                    grievance itself.
                  </div>
                  <a
                    href="/learn/my-courses"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      height: 38,
                      padding: "0 18px",
                      background: "#C9501E",
                      color: "#fff",
                      borderRadius: 100,
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Learn more at Level 2 →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LEARNER JOURNEY */}
      <LearnerJourneySection />

      {/* FOUNDER */}
      <FounderSection />

      {/* HR SNAPSHOT */}
      <HrSnapshotSection snapState={snapState} setSnapState={setSnapState} />

      {/* JOURNEY (career stages) */}
      <CareerJourneySection />

      {/* PLATFORM */}
      <PlatformSection />

      {/* RESEARCH BAR */}
      <div className="research-bar">
        <div className="research-inner">
          <div className="research-label">Research foundations</div>
          <div className="research-items">
            <span className="research-item">CIPD Profession Map</span>
            <span style={{ color: "var(--ink-4)", fontSize: 18 }}>·</span>
            <span className="research-item">SHRM Standards</span>
            <span style={{ color: "var(--ink-4)", fontSize: 18 }}>·</span>
            <span className="research-item">Gallup Research</span>
            <span style={{ color: "var(--ink-4)", fontSize: 18 }}>·</span>
            <span className="research-item">ACAS Code</span>
            <span style={{ color: "var(--ink-4)", fontSize: 18 }}>·</span>
            <span className="research-item">Academic Peer Review</span>
            <span style={{ color: "var(--ink-4)", fontSize: 18 }}>·</span>
            <span className="research-item">
              Multi-jurisdiction Employment Law
            </span>
          </div>
        </div>
      </div>

      {/* CLOCKIQ STRIP */}
      <ClockiqStrip />

      {/* ACU IMPACT */}
      <AcuImpactStrip />

      {/* MYTH BUSTING */}
      <MythBustingSection />

      {/* NUMBERS */}
      <section className="numbers-section">
        <div className="section-inner" style={{ maxWidth: 1280 }}>
          <div className="numbers-grid">
            <div className="n-card reveal">
              <div className="n-big">32+</div>
              <div className="n-label">Original case studies</div>
              <div className="n-sub">
                Across 8 HR topic areas — recruitment, performance, DEIB,
                strategy, conflict, wellbeing, future of work, and more.
              </div>
            </div>
            <div className="n-card reveal reveal-delay-1">
              <div className="n-big">6</div>
              <div className="n-label">Jurisdictions covered</div>
              <div className="n-sub">
                UK, Nigeria, USA, Singapore, China, and Hong Kong employment
                law in every Playbook entry.
              </div>
            </div>
            <div className="n-card reveal reveal-delay-2">
              <div className="n-big">12</div>
              <div className="n-label">Live gamified activities</div>
              <div className="n-sub">
                Embedded directly — no external links, no downloads. Play them
                right in the learning module.
              </div>
            </div>
            <div className="n-card reveal reveal-delay-3">
              <div className="n-big">100%</div>
              <div className="n-label">DEIB integrated</div>
              <div className="n-sub">
                Woven throughout every level, every case, every game, and every
                legal checklist — not an afterthought.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOCKIQ FULL */}
      <ClockiqFullSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* PARTNERS */}
      <PartnersSection />

      {/* CONSULTING */}
      <ConsultingSection />

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg-word">Grow.</div>
        <div className="cta-inner">
          <div className="cta-layout">
            <div>
              <div className="cta-chip">
                <div className="cta-chip-dot" />
                Start today — it&apos;s free
              </div>
              <h2 className="cta-title">
                Your next level
                <br />
                is <em>waiting for you.</em>
              </h2>
              <p className="cta-desc">
                Join HR professionals from the UK, Nigeria, Singapore, and
                beyond who are building genuinely better HR practice — one
                level, one case study, one decision at a time.
              </p>
            </div>
            <div className="cta-right">
              <a
                className="btn-terra"
                href="/learn/my-courses"
              >
                Begin your journey →
              </a>
              <a
                className="btn-ghost-dark"
                href="/"
              >
                Explore the platform
              </a>
              <div className="cta-note">
                No subscription required to get started.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <a className="f-logo" href="/">
                <svg
                  className="f-logo-svg"
                  viewBox="0 0 220 130"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="22" cy="10" r="8" fill="currentColor" />
                  <rect
                    x="17"
                    y="23"
                    width="10"
                    height="62"
                    fill="currentColor"
                  />
                  <rect
                    x="38"
                    y="4"
                    width="16"
                    height="82"
                    fill="currentColor"
                  />
                  <rect
                    x="38"
                    y="32"
                    width="52"
                    height="14"
                    fill="currentColor"
                  />
                  <rect
                    x="74"
                    y="4"
                    width="16"
                    height="82"
                    fill="currentColor"
                  />
                  <path
                    d="M90 4 Q122 4 122 26 Q122 48 90 48"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeLinejoin="miter"
                  />
                  <line
                    x1="90"
                    y1="46"
                    x2="120"
                    y2="86"
                    stroke="currentColor"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <circle cx="122" cy="96" r="8" fill="currentColor" />
                  <text
                    x="0"
                    y="118"
                    fontFamily="'Cabinet Grotesk', sans-serif"
                    fontSize="13"
                    fontWeight="900"
                    letterSpacing="2"
                    fill="currentColor"
                  >
                    THE HR PLAYHOUSE
                  </text>
                  <text
                    x="44"
                    y="128"
                    fontFamily="'Cabinet Grotesk', sans-serif"
                    fontSize="10"
                    fontWeight="400"
                    letterSpacing="6"
                    fill="currentColor"
                  >
                    HUB
                  </text>
                </svg>
              </a>
              <p className="f-desc">
                A research-backed, gamified HR learning platform built for HR
                professionals at every stage — from first role to CHRO.
              </p>
              <div className="f-socials">
                <a
                  className="f-social"
                  href="https://www.linkedin.com/company/hr-playhouse-hub"
                  target="_blank"
                  rel="noopener"
                  title="LinkedIn"
                >
                  in
                </a>
                <a
                  className="f-social"
                  href="https://twitter.com/hrplayhousehub"
                  target="_blank"
                  rel="noopener"
                  title="Twitter / X"
                >
                  𝕏
                </a>
                <a
                  className="f-social"
                  href="https://www.instagram.com/hrplayhousehub"
                  target="_blank"
                  rel="noopener"
                  title="Instagram"
                >
                  ◻
                </a>
              </div>
            </div>
            <div>
              <div className="f-col-title">Platform</div>
              <div className="f-links">
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  Courses
                </a>
                <Link className="f-link" href="/learn/case-study-vault">
                  Case Study Vault
                </Link>
                <Link className="f-link" href="/learn/playbook">
                  HR Playbook
                </Link>
                <Link className="f-link" href="/learn/ai-support">
                  AI HR Support
                </Link>
                <Link className="f-link" href="/learn/innovation-lab">
                  Innovation Lab
                </Link>
              </div>
            </div>
            <div>
              <div className="f-col-title">Learning Levels</div>
              <div className="f-links">
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  L1 — Foundations
                </a>
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  L2 — Operational
                </a>
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  L3 — Strategic
                </a>
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  L4 — Innovation
                </a>
                <a
                  className="f-link"
                  href="/learn/my-courses"
                >
                  Final Project
                </a>
              </div>
            </div>
            <div>
              <div className="f-col-title">Company</div>
              <div className="f-links">
                <a className="f-link" href="#story">
                  Our Story
                </a>
                <a
                  className="f-link"
                  href="https://www.thehrplayhousehub.org/blog/"
                >
                  Blog
                </a>
                <a
                  className="f-link"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  Contact
                </a>
                <Link className="f-link" href="/learn/dashboard">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="f-copy">
              © 2026 HR Playhouse Hub. All rights reserved.
            </div>
            <div className="f-legal">
              <a
                className="f-legal-link"
                href="/privacy-policy/"
              >
                Privacy Policy
              </a>
              <a
                className="f-legal-link"
                href="/terms-of-service/"
              >
                Terms &amp; Conditions
              </a>
              <a
                className="f-legal-link"
                href="/cookie-policy/"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ──────────────────────────────────────────────
   LEARNER JOURNEY (the 4-level breakdown)
────────────────────────────────────────────── */
type Level = {
  num: string;
  title: React.ReactNode;
  cardStyle: React.CSSProperties;
  ctaLabel: string;
  ctaStyle: React.CSSProperties;
  who: string;
  learn: string[];
  formatLabel: string;
  format?: string[];
  capstone?: string;
  completion: string;
  wrapStyle?: React.CSSProperties;
};

function LearnerJourneySection() {
  const levels: Level[] = [
    {
      num: "Level 1",
      title: (
        <>
          HR
          <br />
          Foundations
        </>
      ),
      cardStyle: {
        background: "var(--navy)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      ctaLabel: "Start free →",
      ctaStyle: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 34,
        padding: "0 14px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--f-body)",
        textDecoration: "none",
        width: "fit-content",
      },
      who: "HR newcomers, career changers, and anyone who wants to build a proper professional foundation. No prior experience needed.",
      learn: [
        "The employment lifecycle end to end",
        "Core HR principles and professional ethics",
        "Building your professional HR identity",
        "Employment law fundamentals across 6 jurisdictions",
      ],
      formatLabel: "Format",
      format: ["Video lessons", "Case studies", "Interactive games", "Quizzes"],
      completion: "Level 1 Certificate issued",
      wrapStyle: {
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 0,
        background: "var(--white)",
        borderRadius: "16px 16px 2px 2px",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
      },
    },
    {
      num: "Level 2",
      title: (
        <>
          HR Operations
          <br />
          &amp; Compliance
        </>
      ),
      cardStyle: {
        background: "var(--navy-2)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      ctaLabel: "Explore →",
      ctaStyle: secondaryCta,
      who: "HR officers, HR managers, and practitioners 2–5 years into their career who need operational mastery and legal confidence.",
      learn: [
        "Recruitment, selection and onboarding systems",
        "Disciplinary and grievance management",
        "Performance management frameworks",
        "Compliance, data protection and legal risk",
      ],
      formatLabel: "Includes",
      format: ["HR Playbook access", "Legal checklists", "12 case studies"],
      completion: "Level 2 Certificate issued",
    },
    {
      num: "Level 3",
      title: (
        <>
          HR Leadership
          <br />
          &amp; Change
        </>
      ),
      cardStyle: {
        background: "var(--navy-3)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      ctaLabel: "Explore →",
      ctaStyle: secondaryCta,
      who: "Senior HR managers, HR business partners and those stepping into leadership — building strategic thinking and change management capability.",
      learn: [
        "Workforce planning and talent strategy",
        "Leading change and managing resistance",
        "DEIB strategy design and implementation",
        "Building management capability at scale",
      ],
      formatLabel: "Includes",
      format: [
        "Innovation Lab access",
        "Change case studies",
        "Leadership games",
      ],
      completion: "Level 3 Certificate issued",
    },
    {
      num: "Level 4",
      title: (
        <>
          Strategic HR
          <br />
          &amp; Innovation
        </>
      ),
      cardStyle: {
        background:
          "linear-gradient(160deg,var(--navy-deep) 0%,var(--accent-2) 100%)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      ctaLabel: "Explore →",
      ctaStyle: secondaryCta,
      who: "HR Directors, CHROs and those building executive-level people strategy — thinking at the intersection of HR, organisational design and business performance.",
      learn: [
        "HR analytics, data literacy and people metrics",
        "AI in HR — ethics, adoption and governance",
        "Future of work and agile HR models",
        "Board-level HR strategy and culture leadership",
      ],
      formatLabel: "Capstone",
      capstone:
        "A final HR Strategy Proposal — a real-world deliverable you can add to your professional portfolio.",
      completion: "Level 4 Certificate + Final Project grade",
      wrapStyle: {
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 0,
        background: "var(--white)",
        borderRadius: "2px 2px 16px 16px",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
      },
    },
  ];

  return (
    <section
      style={{
        background: "var(--canvas-2)",
        padding: "64px 40px",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 32,
          }}
        >
          <div>
            <div className="eyebrow reveal">
              <div
                className="eyebrow-rule"
                style={{ background: "var(--accent)" }}
              />
              Your Learning Journey
            </div>
            <h2
              className="h1 reveal reveal-delay-1"
              style={{ marginTop: 16 }}
            >
              From day one
              <br />
              <em>to the top floor.</em>
            </h2>
          </div>
          <p className="body reveal reveal-delay-2">
            A structured path through every stage of your HR career — each
            level builds on the last, and every lesson is designed to be used
            on Monday morning, not just passed on Friday afternoon.
          </p>
        </div>

        {/* Journey steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {levels.map((lv, idx) => (
            <div
              key={lv.num}
              className={`lj-step reveal${idx > 0 ? ` reveal-delay-${idx}` : ""}`}
              style={
                lv.wrapStyle ?? {
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: 0,
                  background: "var(--white)",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid var(--border-light)",
                }
              }
            >
              <div style={lv.cardStyle}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      color: "rgba(255,255,255,.4)",
                      marginBottom: 8,
                    }}
                  >
                    {lv.num}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: idx === 0 ? 28 : 26,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: idx === 0 ? 1 : 1.1,
                      letterSpacing: "-1px",
                    }}
                  >
                    {lv.title}
                  </div>
                </div>
                <a
                  href="/learn/my-courses"
                  style={lv.ctaStyle}
                >
                  {lv.ctaLabel}
                </a>
              </div>
              <div
                style={{
                  padding: 32,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
              >
                <div>
                  <div style={ljHeading}>Who it is for</div>
                  <p
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 14,
                      color: "var(--ink-3)",
                      lineHeight: 1.65,
                    }}
                  >
                    {lv.who}
                  </p>
                </div>
                <div>
                  <div style={ljHeading}>What you will learn</div>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {lv.learn.map((l) => (
                      <li
                        key={l}
                        style={{
                          fontFamily: "var(--f-body)",
                          fontSize: 13,
                          color: "var(--ink-3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            flexShrink: 0,
                            display: "block",
                          }}
                        />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={ljHeading}>{lv.formatLabel}</div>
                  {lv.format ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {lv.format.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 100,
                            background: "var(--mist)",
                            color: "var(--navy-3)",
                            fontFamily: "var(--f-body)",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        fontFamily: "var(--f-body)",
                        fontSize: 13,
                        color: "var(--ink-3)",
                        lineHeight: 1.6,
                      }}
                    >
                      {lv.capstone}
                    </p>
                  )}
                </div>
                <div>
                  <div style={ljHeading}>On completion</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      background: "var(--gold-pale)",
                      borderRadius: 8,
                      border: "1px solid rgba(196,131,10,.15)",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>🏆</span>
                    <span
                      style={{
                        fontFamily: "var(--f-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--gold)",
                      }}
                    >
                      {lv.completion}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 40,
            padding: "28px 36px",
            background: "var(--navy)",
            borderRadius: 14,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 5,
              }}
            >
              Not sure where to start?
            </div>
            <div
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 14,
                color: "rgba(255,255,255,.5)",
              }}
            >
              Begin at Level 1 — it is free, it is not basic, and it will tell
              you exactly where you are.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/learn/my-courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 46,
                padding: "0 28px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--f-body)",
                textDecoration: "none",
              }}
            >
              Start Level 1 free →
            </a>
            <Link
              href="/learn/ai-support"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 46,
                padding: "0 24px",
                background: "rgba(255,255,255,.08)",
                color: "rgba(255,255,255,.8)",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "var(--f-body)",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              Ask AI HR Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const secondaryCta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 34,
  padding: "0 14px",
  background: "rgba(255,255,255,.15)",
  color: "#fff",
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 700,
  fontFamily: "var(--f-body)",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,.2)",
  width: "fit-content",
};

const ljHeading: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: 15,
  fontWeight: 800,
  color: "var(--ink)",
  marginBottom: 8,
};

/* ──────────────────────────────────────────────
   FOUNDER
────────────────────────────────────────────── */
function FounderSection() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "60px 40px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Founder visual */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(201,80,30,.25)",
                  background:
                    "linear-gradient(135deg,#0D1F3C 0%,#1E3560 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", padding: 16 }}>
                  <svg
                    viewBox="0 0 100 100"
                    width="80"
                    height="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="36" r="18" fill="#D4876A" />
                    <path
                      d="M18 96c0-17.7 14.3-32 32-32s32 14.3 32 32"
                      stroke="#D4876A"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 11,
                      color: "rgba(255,255,255,.5)",
                      marginTop: 4,
                    }}
                  >
                    Dr. Marvellous Gberevbie
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--ink)",
                  marginBottom: 2,
                }}
              >
                Dr. Marvellous A. C. Gberevbie
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                }}
              >
                Founder · HR Playhouse Hub
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  marginTop: 2,
                }}
              >
                Covenant University, Nigeria
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
              }}
            >
              {["HR Academic", "ACU Grant", "EdTech"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 100,
                    background: "var(--mist)",
                    color: "var(--ink-3)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  background: "rgba(13,31,60,.06)",
                  color: "var(--navy)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontFamily: "var(--f-display)",
                }}
              >
                HR Academic
              </span>
              <span
                style={{
                  background: "rgba(201,80,30,.08)",
                  color: "var(--accent)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontFamily: "var(--f-display)",
                }}
              >
                ACU Grant Lead
              </span>
              <span
                style={{
                  background: "rgba(13,31,60,.06)",
                  color: "var(--navy)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontFamily: "var(--f-display)",
                }}
              >
                Experience Designer
              </span>
            </div>
          </div>

          {/* Founder bio */}
          <div>
            <div className="eyebrow">
              <div className="eyebrow-rule" />
              Meet the Founder
            </div>
            <h2
              className="h1"
              style={{ marginTop: 14, marginBottom: 20 }}
            >
              Built by someone who
              <br />
              <em>lives the work.</em>
            </h2>
            <p className="body" style={{ marginBottom: 16 }}>
              Dr. Marvellous Gberevbie is an HR practitioner, academic, and
              experience designer whose career spans both the theory and
              reality of HR in higher education. As a faculty member at
              Covenant University, Nigeria, she has spent years observing the
              gap between how HR is taught and how it is actually practised —
              particularly in African and Commonwealth institutions where HR
              capacity is most urgently needed.
            </p>
            <p className="body" style={{ marginBottom: 16 }}>
              Her research focuses on Sustainable Human Resource Management —
              how organisations can build HR systems that are not just legally
              compliant but genuinely human-centred, equitable, and capable of
              adapting to the pace of change in the modern workplace. This
              research underpins every level of the HR Playhouse Hub.
            </p>
            <p className="body" style={{ marginBottom: 28 }}>
              The HR Playhouse Hub was developed under the ACU HR in HE
              Community Grant 2025–2026 — a competitive grant awarded to
              projects that advance HR practice across Commonwealth higher
              education institutions. It is the platform she wished had
              existed when she was beginning her own HR career.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  height: 42,
                  padding: "0 20px",
                  background: "var(--navy)",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--f-display)",
                  textDecoration: "none",
                }}
              >
                Get in touch →
              </a>
              <a
                href="#consulting"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  height: 42,
                  padding: "0 20px",
                  background: "transparent",
                  color: "var(--navy)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--f-display)",
                  textDecoration: "none",
                }}
              >
                Consulting services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   HR SNAPSHOT (self-assessment)
────────────────────────────────────────────── */
type SnapResult = {
  level: string;
  title: React.ReactNode;
  intro: string;
  bullets: { color: string; text: string }[];
  cta: string;
};

const SNAP_RESULTS: Record<"L1" | "L2" | "L3" | "L4", SnapResult> = {
  L1: {
    level: "Level 1",
    title: (
      <>
        Level 1
        <br />
        HR Foundations
      </>
    ),
    intro:
      "This is where every great HR career begins — not with policies, but with instinct. You will build the professional identity and core frameworks that everything else builds on. It is free, it is not basic, and it will change how you see the job.",
    bullets: [
      { color: "#C9501E", text: "4–6 hours at your own pace" },
      {
        color: "#C9501E",
        text: "Case studies, games and real scenarios",
      },
      { color: "#C9501E", text: "Certificate on completion" },
      {
        color: "#28ca41",
        text: "Free for ACU member institution staff",
      },
    ],
    cta: "Start Level 1 free →",
  },
  L2: {
    level: "Level 2",
    title: (
      <>
        Level 2
        <br />
        HR Operations &amp; Compliance
      </>
    ),
    intro:
      "You know the basics. Level 2 gives you the operational mastery and legal confidence to handle the situations that actually keep HR professionals awake at night — disciplinaries, grievances, performance, compliance. With six jurisdictions covered.",
    bullets: [
      { color: "#C9501E", text: "12 case studies across 8 topics" },
      { color: "#C9501E", text: "HR Playbook with legal checklists" },
      {
        color: "#C9501E",
        text: "UK · Nigeria · USA · Singapore · China · HK law",
      },
    ],
    cta: "Explore Level 2 →",
  },
  L3: {
    level: "Level 3",
    title: (
      <>
        Level 3
        <br />
        HR Leadership &amp; Change
      </>
    ),
    intro:
      "You are ready to lead, not just manage. Level 3 builds the strategic thinking, change management and DEIB capability that separates great HR practitioners from good ones. Built for the step up — not just the step along.",
    bullets: [
      { color: "#C9501E", text: "Workforce planning and talent strategy" },
      { color: "#C9501E", text: "Change management and resistance" },
      { color: "#C9501E", text: "Innovation Lab access" },
    ],
    cta: "Explore Level 3 →",
  },
  L4: {
    level: "Level 4",
    title: (
      <>
        Level 4
        <br />
        Strategic HR &amp; Innovation
      </>
    ),
    intro:
      "You are already leading. Level 4 is about what happens at the intersection of HR, organisational design and the future of work — AI ethics, people analytics, agile HR models, and the final Strategy Proposal that proves you can operate at board level.",
    bullets: [
      { color: "#C9501E", text: "AI in HR — ethics, adoption, governance" },
      { color: "#C9501E", text: "HR analytics and people metrics" },
      {
        color: "#C9501E",
        text: "Final HR Strategy Proposal — portfolio piece",
      },
    ],
    cta: "Explore Level 4 →",
  },
};

const SNAP_OPTIONS: {
  level: "L1" | "L2" | "L3" | "L4";
  title: string;
  meta: string;
}[] = [
  {
    level: "L1",
    title: "I am new to HR or just starting out",
    meta: "Less than 2 years experience · Studying or just qualified · Career changer",
  },
  {
    level: "L2",
    title: "I handle day-to-day HR but want more depth",
    meta: "2–5 years experience · HR officer or advisor · Managing processes confidently",
  },
  {
    level: "L3",
    title: "I am stepping into HR leadership",
    meta: "5–10 years experience · HR manager or HRBP · Influencing beyond my team",
  },
  {
    level: "L4",
    title: "I am at director or senior strategic level",
    meta: "10+ years · HR Director or CHRO · Sitting at the board or wanting to",
  },
];

function HrSnapshotSection({
  snapState,
  setSnapState,
}: {
  snapState: SnapState;
  setSnapState: (s: SnapState) => void;
}) {
  return (
    <section
      style={{
        background: "var(--canvas-2)",
        padding: "64px 40px",
        borderTop: "1px solid var(--border-light)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{ width: 20, height: 1.5, background: "#0D1F3C" }}
              />
              <span
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#0D1F3C",
                }}
              >
                Quick self-assessment
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(32px,4vw,48px)",
                fontWeight: 900,
                color: "#0A1628",
                lineHeight: 1.05,
                letterSpacing: "-1px",
                marginBottom: 20,
              }}
            >
              Where are you in your
              <br />
              <em
                style={{
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#C9501E",
                }}
              >
                HR journey?
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 16,
                color: "#5A6880",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Select the statement that best describes where you are right
              now. We will suggest which level to start with.
            </p>
            <div
              id="snap-options"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {SNAP_OPTIONS.map((opt) => (
                <div
                  key={opt.level}
                  onClick={() => setSnapState(opt.level)}
                  style={{
                    cursor: "pointer",
                    padding: "16px 20px",
                    borderRadius: 12,
                    background: "#fff",
                    border:
                      snapState === opt.level
                        ? "1.5px solid #C9501E"
                        : "1.5px solid rgba(10,22,40,.08)",
                    transition: ".2s",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#0A1628",
                      marginBottom: 3,
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 12,
                      color: "#9BABC0",
                    }}
                  >
                    {opt.meta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: result panel */}
          <div
            id="snap-result"
            style={{
              background: "#0D1F3C",
              borderRadius: 18,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 440,
            }}
          >
            {snapState === "default" && (
              <div
                id="snap-default"
                style={{ textAlign: "center", padding: "40px 0" }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "rgba(255,255,255,.5)",
                    lineHeight: 1.4,
                  }}
                >
                  Select a statement on the left
                  <br />
                  to see your recommended starting point
                </div>
              </div>
            )}
            {snapState !== "default" && (
              <SnapResultPanel result={SNAP_RESULTS[snapState]} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SnapResultPanel({ result }: { result: SnapResult }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--f-body)",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          color: "#C9501E",
          marginBottom: 12,
        }}
      >
        Your recommended start
      </div>
      <div
        style={{
          fontFamily: "var(--f-display)",
          fontSize: 36,
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "-1px",
          marginBottom: 8,
        }}
      >
        {result.title}
      </div>
      <div
        style={{
          fontFamily: "var(--f-body)",
          fontSize: 15,
          color: "rgba(255,255,255,.6)",
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        {result.intro}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 28,
        }}
      >
        {result.bullets.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--f-body)",
              fontSize: 13,
              color: "rgba(255,255,255,.6)",
            }}
          >
            <span style={{ color: b.color }}>→</span> {b.text}
          </div>
        ))}
      </div>
      <a
        href="/learn/my-courses"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 46,
          padding: "0 28px",
          background: "#C9501E",
          color: "#fff",
          borderRadius: 100,
          fontFamily: "var(--f-body)",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        {result.cta}
      </a>
    </div>
  );
}

/* ──────────────────────────────────────────────
   CAREER JOURNEY (5 stages SVG cards)
────────────────────────────────────────────── */
function CareerJourneySection() {
  return (
    <section className="journey-section">
      <div className="journey-inner">
        <div className="journey-header">
          <div>
            <div
              className="eyebrow reveal"
              style={{ color: "rgba(255,255,255,.35)" }}
            >
              <div className="eyebrow-rule" />
              The HR Career Journey
            </div>
            <h2
              className="h1 on-dark reveal reveal-delay-1"
              style={{ marginTop: 16 }}
            >
              Every stage.
              <br />
              <em>Covered.</em>
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 28,
              }}
            >
              {[
                {
                  n: "5",
                  body: "Career stages — from first HR role to CHRO",
                },
                {
                  n: "4",
                  body: "Progressively deeper learning levels, each building on the last",
                },
                {
                  n: "1",
                  body: "Final HR Strategy Proposal — a portfolio piece you keep and use",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    background: "rgba(255,255,255,.06)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#C9501E",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {item.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      color: "rgba(255,255,255,.55)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p
            className="body on-dark reveal reveal-delay-2"
            style={{ paddingBottom: 4 }}
          >
            The platform is structured around five career stages. Wherever you
            are today — newcomer or near the top — there is a level built for
            exactly where you are, and a path forward to where you want to be.
          </p>
        </div>

        <div className="journey-stages reveal">
          {/* Stage 1: Newcomer */}
          <div className="journey-stage">
            <div className="person-wrap">
              <svg
                className="person-svg"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="28" cy="16" r="9" fill="#D4876A" />
                <path
                  d="M14 48c0-7.7 6.3-14 14-14s14 6.3 14 14"
                  stroke="#D4876A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity=".7"
                />
                <circle cx="42" cy="20" r="5" fill="rgba(201,80,30,.2)" />
                <text
                  x="39.5"
                  y="24"
                  fontFamily="serif"
                  fontSize="8"
                  fontWeight="700"
                  fill="#C9501E"
                  opacity=".8"
                >
                  ?
                </text>
              </svg>
            </div>
            <div>
              <div
                className="stage-num"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.75)",
                }}
              >
                Level 1
              </div>
              <div className="stage-role">
                The
                <br />
                Newcomer
              </div>
            </div>
            <div className="stage-desc">
              Just entering HR. Building foundations, professional identity,
              and understanding what this profession really means.
            </div>
            <div className="stage-skills">
              <span className="stage-skill">Trust</span>
              <span className="stage-skill">HR Basics</span>
              <span className="stage-skill">Culture</span>
            </div>
          </div>

          {/* Stage 2: Practitioner */}
          <div className="journey-stage">
            <div className="person-wrap">
              <svg
                className="person-svg"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="28" cy="15" r="9.5" fill="#C67A5A" />
                <path
                  d="M13 48c0-8.3 6.7-15 15-15s15 6.7 15 15"
                  stroke="#C67A5A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  opacity=".85"
                />
                <rect
                  x="40"
                  y="22"
                  width="8"
                  height="10"
                  rx="1.5"
                  fill="rgba(201,80,30,.25)"
                />
                <line
                  x1="42"
                  y1="25"
                  x2="46"
                  y2="25"
                  stroke="#C9501E"
                  strokeWidth="1"
                  opacity=".6"
                />
                <line
                  x1="42"
                  y1="27.5"
                  x2="46"
                  y2="27.5"
                  stroke="#C9501E"
                  strokeWidth="1"
                  opacity=".6"
                />
                <line
                  x1="42"
                  y1="30"
                  x2="44.5"
                  y2="30"
                  stroke="#C9501E"
                  strokeWidth="1"
                  opacity=".6"
                />
              </svg>
            </div>
            <div>
              <div
                className="stage-num"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.75)",
                }}
              >
                Level 2
              </div>
              <div className="stage-role">
                The
                <br />
                Practitioner
              </div>
            </div>
            <div className="stage-desc">
              Running the processes. Hiring, performance, absence, retention —
              building operational credibility day by day.
            </div>
            <div className="stage-skills">
              <span className="stage-skill">Hiring</span>
              <span className="stage-skill">Performance</span>
              <span className="stage-skill">Retention</span>
            </div>
          </div>

          {/* Stage 3: Strategist */}
          <div className="journey-stage">
            <div className="person-wrap">
              <svg
                className="person-svg"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="28" cy="14" r="10" fill="#B86A48" />
                <path
                  d="M12 48c0-8.8 7.2-16 16-16s16 7.2 16 16"
                  stroke="#B86A48"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <polyline
                  points="40,32 42,28 44,29 46,24"
                  stroke="#C9501E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity=".7"
                  fill="none"
                />
                <circle cx="46" cy="24" r="2" fill="#C9501E" opacity=".7" />
              </svg>
            </div>
            <div>
              <div
                className="stage-num"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.75)",
                }}
              >
                Level 3
              </div>
              <div className="stage-role">
                The
                <br />
                Strategist
              </div>
            </div>
            <div className="stage-desc">
              Aligning HR to business goals. Analytics, succession planning,
              leadership development, and HR strategy design.
            </div>
            <div className="stage-skills">
              <span className="stage-skill">Analytics</span>
              <span className="stage-skill">Succession</span>
              <span className="stage-skill">Strategy</span>
            </div>
          </div>

          {/* Stage 4: Innovator */}
          <div className="journey-stage">
            <div className="person-wrap">
              <svg
                className="person-svg"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="28" cy="13" r="10.5" fill="#A05A38" />
                <path
                  d="M11 48c0-9.4 7.6-17 17-17s17 7.6 17 17"
                  stroke="#A05A38"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="44"
                  cy="22"
                  r="4.5"
                  fill="none"
                  stroke="#C4830A"
                  strokeWidth="1.5"
                  opacity=".8"
                />
                <line
                  x1="44"
                  y1="27"
                  x2="44"
                  y2="30"
                  stroke="#C4830A"
                  strokeWidth="1.5"
                  opacity=".8"
                />
                <line
                  x1="42"
                  y1="30"
                  x2="46"
                  y2="30"
                  stroke="#C4830A"
                  strokeWidth="1.2"
                  opacity=".6"
                />
              </svg>
            </div>
            <div>
              <div
                className="stage-num"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.75)",
                }}
              >
                Level 4
              </div>
              <div className="stage-role">
                The
                <br />
                Innovator
              </div>
            </div>
            <div className="stage-desc">
              Shaping the future of work. AI in HR, gamification, agile
              structures, gig economy, and ethical technology leadership.
            </div>
            <div className="stage-skills">
              <span className="stage-skill">AI in HR</span>
              <span className="stage-skill">Future Work</span>
              <span className="stage-skill">EX Design</span>
            </div>
          </div>

          {/* Stage 5: Leader */}
          <div
            className="journey-stage"
            style={{ background: "rgba(201,80,30,.08)" }}
          >
            <div className="person-wrap">
              <svg
                className="person-svg"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="28" cy="12" r="11" fill="#8B3E20" />
                <path
                  d="M10 48c0-9.9 8.1-18 18-18s18 8.1 18 18"
                  stroke="#8B3E20"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M22 10L24.5 14L28 11L31.5 14L34 10L31 13.5L28 12L25 13.5Z"
                  fill="#C4830A"
                />
                <circle
                  cx="28"
                  cy="12"
                  r="14"
                  fill="none"
                  stroke="rgba(196,131,10,.2)"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div>
              <div
                className="stage-num"
                style={{
                  background: "rgba(255,255,255,.08)",
                  color: "rgba(255,255,255,.75)",
                }}
              >
                CHRO Level
              </div>
              <div className="stage-role" style={{ color: "#fff" }}>
                The
                <br />
                Leader
              </div>
            </div>
            <div className="stage-desc">
              At the executive table. Shaping organizational culture, people
              strategy, and the future of how your organization treats its
              people.
            </div>
            <div className="stage-skills">
              <span className="stage-skill">Board Voice</span>
              <span className="stage-skill">Org Culture</span>
              <span className="stage-skill">Legacy</span>
            </div>
          </div>
        </div>

        <div className="journey-footer reveal">
          <div>
            <div className="journey-footer-text">
              Your journey ends where{" "}
              <em>real HR leadership begins.</em>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                "Certificate at every level",
                "Learn at your own pace",
                "Free for ACU institution staff",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "rgba(255,255,255,.45)",
                  }}
                >
                  <span style={{ color: "#C9501E" }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
          <a
            className="btn-cream"
            href="/learn/my-courses"
          >
            Find your level →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PLATFORM
────────────────────────────────────────────── */
type PCard = {
  icon: string;
  iconBg: string;
  cat: string;
  catColor?: string;
  title: string;
  body: string;
  meta: string;
  metaColor?: string;
  href: string;
  internal?: boolean;
  cardStyle?: React.CSSProperties;
  arrowStyle?: React.CSSProperties;
  reveal?: number;
};

const P_CARDS: PCard[] = [
  {
    icon: "🎓",
    iconBg: "#E8ECF4",
    cat: "Core Learning",
    title: "HR Learning Module",
    body: "Four progressive levels — Foundations through Innovation. Detailed topic content grounded in CIPD and academic research, with embedded case studies and interactive games.",
    meta: "4 levels · 12 topics · 12 games",
    href: "/courses/",
    reveal: 0,
  },
  {
    icon: "📚",
    iconBg: "#EDF0F8",
    cat: "Applied Learning",
    title: "Case Study Vault",
    body: "32 original HR case studies. Real decisions, pause-and-reflect moments, outcome analysis, and application questions — the kind of learning that sticks.",
    meta: "32 cases · 8 topics · 3 difficulty levels",
    href: "/case-study-vault",
    internal: true,
    reveal: 1,
  },
  {
    icon: "📖",
    iconBg: "#EDE5DC",
    cat: "Practical Reference",
    title: "Everyday HR Playbook",
    body: "10 situation guides for the HR moments that matter. Step-by-step actions, template language, and legal checklists for UK, Nigeria, USA, Singapore, China and Hong Kong.",
    meta: "10 guides · 6 jurisdictions",
    href: "/playbook",
    internal: true,
    reveal: 2,
  },
  {
    icon: "🤖",
    iconBg: "#E8F8EE",
    cat: "AI-Powered",
    title: "AI HR Support",
    body: "Instant, research-backed answers to your HR questions. Ask about policy, practice, law, or strategy — and get evidence-based responses, not generic advice.",
    meta: "Research-backed · 24/7",
    href: "/ai-support",
    internal: true,
    reveal: 0,
  },
  {
    icon: "🔬",
    iconBg: "#E8ECF4",
    cat: "Future Focus",
    title: "Virtual Innovation Lab",
    body: "Explore the cutting edge — AI ethics in hiring, gamification design, agile people practices, and the future of work in an experiment-led interactive environment.",
    meta: "AI ethics · Agile HR · Future of work",
    href: "/innovation-lab",
    internal: true,
    reveal: 1,
  },
  {
    icon: "📊",
    iconBg: "#EDE5DC",
    cat: "Your Progress",
    title: "Personal Dashboard",
    body: "Track your progress across all four levels, access completed courses, review your case study responses, and manage your final HR Strategy Proposal.",
    meta: "Progress · History · Submissions",
    href: "/dashboard",
    internal: true,
    reveal: 2,
  },
  {
    icon: "📥",
    iconBg: "#E8F0FE",
    cat: "Open Access",
    title: "Resources Library",
    body: "Free HR policy toolkits, benchmarking reports, workshop materials, and template packs — produced for the ACU HR in HE Community and open to all practitioners.",
    meta: "8 resources · Free · ACU endorsed",
    href: "/resources",
    internal: true,
    reveal: 1,
  },
  {
    icon: "⏱",
    iconBg: "rgba(201,80,30,.1)",
    cat: "Work Tracking SaaS",
    catColor: "var(--accent)",
    title: "ClockIQ",
    body: "Browser-based time tracking and project management for Nigerian teams and SMEs. No installation. Works on any device. Built for the Nigerian context — NGN pricing, local compliance.",
    meta: "thehrplayhousehub.org · A sister product",
    metaColor: "var(--accent)",
    href: "/clockiq",
    internal: true,
    cardStyle: {
      background:
        "linear-gradient(135deg,rgba(13,31,60,.03) 0%,rgba(201,80,30,.04) 100%)",
      borderColor: "rgba(201,80,30,.18)",
    },
    arrowStyle: {
      borderColor: "rgba(201,80,30,.3)",
      color: "var(--accent)",
    },
    reveal: 2,
  },
];

function PlatformSection() {
  return (
    <section className="platform-section">
      <div className="platform-inner">
        <div className="platform-header">
          <div>
            <div className="eyebrow reveal">
              <div className="eyebrow-rule" />
              The Platform
            </div>
            <h2
              className="h1 reveal reveal-delay-1"
              style={{ marginTop: 14 }}
            >
              Seven tools.
              <br />
              <em>One complete</em>
              <br />
              HR ecosystem.
            </h2>
          </div>
          <p
            className="body reveal reveal-delay-2"
            style={{ paddingBottom: 4 }}
          >
            Research, games, real cases, legal guidance, and AI support —
            everything you need to go from knowing about HR to practising it
            with real confidence.
          </p>
        </div>
        <div className="platform-grid">
          {P_CARDS.map((c) => {
            const revealClass = `p-card reveal${
              c.reveal ? ` reveal-delay-${c.reveal}` : ""
            }`;
            const inner = (
              <>
                <div
                  className="p-icon"
                  style={{ background: c.iconBg }}
                >
                  {c.icon}
                </div>
                <div
                  className="p-cat"
                  style={c.catColor ? { color: c.catColor } : undefined}
                >
                  {c.cat}
                </div>
                <div className="p-title">{c.title}</div>
                <p className="p-body">{c.body}</p>
                <div className="p-foot">
                  <div
                    className="p-meta"
                    style={
                      c.metaColor
                        ? { color: c.metaColor, fontWeight: 600 }
                        : undefined
                    }
                  >
                    {c.meta}
                  </div>
                  <div className="p-arrow" style={c.arrowStyle}>
                    →
                  </div>
                </div>
              </>
            );
            if (c.internal) {
              return (
                <Link
                  key={c.title}
                  href={c.href}
                  className={revealClass}
                  style={c.cardStyle}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <a
                key={c.title}
                href={c.href}
                target="_blank"
                rel="noopener"
                className={revealClass}
                style={c.cardStyle}
              >
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CLOCKIQ STRIP
────────────────────────────────────────────── */
function ClockiqStrip() {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0D1F3C 0%,#162847 50%,#1a0f06 100%)",
        padding: 40,
        borderTop: "1px solid rgba(255,255,255,.06)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "rgba(201,80,30,.2)",
              border: "1px solid rgba(201,80,30,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 18,
                fontWeight: 900,
                color: "#C9501E",
              }}
            >
              ⏱
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                color: "rgba(255,255,255,.4)",
                marginBottom: 4,
              }}
            >
              Also from HR Playhouse Hub
            </div>
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-.5px",
                marginBottom: 3,
              }}
            >
              ClockIQ — Work tracking for Nigerian teams
            </div>
            <div
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 14,
                color: "rgba(255,255,255,.5)",
              }}
            >
              Track hours, manage projects, report on your workforce.
              Browser-based, no installation, built for Nigeria. From NGN
              15,000/month.
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 20,
                fontWeight: 900,
                color: "#C4830A",
              }}
            >
              NGN 15k
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,.4)",
                fontWeight: 600,
              }}
            >
              from / month
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 36,
              background: "rgba(255,255,255,.1)",
            }}
          />
          <Link
            href="/learn/clockiq"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 44,
              padding: "0 22px",
              background: "#C9501E",
              color: "#fff",
              borderRadius: 100,
              fontFamily: "var(--f-body)",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: ".2s",
            }}
          >
            Try ClockIQ →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   ACU IMPACT STRIP
────────────────────────────────────────────── */
function AcuImpactStrip() {
  return (
    <div style={{ background: "var(--accent)", padding: "32px 40px" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,.65)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            ACU HR in HE Community Grant 2025–2026
          </div>
          <div
            style={{
              fontFamily: "var(--f-display)",
              fontSize: 22,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Built under the Association of Commonwealth Universities
            <br />
            <span style={{ fontWeight: 400, fontStyle: "italic" }}>
              HR in Higher Education Community Grant.
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          {[
            { n: "56", label: "Commonwealth\nmember states" },
            { n: "500+", label: "Universities in\nthe ACU network" },
            {
              n: "Free",
              label: "For HR practitioners\nacross the Commonwealth",
            },
          ].map((item, i) => (
            <div
              key={item.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
              }}
            >
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    background: "rgba(255,255,255,.2)",
                    alignSelf: "stretch",
                  }}
                />
              )}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  {item.n}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.65)",
                    fontWeight: 600,
                    marginTop: 2,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        <a
          href="https://www.acu.ac.uk/"
          target="_blank"
          rel="noopener"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 40,
            padding: "0 20px",
            background: "rgba(255,255,255,.15)",
            color: "#fff",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--f-display)",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,.25)",
            whiteSpace: "nowrap",
          }}
        >
          Visit ACU →
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MYTH BUSTING (scenario cards)
────────────────────────────────────────────── */
function MythBustingSection() {
  const scenarios = [
    {
      iconBg: "rgba(201,80,30,.1)",
      icon: "⚖️",
      title: "The disciplinary that could go either way",
      body: "A manager wants an employee dismissed. HR thinks the process was flawed. The employee is a union member. You have 24 hours to advise. What do you do?",
      meta: "Case Study 7 · Level 2 · Nigerian Labour Act context included",
    },
    {
      iconBg: "rgba(13,31,60,.08)",
      icon: "🤝",
      title: "The restructure no one wants to talk about",
      body: "The organisation is cutting 20% of staff. You are told to make it look like voluntary redundancy. Legally and ethically, what are your obligations — and your limits?",
      meta: "Case Study 14 · Level 3 · Change management + ethics",
    },
    {
      iconBg: "rgba(196,131,10,.1)",
      icon: "🌍",
      title: "The DEIB conversation the CEO asked for",
      body: "Your CEO has just announced a DEIB initiative after a public incident. You have been asked to lead it. Where do you actually start when the pressure is on and everyone is watching?",
      meta: "Case Study 22 · Level 3 · DEIB strategy design",
    },
    {
      iconBg: "rgba(40,202,65,.1)",
      icon: "📊",
      title: "Performance management that nobody trusts",
      body: "The annual appraisal process has a 40% completion rate and managers hate it. You need to redesign it in 6 weeks. What does a system people will actually use look like?",
      meta: "Case Study 9 · Level 2 · Performance frameworks",
    },
    {
      iconBg: "rgba(201,80,30,.1)",
      icon: "🔍",
      title: "The grievance everyone knows about but nobody filed",
      body: "A senior manager has been creating a toxic atmosphere for two years. Staff are leaving. Nothing has been formally raised. You have heard enough. What are your options?",
      meta: "Case Study 5 · Level 2 · Employee relations",
    },
  ];

  return (
    <section style={{ background: "#fff", padding: "48px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 20, height: 1.5, background: "#0D1F3C" }} />
          <span
            style={{
              fontFamily: "var(--f-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#0D1F3C",
            }}
          >
            Real HR · Real situations
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "end",
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(32px,4vw,46px)",
              fontWeight: 900,
              color: "#0A1628",
              lineHeight: 1.05,
              letterSpacing: "-1px",
            }}
          >
            The moments that
            <br />
            <em
              style={{
                fontWeight: 300,
                fontStyle: "italic",
                color: "#C9501E",
              }}
            >
              define HR careers.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--f-body)",
              fontSize: 16,
              color: "#5A6880",
              lineHeight: 1.75,
            }}
          >
            Every HR professional faces moments that no textbook quite prepares
            you for. These are the situations our case studies, games and
            playbooks are built around.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
        >
          {scenarios.map((s) => (
            <div
              key={s.title}
              style={{
                background: "var(--canvas-2)",
                borderRadius: 16,
                padding: 28,
                border: "1px solid rgba(10,22,40,.06)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: s.iconBg,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0A1628",
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </div>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  color: "#5A6880",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {s.body}
              </p>
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fff",
                  borderRadius: 8,
                  border: "1px solid rgba(10,22,40,.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#C9501E",
                    marginBottom: 2,
                  }}
                >
                  In the platform
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 12,
                    color: "#5A6880",
                  }}
                >
                  {s.meta}
                </div>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div
            style={{
              background: "#0D1F3C",
              borderRadius: 16,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                32 more situations like these.
              </div>
              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 14,
                  color: "rgba(255,255,255,.55)",
                  lineHeight: 1.7,
                }}
              >
                Every case study includes a pause-and-reflect moment, an
                outcome analysis, and application questions that make it
                impossible to just scroll through.
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <Link
                href="/learn/case-study-vault"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 44,
                  padding: "0 22px",
                  background: "#C9501E",
                  color: "#fff",
                  borderRadius: 100,
                  fontFamily: "var(--f-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Explore the Case Study Vault →
              </Link>
              <a
                href="/learn/my-courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 40,
                  padding: "0 22px",
                  background: "rgba(255,255,255,.08)",
                  color: "rgba(255,255,255,.7)",
                  borderRadius: 100,
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              >
                Start free at Level 1
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CLOCKIQ FULL
────────────────────────────────────────────── */
function ClockiqFullSection() {
  return (
    <section
      style={{
        background: "var(--canvas-2)",
        padding: "48px 40px",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 14px",
                borderRadius: 100,
                background: "rgba(201,80,30,.08)",
                border: "1px solid rgba(201,80,30,.15)",
                fontFamily: "var(--f-body)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "var(--accent)",
                marginBottom: 20,
              }}
            >
              Also from HR Playhouse Hub
            </div>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(32px,4vw,48px)",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-1px",
                marginBottom: 16,
              }}
            >
              Managing a team in Nigeria?
              <br />
              <em
                style={{
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "var(--accent)",
                }}
              >
                Meet ClockIQ.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 16,
                color: "var(--ink-3)",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              The simple, browser-based work tracking platform built
              specifically for Nigerian SMEs and growing teams. Track hours,
              manage projects, report on your workforce — no installation, no
              complexity, no surprises.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 28,
              }}
            >
              {[
                "Works on any device including smartphones — no app download",
                "NGN pricing and Nigerian payroll cycles built in",
                "Project management, leave tracking and HR-ready reports",
                "Built and supported in Nigeria by the HR Playhouse Hub team",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "var(--f-body)",
                    fontSize: 14,
                    color: "var(--ink-3)",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                  {t}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/learn/clockiq"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 48,
                  padding: "0 28px",
                  background: "var(--navy)",
                  color: "#fff",
                  borderRadius: 100,
                  fontFamily: "var(--f-body)",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: ".2s",
                }}
              >
                Learn more about ClockIQ →
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=ClockIQ Enquiry`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 48,
                  padding: "0 24px",
                  background: "transparent",
                  color: "var(--navy)",
                  borderRadius: 100,
                  fontFamily: "var(--f-body)",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1.5px solid var(--border)",
                }}
              >
                Get a quote
              </a>
            </div>
          </div>

          {/* Right pricing */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div
              style={{
                padding: "24px 26px",
                background: "var(--white)",
                borderRadius: 14,
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Starter
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  Up to 10 users · All core features
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "var(--navy)",
                    lineHeight: 1,
                  }}
                >
                  NGN 15,000
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                  }}
                >
                  per month
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "24px 26px",
                background: "var(--navy)",
                borderRadius: 14,
                border: "2px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: 20,
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--f-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  padding: "3px 12px",
                  borderRadius: 100,
                }}
              >
                Most popular
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  Business
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "rgba(255,255,255,.5)",
                  }}
                >
                  Up to 50 users · Advanced reports
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  NGN 35,000
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    color: "rgba(255,255,255,.4)",
                  }}
                >
                  per month
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "24px 26px",
                background: "var(--white)",
                borderRadius: 14,
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Enterprise
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  Unlimited users · Custom setup
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "var(--navy)",
                    lineHeight: 1,
                  }}
                >
                  Custom
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                  }}
                >
                  contact us
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "14px 18px",
                background: "rgba(201,80,30,.06)",
                borderRadius: 10,
                border: "1px solid rgba(201,80,30,.12)",
                fontFamily: "var(--f-body)",
                fontSize: 13,
                color: "var(--accent)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              📧 Email {CONTACT_EMAIL} with subject: ClockIQ Enquiry
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   TESTIMONIALS
────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    initials: "AO",
    bg: "#8B3E20",
    name: "Adaeze O.",
    role: "HR Business Partner",
    location: "Lagos, Nigeria",
    tag: "Case Study Vault",
    quote:
      "I have attended CIPM workshops, in-house HR training, and online courses. Nothing has come close to this. The case studies put you inside real situations — a grievance you have to handle, a disciplinary that could go wrong, a culture problem no one wants to name. You cannot just pick an answer. You have to think. And when you think, you grow. I finished Level 1 and went back to my desk and did my job differently. That is the test.",
    delay: 0,
  },
  {
    initials: "SC",
    bg: "#C9501E",
    name: "Samira C.",
    role: "People Operations Lead",
    location: "London, UK",
    tag: "HR Playbook · Legal Checklists",
    quote:
      "I was managing a redundancy process for the first time and felt completely out of my depth. I opened the Playbook at 9pm the night before the first consultation meeting. It walked me through every step — what to say, what not to say, what the law requires, what good practice looks like. I got through that process without a single grievance. I have since recommended this platform to every HR professional I know. It is the senior colleague you do not always have access to.",
    delay: 1,
  },
  {
    initials: "KT",
    bg: "#C4830A",
    name: "Kai T.",
    role: "Global HR Manager",
    location: "Singapore",
    tag: "Multi-jurisdiction · AI HR Support",
    quote:
      "I manage people across five countries. Every time I face an employment law question, I used to spend hours searching across different sources — GOV.UK, MOM Singapore, different legal blogs. The Playbook changed that. UK and Singapore employment law side by side, covering the same HR situation. And when I have a question the Playbook does not answer, the AI Support gives me a research-backed response in seconds. This is built for people who do real HR in the real world.",
    delay: 2,
  },
  {
    initials: "RM",
    bg: "#2A5240",
    name: "Rachel M.",
    role: "Early-Career HR Advisor",
    location: "Manchester, UK",
    tag: "Level 1 · HR Foundations",
    quote:
      "I am two years into my HR career and I had started to wonder if I was cut out for it. I was doing the work but I did not feel like a professional. I started Level 1 on a Sunday afternoon, not expecting much. Three hours later I was still going. It was not basic. It challenged assumptions I had already formed, gave me frameworks that actually made sense, and for the first time I felt like someone had built something specifically for where I am — not for a textbook version of an HR person. I finally feel like I belong in this profession.",
    delay: 0,
  },
  {
    initials: "BO",
    bg: "#185FA5",
    name: "Blessing O.",
    role: "Deputy Registrar (HR)",
    location: "Covenant University, Nigeria",
    tag: "Pilot Programme · Level 1 & 2",
    quote:
      "When the platform was introduced to our team as part of the pilot, I was sceptical. I have seen many e-learning tools come and go. But this one is different — it understands the Nigerian university context. The language is not foreign. The cases reflect things we actually deal with: Federal Character, promotion disputes, staff welfare. I completed Level 2 last week and I have already shared what I learned in our departmental meeting. My team is asking when they can start.",
    delay: 1,
  },
];

function TestimonialsSection() {
  return (
    <section className="testi-section">
      <div className="testi-inner">
        <div className="testi-header">
          <div>
            <div className="eyebrow reveal">
              <div className="eyebrow-rule" />
              What people say
            </div>
            <h2
              className="h1 reveal reveal-delay-1"
              style={{ marginTop: 14 }}
            >
              Real people.
              <br />
              <em>Real results.</em>
            </h2>
            <p
              className="body reveal reveal-delay-2"
              style={{ marginTop: 20 }}
            >
              These are not paid reviews. These are HR professionals who used
              the platform and told us what they found — unedited.
            </p>
            <div className="testi-proof reveal reveal-delay-3">
              <div className="tp-item">
                <div className="tp-n">150+</div>
                <div className="tp-l">
                  Pilot users at Covenant University
                </div>
              </div>
              <div className="tp-item">
                <div className="tp-n">4</div>
                <div className="tp-l">Countries represented in feedback</div>
              </div>
              <div className="tp-item">
                <div className="tp-n">5★</div>
                <div className="tp-l">Average satisfaction score</div>
              </div>
            </div>
          </div>
        </div>
        <div className="testi-stack">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className={`t-row reveal${
                t.delay ? ` reveal-delay-${t.delay}` : ""
              }`}
            >
              <div className="t-person">
                <div className="t-avatar" style={{ background: t.bg }}>
                  {t.initials}
                </div>
                <div className="t-name">{t.name}</div>
                <div className="t-role">
                  {t.role}
                  <br />
                  {t.location}
                </div>
              </div>
              <div className="t-quote-body">
                <span className="t-tag">{t.tag}</span>
                <div className="t-text">&quot;{t.quote}&quot;</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PARTNERS
────────────────────────────────────────────── */
type ProspectivePartner = {
  initials: string;
  badgeBg: string;
  badgeColor?: string;
  type: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  domain: string;
};

const PROSPECTIVE: ProspectivePartner[] = [
  {
    initials: "KE",
    badgeBg: "#0D1F3C",
    badgeColor: "#C4830A",
    type: "Management Consulting · Lagos, Nigeria",
    name: "KAINOS Edge Consulting Limited",
    description:
      "Born from the merger of Edward Kingston Associates and SoftSkills Management Consultants, KAINOS Edge is a Lagos-based management consulting firm with over 10 years advising public and private sector organisations on Markets, Governance, Capacity and Technology. Chaired by Laoye Jaiyeola, former CEO of the Nigerian Economic Summit Group, and led by Doyin Salami, former Chief Economic Adviser to the President of Nigeria. Has trained FAAN management and serves government entities and corporates across Nigeria. A UN Global Compact participant since 2015.",
    tags: [
      "HR Capacity Development",
      "Public & Private Sector",
      "Nigeria · Ikoyi, Lagos",
    ],
    href: "https://kainosedge.com",
    domain: "kainosedge.com →",
  },
  {
    initials: "GV",
    badgeBg: "#C9501E",
    type: "People-Centric Digital Transformation · UK & Nigeria",
    name: "GrapeVine360 Solutions",
    description:
      "A UK-registered business transformation firm (Companies House 09684591, Brentwood, Essex) founded in 2015 by Managing Partner Femi Olukoya. GrapeVine360 drives business outcomes through People Solutions, Insight & Strategy and Technology. Their subsidiaries span data and customer experience, education, finance, healthcare and lifestyle — offering a 360-degree approach to transformation. Recently supported diaspora Nigerian investment initiatives in partnership with financial institutions across the UK.",
    tags: ["People Solutions", "Digital Transformation", "UK · Nigeria"],
    href: "https://grapevine360.com",
    domain: "grapevine360.com →",
  },
  {
    initials: "HS",
    badgeBg: "#1E3560",
    type: "Startup Incubator · Covenant University, Ota",
    name: "Hebron Startup Lab",
    description:
      "West Africa's first university-based startup incubator, hosted by Covenant University and located on the 3rd floor of the CUCRID Building, Ota. Founded in 2016, Hebron runs two acceleration programmes per year, accepting 7 startups per cohort at pre-seed and seed stage. Alumni include PiggyVest. Its mission is to take ideas from concept to product to market — transforming research outcomes from students, faculty and alumni into viable companies. A natural institutional partner given our shared Covenant University home.",
    tags: ["Startup Acceleration", "Covenant University", "Alumni: PiggyVest"],
    href: "https://hebronstartup.com",
    domain: "hebronstartup.com →",
  },
  {
    initials: "DY",
    badgeBg: "linear-gradient(135deg,#C9501E 0%,#0D1F3C 100%)",
    type: "EdTech · Games-Based Learning · Abuja, Nigeria",
    name: "DoubleYou Centre",
    description:
      "An Abuja-based EdTech organisation focused on learning through games and stories. Founded by CEO Israel Yabkwa, DoubleYou Centre makes lifelong learning and technology fun, simple and profitable — with a Nigerian community of over 1,000 learners. Their games-based learning philosophy closely mirrors the HR Playhouse Hub approach, making this a natural partnership for combining professional HR development with innovative, playful learning design and delivery.",
    tags: ["Games-Based Learning", "EdTech · Nigeria", "Lifelong Learning"],
    href: "https://www.doubleyou.com.ng",
    domain: "doubleyou.com.ng →",
  },
];

function PartnersSection() {
  function scrollToConsulting() {
    document
      .getElementById("consulting")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="partners-section">
      <div className="partners-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <div>
            <div className="eyebrow">
              <div className="eyebrow-rule" />
              Partners &amp; Sponsors
            </div>
            <h2 className="h1" style={{ marginTop: 14 }}>
              Built with the support of
              <br />
              <em>leading institutions.</em>
            </h2>
            <p className="body" style={{ marginTop: 14 }}>
              HR Playhouse Hub was developed with the support of organisations
              committed to advancing professional development, academic
              excellence, and global access to HR education.
            </p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div
              style={{
                padding: "20px 22px",
                background: "var(--accent-mist)",
                borderRadius: 12,
                border: "1px solid rgba(201,80,30,.12)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--accent)",
                  marginBottom: 4,
                }}
              >
                Confirmed partners
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.55,
                }}
              >
                Association of Commonwealth Universities (ACU) — Grant Sponsor,
                and Covenant University, Nigeria — First Host Institution. Both
                active and confirmed.
              </div>
            </div>
            <div
              style={{
                padding: "20px 22px",
                background: "var(--mist)",
                borderRadius: 12,
                border: "1px solid var(--border-light)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--navy)",
                  marginBottom: 4,
                }}
              >
                4 prospective partners in conversation
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.55,
                }}
              >
                KAINOS Edge Consulting, GrapeVine360, Hebron Startup Lab and
                DoubleYou Centre — discussions ongoing for programme delivery,
                referrals and content partnerships.
              </div>
            </div>
            <div
              style={{
                padding: "20px 22px",
                background: "var(--gold-pale)",
                borderRadius: 12,
                border: "1px solid rgba(196,131,10,.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--gold)",
                  marginBottom: 4,
                }}
              >
                CPD recognition coming
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.55,
                }}
              >
                Advanced discussions with a leading HR professional body to
                offer verified CPD hours. Announcement expected before
                September 2026.
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT PARTNERS */}
        <div className="partners-grid">
          {/* ACU */}
          <div className="partner-card featured">
            <div className="pc-ribbon">Grant Sponsor</div>
            <div className="pc-logo-wrap" style={{ position: "relative" }}>
              <div
                style={{
                  width: 110,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  background: "#0D1F3C",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <svg
                  viewBox="0 0 110 80"
                  xmlns="http://www.w3.org/2000/svg"
                  width="110"
                  height="80"
                >
                  <rect width="110" height="80" rx="14" fill="#0D1F3C" />
                  <text
                    x="55"
                    y="36"
                    fontFamily="Georgia,serif"
                    fontSize="22"
                    fontWeight="700"
                    fill="#ffffff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    ACU
                  </text>
                  <text
                    x="55"
                    y="62"
                    fontFamily="Georgia,serif"
                    fontSize="8"
                    fill="rgba(255,255,255,.5)"
                    textAnchor="middle"
                  >
                    Est. 1963
                  </text>
                </svg>
              </div>
            </div>
            <div className="pc-name">
              Association of Commonwealth Universities
            </div>
            <div className="pc-desc">
              The Association of Commonwealth Universities (ACU) awarded HR
              Playhouse Hub a competitive HR in Higher Education Community
              Grant — backing the development of the platform and its
              deployment across Commonwealth institutions. Without the ACU,
              this platform would not exist.
            </div>
            <div className="pc-tags">
              <span className="pc-tag">Grant Sponsor</span>
              <span className="pc-tag">Commonwealth</span>
              <span className="pc-tag">56 Nations</span>
              <span className="pc-tag">HR in HE Grant</span>
            </div>
            <a
              className="pc-link"
              href="https://www.acu.ac.uk/"
              target="_blank"
              rel="noopener"
            >
              Visit ACU →
            </a>
          </div>

          {/* COVENANT */}
          <div className="partner-card">
            <div
              className="pc-ribbon"
              style={{ background: "var(--gold)" }}
            >
              Host University
            </div>
            <div className="pc-logo-wrap" style={{ position: "relative" }}>
              <div
                style={{
                  width: 110,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  background: "#1E3560",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <svg
                  viewBox="0 0 110 80"
                  xmlns="http://www.w3.org/2000/svg"
                  width="110"
                  height="80"
                >
                  <rect width="110" height="80" rx="14" fill="#1E3560" />
                  <text
                    x="55"
                    y="28"
                    fontFamily="Georgia,serif"
                    fontSize="10"
                    fontWeight="700"
                    fill="#C4830A"
                    textAnchor="middle"
                  >
                    COVENANT
                  </text>
                  <text
                    x="55"
                    y="44"
                    fontFamily="Georgia,serif"
                    fontSize="9"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    UNIVERSITY
                  </text>
                  <text
                    x="55"
                    y="60"
                    fontFamily="Georgia,serif"
                    fontSize="8"
                    fill="rgba(255,255,255,.45)"
                    textAnchor="middle"
                  >
                    Ota, Nigeria
                  </text>
                </svg>
              </div>
            </div>
            <div className="pc-name">Covenant University</div>
            <div className="pc-desc">
              Covenant University, Ota, Nigeria served as the first host
              institution for HR Playhouse Hub — providing the academic
              environment, staff cohort, and institutional infrastructure for
              the platform&apos;s initial development and pilot programme.
            </div>
            <div className="pc-tags">
              <span className="pc-tag">Host Institution</span>
              <span className="pc-tag">Nigeria</span>
              <span className="pc-tag">Pilot Programme</span>
              <span className="pc-tag">Academic Research</span>
            </div>
            <a
              className="pc-link"
              href="https://covenantuniversity.edu.ng/"
              target="_blank"
              rel="noopener"
            >
              Visit Covenant University →
            </a>
          </div>
        </div>

        {/* CPD STRIP */}
        <div
          style={{
            marginTop: 32,
            background: "var(--navy)",
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                color: "var(--accent)",
                marginBottom: 8,
              }}
            >
              CPD Partnership — Coming Soon
            </div>
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
                lineHeight: 1.2,
              }}
            >
              CPD recognition for HR professionals
            </div>
            <div
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 14,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.6,
              }}
            >
              We are in advanced discussions with a leading HR professional
              body to offer verified CPD hours to practitioners who complete
              our learning levels. Members will earn recognised CPD credit
              directly on the platform.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                background: "rgba(255,255,255,.06)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#28ca41",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,.7)",
                }}
              >
                In active discussion
              </span>
            </div>
            <Link
              href="/partner-register?track=cpd"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 38,
                padding: "0 18px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--f-body)",
                textDecoration: "none",
              }}
            >
              Register interest →
            </Link>
          </div>
        </div>

        {/* PROSPECTIVE PARTNERS */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontFamily: "var(--f-body)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: "var(--ink-4)",
              marginBottom: 20,
            }}
          >
            Prospective partners in conversation
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 16,
            }}
          >
            {PROSPECTIVE.map((p) => (
              <div
                key={p.name}
                onClick={scrollToConsulting}
                style={{
                  cursor: "pointer",
                  background: "var(--white)",
                  borderRadius: 16,
                  border: "1.5px solid var(--border-light)",
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  transition: ".2s",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: p.badgeBg,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: p.initials.length > 2 ? 13 : 15,
                      fontWeight: 900,
                      color: p.badgeColor ?? "#fff",
                      letterSpacing: "-.5px",
                    }}
                  >
                    {p.initials}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".09em",
                    color: "var(--accent)",
                    marginBottom: 6,
                  }}
                >
                  {p.type}
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 19,
                    fontWeight: 800,
                    color: "var(--ink)",
                    letterSpacing: "-.3px",
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}
                >
                  {p.name}
                </div>
                <p
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13.5,
                    color: "var(--ink-3)",
                    lineHeight: 1.7,
                    marginBottom: 16,
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 16,
                  }}
                >
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 9px",
                        borderRadius: 5,
                        background: "var(--mist)",
                        color: "var(--ink-3)",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 14,
                    borderTop: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#C9501E",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--f-body)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--ink-3)",
                      }}
                    >
                      In conversation
                    </span>
                  </div>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--navy)",
                      textDecoration: "none",
                    }}
                  >
                    {p.domain}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BECOME A PARTNER CTA */}
      <div className="partner-cta">
        <div className="pct-left">
          <div className="pct-title">Interested in partnering with us?</div>
          <div className="pct-sub">
            We work with HR associations, universities, and organisations who
            want to support the development of the next generation of HR
            professionals. Get in touch to discuss partnership opportunities.
          </div>
        </div>
        <Link className="pct-btn" href="/partner-register">
          Become a Partner →
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CONSULTING (form section)
────────────────────────────────────────────── */
const SERVICES_DATA = [
  {
    icon: "🎯",
    title: "HR Strategy & Organisational Design",
    body: "Building people strategies that are genuinely aligned to your business goals.",
  },
  {
    icon: "🔍",
    title: "Talent Acquisition & Workforce Planning",
    body: "Structured, fair, and effective hiring processes at every level.",
  },
  {
    icon: "🌍",
    title: "DEIB Programmes & Culture Change",
    body: "Moving beyond representation numbers to genuine inclusion and belonging.",
  },
  {
    icon: "📊",
    title: "Performance Management Systems",
    body: "Designing performance frameworks people actually use — and trust.",
  },
  {
    icon: "📋",
    title: "HR Policy Development & Compliance",
    body: "Policies that are legally sound, clearly written, and practically usable.",
  },
  {
    icon: "👑",
    title: "Leadership & Management Development",
    body: "Building the management capability that drives every other HR outcome.",
  },
  {
    icon: "🤝",
    title: "Employee Relations & Conflict Resolution",
    body: "Navigating complex ER situations fairly, legally, and with minimal disruption.",
  },
  {
    icon: "🔬",
    title: "HR Audits & Diagnostics",
    body: "An independent assessment of where your HR practice is strong — and where it isn't.",
  },
  {
    icon: "🎓",
    title: "Learning & Development Strategy",
    body: "Building L&D that develops people, not just ticks a training box.",
  },
  {
    icon: "🔄",
    title: "Change Management & Transformation",
    body: "Supporting organisations through restructures, mergers, and cultural transformation.",
  },
];

const SERVICE_OPTIONS = [
  "HR Strategy & Organisational Design",
  "Talent Acquisition & Workforce Planning",
  "DEIB Programmes & Culture Change",
  "Performance Management Systems",
  "HR Policy Development & Compliance",
  "Leadership & Management Development",
  "Employee Relations & Conflict Resolution",
  "HR Audits & Diagnostics",
  "Learning & Development Strategy",
  "Change Management & Transformation",
  "Not sure yet — want to discuss",
];

function ConsultingSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorShown, setErrorShown] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorShown(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("cs-name") ?? "").trim();
    const title = String(data.get("cs-title") ?? "").trim();
    const email = String(data.get("cs-email") ?? "").trim();
    const org = String(data.get("cs-org") ?? "").trim();
    const orgtype = String(data.get("cs-orgtype") ?? "");
    const country = String(data.get("cs-country") ?? "");
    const service = String(data.get("cs-service") ?? "");
    const message = String(data.get("cs-message") ?? "").trim();

    // EmailJS is not loaded on this static marketing page, so we go straight
    // to the mailto fallback that the original script also used in its catch
    // branch. The user is informed via the success panel.
    try {
      const body = encodeURIComponent(
        `Name: ${name}\nTitle: ${title}\nEmail: ${email}\nOrganisation: ${org} (${orgtype || "Not specified"})\nCountry: ${country || "Not specified"}\nService: ${service || "Not specified"}\n\n${message}`,
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`New Consulting Enquiry — ${name} / ${org}`)}&body=${body}`;
      setSubmittedEmail(email);
      setSubmitted(true);
    } catch (err) {
      console.error("Consulting form error:", err);
      setErrorShown(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="consulting-section" id="consulting">
      <div className="cs-glow-1" />
      <div className="cs-glow-2" />
      <div className="cs-inner">
        {/* Header */}
        <div className="cs-top">
          <div>
            <div className="cs-eyebrow">
              <div className="cs-eyebrow-rule" />
              HR Consulting
            </div>
            <h2 className="cs-title">
              Expert HR for
              <br />
              organisations that
              <br />
              <em>want to get it right.</em>
            </h2>
          </div>
          <div>
            <p className="cs-body">
              Beyond the platform, we work directly with organisations — from
              startups to universities to government bodies — to design, build,
              and transform their HR practice. Evidence-based, practical, and
              built around your specific context.
            </p>
            <div className="cs-geo">
              <span className="cs-geo-tag">🇳🇬 Nigeria</span>
              <span className="cs-geo-tag">🇬🇧 United Kingdom</span>
              <span className="cs-geo-tag">🌍 Remote &amp; on-site</span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="cs-services">
          {SERVICES_DATA.map((s) => (
            <div key={s.title} className="cs-service">
              <span className="cs-service-icon">{s.icon}</span>
              <div className="cs-service-title">{s.title}</div>
              <div className="cs-service-desc">{s.body}</div>
            </div>
          ))}
        </div>

        {/* Clients */}
        <div className="cs-clients-row">
          <span className="cs-clients-label">We work with</span>
          <span className="cs-client-tag">🏢 SMEs &amp; Growing Businesses</span>
          <span className="cs-client-tag">🚀 Startups &amp; Scale-ups</span>
          <span className="cs-client-tag">🏛 Government &amp; Public Sector</span>
          <span className="cs-client-tag">
            🎓 Universities &amp; Academic Institutions
          </span>
          <span className="cs-client-tag">🌱 NGOs &amp; Non-profits</span>
        </div>

        <div className="cs-divider" />

        {/* Contact form + info */}
        <div className="cs-contact-grid">
          <div className="cs-form-side">
            <div className="cs-form-label">Work with us</div>
            <div className="cs-form-sub">
              Tell us about your organisation and what you need. We&apos;ll
              respond within 2 working days.
            </div>

            {!submitted && (
              <div id="cs-form-wrap">
                <form
                  className="cs-form"
                  id="consulting-form"
                  onSubmit={handleSubmit}
                >
                  <div className="cs-form-row">
                    <div className="cs-field">
                      <label>
                        Your name <span>*</span>
                      </label>
                      <input
                        className="cs-input"
                        type="text"
                        name="cs-name"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div className="cs-field">
                      <label>
                        Job title <span>*</span>
                      </label>
                      <input
                        className="cs-input"
                        type="text"
                        name="cs-title"
                        placeholder="e.g. HR Director, CEO"
                        required
                      />
                    </div>
                  </div>
                  <div className="cs-form-row">
                    <div className="cs-field">
                      <label>
                        Work email <span>*</span>
                      </label>
                      <input
                        className="cs-input"
                        type="email"
                        name="cs-email"
                        placeholder="you@organisation.com"
                        required
                      />
                    </div>
                    <div className="cs-field">
                      <label>
                        Organisation <span>*</span>
                      </label>
                      <input
                        className="cs-input"
                        type="text"
                        name="cs-org"
                        placeholder="Organisation name"
                        required
                      />
                    </div>
                  </div>
                  <div className="cs-form-row">
                    <div className="cs-field">
                      <label>Organisation type</label>
                      <div style={{ position: "relative" }}>
                        <select className="cs-select" name="cs-orgtype">
                          <option value="">Select type</option>
                          <option>SME / Growing Business</option>
                          <option>Startup / Scale-up</option>
                          <option>Government / Public Sector</option>
                          <option>University / Academic Institution</option>
                          <option>NGO / Non-profit</option>
                          <option>Other</option>
                        </select>
                        <span
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            fontSize: 11,
                            color: "rgba(255,255,255,.4)",
                          }}
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                    <div className="cs-field">
                      <label>Country</label>
                      <div style={{ position: "relative" }}>
                        <select className="cs-select" name="cs-country">
                          <option value="">Select country</option>
                          <option>Nigeria</option>
                          <option>United Kingdom</option>
                          <option>Ghana</option>
                          <option>Kenya</option>
                          <option>South Africa</option>
                          <option>United States</option>
                          <option>Other</option>
                        </select>
                        <span
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            fontSize: 11,
                            color: "rgba(255,255,255,.4)",
                          }}
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="cs-field">
                    <label>Service you&apos;re interested in</label>
                    <div style={{ position: "relative" }}>
                      <select className="cs-select" name="cs-service">
                        <option value="">Select a service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                      <span
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          fontSize: 11,
                          color: "rgba(255,255,255,.4)",
                        }}
                      >
                        ▾
                      </span>
                    </div>
                  </div>
                  <div className="cs-field">
                    <label>
                      Tell us about your challenge <span>*</span>
                    </label>
                    <textarea
                      className="cs-textarea"
                      name="cs-message"
                      placeholder="Briefly describe your organisation's HR challenge or what you're looking to achieve..."
                      required
                    />
                  </div>
                  {errorShown && (
                    <div
                      id="cs-error"
                      style={{
                        padding: "10px 14px",
                        background: "rgba(201,80,30,.15)",
                        border: "1px solid rgba(201,80,30,.3)",
                        borderRadius: 8,
                        fontFamily: "var(--f-body)",
                        fontSize: 13,
                        color: "#fca5a5",
                      }}
                    >
                      Something went wrong. Please try again or email us
                      directly.
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`cs-submit${loading ? " loading" : ""}`}
                    disabled={loading}
                  >
                    <span className="cs-btn-text">Send enquiry →</span>
                    <div className="btn-spinner" />
                  </button>
                  <div className="cs-form-note">
                    We respond to all enquiries within 2 working days.
                  </div>
                </form>
              </div>
            )}
            {submitted && (
              <div
                className="cs-success"
                style={{ display: "block" }}
                id="cs-success"
              >
                <div className="cs-success-icon">✓</div>
                <div className="cs-success-title">Enquiry received</div>
                <div className="cs-success-sub">
                  Thank you for getting in touch. We&apos;ll review your
                  enquiry and respond within 2 working days at{" "}
                  <strong style={{ color: "rgba(255,255,255,.75)" }}>
                    {submittedEmail || "your email"}
                  </strong>
                  .
                </div>
              </div>
            )}
          </div>

          {/* INFO SIDE */}
          <div className="cs-info-side">
            <div className="cs-info-card">
              <div className="cs-info-card-title">
                What happens after you submit
              </div>
              {[
                "We review your enquiry within 2 working days",
                "We'll send a brief response with initial thoughts and any questions we have",
                "If there's a fit, we'll schedule a no-obligation discovery conversation",
                "From there, we'll propose an approach and scope that matches your needs and budget",
              ].map((t) => (
                <div key={t} className="cs-info-item">
                  <div className="cs-info-dot" />
                  {t}
                </div>
              ))}
            </div>
            <div className="cs-info-card">
              <div className="cs-info-card-title">
                Why organisations work with us
              </div>
              {[
                "Evidence-based practice — every recommendation is grounded in HR research and employment law, not just experience",
                "Multi-jurisdiction expertise across Nigeria and the UK — we understand both contexts deeply",
                "We don't just advise — we build things that work in your specific organisational context",
                "DEIB is not an add-on in our work — it is embedded in every piece of HR strategy and policy we design",
              ].map((t) => (
                <div key={t} className="cs-info-item">
                  <div className="cs-info-dot" />
                  {t}
                </div>
              ))}
            </div>
            <a
              className="cs-direct-email"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              <div className="cs-de-icon">✉</div>
              <div>
                <div className="cs-de-label">Or email us directly</div>
                <div className="cs-de-addr">{CONTACT_EMAIL}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
