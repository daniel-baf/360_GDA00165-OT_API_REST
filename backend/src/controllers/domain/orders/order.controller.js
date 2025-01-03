import {
  listOrders,
  searchOrder,
  createOrder,
  deleteOrder,
} from "@models/oders/order.dao.js";

const orderController = {
  listAll: async (filters, user) => await listOrders(filters, user),

  search: async (id, detailed = false, user) =>
    await checkOrderOwner(user, [id, detailed]),

  create: async (form_data) => await createOrder(form_data),

  delete: async (id) => await deleteOrder(id),
};

/**
 * Searches for the order and check if the user requesting it, is the owner of it
 * if the user is an admin, it will skip the check
 * @param {object} user
 * @param {object} filter_parameters id, detailed
 * @returns
 */
async function checkOrderOwner(user, filter_parameters) {
  let order_db = await searchOrder(...filter_parameters);

  // check access level
  if (user.rol_id === 2) {
    return order_db;
  }

  // check if the user is the owner of the order
  if (user.id !== order_db.usuario_id) {
    throw new Error(
      "No tienes permisos para acceder a estos datos, solo puedes acceder a tus propios datos"
    );
  }

  return order_db;
}

export default orderController;
