import type { Metadata } from "next";
import DashboardContent from "./dashboard-content";

export const metadata: Metadata = {
  title: "My Dashboard — HR Playhouse Hub",
  description:
    "Track your HR Playhouse Hub learning progress, courses, badges and next steps.",
};

export default function Page() {
  return <DashboardContent />;
}
