import { Schema, Types, model } from "mongoose";

export interface IEnquiry {
  kind: "cpd" | "partnership" | "mentorship" | "resource_submit" | "clockiq";
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  country: string | null;
  job_title: string | null;
  org_type: string | null;
  track: string | null;
  topic: string | null;
  message: string;
  attachment_url: string | null;
  user_id: Types.ObjectId | null;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    kind: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    organisation: { type: String, default: null },
    phone: { type: String, default: null },
    country: { type: String, default: null },
    job_title: { type: String, default: null },
    org_type: { type: String, default: null },
    track: { type: String, default: null },
    topic: { type: String, default: null },
    message: { type: String, default: "" },
    attachment_url: { type: String, default: null },
    user_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Enquiry = model<IEnquiry>("Enquiry", enquirySchema);
