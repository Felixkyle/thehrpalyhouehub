import type { Metadata } from "next";
import CpdRecognitionContent from "./cpd-recognition-content";

export const metadata: Metadata = {
  title: "CPD recognition | HR Playhouse Hub",
  description:
    "Earn verified CPD hours with HR Playhouse Hub. Our programme is in advanced discussions with a leading HR professional body for CPD accreditation.",
};

export default function Page() {
  return <CpdRecognitionContent />;
}
