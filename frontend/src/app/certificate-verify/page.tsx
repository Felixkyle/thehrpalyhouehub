import type { Metadata } from "next";
import CertificateVerifyContent from "./certificate-verify-content";

export const metadata: Metadata = {
  title: "Certificate verification | HR Playhouse Hub",
  description:
    "Verify that an HR Playhouse Hub certificate is genuine. Enter the Certificate ID to confirm authenticity.",
};

export default function Page() {
  return <CertificateVerifyContent />;
}
