import { searchDirection } from "@models/user/direction/client_direction.dao.js";
import { searchProduct } from "@models/product/product.dao.js";
import {
  listOrders,
  searchOrder,
  createOrder,
  deleteOrder,
  changeOrderState,
} from "@models/oders/order.dao.js";

const orderController = {
  listAll: async (filters, user) => await listOrders(filters, user),

  search: async (id, detailed = false, user) =>
    await checkOrderOwner(user, { id, detailed }),

  create: async (form_data) => await createOrder(form_data),

  swapState: async ({ id, status }) => await changeOrderState(id, status),

  delete: async (params) => await deleteOrder(params),
};

/**
 * Searches for the order and check if the user requesting it, is the owner of it
 * if the user is an admin, it will skip the check
 * @param {object} user
 * @param {object} filter_parameters id, detailed
 * @returns
 */
async function checkOrderOwner(user, filter_parameters) {
  // disable detailed information 'cause the conversion reutnrs always a detailed one
  // search the order
  const order_db = await searchOrder(filter_parameters);

  // // cast to a valid frontend object
  const frontend_order = {
    direccion: await searchDirection(order_db.direccion_entrega_id),
    productos: filter_parameters.detailed
      ? await Promise.all(
          order_db.details?.map(async (product) => ({
            quantity: product.cantidad,
            product: {
              ...(await searchProduct(product.producto_id)),
            },
          }))
        )
      : [],
  };

  // check if the user is the owner of the order
  if (user.rol_id != 2 && user.id !== order_db.usuario_id) {
    throw new Error(
      "No tienes permisos para acceder a estos datos, solo puedes acceder a tus propios datos"
    );
  }

  return frontend_order;
}

export default orderController;
