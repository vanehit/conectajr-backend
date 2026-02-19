import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // 🔥 Si el usuario no tiene password → es cuenta Google
    if (!user.passwordHash) {
      return res.status(400).json({
        error: "Este usuario inició sesión con Google.",
      });
    }

    const valido = await bcrypt.compare(password, user.passwordHash);

    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      userId: user._id,
      token,
    });
  } catch (err) {
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

    // 1️⃣ Verificar token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // 2️⃣ Buscar usuario
    let user = await User.findOne({ email });

    // 3️⃣ Si no existe → crear usuario
    if (!user) {
      user = new User({
        nombre: name,
        email,
        passwordHash: null, // porque viene de Google
        googleId: sub,
        avatar: picture,
      });

      await user.save();
    }

    // 4️⃣ Generar JWT propio
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login con Google exitoso",
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error("Error Google Login:", error);
    res.status(500).json({ error: "Error en autenticación con Google" });
  }
};
