import { Schema, Types, model } from "mongoose";

interface IPasswordReset {
  user_id: Types.ObjectId;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  token_hash: { type: String, required: true, unique: true },
  expires_at: { type: Date, required: true },
  used_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

passwordResetSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = model<IPasswordReset>("PasswordReset", passwordResetSchema);
