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

    const slot = await ctx.db.get(consultation.slotId);

    if (!slot) {
      throw new Error("Consultation slot not found.");
    }

    if (Date.now() >= slot.endTime) {
      throw new Error("This consultation has ended.");
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

    const recipientId =
      sender === "user"
        ? consultant.clerkId
        : consultation.userId;

    const activeView = await ctx.db
      .query("activeConsultationViews")
      .withIndex("by_clerk_and_consultation", (q) =>
        q
          .eq("clerkId", recipientId)
          .eq("consultationId", args.consultationId)
      )
      .first();

    const isRecipientViewingChat =
      activeView !== null &&
      now - activeView.updatedAt < 60_000;
    
    console.log("MESSAGE PRESENCE DEBUG", {
      sender,
      senderClerkId: identity.subject,
      recipientId,
      consultationId: args.consultationId,
      activeView,
      age:
        activeView !== null
          ? now - activeView.updatedAt
          : null,
      isRecipientViewingChat,
    });

    if (!isRecipientViewingChat) {
      await ctx.db.insert("notifications", {
        recipientId,
        title: "New consultation message",
        message:
          sender === "user"
            ? `${consultation.userName} sent you a message.`
            : `${consultant.fullName} sent you a message.`,
        type: "consultation_message",
        link:
          sender === "user"
            ? `/consultant/chat/${args.consultationId}`
            : `/consultantchat/${args.consultationId}`,
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