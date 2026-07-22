import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==========================
// Create Herb
// ==========================
export const createHerb = mutation({
  args: {
    scientificName: v.string(),

    commonNames: v.array(v.string()),

    aliases: v.array(v.string()),

    family: v.optional(v.string()),

    genus: v.optional(v.string()),

    species: v.optional(v.string()),

    description: v.optional(v.string()),

    tags: v.array(v.string()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("herbs", {
      ...args,

      imageUrl: undefined,

      status: "pending",

      createdAt: now,

      updatedAt: now,
    });
  },
});

// ==========================
// Queries
// ==========================
export const getHerbs = query({
  handler: async (ctx) => {
    const herbs = await ctx.db
      .query("herbs")
      .collect();

    return await Promise.all(
      herbs.map(async (herb) => {
        const links = await ctx.db
          .query("documentHerbs")
          .withIndex("by_herb", (q) =>
            q.eq("herbId", herb._id)
          )
          .collect();

        return {
          ...herb,
          documentCount: links.length,
        };
      })
    );
  },
});

export const getHerbById = query({
  args: {
    id: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// NEW
export const getHerbByScientificName = query({
  args: {
    scientificName: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("herbs")
      .withIndex("by_scientific_name", (q) =>
        q.eq("scientificName", args.scientificName)
      )
      .unique();
  },
});

// ==========================
// Update
// ==========================
export const updateHerb = mutation({
  args: {
    id: v.id("herbs"),

    scientificName: v.string(),

    commonNames: v.array(v.string()),

    aliases: v.array(v.string()),

    family: v.optional(v.string()),

    genus: v.optional(v.string()),

    species: v.optional(v.string()),

    description: v.optional(v.string()),

    tags: v.array(v.string()),

    imageUrl: v.optional(v.string()),

    status: v.union(
      v.literal("pending"),
      v.literal("verified")
    ),
  },

  handler: async (ctx, args) => {
    const { id, ...data } = args;

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("herbs"),

    status: v.union(
      v.literal("pending"),
      v.literal("verified")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
// ==========================
// Delete
// ==========================
export const deleteHerb = mutation({
  args: {
    id: v.id("herbs"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});