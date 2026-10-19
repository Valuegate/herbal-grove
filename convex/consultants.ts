import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveConsultant = mutation({
  args: {
    clerkId: v.string(),
    fullName: v.string(),
    specialization: v.optional(v.string()),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("consultants")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });

      return existing._id;
    }

    return await ctx.db.insert("consultants", {
      ...args,
      isOnline: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getCurrentConsultant = query({
  args: {
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("consultants")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();
  },
});

export const getConsultantById = query({
  args: {
    consultantId: v.id("consultants"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.consultantId);
  },
});

export const getAllConsultants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("consultants").collect();
  },
});

export const updateOnlineStatus = mutation({
  args: {
    clerkId: v.string(),
    isOnline: v.boolean(),
  },

  handler: async (ctx, args) => {
    const consultant = await ctx.db
      .query("consultants")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();

    if (!consultant) return;

    await ctx.db.patch(consultant._id, {
      isOnline: args.isOnline,
      updatedAt: Date.now(),
    });
  },
});