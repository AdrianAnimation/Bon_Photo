import { Router } from "express";
import upload from '../config/multerConfig.js'
import { isAuthenticated } from "../controllers/user.controller.js";
import { contentGuard } from "../../middleware/content-guard.middleware.js";
import {
  getPhotos,
  addPhoto,
  updatePhoto,
  deletePhoto,
  getPublicPhotos,
  getRandomPublicPhotos
} from "../controllers/dashboard.controller.js";

const router = Router();

// Public routes
router.get("/public/photos", getPublicPhotos);
router.get("/public/photos/random", getRandomPublicPhotos);

// Middleware to protect all following routes
router.use(isAuthenticated);

// Dashboard routes with content guard
router.get("/photos", getPhotos);
router.post("/photos", upload.single("photo"), contentGuard, addPhoto);
router.put("/photos/:id", contentGuard, updatePhoto);
router.delete("/photos/:id", deletePhoto);

export default router;
