"use client";

import { useState } from "react";
import Link from "next/link";
import "./pricing.css";

/**
 * Pricing (September 2026).
 *
 * Faithful port of pricing_sep2026.html. The original used global `cur` /
 * `bill` variables with `setCur()` / `setBill()` / `render()` mutating price
 * text by id. That is now `cur` / `bill` state; the price strings are derived
 * exactly as `render()` computed them.
 *
 * Important faithfulness detail: the original markup ships *static* initial
 * prices (Free £0, Pro £9 "/ month · from September 2026" / "or £79/year —
 * save 27%", Institutional £499 "/ year · up to 50 users" / "Under £10 per
 * person per year"). `render()` is only invoked from the toggle handlers — so
 * before any interaction these exact strings show, and only after a toggle do
 * the `P`-table strings (including the founding-price note for Institutional)
 * take over. That two-phase behaviour is reproduced via a `rendered` flag.
 *
 * The NGN note is hidden until the NGN currency is selected, matching the
 * original `display` toggle.
 *
 * This page uses its OWN top nav variant (not the shared marketing `.nav`),
 * so that chrome is ported inline and scoped under `.pricing-page`. Internal
 * links with a local route use Next `<Link>`; LMS sign-up / courses links stay
 * plain anchors per the original link-rewrite rules.
 */

type Cur = "gbp" | "ngn" | "usd";
type Bill = "monthly" | "annual";

const P = {
  gbp: {
    pro: {
      m: "£9",
      a: "£79",
      mn: "/ month · from Sep 2026",
      an: "/ year · from Sep 2026",
      nn: "or £79/year — save 27%",
      na: "£6.58/month billed annually",
    },
    inst: {
      m: "£499",
      mn: "/ year · up to 50 users",
      fp2: "Founding: £299/yr until Mar 2027",
    },
  },
  ngn: {
    pro: {
      m: "₦800",
      a: "₦6,000",
      mn: "/ month · from Sep 2026",
      an: "/ year · from Sep 2026",
      nn: "or ₦6,000/year — save 30%",
      na: "₦500/month billed annually",
    },
    inst: {
      m: "₦180,000",
      mn: "/ year · up to 50 users",
      fp2: "Founding: ₦108,000/yr until Mar 2027",
    },
  },
  usd: {
    pro: {
      m: "$12",
      a: "$99",
      mn: "/ month · from Sep 2026",
      an: "/ year · from Sep 2026",
      nn: "or $99/year — save 31%",
      na: "$8.25/month billed annually",
    },
    inst: {
      m: "$599",
      mn: "/ year · up to 50 users",
      fp2: "Founding: $359/yr until Mar 2027",
    },
  },
} as const;

const freeP: Record<Cur, string> = { gbp: "£0", ngn: "₦0", usd: "$0" };
const labels: Record<Cur, string> = {
  gbp: "Prices in British Pounds · Switch to see Nigerian Naira pricing",
  ngn: "🇳🇬 Nigerian Naira pricing — PPP rates for the Nigerian market",
  usd: "Prices in US Dollars · Switch to GBP or NGN",
};

