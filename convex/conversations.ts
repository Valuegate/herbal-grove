import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createConversation = mutation({
  args: {
    title: v.string()
  },

  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized")
    }

    return await ctx.db.insert("conversations", {
      userId: identity.subject,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const getConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect()

    return conversations.sort(
      (a, b) => b.updatedAt - a.updatedAt
);
  } 
  
})

export const getRecentConversations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(args.limit ?? 2);
  },
});

export const updateConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });
  },
});

export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations")
  },

  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete("messages", message._id);
    }
    await ctx.db.delete("conversations", args.conversationId);
  }
})