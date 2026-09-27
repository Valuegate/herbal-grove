import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const APP_TIME_ZONE = "Africa/Lagos";

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function toHHMM(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    timeZone: APP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getDayOfWeek(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { timeZone: APP_TIME_ZONE, weekday: "short" });
  return DAY_INDEX[weekday];
}

// Throws if the user already has a booking with this consultant that would
// conflict with a new one: any active consultation blocks, and a pending
// consultation only blocks while its slot hasn't yet expired.
async function assertNoConflictingConsultation(ctx: MutationCtx, userId: string, consultantId: Id<"consultants">) {
  const consultations = await ctx.db
    .query("consultations")
    .withIndex("by_user_consultant", (q) => q.eq("userId", userId).eq("consultantId", consultantId))
    .collect();

  for (const consultation of consultations) {
    if (consultation.status === "active") {
      throw new Error("You already have an active consultation with this consultant.");
    }

    if (consultation.status === "pending") {
      const existingSlot = await ctx.db.get(consultation.slotId);
      if (existingSlot && existingSlot.endTime > Date.now()) {
        throw new Error("You already have a pending consultation with this consultant.");
      }
    }
  }
}

// Validates a requested time against the consultant's weekly availability
// (in the app's local timezone) and existing bookings, then creates the
// booked slot. `excludeSlotId` lets a reschedule ignore its own current slot.
async function validateAndBookSlot(
  ctx: MutationCtx,
  consultantId: Id<"consultants">,
  startTime: number,
  durationMinutes: number,
  excludeSlotId?: Id<"availableSlots">
) {
  const endTime = startTime + durationMinutes * 60 * 1000;

  if (startTime <= Date.now()) {
    throw new Error("This consultation time has already passed.");
  }

  const appointmentDate = new Date(startTime);
  const dayOfWeek = getDayOfWeek(appointmentDate);

  const availability = await ctx.db
    .query("consultantAvailability")
    .withIndex("by_consultant_day", (q) => q.eq("consultantId", consultantId).eq("dayOfWeek", dayOfWeek))
    .unique();

  if (!availability || !availability.isAvailable) {
    throw new Error("The consultant is not available on this day.");
  }

  const requestedStart = toHHMM(appointmentDate);
  const requestedEnd = toHHMM(new Date(endTime));

  if (requestedStart < availability.startTime || requestedEnd > availability.endTime) {
    throw new Error("This time is outside the consultant's available hours.");
  }

  const existingSlots = await ctx.db
    .query("availableSlots")
    .withIndex("by_consultant", (q) => q.eq("consultantId", consultantId))
    .collect();

  const overlapping = existingSlots.some(
    (slot) =>
      slot._id !== excludeSlotId &&
      slot.status === "booked" &&
      startTime < slot.endTime &&
      endTime > slot.startTime
  );

  if (overlapping) {
    throw new Error("This consultation time has already been booked.");
  }

  const now = Date.now();
  const slotId = await ctx.db.insert("availableSlots", {
    consultantId,
    startTime,
    endTime,
    status: "booked",
    createdAt: now,
    updatedAt: now,
  });

  return { slotId, endTime };
}

async function notifyConsultant(
  ctx: MutationCtx,
  consultantId: Id<"consultants">,
  title: string,
  message: string
) {
  const consultant = await ctx.db.get(consultantId);
  if (!consultant) throw new Error("Consultant not found.");

  await ctx.db.insert("notifications", {
    recipientId: consultant.clerkId,
    title,
    message,
    type: "consultation_booking",
    link: "/consultant/consultations",
    isRead: false,
    createdAt: Date.now(),
  });
}

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
      (slot) => slot.status !== "blocked" && args.startTime < slot.endTime && args.endTime > slot.startTime
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
  args: { slotId: v.id("availableSlots") },
  handler: async (ctx, args) => ctx.db.get(args.slotId),
});

// Get recurring availability and existing upcoming bookings
export const getBookingAvailability = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) => {
    const availability = await ctx.db
      .query("consultantAvailability")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    const bookedSlots = await ctx.db
      .query("availableSlots")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .collect();

    return {
      availability,
      bookedSlots: bookedSlots.filter((slot) => slot.endTime > Date.now()),
    };
  },
});

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("You must be signed in.");

    // Always use the authenticated Clerk ID, not the client-supplied userId.
    const userId = identity.subject;

    await assertNoConflictingConsultation(ctx, userId, args.consultantId);

    const { slotId } = await validateAndBookSlot(
      ctx,
      args.consultantId,
      args.startTime,
      args.durationMinutes ?? 30
    );

    const now = Date.now();
    const consultationId = await ctx.db.insert("consultations", {
      userId,
      userName: args.userName,
      userEmail: args.userEmail,
      consultantId: args.consultantId,
      slotId,
      initialMessage: args.initialMessage.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await notifyConsultant(
      ctx,
      args.consultantId,
      "New consultation request",
      `${args.userName} booked a consultation with you.`
    );

    return { consultationId, slotId };
  },
});