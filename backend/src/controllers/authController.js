import { loginUser, registerUser } from "../service/authService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "please fill all the blank field",
      });
    }

    const newUser = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "Register Successfuly",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the blank field" });
    }

    const { isValidEmail, token } = await loginUser(email, password);

    res.status(201).json({
      success: true,
      message: "Login Successfuly",
      data: {
        token,
        data: {
          id: isValidEmail.id,
          name: isValidEmail.name,
          email: isValidEmail.email,
        },
      },
    });
  } catch (error) {
    console.log(error.message); // Cetak pesan errornya saja biar rapi

    // Jika error-nya berasal dari salah email/password yang kita buat di service:
    if (
      error.message === "Email not registered" ||
      error.message === "Wrong password"
    ) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Jika error lainnya (seperti database mati, JWT secret hilang, dll):
    res.status(500).json({ message: "Internal server error" });
  }
};
