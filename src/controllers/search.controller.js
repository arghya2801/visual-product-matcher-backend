import { vectorSearch, getProduct } from "../services/product.service.js";
import { embedImageUrl } from "../services/embedding.service.js";

export async function postSearch(req, res) {
  const { imageUrl, productId, topK = 20, minScore = 0 } = req.body || {};
  let queryEmbedding;
  if (imageUrl) {
    queryEmbedding = await embedImageUrl(imageUrl);
  } else if (productId) {
    const prod = await getProduct(productId);
    if (!prod) return res.status(404).json({ error: "Product not found" });
    queryEmbedding = prod.embedding;
  } else {
    return res.status(400).json({ error: "Provide imageUrl or productId" });
  }

  const results = await vectorSearch(queryEmbedding, topK, minScore);
  res.json({ queryEmbeddingDims: queryEmbedding.length, results });
}
