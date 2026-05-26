import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import * as adminController from "../controllers/adminController";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(adminController.requireAdmin);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// Expert management
router.post("/experts/:expertId/verify", adminController.verifyExpert);
router.post("/experts/:expertId/reject", adminController.rejectExpertVerification);

// User management
router.get("/users", adminController.getUsers);
router.post("/users/:userId/suspend", adminController.suspendUser);

// Reports & Moderation
router.get("/reports", adminController.getPendingReports);
router.post("/reports/:reportId/resolve", adminController.resolveReport);

// Categories
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.delete("/categories/:categoryId", adminController.deleteCategory);

export const adminRoutes = router;
