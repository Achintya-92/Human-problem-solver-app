import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import * as reportController from "../controllers/reportController";

const router = express.Router();

// Create a report
router.post("/", requireAuth, reportController.createReport);

// Get all reports (admin only)
router.get("/", requireAuth, reportController.getReports);

// Get a specific report
router.get("/:id", requireAuth, reportController.getReport);

// Update report status (admin only)
router.patch("/:id/status", requireAuth, reportController.updateReportStatus);

// Get reports for a user
router.get("/user/:userId", requireAuth, reportController.getUserReports);

export const reportRoutes = router;
