import type { Metadata } from "next";
import PlaybookContent from "./playbook-content";

export const metadata: Metadata = {
  title: "Everyday HR Playbook — HR Playhouse Hub",
  description:
    "Your grab-it-when-you-need-it guide to the 10 situations every HR professional and manager will face — step-by-step actions, template language and legal checklists.",
};

export default function Page() {
  return <PlaybookContent />;
}
