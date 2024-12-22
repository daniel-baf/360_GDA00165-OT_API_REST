import { searchUser } from "@models/user/user.dao.js";
import { compareHash } from "@services/hashing/cypter.service.js";
import { createToken } from "@helpers/auth.helper.js";

/**
 * Validates the login credentials of a user.
 *
 * @param {string} email - The email of the user attempting to log in.
 * @param {string} password_plain - The plain text password provided by the user.
 * @returns {Promise<string>} - A promise that resolves to a valid session token if the credentials are correct.
 * @throws {Error} - Throws an error if the credentials are incorrect.
 */
async function validateLogin(email, password_plain) {
  let db_user = await searchUser(null, email);

  // check if the user_db password is the same as the password_plain
  if (!compareHash(password_plain, db_user.password)) {
    throw new Error("Credenciales incorrectas");
  }

  // delete sensible data -> password OK
  db_user = {
    nombre_completo: db_user.nombre_completo,
    rol_id: db_user.rol_id,
  };
  // return a valid session token
  return { token: createToken(db_user) };
}

export { validateLogin };
