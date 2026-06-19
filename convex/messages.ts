import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveMessages = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant")
    ),
    content: v.string()
  },

  handler: async(ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      createdAt: Date.now()
    });
  }
});