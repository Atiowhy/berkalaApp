// src/routes/savingRoutes.js
import express from "express";
import {
  createSaving,
  getSavings,
  addProgress,
  deleteSaving,
} from "../controllers/savingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createSaving);
router.get("/", verifyToken, getSavings);
router.put("/:id/add", verifyToken, addProgress); // Pakai PUT karena kita meng-update currentAmount
router.delete("/:id", verifyToken, deleteSaving);

export default router;
