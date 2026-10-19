import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create Document
export const createDocument = mutation({
  args: {
    title: v.string(),
    originalFileName: v.string(),
    uploadedBy: v.string(),
    storageProvider: v.literal("cloudinary"),
    storageId: v.string(),
    fileUrl: v.string(),
    summary: v.optional(v.string()),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("outdated")
    ),
    ingestionStatus: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("indexed"),
      v.literal("failed")
    ),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("documents", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getRecentDocuments = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;

    const documents = await ctx.db
      .query("documents")
      .collect();

    return documents
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
});
// Get Documents
export const getDocuments = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const getDocumentById = query({
  args: {
    id: v.id("documents"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getDocumentsByStatus = query({
  args: {
    status: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("indexed"),
      v.literal("failed")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_status", (q) =>
        q.eq("ingestionStatus", args.status)
      )
      .collect();
  },
});

export const getDocumentsByVerification = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("outdated")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_verification", (q) =>
        q.eq("verificationStatus", args.status)
      )
      .collect();
  },
});

export const getFeaturedDocuments = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_verification", (q) =>
        q.eq("verificationStatus", "approved")
      )
      .collect();

    return documents
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
});

export const getLatestDocuments = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_verification", (q) =>
        q.eq("verificationStatus", "approved")
      )
      .collect();

    return documents
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
});

// Update Document
export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const updateDocumentStatus = mutation({
  args: {
    id: v.id("documents"),
    ingestionStatus: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("indexed"),
      v.literal("failed")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ingestionStatus: args.ingestionStatus,
      updatedAt: Date.now(),
    });
  },
});

export const updateDocumentContent = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const updateDocumentSummary = mutation({
  args: {
    id: v.id("documents"),
    summary: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      summary: args.summary,
      updatedAt: Date.now(),
    });
  },
});

export const updateVerificationStatus = mutation({
  args: {
    id: v.id("documents"),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
  },

  handler: async (ctx, args) => {
    // Update the document
    await ctx.db.patch(args.id, {
      verificationStatus: args.verificationStatus,
      updatedAt: Date.now(),
    });

    // Find all herbs linked to this document
    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.id)
      )
      .collect();

    // Map document verification -> herb status
    const herbStatus =
      args.verificationStatus === "approved"
        ? "verified"
        : "pending";

    // Update every linked herb
    for (const link of links) {
      await ctx.db.patch(link.herbId, {
        status: herbStatus,
        updatedAt: Date.now(),
      });
    }
  },
});

//Delete Document
export const deleteDocument = mutation({
  args: {
    id: v.id("documents"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get a source by name
export const getSourceByName = query({
  args: {
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const sources = await ctx.db
      .query("sources")
      .collect();

    const normalizedName =
      args.name.trim().toLowerCase();

    return (
      sources.find(
        (source) =>
          source.name.trim().toLowerCase() ===
          normalizedName
      ) ?? null
    );
  },
});

// Create a source
export const createSource = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("journal"),
      v.literal("research_institute"),
      v.literal("government"),
      v.literal("traditional"),
      v.literal("other")
    ),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("sources", {
      name: args.name.trim(),
      type: args.type,
      url: args.url,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Check whether a document is already linked to a source
export const getDocumentSource = query({
  args: {
    documentId: v.id("documents"),
    sourceId: v.id("sources"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentSources")
      .withIndex(
        "by_document_and_source",
        (q) =>
          q
            .eq(
              "documentId",
              args.documentId
            )
            .eq(
              "sourceId",
              args.sourceId
            )
      )
      .unique();
  },
});

// Link a document to a source
export const linkDocumentToSource = mutation({
  args: {
    documentId: v.id("documents"),
    sourceId: v.id("sources"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert(
      "documentSources",
      {
        documentId: args.documentId,
        sourceId: args.sourceId,
        createdAt: Date.now(),
      }
    );
  },
});