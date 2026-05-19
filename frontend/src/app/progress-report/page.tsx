import type { Metadata } from "next";
import ProgressReportContent from "./progress-report-content";

export const metadata: Metadata = {
  title: "Progress report | HR Playhouse Hub",
  description:
    "View your full HR Playhouse Hub learning progress — all levels, activities, certificates and timeline.",
};

export default function Page() {
  return <ProgressReportContent />;
}
