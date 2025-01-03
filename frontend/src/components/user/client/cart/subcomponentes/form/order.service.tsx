import { CartItem } from "@context/user/client/ClientCart.context";
import { API_ENDPOINTS } from "@helpers/API.enum";
import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import { Settings } from "CONFIGURATION";

export interface NewOrderType {
  direccion: UserDirectionTypes;
  productos: CartItem[];
}

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
  console.log(data);
  return data;
}

export { putNewOrder };
