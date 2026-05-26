import { prisma } from "../db/prisma";
import type { NotificationType } from "@prisma/client";

export async function createNotification(
  sentById: string,
  receivedById: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  return prisma.notification.create({
    data: {
      sentById,
      receivedById,
      type,
      message,
      link,
    },
  });
}

export async function getUserNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { receivedById: userId },
      skip,
      take: limit,
      include: { sentBy: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where: { receivedById: userId } }),
  ]);

  return { notifications, total, page, limit };
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: { receivedById: userId, read: false },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { receivedById: userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}
