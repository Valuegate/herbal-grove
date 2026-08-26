import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type ConsultationStatus = "pending" | "active" | "completed";

function transitionConsultation(
  fromStatus: ConsultationStatus,
  toStatus: ConsultationStatus,
  notFoundMessage = "This consultation is not eligible for this action."
) {
  return mutation({
    args: { consultationId: v.id("consultations") },
    handler: async (ctx, args) => {
      const consultation = await ctx.db.get(args.consultationId);
      if (!consultation) throw new Error("Consultation not found.");
      if (consultation.status !== fromStatus) throw new Error(notFoundMessage);

      await ctx.db.patch(args.consultationId, { status: toStatus, updatedAt: Date.now() });
    },
  });
}

// Create a consultation request from a booked slot
export const createConsultation = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    consultantId: v.id("consultants"),
    slotId: v.id("availableSlots"),
    initialMessage: v.string(),
  },

  handler: async (ctx, args) => {
    // Prevent a duplicate active/pending request with the same consultant
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_user_consultant", (q) =>
        q.eq("userId", args.userId).eq("consultantId", args.consultantId)
      )
      .collect();

    const existing = consultations.find(
      (consultation) => consultation.status === "pending" || consultation.status === "active"
    );

    if (existing) {
      throw new Error("You already have an active consultation with this consultant.");
    }

    const slot = await ctx.db.get(args.slotId);
    if (!slot) throw new Error("This consultation slot no longer exists.");
    if (slot.consultantId !== args.consultantId) {
      throw new Error("This slot does not belong to this consultant.");
    }
    if (slot.status !== "available") {
      throw new Error("This consultation slot has already been booked.");
    }

    const consultationId = await ctx.db.insert("consultations", {
      userId: args.userId,
      userName: args.userName,
      userEmail: args.userEmail,
      consultantId: args.consultantId,
      slotId: args.slotId,
      initialMessage: args.initialMessage,
      // User has requested the consultation; consultant hasn't started the chat yet.
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.slotId, { status: "booked", updatedAt: Date.now() });

    return consultationId;
  },
});

// Get a consultation with consultant + slot details
export const getConsultation = query({
  args: { consultationId: v.id("consultations") },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) return null;

    const [consultant, slot] = await Promise.all([
      ctx.db.get(consultation.consultantId),
      ctx.db.get(consultation.slotId),
    ]);

    return { consultation, consultant, slot, userId: consultation.userId };
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

// Get the consultant's currently active consultation, if any
export const getActiveConsultation = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    return consultations.find((consultation) => consultation.status === "active") ?? null;
  },
});

// pending → active
export const acceptConsultation = transitionConsultation(
  "pending",
  "active",
  "This consultation is no longer pending."
);

// active → completed
export const completeConsultation = transitionConsultation(
  "active",
  "completed",
  "Only an active consultation can be completed."
);