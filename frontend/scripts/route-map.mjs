// Maps each source HTML file (in "Corrected Files for HRPH/") to a Next.js route.
//
// - route "" means the homepage (app/page.tsx)
// - route "__not_found__" is special-cased to app/not-found.tsx
//
// Edit this file if you want to change any URL, then re-run:
//   node scripts/generate-pages.mjs

export const ROUTE_MAP = [
  { html: "hrplayhousehub_v7.html", route: "" }, // homepage  ->  /
  { html: "01_signup.html", route: "signup" }, // /signup
  { html: "02_dashboard.html", route: "dashboard" }, // /dashboard
  { html: "03_ai-support.html", route: "ai-support" }, // /ai-support
  { html: "08_resources_library.html", route: "resources" }, // /resources
  { html: "my-courses.html", route: "my-courses" }, // /my-courses
  { html: "learner-profile.html", route: "learner-profile" }, // /learner-profile
  { html: "progress-report.html", route: "progress-report" }, // /progress-report
  { html: "certificate-verify.html", route: "certificate-verify" },
  { html: "cpd-recognition.html", route: "cpd-recognition" },
  { html: "partner-register.html", route: "partner-register" },
  { html: "password-reset.html", route: "password-reset" },
  { html: "webinar-booking.html", route: "webinar-booking" },
  { html: "pricing_sep2026.html", route: "pricing" }, // /pricing
  { html: "clockiq.html", route: "clockiq" },
  { html: "innovation-lab.html", route: "innovation-lab" },
  { html: "case_study_vault_v2.html", route: "case-study-vault" },
  { html: "everyday_hr_playbook_v3.html", route: "playbook" }, // /playbook
  { html: "learning_module_v2.html", route: "learning-module" }, // /learning-module
  { html: "hrph-email-sender.html", route: "email-sender" },
  { html: "404.html", route: "__not_found__" }, // app/not-found.tsx
];

// Rewrites for cross-page links found inside the HTML.
// Original WordPress pages link to each other with bare ".html" filenames
// (e.g. href="02_dashboard.html") or absolute paths
// (e.g. href="/partner-register.html"). We rewrite those to Next.js routes.
export const LINK_REWRITES = ROUTE_MAP.filter(
  (m) => m.route !== "__not_found__",
).flatMap(({ html, route }) => {
  const target = route === "" ? "/" : `/${route}`;
  // Match both "file.html" and "/file.html" forms (with optional query/hash).
  return [
    { from: `/${html}`, to: target },
    { from: html, to: target },
  ];
});

// The original pages link to the old WordPress LMS on the
// `learn.thehrplayhousehub.org` subdomain. Where we now have a local
// equivalent page, rewrite those links to the internal route. Paths NOT
// listed here (e.g. /courses/, /sign-in/, legal pages) are intentionally
// left pointing at the live site — they aren't part of these 20 pages.
export const LMS_PATH_MAP = {
  "case-study-vault": "/case-study-vault",
  "hr-support": "/ai-support",
  playbook: "/playbook",
  "virtual-innovation-lab": "/innovation-lab",
  dashboard: "/dashboard",
  resources: "/resources",
  "sign-up": "/signup",
};
