import Link from "next/link";
import "./legal.css";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

/**
 * Shared shell for the policy stub pages. Renders the standard nav + a
 * centered article column. The actual policy copy is passed as children —
 * these are placeholders until the real legal text is supplied.
 */
export default function LegalPage({ eyebrow, title, children }: LegalPageProps) {
  return (
    <div className="legal-shell">
      <nav className="legal-nav">
        <a className="legal-nav-logo" href="/">
          <span className="legal-nav-pill">HR</span>
          <span className="legal-nav-text">Playhouse Hub</span>
        </a>
        <Link className="legal-nav-back" href="/">
          ← Back to home
        </Link>
      </nav>

      <main className="legal-main">
        <div className="legal-eyebrow">{eyebrow}</div>
        <h1 className="legal-title">{title}</h1>
        <p className="legal-updated">Last updated: pending</p>

        <div className="legal-notice">
          This is a placeholder page. The full {title.toLowerCase()} will be published here.
          For any questions in the meantime, contact{" "}
          <a href="mailto:contact@thehrplayhousehub.org">contact@thehrplayhousehub.org</a>.
        </div>

        <div className="legal-body">{children}</div>
      </main>
    </div>
  );
}
