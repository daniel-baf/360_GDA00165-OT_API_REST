import {
  createProductStatus,
  listProductStatus,
  updateProductStatus,
  deleteProductStatus,
} from "@models/model_states/product_status.dao.js";

const product_status_controller = {
  create: async (new_product_status) =>
    await newProductStatusCtrl(new_product_status),
  list: async (filters) => await listProductStatus(filters),
  update: async (id, product_status) =>
    await updateProductStatusCtrl(id, product_status),
  delete: async (id) => await deleteProductStatus(id),
};

/**
 * Updates the status of a product.
 *
 * @param {string} id - The unique identifier of the product.
 * @param {Object} param1 - An object containing the new status details.
 * @param {string} param1.nombre - The new name of the product status.
 * @param {string} param1.descripcion - The new description of the product status.
 * @throws {Error} If the ID is not provided.
 * @returns {Promise<Object>} The updated product status.
 */
async function updateProductStatusCtrl(id, { nombre, descripcion }) {
  if (!id) throw new Error("El ID es obligatorio");
  return await updateProductStatus(id, nombre, descripcion);
}

/**
 * Creates a new product status.
 *
 * @param {Object} params - The parameters for creating a new product status.
 * @param {string} params.nombre - The name of the product status.
 * @param {string} params.descripcion - The description of the product status.
 * @throws {Error} If the nombre or descripcion is not provided.
 * @returns {Promise<Object>} The created product status.
 */
async function newProductStatusCtrl({ nombre, descripcion }) {
  if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");

  return await createProductStatus(nombre, descripcion);
}

export { product_status_controller };