export default function PricingContent() {
  const [cur, setCur] = useState<Cur>("gbp");
  const [bill, setBill] = useState<Bill>("monthly");
  // false = original static markup (pre-`render()`); true once a toggle ran.
  const [rendered, setRendered] = useState(false);

  const p = P[cur];
  const annual = bill === "annual";

  // Pre-interaction the static HTML strings are shown; post-render the
  // derived strings from the price table take over (exactly like the
  // original render() / initial markup split).
  const freePrice = rendered ? freeP[cur] : "£0";
  const proPrice = rendered ? (annual ? p.pro.a : p.pro.m) : "£9";
  const proPeriod = rendered
    ? annual
      ? p.pro.an
      : p.pro.mn
    : "/ month · from September 2026";
  const proNote = rendered
    ? annual
      ? p.pro.na
      : p.pro.nn
    : "or £79/year — save 27%";
  const instPrice = rendered ? p.inst.m : "£499";
  const instPeriod = rendered ? p.inst.mn : "/ year · up to 50 users";
  const instNote = rendered ? p.inst.fp2 : "Under £10 per person per year";

  return (
    <div className="pricing-page">
      <nav className="nav">
        <a className="nav-logo" href="">
          <div className="nav-mark">HR</div>
          <span className="nav-name">HR Playhouse Hub</span>
        </a>
        <div className="nav-sep" />
        <div className="nav-links">
          <a
            className="nav-link"
            href="/courses/"
          >
            Courses
          </a>
          <a
            className="nav-link"
            href="/case-study-vault/"
          >
            Case Studies
          </a>
          <Link className="nav-link" href="/resources">
            Resources
          </Link>
          <Link className="nav-link active" href="/pricing">
            Pricing
          </Link>
        </div>
        <div className="nav-right">
          <a
            className="nav-cta"
            href="/sign-up/"
          >
            Start Free →
          </a>
        </div>
      </nav>

      {/* LAUNCH BANNER */}
      <div className="launch-banner">
        <span className="lb-badge">LAUNCHING SEPTEMBER 2026</span>
        <span className="lb-text">
          Paid plans open September 2026 · Founding partner window closes 31
          March 2027 ·
        </span>
        <a
          className="lb-link"
          href="mailto:contact@thehrplayhousehub.org?subject=Founding Partner Interest"
        >
          Register interest now →
        </a>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">
          Simple, fair pricing · from September 2026
        </div>
        <h1>
          Invest in your
          <br />
          <em>HR career.</em>
        </h1>
        <p className="hero-sub">
          ACU member institution staff get free access — forever. Everyone else
          starts free and upgrades when they&apos;re ready. Prices reflect local
          purchasing power across the Commonwealth.
        </p>
        <div className="cur-toggle">
          <button
            className={`cur-btn${cur === "gbp" ? " active" : ""}`}
            onClick={() => {
              setCur("gbp");
              setRendered(true);
            }}
          >
            £ GBP
          </button>
          <button
            className={`cur-btn${cur === "ngn" ? " active" : ""}`}
            onClick={() => {
              setCur("ngn");
              setRendered(true);
            }}
          >
            ₦ NGN
          </button>
          <button
            className={`cur-btn${cur === "usd" ? " active" : ""}`}
            onClick={() => {
              setCur("usd");
              setRendered(true);
            }}
          >
            $ USD
          </button>
        </div>
        <div className="toggle-label">
          {rendered
            ? labels[cur]
            : "Prices in British Pounds · Switch to see Nigerian Naira pricing"}
        </div>
        <br />
        <div className="bill-toggle">
          <button
            className={`bill-btn${bill === "monthly" ? " active" : ""}`}
            onClick={() => {
              setBill("monthly");
              setRendered(true);
            }}
          >
            Monthly
          </button>
          <button
            className={`bill-btn${bill === "annual" ? " active" : ""}`}
            onClick={() => {
              setBill("annual");
              setRendered(true);
            }}
          >
            Annual <span className="save-badge">Save 27%</span>
          </button>
        </div>
      </div>

      <div className="wrap">
        {/* ACU FREE STRIP */}
        <div className="acu-strip">
          <div className="acu-icon">ACU</div>
          <div className="acu-text">
            <h3>ACU member institution staff — free forever</h3>
            <p>
              If you work at one of the 500+ ACU member universities, you have
              full Professional-level access at no cost — permanently. Your
              access is verified automatically at registration and renewed with
              one click each year.
            </p>
          </div>
          <div className="acu-pills">
            <span className="apill">500+ institutions</span>
            <span className="apill">Auto-verified</span>
            <span className="apill">Free forever</span>
          </div>
        </div>

        {/* CIPM STRIP */}
        <div className="cipm-strip">
          <div className="cipm-icon">🏆</div>
          <div className="cipm-text">
            <h3>CIPM CPD recognition — activating late 2026</h3>
            <p>
              Professional and Institutional plan holders will receive verified
              CIPM CPD hours for each level completed. Partnership with the
              Chartered Institute of Personnel Management of Nigeria is being
              finalised from September 2026.
            </p>
          </div>
          <div className="cpills">
            <span className="cpill ac">CIPM Partnership</span>
            <span className="cpill">CPD Hours</span>
            <span className="cpill">Verified Certificate</span>
          </div>
        </div>

        {/* FOUNDING PARTNER STRIP */}
        <div className="founding-strip">
          <div className="fs-icon">🏛</div>
          <div className="fs-text">
            <h4>
              Founding Partner offer — September 2026 to 31 March 2027 only
            </h4>
            <p>
              Institutions signing during the founding window receive 40% off
              the Institutional plan for two years (£299/yr instead of £499/yr ·
              ₦108,000 instead of ₦180,000) plus permanent Partners page
              recognition and first-mover benefits.
            </p>
          </div>
          <a
            className="fs-cta"
            href="mailto:contact@thehrplayhousehub.org?subject=Founding Partner Interest"
          >
            Register interest →
          </a>
        </div>

        {/* PRICING GRID */}
        <div className="pgrid">
          {/* FREE */}
          <div className="plan">
            <div className="plan-name">Free</div>
            <div className="plan-who">
              Individual practitioners · Students · ACU community members
            </div>
            <div className="plan-price">
              <div className="price-main">{freePrice}</div>
              <div className="price-period">forever</div>
              <div className="price-note">&nbsp;</div>
            </div>
            <div className="plan-div" />
            <ul className="feats">
              <li className="feat">
                <span className="ck y">✓</span>Level 1 — HR Foundations (full)
              </li>
              <li className="feat">
                <span className="ck y">✓</span>10 of 32 case studies
              </li>
              <li className="feat">
                <span className="ck y">✓</span>HR Playbook — 3 situations
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Resources Library downloads
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Innovation Lab community
              </li>
              <li className="feat">
                <span className="ck n">–</span>AI HR Support
              </li>
              <li className="feat">
                <span className="ck n">–</span>Levels 2–4
              </li>
              <li className="feat">
                <span className="ck n">–</span>Completion certificate
              </li>
              <li className="feat">
                <span className="ck n">–</span>CIPM CPD recognition
              </li>
            </ul>
            <a
              className="plan-cta cta-ol"
              href="/sign-up/"
            >
              Start for free
            </a>
          </div>

          {/* PROFESSIONAL */}
          <div className="plan featured">
            <div className="pop-badge">Most popular</div>
            <div className="plan-name">Professional</div>
            <div className="plan-who">
              HR officers, managers and directors wanting the full career
              journey
            </div>
            <div className="plan-price">
              <div className="price-main">{proPrice}</div>
              <div className="price-period">{proPeriod}</div>
              <div className="price-note">{proNote}</div>
            </div>
            <div className="plan-div" />
            <ul className="feats">
              <li className="feat">
                <span className="ck y">✓</span>All 4 levels — Foundations to
                Innovation
              </li>
              <li className="feat">
                <span className="ck y">✓</span>All 32 case studies
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Full HR Playbook — all 10
                situations
              </li>
              <li className="feat">
                <span className="ck y">✓</span>AI HR Support — unlimited
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Completion certificate per level
              </li>
              <li className="feat">
                <span className="ck y">✓</span>CIPM CPD recognition (late 2026)
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Priority access to new content
              </li>
              <li className="feat">
                <span className="ck n">–</span>Team admin dashboard
              </li>
            </ul>
            <a
              className="plan-cta cta-nv"
              href="/sign-up/"
            >
              Start Professional
            </a>
          </div>

          {/* INSTITUTIONAL */}
          <div className="plan">
            <div className="plan-name">Institutional</div>
            <div className="plan-who">
              Universities &amp; HR departments wanting team management and
              admin reporting
            </div>
            <div className="plan-price">
              <div className="price-main">{instPrice}</div>
              <div className="price-period">{instPeriod}</div>
              <div className="price-note">{instNote}</div>
            </div>
            <div className="plan-div" />
            <ul className="feats">
              <li className="feat">
                <span className="ck y">✓</span>Everything in Professional
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Admin dashboard + usage reports
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Branded onboarding page
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Bulk enrolment management
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Quarterly L&amp;D impact reports
              </li>
              <li className="feat">
                <span className="ck y">✓</span>CIPM CPD reporting per staff
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Dedicated account support
              </li>
              <li className="feat">
                <span className="ck p">◑</span>Workshop licence — 50% off
              </li>
            </ul>
            <a
              className="plan-cta cta-ac"
              href="mailto:contact@thehrplayhousehub.org?subject=Institutional Plan Enquiry"
            >
              Get a quote
            </a>
          </div>

          {/* ENTERPRISE */}
          <div className="plan ent">
            <div className="plan-name">Enterprise + Consulting</div>
            <div className="plan-who">
              Large organisations, government bodies, multi-campus universities,
              HR associations
            </div>
            <div className="plan-price">
              <div className="price-main">Custom</div>
              <div className="price-period">bespoke pricing</div>
              <div className="price-note">Includes consulting engagement</div>
            </div>
            <div className="plan-div" />
            <ul className="feats">
              <li className="feat">
                <span className="ck y">✓</span>Everything in Institutional
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Unlimited users
              </li>
              <li className="feat">
                <span className="ck y">✓</span>White-label option
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Custom learning pathways
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Consulting from Dr. Gberevbie
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Bespoke case study development
              </li>
              <li className="feat">
                <span className="ck y">✓</span>Workshop facilitation included
              </li>
              <li className="feat">
                <span className="ck y">✓</span>SLA + dedicated account manager
              </li>
            </ul>
            <a
              className="plan-cta cta-ent"
              href="mailto:contact@thehrplayhousehub.org?subject=Enterprise Enquiry"
            >
              Contact us →
            </a>
          </div>
        </div>

        {/* NGN NOTE */}
        {cur === "ngn" && (
          <div className="ngn-note">
            <h4>🇳🇬 Nigerian Naira pricing — our home market rates</h4>
            <p>
              These prices use purchasing power parity (PPP) so the platform
              costs a proportionate share of income regardless of where you are.
              The Professional plan at ₦6,000/year works out to ₦500/month.
              Staff at ACU member Nigerian universities (including Covenant
              University) register free and never pay. Founding Partner
              institutional price: ₦108,000/year until 31 March 2027.
            </p>
            <div className="ngn-tags">
              <div className="ngn-tag">
                <b>Payment:</b> Paystack · Flutterwave · GTBank · First Bank ·
                Bank transfer
              </div>
              <div className="ngn-tag">
                <b>CIPM members:</b>{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  10% discount on Professional
                </span>
              </div>
              <div className="ngn-tag">
                <b>ACU member staff:</b>{" "}
                <span style={{ color: "var(--green)", fontWeight: 600 }}>
                  Always free
                </span>
              </div>
            </div>
          </div>
        )}

        {/* COMPARE TABLE */}
        <div className="cmp-wrap">
          <h2>Full feature comparison</h2>
          <p className="sub">
            Everything you get on each plan — side by side. All plans available
            from September 2026.
          </p>
          <table className="ctbl">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Professional</th>
                <th>Institutional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sr" colSpan={5}>
                  Access &amp; Content
                </td>
              </tr>
              <tr>
                <td>ACU member institution staff</td>
                <td>
                  <span
                    style={{
                      color: "var(--green)",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Free forever
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      color: "var(--green)",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Free forever
                  </span>
                </td>
                <td>Institutional add-on</td>
                <td>Institutional add-on</td>
              </tr>
              <tr>
                <td>Level 1 — HR Foundations</td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td>Levels 2, 3 &amp; 4</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td>Case studies (32 total)</td>
                <td>10</td>
                <td>All 32</td>
                <td>All 32</td>
                <td>All 32 + custom</td>
              </tr>
              <tr>
                <td>HR Playbook situations</td>
                <td>3 of 10</td>
                <td>All 10</td>
                <td>All 10</td>
                <td>All 10</td>
              </tr>
              <tr>
                <td className="sr" colSpan={5}>
                  Tools &amp; Support
                </td>
              </tr>
              <tr>
                <td>AI HR Support</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>Unlimited</td>
                <td>Unlimited</td>
                <td>Unlimited + priority</td>
              </tr>
              <tr>
                <td>Innovation Lab access</td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td>Resources Library</td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td className="sr" colSpan={5}>
                  Credentials &amp; Certification
                </td>
              </tr>
              <tr>
                <td>Completion certificate</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>Per level</td>
                <td>Per level</td>
                <td>Per level</td>
              </tr>
              <tr>
                <td>CIPM CPD recognition</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck p">Late 2026</span>
                </td>
                <td>
                  <span className="tck p">Late 2026</span>
                </td>
                <td>
                  <span className="tck p">Late 2026</span>
                </td>
              </tr>
              <tr>
                <td>Institutional CPD reporting</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td className="sr" colSpan={5}>
                  Admin &amp; Team Features
                </td>
              </tr>
              <tr>
                <td>Admin dashboard</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td>Branded onboarding page</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td>White-label option</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
              <tr>
                <td className="sr" colSpan={5}>
                  Founding Partner (Sep 2026 – Mar 2027 only)
                </td>
              </tr>
              <tr>
                <td>Founding Partner discount</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>40% off for 2 years</td>
                <td>Negotiated</td>
              </tr>
              <tr>
                <td>Partners page recognition</td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck n">–</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
                <td>
                  <span className="tck y">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently asked questions</h2>
          <p className="sub">
            Everything you need to know about accessing the platform from
            September 2026.
          </p>
          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-q">When exactly do paid plans launch?</div>
              <div className="faq-a">
                Paid plans open in September 2026, following the formal
                completion of the ACU grant period and submission of the final
                report to ACU in July 2026. During the grant period (through
                July 2026), the platform is free for all users as part of the
                publicly funded pilot.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                I am at an ACU member institution. Do I pay anything?
              </div>
              <div className="faq-a">
                No — never. Staff at ACU member universities have free full
                Professional-level access permanently. Your access is verified
                automatically when you register using your institutional email,
                and renewed with a single annual click. There is no cost now or
                in the future.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">What is the Founding Partner window?</div>
              <div className="faq-a">
                The Founding Partner offer runs from September 2026 to 31 March
                2027. Institutions that sign an institutional plan during this
                window receive 40% off for the first two years, permanent
                Partners page recognition, and first-mover benefits. After 31
                March 2027, standard pricing applies.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                Can I register my interest before September 2026?
              </div>
              <div className="faq-a">
                Yes — email contact@thehrplayhousehub.org with subject
                &quot;Founding Partner Interest — [Institution Name]&quot;. We
                will add you to the pre-launch list and contact you in September
                2026 with the formal offer. No payment is taken until September
                2026.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                Why are Nigerian Naira prices much lower than GBP prices?
              </div>
              <div className="faq-a">
                We use purchasing power parity (PPP) pricing — the same approach
                used by Notion, Figma, and Coursera. The goal is for the
                platform to cost a proportionate share of income regardless of
                where you are. The product is identical; only the price reflects
                local economic reality.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                What is the CIPM CPD recognition and when does it start?
              </div>
              <div className="faq-a">
                We are finalising a partnership with the Chartered Institute of
                Personnel Management of Nigeria (CIPM) from September 2026. Once
                the MOU is signed — expected late 2026 — Professional and
                Institutional plan holders receive verified CPD hours on their
                CIPM record for each level completed.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                Can my university pay by purchase order or bank transfer?
              </div>
              <div className="faq-a">
                Yes — we support PO-based procurement and bank transfer. We
                issue a formal invoice in your institution&apos;s name and can
                provide a vendor registration pack for your finance team.
                Paystack and Flutterwave are available for Nigerian
                institutions.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">
                Are certificates recognised outside Nigeria?
              </div>
              <div className="faq-a">
                Certificates are issued under HR Playhouse Hub and Covenant
                University branding — valid as professional development evidence
                in any jurisdiction. CIPM CPD recognition applies to CIPM
                Nigeria records. We are in exploratory discussions with CIPD
                (UK) and SHRM (USA) for future cohorts.
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="footer-cta">
          <h2>
            Ready to invest in your
            <br />
            <em>HR career?</em>
          </h2>
          <p>
            Platform open from September 2026. Register interest now for the
            Founding Partner offer or start free today on the grant-funded tier.
          </p>
          <div className="fbtns">
            <a
              className="btn-lg btn-ac"
              href="/sign-up/"
            >
              Start free now →
            </a>
            <a
              className="btn-lg btn-gh"
              href="mailto:contact@thehrplayhousehub.org?subject=Founding Partner Interest"
            >
              Register founding partner interest
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
