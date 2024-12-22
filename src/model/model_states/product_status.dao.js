import { getConnection } from "@ORM/sequelize_orm.model.js";

const sequelize = getConnection();

/**
 * Create a new product status.
 * @param {string} nombre - The name of the product status.
 * @param {string} descripcion - The description of the product status.
 * @returns {Promise} - A promise that resolves when the product status is created.
 */
async function createProductStatus(nombre, descripcion) {
  try {
    if (!nombre || !descripcion)
      throw new TypeError(
        "Nombre y descripción son requeridos para crear estado de producto"
      );

    let [result] = await sequelize.query(
      "EXEC p_create_estado_producto @nombre = :nombre, @descripcion = :descripcion",
      {
        replacements: { nombre, descripcion },
        type: sequelize.QueryTypes.CREATE,
      }
    );

    return { id: result[0].id, nombre, descripcion };
  } catch (error) {
    throw new Error(`Error creating product status: ${error.message}`);
  }
}

/**
 * Update an existing product status.
 * @param {number} id - The ID of the product status.
 * @param {string} nombre - The name of the product status.
 * @param {string} descripcion - The description of the product status.
 * @returns {Promise} - A promise that resolves when the product status is updated.
 */
async function updateProductStatus(id, nombre = null, descripcion = null) {
  try {
    if (!nombre && !descripcion)
      throw new TypeError("No hay datos para actualiza estado de productor");

    await sequelize.query(
      "EXEC p_update_estado_producto @id = :id, @nombre = :nombre, @descripcion = :descripcion",
      {
        replacements: { id, nombre, descripcion },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return Object.fromEntries(
      Object.entries({ id, nombre, descripcion }).filter(([_, v]) => v !== null)
    );
  } catch (error) {
    throw new Error(`Error updating product status: ${error.message}`);
  }
}

/**
 * Delete a product status.
 * @param {number} id - The ID of the product status.
 * @returns {Promise} - A promise that resolves when the product status is deleted.
 */
async function deleteProductStatus(id) {
  try {
    if (!id) throw new TypeError("ID es requerido para borrar el estado");

    await sequelize.query("EXEC p_delete_estado_producto @id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    return { id };
  } catch (error) {
    throw new Error(`Error deleting product status: ${error.message}`);
  }
}

/**
 * List product statuses with pagination.
 * @param {number} [limit] - The maximum number of product statuses to return.
 * @param {number} [offset] - The number of product statuses to skip.
 * @returns {Promise<Array>} - A promise that resolves to an array of product statuses.
 */
async function listProductStatus(limit = null, offset = 0) {
  try {
    if ((!!limit && limit < 1) || offset < 0)
      throw new RangeError(
        "El limite y el offset deben ser mayores a 0 o nulos"
      );

    const results = await sequelize.query(
      "EXEC p_list_estado_producto @limit = :limit, @offset = :offset",
      {
        replacements: { limit, offset },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return results;
  } catch (error) {
    throw new Error(`Error listing product statuses: ${error.message}`);
  }
}

export {
  createProductStatus,
  updateProductStatus,
  deleteProductStatus,
  listProductStatus,
};
