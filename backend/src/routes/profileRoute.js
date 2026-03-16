// src/routes/profileRoutes.js
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Kedua rute ini wajib dijaga satpam (verifyToken)
router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile); // Pakai PUT karena sifatnya memperbarui (Edit)

export default router;
