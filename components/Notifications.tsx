"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { NotificationIcon } from "@/components/ui/icons";
import { useUIStateContext } from "@/components/UIStateContext";

function formatNotificationTime(createdAt: number) {
  const difference = Date.now() - createdAt;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) return "Just now";
  if (difference < hour) return `${Math.floor(difference / minute)}m ago`;
  if (difference < day) return `${Math.floor(difference / hour)}h ago`;

  const days = Math.floor(difference / day);
  if (days < 7) return `${days}d ago`;

  return new Date(createdAt).toLocaleDateString();
}

export default function Notifications() {
  const { darkMode } = useUIStateContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { isAuthenticated } = useConvexAuth();

  const notifications = useQuery(api.notifications.getNotifications, isAuthenticated ? {} : "skip");
  const unreadCount = useQuery(api.notifications.getUnreadCount, isAuthenticated ? {} : "skip");
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  // Only show the latest 5 in the dropdown
  const recentNotifications = notifications?.slice(0, 5) ?? [];
  const hasUnread = !!unreadCount;

  const borderClass = darkMode ? "border-neutral-800" : "border-gray-100";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const headingClass = darkMode ? "text-white" : "text-gray-900";

  async function handleNotificationClick(
    notification: (typeof recentNotifications)[number]
  ) {
    if (!isAuthenticated) return;

    if (!notification.isRead) {
      await markAsRead({
        notificationId: notification._id,
      });
    }

    setOpen(false);

    if (notification.link) {
      router.push(notification.link);
    }
  }

  async function handleMarkAllAsRead() {
    if (!isAuthenticated) return;
    await markAllAsRead({});
  }

  return (
    <div className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`relative p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
          darkMode ? "bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300" : "bg-white hover:bg-gray-50 text-gray-600"
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <NotificationIcon />

        {hasUnread && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
            {unreadCount! > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`fixed left-4 right-4 top-18 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-95 rounded-2xl border shadow-xl overflow-hidden z-50 ${
            darkMode ? "bg-[#1e1e1e] border-neutral-800" : "bg-white border-gray-100"
          }`}
        >
          {/* Dropdown header */}
          <div className={`flex items-center justify-between px-4 py-4 border-b ${borderClass}`}>
            <h2 className={`font-semibold ${headingClass}`}>Notifications</h2>

            {hasUnread && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-[#2b7a2d] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="max-h-100 overflow-y-auto">
            {notifications === undefined ? (
              <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className={`text-sm ${mutedClass}`}>No notifications yet.</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-4 border-b transition ${
                    darkMode ? "border-neutral-800 hover:bg-neutral-800" : "border-gray-100 hover:bg-gray-50"
                  } ${!notification.isRead ? (darkMode ? "bg-green-950/20" : "bg-green-50/50") : ""}`}
                >
                  <div className="flex gap-3">
                    {/* Unread dot */}
                    <div className="pt-2">
                      <span
                        className={`block w-2 h-2 rounded-full ${
                          notification.isRead ? "bg-transparent" : "bg-[#2b7a2d]"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${notification.isRead ? "font-medium" : "font-semibold"} ${
                          darkMode ? "text-neutral-100" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </p>

                      <p className={`text-xs mt-1 line-clamp-2 ${mutedClass}`}>{notification.message}</p>

                      <p className={`text-[11px] mt-2 ${darkMode ? "text-neutral-500" : "text-gray-400"}`}>
                        {formatNotificationTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/notifications");
            }}
            className={`w-full py-3.5 text-sm font-semibold text-[#2b7a2d] transition ${
              darkMode ? "hover:bg-neutral-800" : "hover:bg-gray-50"
            }`}
          >
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
}