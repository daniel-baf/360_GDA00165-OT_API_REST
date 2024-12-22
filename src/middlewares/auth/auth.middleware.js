import { checkToken } from "@helpers/auth.helper.js";

const verifyTokenTimeout = async (req, res, next) => {
  try {
    // Extraer el token del encabezado Authorization
    const token = req.headers["authorization"]?.split(" ")[1]; // Asume formato Bearer <token>
    if (!token) throw new Error("No token provided");

    // Verificar el token
    const decoded = checkToken(token);
    req.user = decoded.payload.user;

    next();
  } catch (error) {
    res.status(401).send(`Unauthorized: ${error.message}`);
  }
};

export { verifyTokenTimeout };
