import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import * as consultationController from "../controllers/consultationController";

const router = express.Router();

// Book a consultation with an expert
router.post("/experts/:expertId/book", requireAuth, consultationController.bookConsultation);

// Get a specific consultation
router.get("/:id", requireAuth, consultationController.getConsultation);

// Get my consultations (as a user)
router.get("/user/my", requireAuth, consultationController.getMyConsultations);

// Get my consultations (as an expert)
router.get("/expert/my", requireAuth, consultationController.getExpertConsultations);

// Update consultation status (expert only)
router.patch("/:id/status", requireAuth, consultationController.updateConsultation);

// Cancel consultation (user only)
router.post("/:id/cancel", requireAuth, consultationController.cancelConsultation);

export const consultationRoutes = router;
