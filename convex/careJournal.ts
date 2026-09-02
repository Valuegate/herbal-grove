import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new note
export const createNote = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("careJournalNotes", {
      userId: args.userId,
      title: args.title.trim(),
      content: args.content.trim(),
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all notes belonging to a user
export const getUserNotes = query({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("careJournalNotes")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .order("desc")
      .collect();
  },
});

// Get user's notes for an active consultation
export const getConsultantUserNotes = query({
  args: {
    consultationId: v.id("consultations"),
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.consultationId);

    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    if (consultation.consultantId !== args.consultantId) {
      throw new Error(
        "You do not have access to this consultation."
      );
    }

    if (consultation.status !== "active") {
      throw new Error(
        "Care Journal access is only available during an active consultation."
      );
    }

    return await ctx.db
      .query("careJournalNotes")
      .withIndex("by_user", (q) =>
        q.eq("userId", consultation.userId)
      )
      .order("desc")
      .collect();
  },
});

// Update an existing note
export const updateNote = mutation({
  args: {
    noteId: v.id("careJournalNotes"),
    userId: v.string(),
    title: v.string(),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Note not found.");
    }

    if (note.userId !== args.userId) {
      throw new Error(
        "You do not have permission to edit this note."
      );
    }

    await ctx.db.patch(args.noteId, {
      title: args.title.trim(),
      content: args.content.trim(),
      updatedAt: Date.now(),
    });

    return args.noteId;
  },
});

// Delete a note
export const deleteNote = mutation({
  args: {
    noteId: v.id("careJournalNotes"),
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId)
    if (!note) {
      throw new Error("Note not found.");
    }

    if (note.userId !== args.userId) {
      throw new Error(
        "You do not have permission to delete this note."
      );
    }

    await ctx.db.delete(args.noteId);
  },
});

export const createDocument = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    fileUrl: v.string(),
    storageProvider: v.string(),
    mimeType: v.string()
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert(
      "careJournalDocuments",
      {
        userId: args.userId,
        title: args.title.trim(),
        fileUrl: args.fileUrl,
        storageProvider: args.storageProvider,
        mimeType: args.mimeType,
        createdAt: now,
        updatedAt: now,
      }
    );
  },
});

// Get all documents belonging to a user
export const getUserDocuments = query({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("careJournalDocuments")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .order("desc")
      .collect();
  },
});

// Get user's documents for an active consultation
export const getConsultantUserDocuments = query({
  args: {
    consultationId: v.id("consultations"),
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.consultationId);

    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    if (consultation.consultantId !== args.consultantId) {
      throw new Error(
        "You do not have access to this consultation."
      );
    }

    if (consultation.status !== "active") {
      throw new Error(
        "Care Journal access is only available during an active consultation."
      );
    }

    return await ctx.db
      .query("careJournalDocuments")
      .withIndex("by_user", (q) =>
        q.eq("userId", consultation.userId)
      )
      .order("desc")
      .collect();
  },
});

// Delete a document record
export const deleteDocument = mutation({
  args: {
    documentId: v.id("careJournalDocuments"),
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    const document = await ctx.db.get(
      args.documentId
    );

    if (!document) {
      throw new Error("Document not found.");
    }

    if (document.userId !== args.userId) {
      throw new Error(
        "You do not have permission to delete this document."
      );
    }

    await ctx.db.delete(args.documentId);
  },
});