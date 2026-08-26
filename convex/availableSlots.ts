import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create an availability slot
export const createAvailableSlot = mutation({
  args: {
    consultantId: v.id("consultants"),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.endTime <= args.startTime) {
      throw new Error("End time must be after start time.");
    }

    const existingSlots = await ctx.db
      .query("availableSlots")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    const overlapping = existingSlots.some(
      (slot) =>
        slot.status !== "blocked" &&
        args.startTime < slot.endTime &&
        args.endTime > slot.startTime
    );

    if (overlapping) {
      throw new Error("This time overlaps with an existing availability slot.");
    }

    return ctx.db.insert("availableSlots", {
      consultantId: args.consultantId,
      startTime: args.startTime,
      endTime: args.endTime,
      status: "available",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get a consultant's availability
export const getConsultantAvailableSlots = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const slots = await ctx.db
      .query("availableSlots")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    return slots.sort((a, b) => a.startTime - b.startTime);
  },
});

// Delete an availability slot
export const deleteAvailableSlot = mutation({
  args: { slotId: v.id("availableSlots") },
  handler: async (ctx, args) => {
    const slot = await ctx.db.get(args.slotId);
    if (!slot) throw new Error("Availability slot not found.");
    if (slot.status === "booked") throw new Error("A booked slot cannot be deleted.");

    await ctx.db.delete(args.slotId);
  },
});

export const getSlotById = query({
  args: {
    slotId: v.id("availableSlots"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.slotId);
  },
});

// Get recurring availability and existing upcoming bookings
export const getBookingAvailability = query({
  args: {
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    const availability = await ctx.db
      .query("consultantAvailability")
      .withIndex("by_consultant", (q) =>
        q.eq("consultantId", args.consultantId)
      )
      .collect();

    const bookedSlots = await ctx.db
      .query("availableSlots")
      .withIndex("by_consultant", (q) =>
        q.eq("consultantId", args.consultantId)
      )
      .collect();

    return {
      availability,
      bookedSlots: bookedSlots.filter(
        (slot) => slot.endTime > Date.now()
      ),
    };
  },
});

function toHHMM(date: Date) {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export const bookConsultation = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    consultantId: v.id("consultants"),
    startTime: v.number(),
    initialMessage: v.string(),
    durationMinutes: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const durationMs = (args.durationMinutes ?? 30) * 60 * 1000;
    const endTime = args.startTime + durationMs;

    // Reject times in the past.
    if (args.startTime <= Date.now()) {
      throw new Error("This consultation time has already passed.");
    }

    // Reject a duplicate pending/active consultation with this consultant.
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_user_consultant", (q) =>
        q.eq("userId", args.userId).eq("consultantId", args.consultantId)
      )
      .collect();

    const existingConsultation = consultations.find(
      (consultation) => consultation.status === "pending" || consultation.status === "active"
    );

    if (existingConsultation) {
      throw new Error("You already have an active consultation with this consultant.");
    }

    // Confirm the consultant works on this day of the week.
    const appointmentDate = new Date(args.startTime);
    const dayOfWeek = appointmentDate.getDay();

    const availability = await ctx.db
      .query("consultantAvailability")
      .withIndex("by_consultant_day", (q) => q.eq("consultantId", args.consultantId).eq("dayOfWeek", dayOfWeek))
      .unique();

    if (!availability || !availability.isAvailable) {
      throw new Error("The consultant is not available on this day.");
    }

    // Confirm the requested window fits inside the consultant's working hours.
    const requestedStart = toHHMM(appointmentDate);
    const requestedEnd = toHHMM(new Date(endTime));

    if (requestedStart < availability.startTime || requestedEnd > availability.endTime) {
      throw new Error("This time is outside the consultant's available hours.");
    }

    // Reject a time that overlaps an already-booked slot.
    const existingSlots = await ctx.db
      .query("availableSlots")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    const overlapping = existingSlots.some(
      (slot) => slot.status === "booked" && args.startTime < slot.endTime && endTime > slot.startTime
    );

    if (overlapping) {
      throw new Error("This consultation time has already been booked.");
    }

    // Create the booked slot and the consultation request together.
    const now = Date.now();

    const slotId = await ctx.db.insert("availableSlots", {
      consultantId: args.consultantId,
      startTime: args.startTime,
      endTime,
      status: "booked",
      createdAt: now,
      updatedAt: now,
    });

    const consultationId = await ctx.db.insert("consultations", {
      userId: args.userId,
      userName: args.userName,
      userEmail: args.userEmail,
      consultantId: args.consultantId,
      slotId,
      initialMessage: args.initialMessage.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return { consultationId, slotId };
  },
});