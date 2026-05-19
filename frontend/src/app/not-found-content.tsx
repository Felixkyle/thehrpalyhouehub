"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./not-found.css";

/**
 * 404 / page-not-found screen.
 *
 * Faithful port of 404.html. The original used an inline `doSearch()` script
 * plus an `onkeydown` attribute that read the input by id; that imperative DOM
 * code is now a controlled input with a React `search()` handler. Behaviour is
 * unchanged: a non-empty trimmed query redirects to the LMS site search.
 *
 * Standard marketing nav/footer are rendered via the shared components.
 * Internal links that have a local route use Next `<Link>`; the LMS courses,
 * ClockIQ and contact links stay as plain anchors per the original
 * link-rewrite rules.
 */
export default function NotFoundContent() {
  const [query, setQuery] = useState("");

  function search() {
    const q = query.trim();
    if (q) {
      window.location.href =
        "/?s=" + encodeURIComponent(q);
    }
  }

  return (
    <>
      <Nav />
      <main>
        <div className="err-wrap">
          <div className="err-inner">
            <div className="err-404">404</div>
            <div className="err-emoji">🗺️</div>
            <h1 className="err-title">Page not found</h1>
            <p className="err-sub">
              This page doesn&apos;t exist, has been moved, or the link may
              have been mistyped. Let us help you find what you need.
            </p>
            <div className="err-actions">
              <Link className="btn btn-accent" href="/">
                Back to Homepage
              </Link>
              <a
                className="btn btn-outline-white"
                href="/courses/"
              >
                Go to Courses
              </a>
            </div>
            <div className="err-search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the platform…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") search();
                }}
              />
              <button onClick={search}>Search →</button>
            </div>
            <div className="err-popular">
              <div className="err-popular-label">Popular pages</div>
              <div className="err-chips">
                <a
                  className="err-chip"
                  href="/courses/"
                >
                  Courses
                </a>
                <Link className="err-chip" href="/dashboard">
                  My Dashboard
                </Link>
                <Link className="err-chip" href="/case-study-vault">
                  Case Studies
                </Link>
                <Link className="err-chip" href="/innovation-lab">
                  Innovation Lab
                </Link>
                <Link className="err-chip" href="/partner-register">
                  Partner with Us
                </Link>
                <a
                  className="err-chip"
                  href="https://thehrplayhousehub-clockiq.netlify.app/"
                >
                  ClockIQ
                </a>
                <a
                  className="err-chip"
                  href="mailto:contact@thehrplayhousehub.org"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
