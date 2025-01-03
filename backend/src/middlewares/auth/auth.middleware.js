import { checkToken } from "@helpers/auth.helper.js";

/**
 * Middleware to verify the token and check for timeout.
 * Extracts the token from the Authorization header, verifies it, and saves the user information in the request object.
 * If the token is invalid or not provided, responds with a 401 Unauthorized status.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If no token is provided or the token is invalid.
 */
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

/**
 * Master verifyTokenTImeout middleware check valid session, just call this 
 * middleware to check if the user.role saved by the middleware is admin
 * 
 * veirfyTokenTimeout middleware will save the user.role in req.user.role
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const checkAdminPermission = (req, res, next) => {
  if (req.user.rol_id !== 2) {
    return res.status(403).send("Forbidden: Admin permission required");
  }
  next();
};

export { verifyTokenTimeout, checkAdminPermission };
