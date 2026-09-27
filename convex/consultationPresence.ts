import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in.");
    }

    const consultation = await ctx.db.get(
      args.consultationId
    );

    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    const consultant = await ctx.db.get(
      consultation.consultantId
    );

    if (!consultant) {
      throw new Error("Consultant not found.");
    }

    const isUser =
      consultation.userId === identity.subject;

    const isConsultant =
      consultant.clerkId === identity.subject;

    if (!isUser && !isConsultant) {
      throw new Error(
        "You do not have permission to view this consultation."
      );
    }

    const existing = await ctx.db
      .query("activeConsultationViews")
      .withIndex("by_clerk", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        consultationId: args.consultationId,
        updatedAt: Date.now(),
      });

      return;
    }

    await ctx.db.insert("activeConsultationViews", {
      clerkId: identity.subject,
      consultationId: args.consultationId,
      updatedAt: Date.now(),
    });
  },
});

export const leave = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const existing = await ctx.db
      .query("activeConsultationViews")
      .withIndex("by_clerk_and_consultation", (q) =>
        q
          .eq("clerkId", identity.subject)
          .eq("consultationId", args.consultationId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});