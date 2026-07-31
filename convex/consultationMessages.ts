import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Send a message
export const sendMessage = mutation({
  args: {
    consultationId: v.id("consultations"),
    sender: v.union(
      v.literal("user"),
      v.literal("consultant")
    ),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert(
      "consultationMessages",
      {
        consultationId: args.consultationId,
        sender: args.sender,
        content: args.content,
        createdAt: Date.now(),
      }
    );
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