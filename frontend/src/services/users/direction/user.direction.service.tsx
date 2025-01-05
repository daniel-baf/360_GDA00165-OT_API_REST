import { API_ENDPOINTS } from "@helpers/API.enum";
import { UserDirectionTypes } from "./user.direction.types";

const fetchUserDirections = async (
  userId: number,
  token: string
): Promise<UserDirectionTypes[]> => {
  const response = await fetch(API_ENDPOINTS.USER.DIRECTIONS.LIST(userId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data;
};

export default fetchUserDirections;
