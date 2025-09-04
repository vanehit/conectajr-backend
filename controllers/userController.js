import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 👉 POST /api/users/signup
export const signup = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email ya registrado." });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ nombre, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 👉 POST /api/users/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, user.passwordHash);
    if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Opcional: JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", userId: user._id, token });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};
