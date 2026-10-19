import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cosineSimilarity } from "../lib/retrieval/cosineSimilarity";

export const createResearchChunk = mutation({
  args: {
    discoveryId: v.id("researchDiscoveries"),
    chunkIndex: v.number(),
    text: v.string(),
    embedding: v.array(v.float64()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("researchChunks", {
      ...args,
      isApproved: true,
      createdAt: Date.now(),
    });
  },
});

export const getApprovedResearchChunks = query({
  args: {},

  handler: async (ctx) => {
    const chunks = await ctx.db
      .query("researchChunks")
      .collect();

    const approvedChunks = [];

    for (const chunk of chunks) {
      const discovery = await ctx.db.get(
        chunk.discoveryId
      );

      if (discovery?.status === "approved") {
        approvedChunks.push(chunk);
      }
    }

    return approvedChunks;
  },
});

export const getResearchChunksByDiscovery = query({
  args: {
    discoveryId: v.id("researchDiscoveries"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("researchChunks")
      .withIndex("by_discovery", (q) =>
        q.eq("discoveryId", args.discoveryId)
      )
      .collect();
  },
});

export const deleteResearchChunksByDiscovery =
  mutation({
    args: {
      discoveryId: v.id("researchDiscoveries"),
    },

    handler: async (ctx, args) => {
      const chunks = await ctx.db
        .query("researchChunks")
        .withIndex("by_discovery", (q) =>
          q.eq(
            "discoveryId",
            args.discoveryId
          )
        )
        .collect();

      for (const chunk of chunks) {
        await ctx.db.delete(chunk._id);
      }
    },
  });

  export const searchApprovedResearchChunks = query({
  args: {
    embedding: v.array(v.float64()),
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("researchChunks")
      .withIndex("by_approved", (q) =>
        q.eq("isApproved", true)
      )
      .take(200);

    const ranked = chunks
      .map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(
          args.embedding,
          chunk.embedding
        ),
      }))
      .sort(
        (a, b) =>
          b.similarity - a.similarity
      );

    return ranked
      .filter(
        (chunk) =>
          chunk.similarity >= 0.65
      )
      .slice(0, args.limit ?? 3);
  },
});