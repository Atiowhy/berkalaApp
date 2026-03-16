// src/controllers/profileController.js
import {
  getUserProfileService,
  updateUserProfileService,
} from "../service/profileService.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Dari hasil bongkar Token
    const user = await getUserProfileService(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal mengambil profil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, role } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama tidak boleh kosong!" });
    }

    const updatedProfile = await updateUserProfileService(userId, name, role);
    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal memperbarui profil" });
  }
};
