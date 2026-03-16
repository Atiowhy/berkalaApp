// src/service/savingService.js
import prisma from "../config/prisma.js";

// 1. Buat Target Tabungan Baru
export const createNewSaving = async (userId, title, targetAmount) => {
  const newSaving = await prisma.saving.create({
    data: {
      userId,
      title,
      targetAmount: parseInt(targetAmount),
      currentAmount: 0, // Selalu mulai dari 0
    },
  });
  return newSaving;
};

// 2. Ambil Semua Tabungan User
export const getUserSavings = async (userId) => {
  return await prisma.saving.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// 3. Tambah Saldo ke Tabungan (Nabung)
export const addSavingProgress = async (savingId, amountToAdd) => {
  // Cari tabungan aslinya dulu
  const saving = await prisma.saving.findUnique({ where: { id: savingId } });
  if (!saving) throw new Error("Tabungan tidak ditemukan");

  // Tambahkan uangnya
  const updatedSaving = await prisma.saving.update({
    where: { id: savingId },
    data: { currentAmount: saving.currentAmount + parseInt(amountToAdd) },
  });
  return updatedSaving;
};

// 4. Hapus Tabungan (Kalau sudah tercapai / batal)
export const deleteSavingService = async (id) => {
  await prisma.saving.delete({ where: { id } });
  return { message: "Tabungan berhasil dihapus" };
};
