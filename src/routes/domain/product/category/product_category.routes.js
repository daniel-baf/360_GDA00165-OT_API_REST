import express from "express";
import {
  createProductCategory,
  listProductsCategory,
  searchProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@models/product/product_category.dao.js";

const product_category_router = express.Router();

/**
 * Route to create a new product category.
 * @name POST /create
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.nombre - Name of the product category.
 * @param {string} req.body.descripcion - Description of the product category.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.post("/create", async (req, res) => {
  try {
    let { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");

    return res
      .status(201)
      .json(await createProductCategory({ nombre, descripcion }));
  } catch (error) {
    res
      .status(500)
      .send(`No ha sido posible crear la categoria de producto: ${error}`);
  }
});

/**
 * Route to list all product categories.
 * @name GET /list
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await listProductsCategory());
  } catch (error) {
    res
      .status(500)
      .send(
        `No ha sido posible recuperar las categorias de productos: ${error}`
      );
  }
});

/**
 * Route to list product categories with pagination.
 * @name GET /list/:limit/:offset
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.limit - Limit of categories to retrieve.
 * @param {number} req.params.offset - Offset for pagination.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    res.status(200).json(await listProductsCategory(limit, offset));
  } catch (error) {
    res
      .status(500)
      .send(
        `No ha sido posible recuperar las categorias de productos: ${error}`
      );
  }
});

/**
 * Route to update a product category.
 * @name PUT /update/:id
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the product category to update.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.nombre - New name of the product category.
 * @param {string} req.body.descripcion - New description of the product category.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.put("/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let { nombre, descripcion } = req.body;
    if (!id) throw new Error("El id es un campo obligatorio");

    return res
      .status(200)
      .json(await updateProductCategory({ nombre, descripcion, id }));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to delete a product category.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the product category to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new Error("El id es un campo obligatorio");
    return res.status(200).json(await deleteProductCategory(id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default product_category_router;
