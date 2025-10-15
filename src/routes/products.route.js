import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { getProducts, seedProducts } from "../controllers/products.controller.js";

const router = Router();
router.get("/", asyncHandler(getProducts));
router.post("/seed", asyncHandler(seedProducts));
export default router;
