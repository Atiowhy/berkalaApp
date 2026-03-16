// src/controllers/savingController.js
import {
  createNewSaving,
  getUserSavings,
  addSavingProgress,
  deleteSavingService,
} from "../service/savingService.js";

export const createSaving = async (req, res) => {
  try {
    const { title, targetAmount } = req.body;
    if (!title || !targetAmount)
      return res.status(400).json({ message: "Judul dan Target wajib diisi!" });

    const newSaving = await createNewSaving(
      req.user.userId,
      title,
      targetAmount,
    );
    res.status(201).json({ success: true, data: newSaving });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSavings = async (req, res) => {
  try {
    const savings = await getUserSavings(req.user.userId);
    res.status(200).json({ success: true, data: savings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProgress = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({ message: "Nominal wajib diisi!" });

    const updatedSaving = await addSavingProgress(req.params.id, amount);
    res.status(200).json({ success: true, data: updatedSaving });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSaving = async (req, res) => {
  try {
    await deleteSavingService(req.params.id);
    res.status(200).json({ success: true, message: "Tabungan dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
