import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./utils/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { authRoutes } from "./routes/authRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { problemRoutes } from "./routes/problemRoutes";
import { aiRoutes } from "./routes/aiRoutes";
import { userRoutes } from "./routes/userRoutes";
import { expertRoutes } from "./routes/expertRoutes";
import { consultationRoutes } from "./routes/consultationRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { reportRoutes } from "./routes/reportRoutes";

export function createApp() {
  const app = express();

  
  app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/", (req, res) => {
  res.json({
    message: "Sharthi API running successfully",
  });
});
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/problems", problemRoutes);
  app.use("/api/experts", expertRoutes);
  app.use("/api/consultations", consultationRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

