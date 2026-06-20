/**
 * Seed the 4 course levels into MongoDB.
 *
 * Run:  npm run seed:courses
 *
 * Idempotent — upserts by level_number, so re-running updates content rather
 * than duplicating. Does NOT touch user Progress.
 */
import { connectDb } from "../db/connect.js";
import { Course } from "../models/Course.js";
import { Badge } from "../models/Badge.js";
import mongoose from "mongoose";

/**
 * Badge catalog — one badge awarded per level completed, plus the full
 * programme. Slugs MUST match the slugs awarded in `onLevelComplete`
 * (utils/progress.ts): `level-1`..`level-4` and `full-programme`.
 */
const BADGES = [
  { slug: "level-1", name: "HR Foundations", emoji: "🏅", description: "Completed Level 1 — HR Foundations." },
  { slug: "level-2", name: "Operational HR", emoji: "🏅", description: "Completed Level 2 — Operational HR." },
  { slug: "level-3", name: "Strategic HR", emoji: "🏅", description: "Completed Level 3 — Strategic HR." },
  { slug: "level-4", name: "Future-Forward HR", emoji: "🏅", description: "Completed Level 4 — Future-Forward HR." },
  {
    slug: "full-programme",
    name: "Programme Graduate",
    emoji: "🏆",
    description: "Completed all four levels and the final HR Strategy Proposal.",
  },
];

type Item = { id: string; name: string };

interface SeedLevel {
  level_number: 1 | 2 | 3 | 4;
  title: string;
  course_name: string;
  description: string;
  estimated_hours: number;
  topics: Item[];
  case_studies: Item[];
  games: Item[];
}

const LEVELS: SeedLevel[] = [
  {
    level_number: 1,
    title: "HR Foundations",
    course_name: "Level 1 — HR Foundations",
    description:
      "The bedrock of people practice: how HR creates value, the employment relationship, and building culture and engagement from day one.",
    estimated_hours: 6,
    topics: [
      { id: "l1-t1", name: "The HR Mindset & Function" },
      { id: "l1-t2", name: "Employment Relationships" },
      { id: "l1-t3", name: "Culture & Engagement" },
    ],
    case_studies: [{ id: "l1-cs1", name: "TechStart Culture Clash" }],
    games: [
      { id: "l1-g1", name: "HR Role Matcher" },
      { id: "l1-g2", name: "Culture Builder" },
      { id: "l1-g3", name: "Engagement Audit" },
    ],
  },
  {
    level_number: 2,
    title: "Operational HR",
    course_name: "Level 2 — Operational HR",
    description:
      "The day-to-day engine room: hiring the right people, managing performance fairly, and keeping good people through retention and well-being.",
    estimated_hours: 7,
    topics: [
      { id: "l2-t1", name: "Recruitment & Selection" },
      { id: "l2-t2", name: "Performance Management" },
      { id: "l2-t3", name: "Retention & Well-being" },
    ],
    case_studies: [{ id: "l2-cs1", name: "HealthCo Retention Crisis" }],
    games: [
      { id: "l2-g1", name: "Hiring Decision" },
      { id: "l2-g2", name: "Burnout Detective" },
      { id: "l2-g3", name: "Wellbeing Sprint" },
    ],
  },
  {
    level_number: 3,
    title: "Strategic HR",
    course_name: "Level 3 — Strategic HR",
    description:
      "From operator to advisor: using analytics and metrics, managing talent pipelines, and aligning HR strategy with the business.",
    estimated_hours: 8,
    topics: [
      { id: "l3-t1", name: "HR Analytics & Metrics" },
      { id: "l3-t2", name: "Talent Management" },
      { id: "l3-t3", name: "HR Strategy & Business" },
    ],
    case_studies: [{ id: "l3-cs1", name: "RetailCo Talent Pipeline" }],
    games: [
      { id: "l3-g1", name: "Analytics Challenge" },
      { id: "l3-g2", name: "Talent Board" },
      { id: "l3-g3", name: "Strategy Pitch" },
    ],
  },
  {
    level_number: 4,
    title: "Future-Forward HR",
    course_name: "Level 4 — Future-Forward HR",
    description:
      "The leading edge: ethics of AI in HR, designing gamified learning, and preparing for the future of work — capped by your HR Strategy Proposal.",
    estimated_hours: 9,
    topics: [
      { id: "l4-t1", name: "AI Ethics in HR" },
      { id: "l4-t2", name: "Gamification & L&D Design" },
      { id: "l4-t3", name: "Future of Work" },
    ],
    case_studies: [{ id: "l4-cs1", name: "FintechNG AI Hiring Audit" }],
    games: [{ id: "l4-g1", name: "Final Project: HR Strategy Proposal" }],
  },
];

async function main() {
  await connectDb();
  for (const lvl of LEVELS) {
    await Course.updateOne({ level_number: lvl.level_number }, { $set: lvl }, { upsert: true });
    console.log(`✓ seeded Level ${lvl.level_number} — ${lvl.title}`);
  }
  for (const b of BADGES) {
    await Badge.updateOne({ slug: b.slug }, { $set: b }, { upsert: true });
    console.log(`✓ seeded badge — ${b.name}`);
  }

  const count = await Course.countDocuments();
  const badgeCount = await Badge.countDocuments();
  console.log(`Done. ${count} course level(s) and ${badgeCount} badge(s) in the database.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
