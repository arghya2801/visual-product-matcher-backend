import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { handleUpload, uploadMiddleware } from "../controllers/upload.controller.js";

const router = Router();
router.post("/", uploadMiddleware, asyncHandler(handleUpload));
export default router;
