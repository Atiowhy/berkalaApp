// src/routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getDataTransaction,
  getSummary,
  deleteData,
} from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getDataTransaction);
router.get("/summary", verifyToken, getSummary); // Rute khusus untuk tarik data Saldo
router.delete("/:id", verifyToken, deleteData);

export default router;
