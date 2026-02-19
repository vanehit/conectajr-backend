import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header requerido" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET no definido");
    return res.status(500).json({ error: "Error de configuración del servidor" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }

    return res.status(401).json({ error: "Token inválido" });
  }
};

export default authMiddleware;
