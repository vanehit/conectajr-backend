import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import mensajeRoutes from "./routes/mensajes.js";
import userRoutes from "./routes/userRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

dotenv.config(); // cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a la base de datos
conectarDB();

// ⚡ Configuración de CORS
app.use(cors({
  origin: "https://conecta-jr.vercel.app", // tu frontend
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas del backend
app.use("/api/mensajes", mensajeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send(`🚀 El servidor está corriendo en puerto ${PORT}`);
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
