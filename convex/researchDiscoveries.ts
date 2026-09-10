import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDiscovery = mutation({
  args: {
    source: v.string(),
    sourceUrl: v.string(),
    sourceId: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    discoveredAt: v.number(),
    topics: v.array(v.string()),
    plants: v.array(v.string()),
    contentType: v.string(),
    evidenceType: v.string(),
    relevanceScore: v.number(),
    images: v.array(
      v.object({
        url: v.string(),
        altText: v.optional(v.string()),
      })
    ),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("researchDiscoveries", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});