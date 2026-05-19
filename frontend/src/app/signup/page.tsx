import type { Metadata } from "next";
import SignupContent from "./signup-content";

export const metadata: Metadata = {
  title: "Join The HR Playhouse Hub",
  description: "Create your free HR Playhouse Hub account and start your HR learning journey today.",
};

export default function Page() {
  return <SignupContent />;
}
