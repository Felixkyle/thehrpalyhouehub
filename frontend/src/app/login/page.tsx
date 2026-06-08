import type { Metadata } from "next";
import { Suspense } from "react";
import LoginContent from "./login-content";

export const metadata: Metadata = {
  title: "Sign in — The HR Playhouse Hub",
  description: "Sign in to your HR Playhouse Hub account to continue your learning journey.",
};

export default function Page() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
