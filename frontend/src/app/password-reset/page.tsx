import type { Metadata } from "next";
import { Suspense } from "react";
import PasswordResetContent from "./password-reset-content";

export const metadata: Metadata = {
  title: "Reset password | HR Playhouse Hub",
  description: "Reset your HR Playhouse Hub account password. Enter your email and we'll send you a reset link.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PasswordResetContent />
    </Suspense>
  );
}
