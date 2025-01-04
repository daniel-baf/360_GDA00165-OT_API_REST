import { API_ENDPOINTS } from "@helpers/API.enum";
import { SignUpFormData } from "./signup.types";

/**
 * Sends a new user data to the server.
 *
 * @param {SignUpFormData} user - The data of the user to be signed up.
 * @returns {void}
 */
const fetchPutNewUser = async (user: SignUpFormData): Promise<string> => {
  const response = await fetch(API_ENDPOINTS.USER.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  // now must create a link to validate via onclick emial
  return "Usuario creado, puedes verificarlo en tu correo electronico";
};

export { fetchPutNewUser };
