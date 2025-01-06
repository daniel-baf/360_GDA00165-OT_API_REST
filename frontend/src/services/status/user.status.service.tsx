import { API_ENDPOINTS } from "@helpers/API.enum";
import { UserStatusType } from "./user.status.types";

/**
 * Fetches the list of user statuses from the API.
 *
 * @param token - The authentication token to be included in the request headers.
 * @returns A promise that resolves to an array of `UserStatusType`.
 * @throws Will throw an error if the response is not ok.
 */
const fetchUserStatuses = async (token: string): Promise<UserStatusType[]> => {
  const response = await fetch(API_ENDPOINTS.STATUS.USER.LIST, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return data;
};

const fetchAlterUserStatus = async (
  token: string,
  status: number,
  user_id: number
): Promise<string> => {
  const URL_PATH =
    status === 3
      ? API_ENDPOINTS.STATUS.USER.ENABLE(user_id)
      : API_ENDPOINTS.STATUS.USER.DISABLE(user_id);

  const response = await fetch(URL_PATH, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return "Permisos actualizados correctamente";
};

export { fetchUserStatuses, fetchAlterUserStatus };
