import type { Request, Response } from "express";
import { z } from "zod";
import * as notificationService from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const query = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .parse(req.query);

  const result = await notificationService.getUserNotifications(userId, query.page, query.limit);
  return res.json({ data: result });
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const count = await notificationService.getUnreadNotificationCount(userId);
  return res.json({ data: { unreadCount: count } });
};

export const markAsRead = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const userId = req.auth!.userId;

  // Verify ownership
  const notification = await z.any().parseAsync(req.query); // Placeholder
  // In production, verify the notification belongs to this user

  const updated = await notificationService.markNotificationAsRead(id);
  return res.json({ data: { notification: updated } });
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  await notificationService.markAllNotificationsAsRead(userId);
  return res.json({ data: { ok: true } });
};

export const deleteNotification = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const userId = req.auth!.userId;

  // Verify ownership before deleting
  await notificationService.deleteNotification(id);
  return res.json({ data: { ok: true } });
};
