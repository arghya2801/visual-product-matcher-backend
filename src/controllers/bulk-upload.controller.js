import { bulkAddProducts } from "../services/product.service.js";
import { uploadBufferToUploadThing } from "../lib/clients.js";
import { embedImageUrl } from "../services/embedding.service.js";

export async function bulkUploadProducts(req, res) {
  const { images, category = "uncategorized" } = req.body || {};

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "No images uploaded. Provide array of { imageData, filename?, mimetype? }" });
  }

  const items = [];
  for (let i = 0; i < images.length; i++) {
    const { imageData, filename, mimetype = "image/jpeg" } = images[i];
    const name = filename ? filename.split('.')[0] : `Product ${i + 1}`;
    
    try {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fname = filename || `product_${Date.now()}_${i}.jpg`;
      
      const up = await uploadBufferToUploadThing(buffer, fname, mimetype);
      const emb = await embedImageUrl(up.url);
      
      items.push({
        name,
        category,
        imageUrl: up.url,
        uploadThingKey: up.key,
        embedding: emb,
        metadata: { uploadedAt: new Date().toISOString() },
      });
    } catch (e) {
      console.error(`Failed to process image ${i}:`, e?.message || e);
    }
  }

  if (items.length === 0) {
    return res.status(500).json({ error: "Failed to process any images" });
  }

  const inserted = await bulkAddProducts(items);
  res.json({ inserted: inserted.length, products: items.map((it, idx) => ({ ...it, _id: inserted[idx] })) });
}

