import { Schema, model } from "mongoose";

export interface IResource {
  slug: string;
  category: "policy" | "research" | "workshop" | "template";
  type_tag: string;
  title: string;
  description: string;
  long_description: string | null;
  year: number;
  pages: number | null;
  format: string;
  jurisdictions: string[];
  tags: string[];
  is_new: boolean;
  is_featured: boolean;
  download_url: string | null;
  open_url: string | null;
  contents: string[];
  icon: string | null;
  download_count: number;
}

const resourceSchema = new Schema<IResource>(
  {
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["policy", "research", "workshop", "template"], required: true },
    type_tag: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    long_description: { type: String, default: null },
    year: { type: Number, default: () => new Date().getFullYear() },
    pages: { type: Number, default: null },
    format: { type: String, default: "" },
    jurisdictions: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    is_new: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    download_url: { type: String, default: null },
    open_url: { type: String, default: null },
    contents: { type: [String], default: [] },
    icon: { type: String, default: null },
    download_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

resourceSchema.index({ title: "text", description: "text", tags: "text" });

export const Resource = model<IResource>("Resource", resourceSchema);
