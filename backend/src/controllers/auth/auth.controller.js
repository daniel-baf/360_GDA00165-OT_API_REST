import { validateLogin as checkLoginService } from "@services/auth/auth.service.js";

/**
 * In the auth controller, validateLogin is a function that takes an email and a password as arguments and returns the token if the credentials are correct.
 * if any erro ocurrs, the server will return a 500 status code.
 * @param {string} email
 * @param {string} password
 * @returns the token if the credentials are correct
 */
export async function validateLogin(email, password) {
  return await checkLoginService(email, password);
}
