import { mutation } from "./_generated/server";
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