import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — The HR Playhouse Hub",
  description: "How The HR Playhouse Hub uses cookies and similar technologies.",
};

export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Cookie Policy">
      <p>
        This policy explains how The HR Playhouse Hub uses cookies and similar technologies to
        run the platform and improve your experience.
      </p>
      <h2>Essential cookies</h2>
      <p>Required for sign-in and core functionality — these cannot be turned off.</p>
      <h2>Analytics cookies</h2>
      <p>Help us understand how the platform is used so we can improve it.</p>
    </LegalPage>
  );
}
