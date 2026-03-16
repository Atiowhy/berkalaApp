import e from "express";
import {
  createTodoData,
  deleteDataTodo,
  getDataTodo,
  toggleTodoTrigger,
} from "../controllers/todoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = e.Router();

router.post("/", verifyToken, createTodoData);
router.get("/", verifyToken, getDataTodo);
router.delete("/:id", verifyToken, deleteDataTodo);
router.put("/:id/toggle", verifyToken, toggleTodoTrigger);

export default router;
