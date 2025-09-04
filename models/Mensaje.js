import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, "Email inválido"],
  },
  mensaje: {
    type: String,
    required: true,
    trim: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  respuesta: {
    type: String,
    trim: true,
  },
  fechaRespuesta: {
    type: Date,
  },
});

export default mongoose.model("Mensaje", mensajeSchema);
