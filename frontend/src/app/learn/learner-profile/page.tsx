import type { Metadata } from "next";
import LearnerProfileContent from "./learner-profile-content";

export const metadata: Metadata = {
  title: "Profile & settings | HR Playhouse Hub",
  description:
    "Manage your HR Playhouse Hub account — update your profile, change your password, and set your notification preferences.",
};

export default function Page() {
  return <LearnerProfileContent />;
}
