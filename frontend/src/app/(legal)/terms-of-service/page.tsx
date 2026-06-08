import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — The HR Playhouse Hub",
  description: "The terms governing your use of The HR Playhouse Hub platform.",
};

export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service">
      <p>
        These terms govern your access to and use of The HR Playhouse Hub. By creating an
        account or using the platform, you agree to these terms.
      </p>
      <h2>Use of the platform</h2>
      <p>Your account is for your individual use. Content is provided for learning purposes.</p>
      <h2>Account responsibilities</h2>
      <p>You are responsible for keeping your login credentials secure.</p>
    </LegalPage>
  );
}
