import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a consultation request
export const createConsultation = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_user_consultant", (q) =>
        q
          .eq("userId", args.userId)
          .eq("consultantId", args.consultantId)
      )
      .collect();

    const existing = consultations.find(
      (consultation) =>
        consultation.status === "pending" ||
        consultation.status === "active"
    );

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("consultations", {
      userId: args.userId,
      userName: args.userName,
      userEmail: args.userEmail,
      consultantId: args.consultantId,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get a consultation with consultant details
export const getConsultation = query({
  args: { 
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(
      args.consultationId
    );

    if (!consultation) return null;

    const consultant = await ctx.db.get(
      consultation.consultantId
    );

    return {
      consultation,
      consultant,
      userId: consultation.userId,
    };
  },
});

// User consultations
export const getUserConsultations = query({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultations")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .collect();
  },
});

// Consultant consultations
export const getConsultantConsultations = query({
  args: {
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultations")
      .withIndex("by_consultant", (q) =>
        q.eq("consultantId", args.consultantId)
      )
      .collect();
  },
});

// Accept consultation
export const acceptConsultation = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.consultationId, {
      status: "active",
      updatedAt: Date.now(),
    });
  },
});

// Complete consultation
export const completeConsultation = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.consultationId, {
      status: "completed",
      updatedAt: Date.now(),
    });
  },
});