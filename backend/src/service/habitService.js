// src/service/habitService.js
import prisma from "../config/prisma.js";

// Fungsi Create
export const createNewHabit = async (userId, title, description) => {
  const newHabit = await prisma.habit.create({
    data: {
      userId: userId,
      title,
      description,
    },
  });
  return newHabit;
};

// Fungsi Read (UPDATE: Sekarang kita tarik juga data log-nya!)
export const getUserHabits = async (userId) => {
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      logs: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return habits;
};

// Fungsi Toggle Log (BARU)
export const toggleHabitLogService = async (habitId, dateString) => {
  // Kita pastikan format waktunya UTC jam 00:00:00 agar PostgreSQL (@db.Date) tidak bingung
  const targetDate = new Date(`${dateString}T00:00:00Z`);

  // 1. Cek apakah di tanggal tersebut habit ini sudah dicentang
  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId: habitId,
      date: targetDate,
    },
  });

  if (existingLog) {
    // 2A. Kalau sudah dicentang, klik lagi berarti BATAL (Hapus)
    await prisma.habitLog.delete({
      where: { id: existingLog.id },
    });
    return { message: "Habit batal dicentang", isCompleted: false };
  } else {
    // 2B. Kalau belum dicentang, kita CATAT (Create)
    const newLog = await prisma.habitLog.create({
      data: {
        habitId: habitId,
        date: targetDate,
        status: "COMPLETED",
      },
    });
    return {
      message: "Habit berhasil dicentang!",
      isCompleted: true,
      log: newLog,
    };
  }
};
