import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Send a message
export const sendMessage = mutation({
  args: {
    consultationId: v.id("consultations"),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be signed in.");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    if (consultation.status !== "active") {
      throw new Error(
        "Messages can only be sent during an active consultation."
      );
    }

    const consultant = await ctx.db.get(
      consultation.consultantId
    );
    if (!consultant) {
      throw new Error("Consultant not found.");
    }

    const isUser = consultation.userId === identity.subject;
    const isConsultant = consultant.clerkId === identity.subject;

    if (!isUser && !isConsultant) {
      throw new Error(
        "You do not have permission to send messages in this consultation."
      );
    }

    const sender = isUser ? "user" : "consultant";
    const content = args.content.trim();

    if (!content) {
      throw new Error("Message cannot be empty.");
    }

    const now = Date.now();

    const messageId = await ctx.db.insert(
      "consultationMessages",
      {
        consultationId: args.consultationId,
        sender,
        content,
        createdAt: now,
      }
    );

    // User sent a message → notify consultant
    if (sender === "user") {
      await ctx.db.insert("notifications", {
        recipientId: consultant.clerkId,
        title: "New consultation message",
        message: `${consultation.userName} sent you a message.`,
        type: "consultation_message",
        link: `/consultant/chat/${args.consultationId}`,
        isRead: false,
        createdAt: now,
      });
    }

    // Consultant sent a message → notify user
    if (sender === "consultant") {
      await ctx.db.insert("notifications", {
        recipientId: consultation.userId,
        title: "New consultation message",
        message: `${consultant.fullName} sent you a message.`,
        type: "consultation_message",
        link: `/consultantchat/${args.consultationId}`,
        isRead: false,
        createdAt: now,
      });
    }

    return messageId;
  },
});

// Get all messages in a consultation
export const getMessages = query({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultationMessages")
      .withIndex(
        "by_consultation",
        (q) =>
          q.eq(
            "consultationId",
            args.consultationId
          )
      )
      .order("asc")
      .collect();
  },
});