import { getConnection } from "@ORM/sequelize_orm.model.js";

const sequelize = getConnection();

/**
 * Creates a new product using a stored procedure.
 * @param {Object} productData - The data of the product to create.
 * @param {string} productData.name - The name of the product.
 * @param {string} productData.description - The description of the product.
 * @returns {Promise<Object>} The created product data.
 * @throws Will throw an error if the query fails.
 */
async function createProductCategory(productData) {
  let { nombre = null, descripcion = null }
    = productData;

  try {
    const [result] = await sequelize.query(
      "EXEC p_create_categoria_producto :nombre, :descripcion",
      {
        replacements: { nombre, descripcion },
        type: sequelize.QueryTypes.CREATE,
      }
    );
    return { id: result[0].id, nombre, descripcion };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches a product by its ID using a stored procedure.
 * @param {number} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} The product data.
 * @throws Will throw an error if the query fails.
 */
async function listProductsCategory({ limit = null, offset = 0 }) {
  try {
    if (!!limit && limit < 1) throw new Error("El limite debe ser mayor a 0");

    const result = await sequelize.query(
      "EXEC p_list_categoria_producto :limit, :offset",
      {
        replacements: { limit, offset },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Searches for a product by its ID or name using a stored procedure.
 * @param {Object} searchParams - The search parameters.
 * @param {number} [searchParams.id] - The ID of the product to search for.
 * @param {string} [searchParams.nombre] - The name of the product to search for.
 * @returns {Promise<Object>} The product data.
 * @throws Will throw an error if the query fails.
 */
async function searchProductCategory(searchParams) {
  let { id = null, nombre = null } = searchParams;
  try {
    const result = await sequelize.query(
      "EXEC p_search_producto :id, :nombre",
      {
        replacements: { id, nombre },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Updates an existing product using a stored procedure.
 * @param {number} productId - The ID of the product to update.
 * @param {Object} productData - The new data for the product.
 * @param {string} productData.name - The new name of the product.
 * @param {string} productData.description - The new description of the product.
 * @returns {Promise<Object>} The updated product data.
 * @throws Will throw an error if the query fails.
 */
async function updateProductCategory(product_update) {
  // extreaer datos de product_update
  let { nombre = null, descripcion = null, id } = product_update;

  try {
    const result = await sequelize.query(
      "EXEC p_update_categoria_producto :id, :nombre, :descripcion",
      {
        replacements: { nombre, descripcion, id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return Object.fromEntries(
      Object.entries({ id, nombre, descripcion }).filter(([_, v]) => v !== null)
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes a product by its ID using a stored procedure.
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 * @throws Will throw an error if the query fails.
 */
async function deleteProductCategory(productId) {
  try {
    const result = await sequelize.query(
      "EXEC p_delete_categoria_producto :id",
      {
        replacements: { id: productId },
        type: sequelize.QueryTypes.DELETE,
      }
    );
    return { id: productId };
  } catch (error) {
    throw error;
  }
}

export {
  createProductCategory,
  listProductsCategory,
  searchProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
