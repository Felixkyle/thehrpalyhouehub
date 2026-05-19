import type { Metadata } from "next";
import CaseStudyVaultContent from "./case-study-vault-content";

export const metadata: Metadata = {
  title: "Case Study Vault — HR Playhouse Hub",
  description:
    "A library of 32 research-grounded HR case studies across 8 topic areas — scenario, decision points, outcome analysis, lessons learned, and application questions.",
};

export default function Page() {
  return <CaseStudyVaultContent />;
}
