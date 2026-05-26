"use client";

import { useEffect, useState } from "react";
import { Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: string;
  sentBy: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get<{ notifications: Notification[] }>("/notifications");
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await api.get<{ unreadCount: number }>("/notifications/unread/count");
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount(Math.max(0, unreadCount - 1));
      toast.success("Marked as read");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all", {});
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.post(`/notifications/${id}`, {});
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SOLUTION_LIKED":
        return "❤️";
      case "SOLUTION_REPLY":
        return "💬";
      case "MENTION":
        return "@";
      case "SOLUTION_ACCEPTED":
        return "✓";
      case "EXPERT_RESPONSE":
        return "👨‍💼";
      case "FOLLOW":
        return "👤";
      case "CONSULTATION_UPDATE":
        return "📅";
      default:
        return "🔔";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-all ${
                  notification.read
                    ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {notification.sentBy.avatarUrl ? (
                    <img
                      src={notification.sentBy.avatarUrl}
                      alt={notification.sentBy.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.sentBy.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsContent />
    </RequireAuth>
  );
}
