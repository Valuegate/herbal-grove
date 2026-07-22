import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Link Document to Herb
export const linkDocumentToHerb = mutation({
  args: {
    documentId: v.id("documents"),
    herbId: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    // Prevent duplicate relationships
    const existingLinks = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    const alreadyLinked = existingLinks.find(
      (link) => link.herbId === args.herbId
    );

    if (alreadyLinked) {
      return alreadyLinked._id;
    }

    return await ctx.db.insert("documentHerbs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get Herbs for Document
export const getHerbsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },

  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    const herbs = await Promise.all(
      links.map((link) => ctx.db.get(link.herbId))
    );

    return herbs.filter(Boolean);
  },
});

// Get Documents for Herb
export const getDocumentsForHerb = query({
  args: {
    herbId: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_herb", (q) =>
        q.eq("herbId", args.herbId)
      )
      .collect();

    const documents = await Promise.all(
      links.map((link) => ctx.db.get(link.documentId))
    );

    return documents.filter(Boolean);
  },
});

export const documentHerbExists = query({
  args: {
    documentId: v.id("documents"),
    herbId: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("documentHerbs")
      .withIndex(
        "by_document_and_herb",
        (q) =>
          q.eq("documentId", args.documentId)
           .eq("herbId", args.herbId)
      )
      .unique();

    return !!link;
  },
});
// Unlink One Relationship
export const unlinkDocumentFromHerb = mutation({
  args: {
    id: v.id("documentHerbs"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getRelationship = query({
  args: {
    documentId: v.id("documents"),
    herbId: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    return (
      links.find((link) => link.herbId === args.herbId) ?? null
    );
  },
});

export const deleteLinksByDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },

  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }
  },
});

export const getHerbsForDocumentLinks = query({
  args: {
    documentId: v.id("documents"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();
  },
});

export const getDocumentsForHerbLinks = query({
  args: {
    herbId: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentHerbs")
      .withIndex("by_herb", (q) =>
        q.eq("herbId", args.herbId)
      )
      .collect();
  },
});