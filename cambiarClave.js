// cambiarClave.js
import bcrypt from "bcrypt";

const nuevaClave = "MiNuevaClave123"; // escribí aquí la nueva contraseña que quieras
const generarHash = async () => {
  const hash = await bcrypt.hash(nuevaClave, 10);
  console.log("Hash generado:", hash);
};

generarHash();
