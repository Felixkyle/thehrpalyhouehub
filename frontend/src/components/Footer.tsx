import Link from "next/link";

/**
 * Shared site footer.
 *
 * Faithful port of the `<footer>` block that was byte-identical across the
 * marketing/auth pages. Internal links with a local route use the Next.js
 * route; external/legal links keep pointing at the live site, matching the
 * original generator's link-rewrite rules.
 */
export default function Footer() {
  return (
    <footer>
      <div className="f-inner">
        <div className="f-top">
          <div>
            <a className="f-brand" href="https://www.thehrplayhousehub.org/">
              <div className="f-brand-pill">HR Playhouse</div>
              <div className="f-brand-name">Hub</div>
            </a>
            <p className="f-desc">
              A research-backed, gamified HR learning platform built for HR
              professionals at every stage — from first role to strategic
              leader.
            </p>
          </div>
          <div>
            <div className="f-col-title">Platform</div>
            <a
              className="f-link"
              href="https://learn.thehrplayhousehub.org/courses/"
            >
              Courses
            </a>
            <Link className="f-link" href="/case-study-vault">
              Case Studies
            </Link>
            <Link className="f-link" href="/playbook">
              HR Playbook
            </Link>
            <Link className="f-link" href="/innovation-lab">
              Innovation Lab
            </Link>
            <Link className="f-link" href="/ai-support">
              AI Support
            </Link>
          </div>
          <div>
            <div className="f-col-title">Company</div>
            <a className="f-link" href="https://www.thehrplayhousehub.org/">
              Homepage
            </a>
            <Link className="f-link" href="/partner-register">
              Partner with Us
            </Link>
            <a
              className="f-link"
              href="https://thehrplayhousehub-clockiq.netlify.app/"
            >
              ClockIQ
            </a>
            <a className="f-link" href="mailto:contact@thehrplayhousehub.org">
              Contact
            </a>
          </div>
          <div>
            <div className="f-col-title">Legal</div>
            <a
              className="f-link"
              href="https://learn.thehrplayhousehub.org/privacy-policy/"
            >
              Privacy Policy
            </a>
            <a
              className="f-link"
              href="https://learn.thehrplayhousehub.org/terms-of-service/"
            >
              Terms &amp; Conditions
            </a>
            <a
              className="f-link"
              href="https://learn.thehrplayhousehub.org/cookie-policy/"
            >
              Cookie Policy
            </a>
          </div>
        </div>
        <div className="f-bottom">
          <div className="f-copy">
            © 2026 HR Playhouse Hub Limited · RC 8387672
          </div>
          <div className="f-legal">
            <a href="https://learn.thehrplayhousehub.org/privacy-policy/">
              Privacy
            </a>
            <a href="https://learn.thehrplayhousehub.org/terms-of-service/">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
