import type { Metadata } from "next";
import ResourcesContent from "./resources-content";

export const metadata: Metadata = {
  title: "Resources Library — HR Playhouse Hub",
  description:
    "Free toolkits, research reports, policy frameworks and practice guides for HR professionals in higher education.",
};

export default function Page() {
  return <ResourcesContent />;
}
