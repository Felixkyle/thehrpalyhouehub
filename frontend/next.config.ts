import type { NextConfig } from "next";

// Pages that moved under the /learn/ prefix (formerly the learn. subdomain).
// Old top-level paths redirect to their new /learn/ location so existing
// bookmarks and inbound links keep working.
const LEARN_ROUTES = [
  "dashboard",
  "my-courses",
  "learning-module",
  "learner-profile",
  "progress-report",
  "certificate-verify",
  "case-study-vault",
  "playbook",
  "resources",
  "innovation-lab",
  "ai-support",
  "clockiq",
  "email-sender",
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEARN_ROUTES.flatMap((route) => [
      // Exact old path -> new /learn path
      { source: `/${route}`, destination: `/learn/${route}`, permanent: true },
      // Any nested sub-paths (e.g. /learning-module/123)
      { source: `/${route}/:path*`, destination: `/learn/${route}/:path*`, permanent: true },
    ]);
  },
};

export default nextConfig;
