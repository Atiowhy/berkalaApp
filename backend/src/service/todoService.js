import prisma from "../config/prisma.js";

export const createTodo = async (userId, title, description) => {
  const newTodo = await prisma.todo.create({
    data: {
      userId: userId,
      title,
      description,
    },
  });

  return newTodo;
};

export const getAllTodo = async (userId) => {
  const dataTodo = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return dataTodo;
};

export const deleteTodo = async (todoId) => {
  await prisma.todo.delete({
    where: { id: todoId },
  });

  return { message: "Delete success" };
};

export const toggleTodoStatus = async (todoId) => {
  const existingTodo = await prisma.todo.findUnique({ where: { id: todoId } });

  if (!existingTodo) {
    throw new Error("Todo not found");
  }

  const updateTodo = await prisma.todo.update({
    where: { id: todoId },
    data: { isCompleted: !existingTodo.isCompleted },
  });

  return updateTodo;
};
