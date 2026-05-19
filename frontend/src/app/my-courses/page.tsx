import type { Metadata } from "next";
import MyCoursesContent from "./my-courses-content";

export const metadata: Metadata = {
  title: "My Courses — HR Playhouse Hub",
  description:
    "Track your progress across the four-level HR Playhouse Hub programme — courses, certificates and your next step.",
};

export default function Page() {
  return <MyCoursesContent />;
}
