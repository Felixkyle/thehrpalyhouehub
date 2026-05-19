"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Shared marketing navigation bar.
 *
 * Faithful port of the `<nav class="nav">` block that was byte-identical
 * across the marketing/auth pages. The original toggled the mobile menu with
 * an inline `onclick` that did `classList.toggle('open')`; that imperative DOM
 * call is now React state.
 *
 * Internal links that have a local route (case studies, playbook, innovation
 * lab, AI support) point at the Next.js route; links without a local
 * equivalent (courses, sign-in) still point at the live LMS, matching the
 * original generator's link-rewrite rules.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav" id="nav">
      <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
        <div className="nav-logo-pill">HR Playhouse</div>
        <div className="nav-logo-text">Hub</div>
      </a>
      <div className={`nav-links${open ? " open" : ""}`} id="nav-links">
        <a className="nl" href="https://learn.thehrplayhousehub.org/courses/">
          Courses
        </a>
        <Link className="nl" href="/case-study-vault">
          Case Studies
        </Link>
        <Link className="nl" href="/playbook">
          Playbook
        </Link>
        <Link className="nl" href="/innovation-lab">
          Innovation Lab
        </Link>
        <Link className="nl" href="/ai-support">
          AI Support
        </Link>
      </div>
      <button
        className="nav-ham"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        <span className="nav-ham-bar" />
        <span className="nav-ham-bar" />
        <span className="nav-ham-bar" />
      </button>
      <a
        className="nav-cta"
        href="https://learn.thehrplayhousehub.org/courses/"
      >
        Start Learning →
      </a>
    </nav>
  );
}
