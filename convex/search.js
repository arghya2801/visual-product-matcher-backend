import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const vectorSearch = query({
  args: {
    queryEmbedding: v.array(v.float64()),
    topK: v.optional(v.number()),
    minScore: v.optional(v.number()),
  },
  handler: async (ctx, { queryEmbedding, topK = 20, minScore = 0 }) => {
    // Use vector index if available
    const results = await ctx.db
      .query("products")
      .withSearchIndex("byEmbedding", q => q.nearest("embedding", queryEmbedding))
      .take(topK);

    // Convex returns _score for vector similarity (if available). If not, set 1.0
    return results
      .map(r => ({ ...r, score: r?._score ?? 1.0 }))
      .filter(r => r.score >= minScore);
  },
});

export const logSearch = mutation({
  args: {
    uploadedImageUrl: v.optional(v.string()),
    queryEmbedding: v.array(v.float64()),
    results: v.array(v.id("products")),
  },
  handler: async (ctx, { uploadedImageUrl, queryEmbedding, results }) => {
    await ctx.db.insert("searchHistory", {
      uploadedImageUrl: uploadedImageUrl ?? "",
      queryEmbedding,
      results,
      timestamp: Date.now(),
    });
    return true;
  },
});
