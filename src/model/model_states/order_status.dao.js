import { getConnection } from "@ORM/sequelize_orm.model.js";
import { ValidationError } from "sequelize";

const sequelize = getConnection();
/**
 * Creates a new order status.
 *
 * @param {string} nombre - The name of the order status.
 * @param {string} descripcion - The description of the order status.
 * @returns {Promise<number>} The ID of the created order status.
 * @throws {Error} If the name or description is not provided.
 */
async function createOrderStatus(nombre, descripcion) {
  if (!nombre || !descripcion) {
    throw new Error("Nombre y descripción son requeridos");
  }

  const [result] = await sequelize.query(
    "EXEC p_create_estado_pedido :nombre, :descripcion",
    {
      replacements: { nombre, descripcion },
      type: sequelize.QueryTypes.CREATE,
    }
  );

  return { id: result[0].id, nombre, descripcion };
}
/**
 * Updates an existing order status. retorna el objeto actualizado, excluyendo los campos que no se actualizan
 *
 * @param {number} id - The ID of the order status to update.
 * @param {string} nombre - The new name of the order status.
 * @param {string} descripcion - The new description of the order status.
 * @returns {Promise<void>}
 * @throws {Error} If the ID is not provided.
 */
async function updateOrderStatus(id, nombre = null, descripcion = null) {
  if (!id) {
    throw new ValidationError("ID es requerido");
  }
  if (!nombre && !descripcion)
    throw new ValidationError("No hay datos para actualizar");

  await sequelize.query(
    "EXEC p_update_estado_pedido :id, :nombre, :descripcion",
    {
      replacements: { id, nombre, descripcion },
      type: sequelize.QueryTypes.UPDATE,
    }
  );
  let tmp_object = { id, nombre, descripcion };
  return Object.fromEntries(
    Object.entries(tmp_object).filter(([_, v]) => v !== null)
  );
}
/**
 * Lists order statuses with pagination.
 *
 * @param {number} limit - The maximum number of order statuses to return.
 * @param {number} offset - The number of order statuses to skip before starting to collect the result set.
 * @returns {Promise<Array>} The list of order statuses.
 */
async function listOrderStatuses(limit = null, offset = 0) {
  const results = await sequelize.query(
    "EXEC p_list_estado_pedido :limit, :offset",
    {
      replacements: { limit, offset },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results;
}

/**
 * Deletes an order status.
 *
 * @param {number} id - The ID of the order status to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the ID is not provided.
 */
async function deleteOrderStatus(id) {
  if (!id) {
    throw new ValidationError("ID es requerido");
  }

  await sequelize.query("EXEC p_delete_estado_pedido :id", {
    replacements: { id },
    type: sequelize.QueryTypes.DELETE,
  });

  return { id };
}

export {
  createOrderStatus,
  listOrderStatuses,
  updateOrderStatus,
  deleteOrderStatus,
};
