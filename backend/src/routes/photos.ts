import { Router } from "express";
import multer from "multer";
import { deletePhoto, listPhotos, updatePhoto, uploadPhoto } from "../controllers/photoController";
import { requireAuth } from "../middleware/requireAuth";
import { asyncHandler } from "../lib/asyncHandler";
import { HttpError } from "../middleware/errorHandler";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(new HttpError(400, "Solo se permiten imágenes JPG, PNG o WEBP"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listPhotos));
router.post("/", upload.single("file"), asyncHandler(uploadPhoto));
router.patch("/:id", asyncHandler(updatePhoto));
router.delete("/:id", asyncHandler(deletePhoto));

export default router;
