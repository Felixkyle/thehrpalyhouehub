import express from "express";
import cors from "cors";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";
import courseRoutes from "./routes/courses.js";
import certificateRoutes from "./routes/certificates.js";
import progressReportRoutes from "./routes/progress-report.js";
import enquiryRoutes from "./routes/enquiries.js";
import aiRoutes from "./routes/ai.js";
import caseStudyRoutes from "./routes/case-studies.js";
import playbookRoutes from "./routes/playbook.js";
import resourceRoutes from "./routes/resources.js";
import webinarRoutes from "./routes/webinars.js";
import forumRoutes from "./routes/forum.js";
import adminEmailRoutes from "./routes/admin-email.js";
import adminRoutes from "./routes/admin.js";

export function createApp() {
  const app = express();

  // FRONTEND_URL may be a comma-separated list (e.g. apex + www + localhost).
  const allowedOrigins = env.frontendUrl.split(",").map((o) => o.trim()).filter(Boolean);
  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients (curl, server-to-server) with no Origin header.
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Origin not allowed by CORS: ${origin}`));
      },
    }),
  );
  app.use(express.json({ limit: "20mb" }));

  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/certificates", certificateRoutes);
  app.use("/api/progress-report", progressReportRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/case-studies", caseStudyRoutes);
  app.use("/api/playbook", playbookRoutes);
  app.use("/api/resources", resourceRoutes);
  app.use("/api/webinars", webinarRoutes);
  app.use("/api/forum", forumRoutes);
  app.use("/api/admin/email-sender", adminEmailRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  app.use(errorHandler);

  return app;
}
