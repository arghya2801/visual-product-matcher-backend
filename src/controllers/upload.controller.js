import { uploadBufferToUploadThing, uploadByUrlToUploadThing } from "../lib/clients.js";
import { embedImageUrl } from "../services/embedding.service.js";

export async function handleUpload(req, res) {
  let url, key;
  
  // Check if body contains base64 image or imageUrl
  if (req.body?.imageData) {
    // Handle base64 encoded image from frontend
    const { imageData, filename = `image_${Date.now()}.jpg`, mimetype = "image/jpeg" } = req.body;
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const up = await uploadBufferToUploadThing(buffer, filename, mimetype);
    url = up.url; key = up.key;
  } else if (req.body?.imageUrl) {
    const up = await uploadByUrlToUploadThing(req.body.imageUrl);
    url = up.url; key = up.key;
  } else {
    return res.status(400).json({ error: "Provide { imageData } (base64) or { imageUrl }" });
  }

  const embedding = await embedImageUrl(url);
  return res.json({ url, key, embedding, dims: embedding.length });
}

