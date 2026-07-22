import { query } from "./_generated/server";
import { v } from "convex/values";

export const getResearchPaper = query({
  args: {
    documentId: v.id("documents"),
  },

  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      return null;
    }

    const chunks = await ctx.db
      .query("chunks")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    chunks.sort(
      (a, b) => a.chunkIndex - b.chunkIndex
    );

    const content = chunks
      .map((chunk) => chunk.text)
      .join("\n\n");

    const links = await ctx.db
      .query("documentHerbs")
      .withIndex("by_document", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    const herbs = await Promise.all(
      links.map((link) =>
        ctx.db.get(link.herbId)
      )
    );

    return {
      document,
      content,
      herbs: herbs.filter(Boolean),
    };
  },
});