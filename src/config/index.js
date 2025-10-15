import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
export const CONVEX_URL = process.env.CONVEX_URL || ""; // https://<your>.convex.cloud
export const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN || "";

export const CONFIG_WARNINGS = () => {
  if (!GEMINI_API_KEY) console.warn("Missing GOOGLE_API_KEY/GEMINI_API_KEY for embeddings.");
  if (!CONVEX_URL) console.warn("Missing CONVEX_URL e.g. https://xxx.convex.cloud");
  if (!UPLOADTHING_TOKEN) console.warn("Missing UPLOADTHING_TOKEN for UploadThing.");
};
