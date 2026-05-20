import { Schema, model } from "mongoose";

export interface ICaseStudy {
  slug: string;
  title: string;
  org_line: string;
  industry: string;
  industry_key: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "expert";
  featured: boolean;
  preview: string;
  scenario: { paragraphs: string[] };
  challenge: { items?: string[]; paragraphs?: string[] };
  reflect_questions: string[];
  outcomes: string[];
  lessons: string[];
  application_questions: string[];
}

const caseSchema = new Schema<ICaseStudy>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    org_line: { type: String, default: "" },
    industry: { type: String, default: "" },
    industry_key: { type: String, default: "" },
    topic: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "expert"], required: true },
    featured: { type: Boolean, default: false },
    preview: { type: String, default: "" },
    scenario: { paragraphs: { type: [String], default: [] } },
    challenge: {
      items: { type: [String], default: undefined },
      paragraphs: { type: [String], default: undefined },
    },
    reflect_questions: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
    lessons: { type: [String], default: [] },
    application_questions: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

caseSchema.index({ title: "text", org_line: "text", preview: "text" });

export const CaseStudy = model<ICaseStudy>("CaseStudy", caseSchema);
