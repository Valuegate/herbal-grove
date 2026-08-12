import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveMessages = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant")
    ),
    content: v.string(),
    source: v.optional(
      v.union(
        v.literal("rag"),
        v.literal("llm")
      )
    ),
    references: v.optional(
      v.array(
        v.object({
          text: v.string(),
          similarity: v.float64(),
          documentId: v.id("documents"),
          page: v.optional(v.number()),
        })
      )
    ),
  },

  handler: async(ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      source: args.source,
      references: args.references,
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