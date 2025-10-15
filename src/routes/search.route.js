import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { postSearch } from "../controllers/search.controller.js";

const router = Router();
router.post("/", asyncHandler(postSearch));
export default router;
