import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { bulkUploadProducts } from "../controllers/bulk-upload.controller.js";

const router = Router();
router.post("/", asyncHandler(bulkUploadProducts));

export default router;

