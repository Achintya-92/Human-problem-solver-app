import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import * as expertController from "../controllers/expertController";

const router = express.Router();

// Get my expert profile
router.get("/me", requireAuth, expertController.getMyExpertProfile);

// Create or update my expert profile
router.put("/me", requireAuth, expertController.createOrUpdateExpertProfile);

// List all experts (public)
router.get("/", expertController.listExperts);

// Get expert by ID (public)
router.get("/:id", expertController.getExpertById);

// Upload profile photo
router.post("/me/photo", requireAuth, expertController.uploadProfilePhoto);

export const expertRoutes = router;
