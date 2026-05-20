import { Schema, model, type Model, type HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export interface NotificationPrefs {
  course_reminders: boolean;
  completion_emails: boolean;
  webinar_announcements: boolean;
  new_content_emails: boolean;
  lab_activity: boolean;
  platform_updates: boolean;
}

export interface PrivacyPrefs {
  show_profile_in_lab: boolean;
  anonymous_posts: boolean;
  share_progress_with_employer: boolean;
}

export interface IUser {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  job_title: string | null;
  organisation: string | null;
  country: string | null;
  how_heard: string | null;
  linkedin_url: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  email_verified: boolean;
  consent_accepted_at: Date;
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface IUserMethods {
  checkPassword(plain: string): Promise<boolean>;
  toPublic(): Record<string, unknown>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  hashPassword(plain: string): Promise<string>;
}

export type UserDoc = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    job_title: { type: String, default: null },
    organisation: { type: String, default: null },
    country: { type: String, default: null },
    how_heard: { type: String, default: null },
    linkedin_url: { type: String, default: null },
    bio: { type: String, default: null },
    avatar_url: { type: String, default: null },
    is_admin: { type: Boolean, default: false },
    email_verified: { type: Boolean, default: false },
    consent_accepted_at: { type: Date, required: true },
    notifications: {
      course_reminders: { type: Boolean, default: true },
      completion_emails: { type: Boolean, default: true },
      webinar_announcements: { type: Boolean, default: true },
      new_content_emails: { type: Boolean, default: false },
      lab_activity: { type: Boolean, default: true },
      platform_updates: { type: Boolean, default: true },
    },
    privacy: {
      show_profile_in_lab: { type: Boolean, default: true },
      anonymous_posts: { type: Boolean, default: false },
      share_progress_with_employer: { type: Boolean, default: false },
    },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

userSchema.method("checkPassword", function (plain: string) {
  return bcrypt.compare(plain, this.password_hash);
});

userSchema.method("toPublic", function () {
  return {
    id: String(this._id),
    email: this.email,
    first_name: this.first_name,
    last_name: this.last_name,
    display_name: `${this.first_name} ${this.last_name}`.trim(),
    role: this.role,
    job_title: this.job_title,
    organisation: this.organisation,
    country: this.country,
    linkedin_url: this.linkedin_url,
    bio: this.bio,
    avatar_url: this.avatar_url,
    created_at: this.created_at,
    consent_accepted_at: this.consent_accepted_at,
  };
});

userSchema.static("hashPassword", function (plain: string) {
  return bcrypt.hash(plain, env.bcryptRounds);
});

export const User = model<IUser, UserModel>("User", userSchema);
