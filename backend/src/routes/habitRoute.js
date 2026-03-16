import e from "express";
import {
  createHabit,
  getHabits,
  toggleLog,
} from "../controllers/habitController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = e.Router();

router.post("/", verifyToken, createHabit);
router.get("/", verifyToken, getHabits);
router.post("/:id/toggle", verifyToken, toggleLog);

export default router;
