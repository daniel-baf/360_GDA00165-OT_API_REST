import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import { CartItem } from "@context/user/client/ClientCart.context";
import { API_ENDPOINTS } from "../../helpers/API.enum";
import { OrderTypes } from "./Order.types";
import { Settings } from "CONFIGURATION";

export interface NewOrderType {
  direccion: UserDirectionTypes;
  productos: CartItem[];
}

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
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  return await response.json();
};

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
    throw new Error(`${response.statusText}`);
  }
  const data = await response.json();
  return await data.mensaje;
};

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

export { fetchOrders, deleteOrder, putNewOrder };
