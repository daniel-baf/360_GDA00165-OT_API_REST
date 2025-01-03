import { API_ENDPOINTS } from "../../helpers/API.enum";
import { OrderTypes } from "./Order.types";

const fetchOrders = async (
  token: string,
  user_id: number,
  detailed: boolean = false,
  offset: number = 0,
  limit?: number
): Promise<OrderTypes[]> => {
  const response = await fetch(
    API_ENDPOINTS.ORDERS.LIST.BY_USER(user_id, detailed, offset, limit),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  return await response.json();
};

export { fetchOrders };
