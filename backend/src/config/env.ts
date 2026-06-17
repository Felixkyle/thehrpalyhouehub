import "dotenv/config";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  mongodbUri: req("MONGODB_URI"),
  jwtSecret: req("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-pro",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "The HR Playhouse Hub <contact@thehrplayhousehub.org>",
  // Where form/enquiry notifications are sent. Defaults to the real inbox, but
  // can be overridden (e.g. to your Resend account email while the domain is
  // still unverified and resend.dev only delivers to your own address).
  contactInbox: process.env.CONTACT_INBOX ?? "contact@thehrplayhousehub.org",
};

if (env.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters");
}
