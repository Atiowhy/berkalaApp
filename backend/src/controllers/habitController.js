import {
  createNewHabit,
  getUserHabits,
  toggleHabitLogService,
} from "../service/habitService.js";

export const createHabit = async (req, res) => {
  try {
    const { title, description } = req.body;

    console.log("Isi Token Decoded:", req.user);

    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({
        message: "Judul habit tidak boleh kosong",
      });
    }

    const newHabit = await createNewHabit(userId, title, description);

    res.status(201).json({
      success: true,
      message: "Habit berhasil dibuat",
      data: newHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHabits = async (req, res) => {
  try {
    console.log("Isi dari req.user adalah:", req.user);
    const userId = req.user.userId;

    const habits = await getUserHabits(userId);

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const toggleLog = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil ID habit dari URL
    const { date } = req.body; // Mengambil tanggal (Format: YYYY-MM-DD)

    if (!date) {
      return res.status(400).json({ message: "Tanggal wajib dikirim!" });
    }

    const result = await toggleHabitLogService(id, date);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.log("Error saat toggle log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
