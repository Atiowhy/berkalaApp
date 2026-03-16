import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (name, email, password) => {
  // cek apakah email sudah terdaftar
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  // hash password
  const hashedPass = await bcrypt.hash(password, 10);

  // simpan ke database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPass,
    },
  });

  return newUser;
};

export const loginUser = async (email, password) => {
  // cek email
  const isValidEmail = await prisma.user.findUnique({ where: { email } });
  if (!isValidEmail) {
    throw new Error("Email not registered");
  }

  // cek password
  const isValidPassword = await bcrypt.compare(password, isValidEmail.password);
  if (!isValidPassword) {
    throw new Error("Wrong password");
  }

  // buat jwt token
  const token = jwt.sign(
    { userId: isValidEmail.id, email: isValidEmail.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { isValidEmail, token };
};
