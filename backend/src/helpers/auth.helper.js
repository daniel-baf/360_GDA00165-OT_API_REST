import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param {Object} user - The user object for which the token is being created.
 * @returns {string} The generated JWT.
 */
function createToken(user) {
  return jwt.sign({ _id: Math.random(), user }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

/**
 * Verifies the provided JWT token.
 *
 * @param {string} token - The JWT token to be verified.
 * @throws {Error} If the token is not provided.
 * @returns {object} The decoded token if verification is successful.
 */
function checkToken(token) {
  if (!token) throw new Error("No tienes un token de autenticación");

  return jwt.verify(token, process.env.JWT_SECRET, { complete: true });
}

/**
 * Verify if a user [not admin] is trying to access data that is not owned by him
 * ej. trying to upddate other's user or direcciont...
 * or acces to other user's data, just call the middleware and pass the id to check
 * as check_id in the params
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function checkUserAccesOwnedData(id, check_id) {
  id = parseInt(id);
  check_id = parseInt(check_id);

  if (req.user.rol_id === 2) {
    return true;
  }
  if (id !== check_id) {
    throw new Error("No tienes permisos para acceder a estos datos, solo puedes acceder a tus propios datos");
  }
};


export { createToken, checkToken, checkUserAccesOwnedData };
