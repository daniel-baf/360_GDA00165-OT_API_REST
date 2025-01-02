import express from "express";
import { checkAdminPermission } from "@middlewares/auth/auth.middleware.js";
import { productCategoryController as controller } from "@controllers/domain/product/category/product_category.controller.js";

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
    return res.status(201).json(await controller.create(req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list all product categories. all user can check the categories.
 * @name GET /list
 * @function
 * @memberof module:routes/domain/product/category/product_category.routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
product_category_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await controller.list(req.query));
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
product_category_router.put(
  "/update/:id",
  checkAdminPermission,
  async (req, res) => {
    try {
      return res
        .status(200)
        .json(await controller.update({ ...req.params, ...req.body }));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

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
product_category_router.delete(
  "/delete/:id",
  checkAdminPermission,
  async (req, res) => {
    try {
      return res.status(200).json(await controller.delete(req.params.id));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

export default product_category_router;
