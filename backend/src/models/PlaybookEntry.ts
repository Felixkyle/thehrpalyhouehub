import { Schema, model } from "mongoose";

export interface IPlaybookEntry {
  slug: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  pills: string[];
  steps: string[];
  templates: { name: string; body: string }[];
  do_list: string[];
  dont_list: string[];
  legal: { jurisdiction: string; items: string[] }[];
  manager_guidance: string[];
  hr_guidance: string[];
  escalation_flags: string[];
  checklist_url: string | null;
}

const entrySchema = new Schema<IPlaybookEntry>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    icon: { type: String, default: "" },
    summary: { type: String, default: "" },
    pills: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    templates: { type: [{ name: String, body: String, _id: false }], default: [] },
    do_list: { type: [String], default: [] },
    dont_list: { type: [String], default: [] },
    legal: { type: [{ jurisdiction: String, items: [String], _id: false }], default: [] },
    manager_guidance: { type: [String], default: [] },
    hr_guidance: { type: [String], default: [] },
    escalation_flags: { type: [String], default: [] },
    checklist_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const PlaybookEntry = model<IPlaybookEntry>("PlaybookEntry", entrySchema);
