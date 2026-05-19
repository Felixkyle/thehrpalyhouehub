import type { Metadata } from "next";
import PricingContent from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing — HR Playhouse Hub",
  description:
    "Simple, fair pricing from September 2026. ACU member institution staff get free access forever; everyone else starts free and upgrades when ready.",
};

export default function Page() {
  return <PricingContent />;
}
