import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import { CartItem } from "@context/user/client/ClientCart.context";
import { API_ENDPOINTS } from "../../helpers/API.enum";
import { OrderTypes } from "./Order.types";
import { Settings } from "CONFIGURATION";
import { PublicTokenPayload } from "@helpers/auth/auth.service";

export interface NewOrderType {
  direccion: UserDirectionTypes;
  productos: CartItem[];
}

/**
 * Fetches a list of orders from the API.
 *
 * @param token - The authorization token for the API request.
 * @param user_token - The user token payload containing user information.
 * @param detailed - Whether to fetch detailed order information (default: false).
 * @param offset - The offset for pagination (default: 0).
 * @param limit - The maximum number of items to fetch (default: Settings.MAX_ITEMS_PER_LONG_LIST).
 * @returns A promise that resolves to an array of OrderTypes.
 * @throws Will throw an error if the API response is not ok.
 */
const fetchOrders = async (
  token: string,
  user_token: PublicTokenPayload["user"],
  detailed: boolean = false,
  offset: number = 0,
  limit: number = Settings.MAX_ITEMS_PER_LONG_LIST
): Promise<OrderTypes[]> => {
  const uri_fetch =
    user_token.rol_id === 2
      ? API_ENDPOINTS.ORDERS.LIST.ALL.LIMIT_OFFSET(offset, limit)
      : API_ENDPOINTS.ORDERS.LIST.BY_USER(
          user_token.id,
          detailed,
          offset,
          limit
        );

  const response = await fetch(uri_fetch, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  return await response.json();
};

/**
 * Deletes an order by its ID.
 *
 * @param {string} token - The authorization token.
 * @param {number} order_id - The ID of the order to delete.
 * @returns {Promise<string>} - A promise that resolves to a message indicating the result of the deletion.
 * @throws {Error} - Throws an error if the response is not ok.
 */
const deleteOrder = async (
  token: string,
  order_id: number
): Promise<string> => {
  const response = await fetch(API_ENDPOINTS.ORDERS.DELETE(order_id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`${await response.text()}`);
  }
  const data = await response.json();
  return await data.mensaje;
};

/**
 * Places a new order by sending a POST request to the API.
 *
 * @param {string} token - The authentication token for the API.
 * @param {NewOrderType} order - The new order details including delivery address and products.
 * @param {number} user_id - The ID of the user placing the order.
 * @returns {Promise<any>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
async function putNewOrder(
  token: string,
  order: NewOrderType,
  user_id: number
) {
  const body = {
    usuario_id: user_id,
    direccion_entrega_id: order.direccion.id,
    details: order.productos.map((product) => ({
      producto_id: product.product.id,
      cantidad: product.quantity,
      precio_venta:
        product.quantity >= Settings.NUM_MAYORIST
          ? product.product.precio_mayorista
          : product.product.precio,
    })),
  };

  const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to place new order");
  }

  const data = await response.json();
  return data;
}

/**
 * Fetches and approves an order by updating its status.
 *
 * @param {number} order_id - The ID of the order to be approved.
 * @param {string} token - The authorization token for the request.
 * @param {number} new_status - The new status to be set for the order.
 * @returns {Promise<string>} A promise that resolves to a success message containing the order ID.
 * @throws {Error} If the response is not ok, an error is thrown with the response status text.
 */
const fetchApproveOrder = async (
  order_id: number,
  token: string,
  new_status: number
): Promise<string> => {
  const response = await fetch(
    API_ENDPOINTS.ORDERS.STATUS.UPDATE(order_id, new_status),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }

  const data = await response.json();
  return `${data.message}, con id ${data.pedido_id}`;
};

/**
 * Fetches the details of an order based on the provided order ID.
 *
 * @param {number} order_id - The ID of the order to search for.
 * @returns {Promise<any>} A promise that resolves to the order details in JSON format.
 * @throws {Error} Throws an error if the fetch request fails.
 */
const fetchSearchOrder = async (
  order_id: number,
  token: string
): Promise<NewOrderType> => {
  const response = await fetch(API_ENDPOINTS.ORDERS.SEARCH(order_id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${await response.text()}`);
  }
  return await response.json();
};

export {
  fetchOrders,
  deleteOrder,
  putNewOrder,
  fetchApproveOrder,
  fetchSearchOrder,
};
