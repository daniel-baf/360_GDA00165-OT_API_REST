import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param {Object} user - The user object for which the token is being created.
 * @returns {string} The generated JWT.
 */
function createToken(data) {
  return jwt.sign({ _id: Math.random(), user: data }, process.env.JWT_SECRET, {
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


export { createToken, checkToken,  };
