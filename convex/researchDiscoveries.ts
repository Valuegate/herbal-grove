import { mutation, query } from "./_generated/server";
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

export const getDiscoveryBySourceUrl = query({
  args: {
    sourceUrl: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("researchDiscoveries")
      .withIndex("by_source_url", (q) =>
        q.eq("sourceUrl", args.sourceUrl)
      )
      .first();
  },
});

export const getPendingDiscoveries = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("researchDiscoveries")
      .withIndex("by_status", (q) =>
        q.eq("status", "pending")
      )
      .order("desc")
      .collect();
  },
});

export const approveDiscovery = mutation({
  args: {
    discoveryId: v.id("researchDiscoveries"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.discoveryId, {
      status: "approved",
      updatedAt: Date.now(),
    });
  },
});

export const rejectDiscovery = mutation({
  args: {
    discoveryId: v.id("researchDiscoveries"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.discoveryId, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

export const getApprovedDiscoveries = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("researchDiscoveries")
      .withIndex("by_status", (q) =>
        q.eq("status", "approved")
      )
      .order("desc")
      .collect();
  },
});

export const removeApprovedDiscovery = mutation({
  args: {
    discoveryId: v.id("researchDiscoveries"),
  },

  handler: async (ctx, args) => {
    const discovery = await ctx.db.get(
      args.discoveryId
    );

    if (!discovery) {
      throw new Error("Discovery not found.");
    }

    if (discovery.status !== "approved") {
      throw new Error(
        "Only approved discoveries can be removed."
      );
    }

    await ctx.db.patch(args.discoveryId, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

export const getDiscoveryById = query({
  args: {
    discoveryId: v.id("researchDiscoveries"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.discoveryId);
  },
});