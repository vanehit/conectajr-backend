import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import mensajeRoutes from "./routes/mensajes.js";
import userRoutes from "./routes/userRoutes.js";
import visitRoutes from "./routes/visitRoutes.js"

dotenv.config(); //usamos process.env

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a la base de datos (ya con dotenv cargado)
conectarDB();

app.use(cors());
app.use(express.json());

app.use("/api/mensajes", mensajeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

// Ruta para verificar que el servidor está activo
app.get("/", (req, res) => {
  res.send("🚀 El servidor está corriendo en localhost:" + PORT);
});

app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
