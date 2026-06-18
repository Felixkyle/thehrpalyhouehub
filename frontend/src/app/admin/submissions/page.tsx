import type { Metadata } from "next";
import SubmissionsContent from "./submissions-content";

export const metadata: Metadata = {
  title: "Final Project Submissions — Admin",
  description: "Review submitted HR Strategy Proposals.",
};

export default function Page() {
  return <SubmissionsContent />;
}
