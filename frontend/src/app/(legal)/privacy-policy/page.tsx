import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — The HR Playhouse Hub",
  description: "How The HR Playhouse Hub collects, uses, and protects your personal data.",
};

export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy">
      <p>
        The HR Playhouse Hub is committed to protecting your privacy. This policy will explain
        what data we collect, how we use it, the legal basis for processing, and your rights.
      </p>
      <h2>What we collect</h2>
      <p>Account details, learning progress, and usage information needed to run the platform.</p>
      <h2>Your rights</h2>
      <p>You can request access to, correction of, or deletion of your personal data at any time.</p>
    </LegalPage>
  );
}
