import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const certificateFields = {
  title: v.string(),
  institution: v.string(),
  awardedDate: v.string(),
};

export const getCertificates = query({
  args: { consultantId: v.id("consultants") },
  handler: async (ctx, args) =>
    ctx.db
      .query("certificates")
      .withIndex("by_consultant", (q) => q.eq("consultantId", args.consultantId))
      .order("desc")
      .collect(),
});

export const addCertificate = mutation({
  args: { consultantId: v.id("consultants"), ...certificateFields },
  handler: async (ctx, args) =>
    ctx.db.insert("certificates", { ...args, createdAt: Date.now(), updatedAt: Date.now() }),
});

export const updateCertificate = mutation({
  args: { certificateId: v.id("certificates"), ...certificateFields },
  handler: async (ctx, args) => {
    const { certificateId, ...updates } = args;
    await ctx.db.patch(certificateId, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteCertificate = mutation({
  args: { certificateId: v.id("certificates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.certificateId);
  },
});