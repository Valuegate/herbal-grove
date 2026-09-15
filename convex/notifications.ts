import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

const notificationType = v.union(
  v.literal("consultation_booking"),
  v.literal("consultation_message"),
  v.literal("consultation_status"),
  v.literal("research_review"),
  v.literal("document_review"),
  v.literal("system")
);

async function requireUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity.subject;
}

function getUnreadNotifications(ctx: QueryCtx | MutationCtx, recipientId: string) {
  return ctx.db
    .query("notifications")
    .withIndex("by_recipient_and_read", (q) => q.eq("recipientId", recipientId).eq("isRead", false))
    .collect();
}

// Create a notification for another user (e.g. a consultant notifying a patient).
export const createNotification = mutation({
  args: {
    recipientId: v.string(),
    title: v.string(),
    message: v.string(),
    type: notificationType,
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("notifications", { ...args, isRead: false, createdAt: Date.now() });
  },
});

// Get the current user's notifications, most recent first.
export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const recipientId = await requireUserId(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", recipientId))
      .collect();

    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get the current user's unread notification count.
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const recipientId = await requireUserId(ctx);
    const notifications = await getUnreadNotifications(ctx, recipientId);
    return notifications.length;
  },
});

// Mark all of the current user's notifications as read.
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const recipientId = await requireUserId(ctx);
    const notifications = await getUnreadNotifications(ctx, recipientId);

    await Promise.all(
      notifications.map((notification) => ctx.db.patch(notification._id, { isRead: true }))
    );
  },
});

// Mark a single notification as read, only if it belongs to the current user.
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");
    if (notification.recipientId !== userId) throw new Error("Unauthorized");

    if (!notification.isRead) {
      await ctx.db.patch(args.notificationId, { isRead: true });
    }
  },
});