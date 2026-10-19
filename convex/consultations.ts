import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

type ConsultationStatus = "pending" | "active" | "completed" | "expired";

function transitionConsultation(
  fromStatus: ConsultationStatus,
  toStatus: ConsultationStatus,
  notFoundMessage = "This consultation is not eligible for this action.",
  requireAppointmentWindow = false
) {
  return mutation({
    args: { consultationId: v.id("consultations") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("You must be signed in.");
      }

      const consultation = await ctx.db.get(args.consultationId);
      if (!consultation) {
        throw new Error("Consultation not found.");
      }

      const consultant = await ctx.db.get(
        consultation.consultantId
      );
      if (!consultant) {
        throw new Error("Consultant not found.");
      }
      // Only the assigned consultant can change the status.
      if (consultant.clerkId !== identity.subject) {
        throw new Error(
          "You do not have permission to update this consultation."
        );
      }
      if (consultation.status !== fromStatus) {
        throw new Error(notFoundMessage);
      }

      // Only enforce the appointment window when accepting.
      if (requireAppointmentWindow) {
        const slot = await ctx.db.get(consultation.slotId);
        if (!slot) {
          throw new Error("Consultation slot not found.");
        }
        const now = Date.now();
        // Consultant can accept up to 5 minutes before the appointment.
        const earliestAcceptanceTime =
          slot.startTime - 5 * 60 * 1000;
        if (now < earliestAcceptanceTime) {
          throw new Error(
            "This consultation can only be accepted within 5 minutes of the appointment time."
          );
        }
        if (now > slot.endTime) {
          throw new Error(
            "This consultation time has already passed."
          );
        }
      }
      await ctx.db.patch(args.consultationId, {
        status: toStatus,
        updatedAt: Date.now(),
      });

      // Notify the user when accepted.
      if (toStatus === "active") {
        await ctx.db.insert("notifications", {
          recipientId: consultation.userId,
          title: "Consultation accepted",
          message: `Your consultation with ${consultant.fullName} is now active.`,
          type: "consultation_status",
          link: `/consultantchat/${args.consultationId}`,
          isRead: false,
          createdAt: Date.now(),
        });
      }
      // Notify the user when completed.
      if (toStatus === "completed") {
        await ctx.db.insert("notifications", {
          recipientId: consultation.userId,
          title: "Consultation completed",
          message: `Your consultation with ${consultant.fullName} has been completed.`,
          type: "consultation_status",
          link: "/consultants/history",
          isRead: false,
          createdAt: Date.now(),
        });
      }
    },
  });
}

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
  "This consultation is no longer pending.",
  true
);

// active → completed
export const completeConsultation = transitionConsultation(
  "active",
  "completed",
  "Only an active consultation can be completed."
);

export const expirePendingConsultation = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        "You must be signed in."
      );
    }

    const consultation =
      await ctx.db.get(
        args.consultationId
      );

    if (!consultation) {
      throw new Error(
        "Consultation not found."
      );
    }

    const consultant =
      await ctx.db.get(
        consultation.consultantId
      );

    if (!consultant) {
      throw new Error(
        "Consultant not found."
      );
    }

    const isUser =
      consultation.userId ===
      identity.subject;

    const isConsultant =
      consultant.clerkId ===
      identity.subject;

    if (!isUser && !isConsultant) {
      throw new Error(
        "You do not have permission to update this consultation."
      );
    }

    // Nothing to do if it is no longer pending.
    if (
      consultation.status !==
      "pending"
    ) {
      return;
    }

    const slot =
      await ctx.db.get(
        consultation.slotId
      );

    if (!slot) {
      throw new Error(
        "Consultation slot not found."
      );
    }

    // It has not expired yet.
    if (
      Date.now() < slot.endTime
    ) {
      return;
    }

    await ctx.db.patch(
      args.consultationId,
      {
        status: "expired",
        updatedAt: Date.now(),
      }
    );
  },
});

export const expirePendingConsultationScheduled = internalMutation({
  args: {
    consultationId:
      v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const consultation =
      await ctx.db.get(
        args.consultationId
      );

    if (!consultation) {
      return;
    }

    // Only missed pending requests expire.
    // If it was accepted, this scheduled
    // job becomes a harmless no-op.
    if (
      consultation.status !==
      "pending"
    ) {
      return;
    }

    const slot = await ctx.db.get(
      consultation.slotId
    );

    if (!slot) {
      return;
    }

    // Safety check: never expire early.
    if (Date.now() < slot.endTime) {
      return;
    }

    await ctx.db.patch(
      args.consultationId,
      {
        status: "expired",
        updatedAt: Date.now(),
      }
    );
  },
});

export const completeExpiredConsultation = mutation({
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

    // Either participant may trigger the automatic expiry.
    const isUser =
      consultation.userId === identity.subject;

    const isConsultant =
      consultant.clerkId === identity.subject;

    if (!isUser && !isConsultant) {
      throw new Error(
        "You do not have permission to update this consultation."
      );
    }

    // Already completed — nothing else to do.
    if (consultation.status === "completed") {
      return;
    }

    if (consultation.status !== "active") {
      return;
    }

    const slot = await ctx.db.get(
      consultation.slotId
    );

    if (!slot) {
      throw new Error("Consultation slot not found.");
    }

    // Never allow this mutation to end a consultation early.
    if (Date.now() < slot.endTime) {
      return;
    }

    await ctx.db.patch(args.consultationId, {
      status: "completed",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      recipientId: consultation.userId,
      title: "Consultation completed",
      message: `Your consultation with ${consultant.fullName} has been completed.`,
      type: "consultation_status",
      link: "/consultants/history",
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const hideExpiredConsultation = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        "You must be signed in."
      );
    }

    const consultation =
      await ctx.db.get(
        args.consultationId
      );

    if (!consultation) {
      throw new Error(
        "Consultation not found."
      );
    }

    if (
      consultation.status !==
      "expired"
    ) {
      throw new Error(
        "Only expired consultations can be removed."
      );
    }

    const consultant =
      await ctx.db.get(
        consultation.consultantId
      );

    if (!consultant) {
      throw new Error(
        "Consultant not found."
      );
    }

    const isUser =
      consultation.userId ===
      identity.subject;

    const isConsultant =
      consultant.clerkId ===
      identity.subject;

    if (!isUser && !isConsultant) {
      throw new Error(
        "You do not have permission to remove this consultation."
      );
    }

    if (isUser) {
      await ctx.db.patch(
        args.consultationId,
        {
          hiddenFromUser: true,
          updatedAt: Date.now(),
        }
      );

      return;
    }

    await ctx.db.patch(
      args.consultationId,
      {
        hiddenFromConsultant: true,
        updatedAt: Date.now(),
      }
    );
  },
});

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
      throw new Error("You do not have access to this consultation.");
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
      throw new Error("You do not have access to this consultation.");
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

export const shareJournal = mutation({
  args: {
    consultationId: v.id("consultations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be signed in.");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    if (consultation.userId !== identity.subject) {
      throw new Error("You do not have permission to share this journal.");
    }

    if (consultation.status !== "active") {
      throw new Error(
        "The Care Journal can only be shared during an active consultation."
      );
    }

    await ctx.db.patch(args.consultationId, {
      journalShared: true,
      updatedAt: Date.now(),
    });
  },
});