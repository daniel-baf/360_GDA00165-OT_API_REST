import { getConnection } from "@ORM/sequelize_orm.model.js";

const sequelize = getConnection();

/**
 * Creates a new product in the database.
 *
 * @async
 * @function createProduct
 * @param {Object} producto - The product to be created.
 * @param {string} producto.nombre - The name of the product.
 * @param {string} producto.descripcion - The description of the product.
 * @param {number} producto.precio - The price of the product.
 * @param {number} producto.precio_mayorista - The wholesale price of the product.
 * @param {number} producto.stock - The stock quantity of the product.
 * @param {number} producto.estado_producto_id - The status ID of the product.
 * @param {number} producto.categoria_producto_id - The category ID of the product.
 * @throws {Error} Throws an error if there is an issue creating the product.
 */
async function createProduct(product_form) {
  const {
    nombre = null,
    descripcion = null,
    precio = null,
    precio_mayorista = null,
    stock = null,
    estado_producto_id = null,
    categoria_producto_id = null,
  } = product_form;

  try {
    let [result] = await sequelize.query(
      "EXEC p_create_producto :nombre, :descripcion, :precio, :precio_mayorista, :stock, :estado_producto_id, :categoria_producto_id",
      {
        replacements: {
          nombre,
          descripcion,
          precio,
          precio_mayorista,
          stock,
          estado_producto_id,
          categoria_producto_id,
        },
      }
    );

    // return the value of the fields updated
    return Object.fromEntries(
      Object.entries({
        id: result[0].id,
        nombre,
        descripcion,
        precio,
        precio_mayorista,
        stock,
        estado_producto_id,
        categoria_producto_id,
      }).filter(([_, v]) => v !== undefined && v !== null)
    );
  } catch (error) {
    throw new Error(
      "Es probable que el producto ya exista con este ID: " + error.message
    );
  }
}

/**
 * Updates a product in the database.
 *
 * @async
 * @function updateProduct
 * @param {Object} producto - The product object to update.
 * @param {number} producto.id - The ID of the product.
 * @param {string} producto.nombre - The name ofs the product.
 * @param {string} producto.descripcion - The description of the product.
 * @param {number} producto.precio - The price of the product.
 * @param {number} producto.precio_mayorista - The wholesale price of the product.
 * @param {number} producto.stock - The stock quantity of the product.
 * @param {number} producto.estado_producto_id - The status ID of the product.
 * @param {number} producto.categoria_producto_id - The category ID of the product.
 * @throws {Error} Throws an error if the product update fails.
 */
async function updateProduct(producto) {
  const {
    id,
    nombre = null,
    descripcion = null,
    precio = null,
    precio_mayorista = null,
    stock = null,
    estado_producto_id = null,
    categoria_producto_id = null,
  } = producto;
  try {
    if (!id) throw new Error("El id es requerido para actualizar un producto");
    if ((!!precio && precio < 0) || precio_mayorista < 0)
      throw new Error("El precio no puede ser negativo");
    if (!!stock && stock < 0) throw new Error("El stock no puede ser negativo");
    if (!!precio && !!precio_mayorista && precio < precio_mayorista)
      throw new Error(
        "El precio mayorista no puede ser mayor al precio de venta"
      );

    await sequelize.query(
      "EXEC p_update_producto :id, :nombre, :descripcion, :precio, :precio_mayorista, :stock, :estado_producto_id, :categoria_producto_id",
      {
        replacements: {
          id,
          nombre,
          descripcion,
          precio,
          precio_mayorista,
          stock,
          estado_producto_id,
          categoria_producto_id,
        },
      }
    );

    return Object.fromEntries(
      Object.entries({
        id,
        nombre,
        descripcion,
        precio,
        precio_mayorista,
        stock,
        estado_producto_id,
        categoria_producto_id,
      }).filter(([_, v]) => v)
    );
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
}

/**
 * Deletes a product from the database. Proceddure returns a custom message
 *
 * @async
 * @function deleteProduct
 * @param {number} id - The ID of the product to delete.
 * @throws {Error} Throws an error if the product could not be deleted.
 */
async function deleteProduct(id) {
  try {
    if (!id) throw new Error("El id es requerido para eliminar un producto");

    let [result] = await sequelize.query("EXEC p_delete_producto :id", {
      replacements: { id },
    });

    return result[0];
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
}

/**
 * Lists products with pagination.
 *
 * @async
 * @function listProducts
 * @param {Object} filters - The filters to apply to the query.
 * @param {number} filters.limit - The maximum number of products to return.
 * @param {number} filters.offset - The number of products to skip.
 * @param {number} filters.status_id - The status ID of the product, default is 1, send NULL if you want to get all products.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 * @throws {Error} If there is an error listing the products.
 */
async function listProducts({ limit = null, offset = 0, status_id = 1 }) {
  try {
    if (!!limit && limit < 1)
      throw new RangeError("El limite debe ser al menos 1");

    const productos = await sequelize.query(
      "EXEC p_list_producto :limit, :offset, :status_id",
      {
        replacements: { limit, offset, status_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return productos;
  } catch (error) {
    throw new Error("Error listing products: " + error.message);
  }
}

/**
 * Searches for a product by its ID.
 *
 * @async
 * @function searchProduct
 * @param {number} id - The ID of the product to search for.
 * @returns {Promise<Object>} The product object if found.
 * @throws {Error} If there is an error while retrieving the product.
 */
async function searchProduct(filters) {
  const { id = null, category = null, name = null } = filters;
  console.log(filters);

  try {
    const producto = await sequelize.query(
      "EXEC p_get_producto @id=:id, @category_id=:category, @name=:name",
      {
        replacements: { id, category, name },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return producto;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Changes the status of a product.
 *
 * @async
 * @function changeProductStatus
 * @param {number} id - The ID of the product.
 * @param {number} estado_producto_id - The new status ID of the product.
 * @throws {Error} Throws an error if the status update fails.
 */
async function changeProductStatus(id, estado_producto_id) {
  try {
    return updateProduct({ id, estado_producto_id });
  } catch (error) {
    throw new Error("Error changing product status: " + error.message);
  }
}

export {
  createProduct,
  updateProduct,
  changeProductStatus,
  deleteProduct,
  listProducts,
  searchProduct,
};
