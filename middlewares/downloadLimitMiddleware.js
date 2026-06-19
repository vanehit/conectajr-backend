import User from "../models/User.js";

const downloadLimitMiddleware = async (req, res, next) => {
  try {
    const now = new Date();

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 🔥 Si tiene premium activo → ilimitado
    if (user.premiumUntil && user.premiumUntil > now) {
      return next();
    }

    // 🗓 Reset mensual automático
    const lastReset = new Date(user.lastDownloadReset);

    if (
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getFullYear() !== now.getFullYear()
    ) {
      user.downloadsUsed = 0;
      user.lastDownloadReset = now;
      await user.save();
    }

    // 🔒 Incremento atómico para free
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        downloadsUsed: { $lt: user.downloadsLimit },
      },
      { $inc: { downloadsUsed: 1 } },
      { new: true }
    ).select("downloadsUsed downloadsLimit");

    if (!updatedUser) {
      return res.status(403).json({
        error: "Límite de descargas alcanzado",
        message:
          "Ya usaste tus 3 descargas gratuitas este mes. Podés apoyar el proyecto para seguir descargando ❤️",
      });
    }

    req.remainingDownloads =
      updatedUser.downloadsLimit - updatedUser.downloadsUsed;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar límite de descargas" });
  }
};

export default downloadLimitMiddleware;
