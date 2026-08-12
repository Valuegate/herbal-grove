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
        q.eq("userId", args.userId).eq("consultantId", args.consultantId)
      )
      .collect();

    const existing = consultations.find(
      (c) => c.status === "pending" || c.status === "active"
    );
    if (existing) return existing._id;

    return await ctx.db.insert("consultations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get a consultation with consultant details
export const getConsultation = query({
  args: { consultationId: v.id("consultations") },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) return null;

    const consultant = await ctx.db.get(consultation.consultantId);
    return { consultation, consultant, userId: consultation.userId };
  },
});

// User consultations
export const getUserConsultations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("consultations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect(),
});

// Consultant consultations
export const getConsultantConsultations = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) =>
    ctx.db
      .query("consultations")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect(),
});

export const getActiveConsultation = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    return consultations.find((c) => c.status === "active") ?? null;
  },
});

// Shared status-update helper
function setStatus(status: "active" | "completed") {
  return mutation({
    args: { consultationId: v.id("consultations") },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.consultationId, { status, updatedAt: Date.now() });
    },
  });
}

// Accept consultation
export const acceptConsultation = setStatus("active");

// Complete consultation
export const completeConsultation = setStatus("completed");