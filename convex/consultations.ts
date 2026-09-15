import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type ConsultationStatus = "pending" | "active" | "completed";

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
        // Consultant can accept up to 10 minutes before the appointment.
        const earliestAcceptanceTime =
          slot.startTime - 10 * 60 * 1000;
        if (now < earliestAcceptanceTime) {
          throw new Error(
            "This consultation can only be accepted within 10 minutes of the appointment time."
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in.");
    }
    const userId = identity.subject;
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_user_consultant", (q) =>
        q.eq("userId", userId).eq("consultantId", args.consultantId)
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
      userId,
      userName: args.userName,
      userEmail: args.userEmail,
      consultantId: args.consultantId,
      slotId: args.slotId,
      initialMessage: args.initialMessage,
      status: "pending",
      journalShared: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.slotId, { status: "booked", updatedAt: Date.now() });

    const consultant = await ctx.db.get(args.consultantId);
    if (!consultant) {
      throw new Error("Consultant not found.");
    }

    await ctx.db.insert("notifications", {
      recipientId: consultant.clerkId,
      title: "New consultation request",
      message: `${args.userName} booked a consultation with you.`,
      type: "consultation_booking",
      link: `/consultant/chat/${consultationId}`,
      isRead: false,
      createdAt: Date.now(),
    });

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
  "This consultation is no longer pending.",
  true
);

// active → completed
export const completeConsultation = transitionConsultation(
  "active",
  "completed",
  "Only an active consultation can be completed."
);

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