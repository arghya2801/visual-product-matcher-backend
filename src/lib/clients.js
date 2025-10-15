import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { UTApi } from "uploadthing/server";
import { GEMINI_API_KEY, CONVEX_DEPLOYMENT, UPLOADTHING_TOKEN } from "../config/index.js";

// File is a global in Node.js 20+

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const convex = new ConvexHttpClient(CONVEX_DEPLOYMENT);
export const utapi = new UTApi({ token: UPLOADTHING_TOKEN });

export async function fetchImageBuffer(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const contentType = res.headers["content-type"] || "image/jpeg";
  const buffer = Buffer.from(res.data);
  return { buffer, contentType };
}

export async function uploadBufferToUploadThing(buffer, filename, contentType) {
  const file = new File([buffer], filename, { type: contentType });
  const uploaded = await utapi.uploadFiles(file);
  if (uploaded?.data?.url) return { url: uploaded.data.url, key: uploaded.data.key };
  throw new Error(uploaded?.error || "Upload failed");
}

export async function uploadByUrlToUploadThing(url) {
  const { buffer, contentType } = await fetchImageBuffer(url);
  const filename = url.split("?")[0].split("/").pop() || `image_${Date.now()}.jpg`;
  return uploadBufferToUploadThing(buffer, filename, contentType);
}
