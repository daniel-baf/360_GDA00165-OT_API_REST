import { API_ENDPOINTS } from "@helpers/API.enum";
import { SignUpFormData } from "./signup.types";
import { UserTypes } from "./user.types";

/**
 * Sends a new user data to the server.
 *
 * @param {SignUpFormData} user - The data of the user to be signed up.
 * @returns {void}
 */
const fetchPutNewUser = async (
  user: SignUpFormData,
  token: string | null | undefined
): Promise<string> => {
  const headers: { "Content-Type": string; Authorization?: string } = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_ENDPOINTS.USER.CREATE, {
    method: "POST",
    headers,
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  // now must create a link to validate via onclick emial
  return "Usuario creado, puedes verificarlo en tu correo electronico";
};

/**
 * Fetches a list of users from the API.
 *
 * @param limit - The maximum number of users to fetch.
 * @param offset - The number of users to skip before starting to collect the result set.
 * @returns A promise that resolves to the list of users.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetchListUsers = async (
  limit: number,
  offset: number,
  token: string
): Promise<UserTypes[]> => {
  const response = await fetch(API_ENDPOINTS.USER.LIST(offset, limit), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
};

/**
 * Deletes a user from the server.
 *
 * @param userId - The ID of the user to be deleted.
 * @param token - The authorization token.
 * @returns A promise that resolves to a success message.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetchDeleteUser = async (
  userId: number,
  token: string
): Promise<string> => {
  const response = await fetch(API_ENDPOINTS.USER.DELETE(userId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      (await response.text()) || " NO HEMOS PODIDO LLEGAR AL SERVIDOR"
    );
  }

  const data = await response.json();

  return data.mensaje;
};

export { fetchPutNewUser, fetchListUsers, fetchDeleteUser };
