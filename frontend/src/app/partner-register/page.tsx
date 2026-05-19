import type { Metadata } from "next";
import PartnerRegisterContent from "./partner-register-content";

export const metadata: Metadata = {
  title: "Partner with HR Playhouse Hub | Register Interest",
  description: "Register your interest in partnering with The HR Playhouse Hub Limited — CPD recognition, institutional sponsorship, consulting and more.",
};

export default function Page() {
  return <PartnerRegisterContent />;
}
