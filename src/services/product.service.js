import { convex } from "../lib/clients.js";

export async function listProducts(category = null) {
  return convex.query("products:list", { category });
}

export async function getProduct(id) {
  return convex.query("products:get", { id });
}

export async function bulkAddProducts(items) {
  return convex.mutation("products:bulkAdd", { items });
}

export async function vectorSearch(queryEmbedding, topK = 20, minScore = 0) {
  return convex.action("search:vectorSearch", { queryEmbedding, topK, minScore });
}
