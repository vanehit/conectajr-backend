import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function createAuthToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "secretKey",
    { expiresIn: "2h" },
  );
}

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

// 👉 POST /api/users/signup
export const signup = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nombre, email y contraseña son obligatorios." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ error: "Email ya registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      nombre: nombre.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error("Error signup:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 👉 POST /api/users/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        error: "Este usuario inició sesión con Google.",
      });
    }

    const valido = await bcrypt.compare(password, user.passwordHash);

    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = createAuthToken(user);

    res.json({
      message: "Login exitoso",
      userId: user._id,
      token,
      nombre: user.nombre,
    });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 👉 POST /api/users/google-login
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) {
      return res.status(400).json({ error: "Token de Google requerido" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const normalizedEmail = normalizeEmail(email);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = new User({
        nombre: name,
        email: normalizedEmail,
        passwordHash: null,
        googleId: sub,
        avatar: picture,
      });
    } else {
      user.googleId = user.googleId || sub;
      user.avatar = picture || user.avatar;
      user.nombre = user.nombre || name;
    }

    await user.save();

    const token = createAuthToken(user);

    res.json({
      message: "Login con Google exitoso",
      userId: user._id,
      token,
      nombre: user.nombre,
    });
  } catch (error) {
    console.error("Error Google Login:", error);
    res.status(500).json({ error: "Error en autenticación con Google" });
  }
};
