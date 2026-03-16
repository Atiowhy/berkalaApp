import prisma from "../config/prisma.js";

export const createNewTransactions = async (
  userId,
  type,
  amount,
  category,
  description,
) => {
  const newTransaction = await prisma.transaction.create({
    data: {
      userId,
      type,
      amount: parseInt(amount),
      category,
      description,
    },
  });

  return newTransaction;
};

export const getAllTransaction = async (userId) => {
  const getData = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return getData;
};

export const getTransactionSumarry = async (userId) => {
  const transaction = await prisma.transaction.findMany({
    where: { userId },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  transaction.forEach((t) => {
    if (t.type === "INCOME") totalIncome += t.amount;
    if (t.type === "EXPENSE") totalExpense += t.amount;
  });

  return {
    totalExpense,
    totalIncome,
    balance: totalIncome - totalExpense,
  };
};

export const deleteTransaction = async (id) => {
  await prisma.transaction.delete({
    where: { id },
  });

  return { message: "Transaksi berhasil di hapus" };
};
