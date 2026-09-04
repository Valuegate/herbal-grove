import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { cosineSimilarity } from "../lib/retrieval/cosineSimilarity";

// Chunk creation
export const createChunk = mutation({
  args: {
    documentId: v.id("documents"),
    page: v.optional(v.number()),
    chunkIndex: v.number(),
    text: v.string(),
    embedding: v.array(v.float64()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("chunks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const createChunks = mutation({
  args: {
    chunks: v.array(
      v.object({
        documentId: v.id("documents"),
        page: v.optional(v.number()),
        chunkIndex: v.number(),
        text: v.string(),
        embedding: v.array(v.number()),
      })
    ),
  },

  handler: async (ctx, args) => {
    const ids = [];

    for (const chunk of args.chunks) {
      const id = await ctx.db.insert("chunks", {
        ...chunk,
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return ids;
  },
});

// Chunk retrievals
export const getChunks = query({
  handler: async (ctx) => {
    return await ctx.db.query("chunks").collect();
  },
});

export const getChunkById = query({
  args: {
    id: v.id("chunks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getChunksByDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const chunks =  await ctx.db
      .query("chunks")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();
    
    return chunks
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map((chunk) => chunk.text)
      .join("\n\n");
  },
});

// Chunk Updates
export const updateChunk = mutation({
  args: {
    id: v.id("chunks"),
    page: v.optional(v.number()),
    chunkIndex: v.number(),
    text: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    await ctx.db.patch(id, data);
  },
});

// Chunk Deletions
export const deleteChunk = mutation({
  args: {
    id: v.id("chunks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteChunksByDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("chunks")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});

//rag actions
//search chunks
export const searchChunks = query({
  args: {
    embedding: v.array(v.float64()),
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const chunks = await ctx.db.query("chunks").collect();

    const ranked = chunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        args.embedding,
        chunk.embedding
      ),
    }));

    const sorted = ranked.sort(
      (a, b) => b.similarity - a.similarity
    );

    console.log(
      "Top 5 matches:",
      sorted.slice(0, 5).map((chunk) => ({
        similarity: chunk.similarity,
        text: chunk.text.slice(0, 100),
      }))
    );

    return sorted
      .filter((chunk) => chunk.similarity >= 0.8)
      .slice(0, args.limit ?? 5);
  },
});

export const getApprovedChunks = query({
  handler: async (ctx) => {
    const chunks = await ctx.db
      .query("chunks")
      .collect();

    const approvedChunks = [];

    for (const chunk of chunks) {
      const document = await ctx.db.get(chunk.documentId);

      if (
        document?.verificationStatus === "approved" &&
        document?.ingestionStatus === "indexed"
      ) {
        approvedChunks.push(chunk);
      }
    }

    return approvedChunks;
  },
});