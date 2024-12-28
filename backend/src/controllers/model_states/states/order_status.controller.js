import {
  createOrderStatus,
  listOrderStatuses,
  updateOrderStatus,
  deleteOrderStatus,
} from "@models/model_states/order_status.dao.js";

const order_status_controller = {
  create: async (new_order_status) => createOStatosController(new_order_status),

  list: async () => await listOrderStatuses(),

  listLimitOffset: async (limit, offset) =>
    await listOrderStatuses(limit, offset),

  update: async (id, updated_order_status) =>
    updateOSController(id, updated_order_status),

  delete: async (id) => await deleteOrderStatus(id),
};

/**
 * Updates the order status with the given ID and updated order status fields.
 *
 * @param {string} id - The ID of the order status to update.
 * @param {Object} updated_order_status - The updated fields for the order status.
 * @param {string} updated_order_status.nombre - The new name for the order status.
 * @param {string} updated_order_status.descripcion - The new description for the order status.
 * @throws {Error} If the ID or updated_order_status is not provided.
 * @throws {Error} If the updated_order_status object is empty.
 * @returns {Promise<Object>} The updated order status.
 */
async function updateOSController(id, updated_order_status) {
  if (!id || !updated_order_status)
    throw new Error("ID y campos son obligatorios");

  if (Object.keys(updated_order_status).length === 0) {
    throw new Error("El objeto actualizado no puede estar vacío");
  }

  let { nombre, descripcion } = updated_order_status;
  return await updateOrderStatus(id, nombre, descripcion);
}

/**
 * Creates a new order status.
 *
 * @param {Object} params - The parameters for creating the order status.
 * @param {string} params.nombre - The name of the order status.
 * @param {string} params.descripcion - The description of the order status.
 * @throws {Error} If the nombre or descripcion fields are missing.
 * @returns {Promise<Object>} The created order status.
 */
async function createOStatosController({ nombre, descripcion }) {
  if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");

  return await createOrderStatus(nombre, descripcion);
}

export { order_status_controller };
