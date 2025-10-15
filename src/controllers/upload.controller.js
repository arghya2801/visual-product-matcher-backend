import multer from "multer";
import { uploadBufferToUploadThing, uploadByUrlToUploadThing } from "../lib/clients.js";
import { embedImageUrl } from "../services/embedding.service.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const uploadMiddleware = upload.single("image");

export async function handleUpload(req, res) {
  let url, key;
  if (req.file) {
    const { buffer, originalname, mimetype } = req.file;
    const up = await uploadBufferToUploadThing(buffer, originalname, mimetype);
    url = up.url; key = up.key;
  } else if (req.body?.imageUrl) {
    const up = await uploadByUrlToUploadThing(req.body.imageUrl);
    url = up.url; key = up.key;
  } else {
    return res.status(400).json({ error: "Provide multipart file under 'image' or JSON { imageUrl }" });
  }

  const embedding = await embedImageUrl(url);
  return res.json({ url, key, embedding, dims: embedding.length });
}
