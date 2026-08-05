import { Router } from "express";
import { createCategory, deleteCategory, listCategories } from "../controllers/categoryController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listCategories));
router.post("/", asyncHandler(createCategory));
router.delete("/:id", asyncHandler(deleteCategory));

export default router;
