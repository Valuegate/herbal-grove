import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

async function requireUserId(ctx: QueryCtx | MutationCtx) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error("You must be logged in.");
  return userId;
}

function findSavedDocument(ctx: QueryCtx | MutationCtx, userId: string, documentId: Id<"documents">) {
  return ctx.db
    .query("saveDocuments")
    .withIndex("by_user_and_document", (q) => q.eq("userId", userId).eq("documentId", documentId))
    .unique();
}

//Save a document for the currently authenticated user.
export const saveDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await findSavedDocument(ctx, userId, args.documentId);
    if (existing) return existing._id;

    return await ctx.db.insert("saveDocuments", {
      userId,
      documentId: args.documentId,
      createdAt: Date.now(),
    });
  },
});

//Remove a saved document.
export const removeSavedDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await findSavedDocument(ctx, userId, args.documentId);
    if (!existing) return;

    await ctx.db.delete(existing._id);
  },
});

//Check whether the current user has saved a document.
export const isDocumentSaved = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return false;

    const existing = await findSavedDocument(ctx, userId, args.documentId);
    return !!existing;
  },
});

//Get all documents saved by the current user.
export const getSavedDocuments = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const saved = await ctx.db
      .query("saveDocuments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const documents = await Promise.all(
      saved.map(async (item) => {
        const document = await ctx.db.get(item.documentId);
        if (!document) return null;

        return { ...document, savedAt: item.createdAt, saveId: item._id };
      })
    );

    return documents
      .filter((document): document is NonNullable<typeof document> => document !== null)
      .sort((a, b) => b.savedAt - a.savedAt);
  },
});