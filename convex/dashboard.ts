import { query } from "./_generated/server";

export const getDashboardStats = query({
  handler: async (ctx) => {
    const documents = await ctx.db
      .query("documents")
      .collect();

    const herbs = await ctx.db
      .query("herbs")
      .collect();

    const chunks = await ctx.db
      .query("chunks")
      .collect();

    const pendingDocuments = await ctx.db
      .query("documents")
      .withIndex("by_verification", (q) =>
        q.eq("verificationStatus", "pending")
      )
      .collect();

    return {
      totalDocuments: documents.length,
      totalHerbs: herbs.length,
      totalChunks: chunks.length,
      pendingDocuments: pendingDocuments.length,
    };
  },
});