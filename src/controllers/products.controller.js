import { listProducts, bulkAddProducts } from "../services/product.service.js";
import { embedImageUrl } from "../services/embedding.service.js";
import { uploadByUrlToUploadThing } from "../lib/clients.js";

export async function getProducts(req, res) {
  const { category } = req.query;
  const list = await listProducts(category || null);
  res.json(list);
}

export async function seedProducts(req, res) {
  const { count = 50 } = req.body || {};
  const demoImages = Array.from({ length: count }).map((_, i) => `https://picsum.photos/seed/vpm_${i}/512/512`);
  const categories = ["shoes", "bags", "watches", "shirts", "pants"];

  const items = [];
  for (let i = 0; i < demoImages.length; i++) {
    const cat = categories[i % categories.length];
    const up = await uploadByUrlToUploadThing(demoImages[i]);
    const emb = await embedImageUrl(up.url);
    items.push({
      name: `Demo Product ${i + 1}`,
      category: cat,
      imageUrl: up.url,
      uploadThingKey: up.key,
      embedding: emb,
      metadata: { price: Math.round(20 + Math.random() * 180), brand: "VPM", description: `Category ${cat}` },
    });
  }

  const inserted = await bulkAddProducts(items);
  res.json({ inserted: inserted.length });
}
