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

// `learning-module` has static game assets in public/learning-module/games/*.
// A nested redirect would wrongly catch those files, so it only gets an
// exact-path redirect (no `:path*`).
const NO_NESTED_REDIRECT = new Set(["learning-module"]);

const nextConfig: NextConfig = {
  async redirects() {
    return LEARN_ROUTES.flatMap((route) => {
      const rules = [
        // Exact old path -> new /learn path
        { source: `/${route}`, destination: `/learn/${route}`, permanent: true },
      ];
      if (!NO_NESTED_REDIRECT.has(route)) {
        // Any nested sub-paths (e.g. /case-study-vault/123)
        rules.push({ source: `/${route}/:path*`, destination: `/learn/${route}/:path*`, permanent: true });
      }
      return rules;
    });
  },
};

export default nextConfig;
