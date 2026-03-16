import {
  createTodo,
  deleteTodo,
  getAllTodo,
  toggleTodoStatus,
} from "../service/todoService.js";

export const createTodoData = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({
        message: "Title todo harus diisi",
      });
    }

    const userId = req.user.userId;

    const newTodo = await createTodo(userId, title, description);

    res.status(201).json({
      success: true,
      data: newTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getDataTodo = async (req, res) => {
  try {
    const userId = req.user.userId;

    const dataTodo = await getAllTodo(userId);

    res.status(200).json({
      success: true,
      data: dataTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteDataTodo = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTodo(id);

    res.status(200).json({
      success: true,
      message: "Data todo dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const toggleTodoTrigger = async (req, res) => {
  try {
    const { id } = req.params;

    const updateTodo = await toggleTodoStatus(id);

    res.status(201).json({
      success: true,
      message: "Status update",
      data: updateTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
