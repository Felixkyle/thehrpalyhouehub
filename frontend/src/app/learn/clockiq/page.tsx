import type { Metadata } from "next";
import ClockiqContent from "./clockiq-content";

export const metadata: Metadata = {
  title: "ClockIQ | HR Playhouse Hub",
  description:
    "ClockIQ is a browser-based work tracking and HR intelligence platform for African organisations. No installs. No complexity. Free to start.",
};

export default function Page() {
  return <ClockiqContent />;
}
