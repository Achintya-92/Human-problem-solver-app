import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import * as notificationController from "../controllers/notificationController";

const router = express.Router();

// Get my notifications
router.get("/", requireAuth, notificationController.getNotifications);

// Get unread count
router.get("/unread/count", requireAuth, notificationController.getUnreadCount);

// Mark notification as read
router.patch("/:id/read", requireAuth, notificationController.markAsRead);

// Mark all notifications as read
router.post("/read-all", requireAuth, notificationController.markAllAsRead);

// Delete notification
router.delete("/:id", requireAuth, notificationController.deleteNotification);

export const notificationRoutes = router;
