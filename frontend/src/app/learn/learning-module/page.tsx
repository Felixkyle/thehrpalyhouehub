import type { Metadata } from "next";
import LearningModuleContent from "./learning-module-content";

export const metadata: Metadata = {
  title: "The HR Playhouse Hub — Learning Module",
  description: "",
};

export default function Page() {
  return <LearningModuleContent />;
}
