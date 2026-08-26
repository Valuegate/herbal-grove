import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get the consultant's weekly availability
export const getConsultantAvailability = query({
  args: {
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultantAvailability")
      .withIndex("by_consultant", (q) =>
        q.eq("consultantId", args.consultantId)
      )
      .collect();
  },
});

// Save the complete weekly schedule at once
export const saveWeeklyAvailability = mutation({
  args: {
    consultantId: v.id("consultants"),

    schedule: v.array(
      v.object({
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isAvailable: v.boolean(),
      })
    ),
  },

  handler: async (ctx, args) => {
    if (args.schedule.length !== 7) {
      throw new Error("A complete weekly schedule is required.");
    }

    const now = Date.now();

    for (const day of args.schedule) {
      if (day.dayOfWeek < 0 || day.dayOfWeek > 6) {
        throw new Error("Invalid day of week.");
      }

      if (
        day.isAvailable &&
        day.endTime <= day.startTime
      ) {
        throw new Error(
          "End time must be after start time."
        );
      }

      const existing = await ctx.db
        .query("consultantAvailability")
        .withIndex("by_consultant_day", (q) =>
          q
            .eq("consultantId", args.consultantId)
            .eq("dayOfWeek", day.dayOfWeek)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          startTime: day.startTime,
          endTime: day.endTime,
          isAvailable: day.isAvailable,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("consultantAvailability", {
          consultantId: args.consultantId,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          isAvailable: day.isAvailable,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  },
});