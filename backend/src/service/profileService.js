// src/service/profileService.js
import prisma from "../config/prisma.js";

// 1. Ambil Data Profil (Sembunyikan Password!)
export const getUserProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true, // Ambil kolom role yang baru kita buat
      createdAt: true,
    },
  });

  if (!user) throw new Error("User tidak ditemukan");
  return user;
};

// 2. Update Data Profil (Nama & Role)
export const updateUserProfileService = async (userId, name, role) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      role,
    },
    select: {
      // Sekali lagi, kembalikan data tanpa password
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return updatedUser;
};
