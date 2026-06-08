import type { Metadata } from "next";
import EmailSenderContent from "./email-sender-content";

export const metadata: Metadata = {
  title: "HR Playhouse Hub — Email Sender",
  description:
    "Internal team tool for composing and sending HR Playhouse Hub learner emails.",
};

export default function Page() {
  return <EmailSenderContent />;
}
