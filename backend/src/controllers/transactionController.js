import {
  createNewTransactions,
  deleteTransaction,
  getAllTransaction,
  getTransactionSumarry,
} from "../service/transactionService.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;

    if (!type || !amount || !category) {
      return res
        .status(400)
        .json({ message: "Tipe, Nominal, dan Kategori wajib diisi" });
    }

    const userId = req.user.userId;

    const newTx = await createNewTransactions(
      userId,
      type,
      amount,
      description,
    );

    res.status(201).json({
      success: true,
      data: newTx,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDataTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await getAllTransaction(userId);
    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dataSummary = await getTransactionSumarry(userId);
    res.status(200).json({
      success: true,
      data: dataSummary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTransaction(id);
    res.status(201).json({
      success: true,
      message: "Transaksi dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
