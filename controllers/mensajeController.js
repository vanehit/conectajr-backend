import Mensaje from "../models/Mensaje.js";

export const crearMensaje = async (req, res) => {
  try {
    const nuevoMensaje = new Mensaje(req.body);
    await nuevoMensaje.save();
    res.status(201).json({ mensaje: "Mensaje guardado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el mensaje" });
  }
};

export const obtenerMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

export const responderMensaje = async (req, res) => {
  const { id } = req.params;
  const { respuesta } = req.body;

  try {
    const mensaje = await Mensaje.findById(id);
    if (!mensaje) return res.status(404).json({ error: "Mensaje no encontrado" });

    mensaje.respuesta = respuesta;
    mensaje.fechaRespuesta = new Date();
    await mensaje.save();

    res.json({ mensaje: "Respuesta guardada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la respuesta" });
  }
};
