import { mutation, query } from "./_generated/server";
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

export const getMessages = query({
  args: {
    conversations: v.id("conversations")
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversations)
      )
      .order("asc")
      .collect()
  }
})