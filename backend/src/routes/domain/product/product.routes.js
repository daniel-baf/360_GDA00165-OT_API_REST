/**
 * Express router for handling product-related routes.
 * @module routes/domain/product/product.routes
 */

import express from "express";
import { checkAdminPermission } from "@middlewares/auth/auth.middleware.js";
import { productController as controller } from "@controllers/domain/product/product.controller.js";
import product_category_router from "./category/product_category.routes.js";

const product_router = express.Router();

/**
 * Middleware to use product category routes.
 * @name /category
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 */
product_router.use("/category", product_category_router);

/**
 * Route to create a new product.
 * @name POST /create
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} The created product.
 */
product_router.post("/create", checkAdminPermission, async (req, res) => {
  try {
    return res.status(201).json(await controller.create(req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list all products. sned in the query the status_id to filter by status.
 * Or null to get all products.
 * @name GET /list
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} The list of products.
 */
product_router.get("/list", async (req, res) => {
  try {
    let { status_id } = req.query;
    res
      .status(200)
      .json(await controller.list({ status_id: status_id ? status_id : null }));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list products with pagination.
 * @name GET /list/:limit/:offset
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.limit - The limit of products to return.
 * @param {string} req.params.offset - The offset of products to return.
 * @returns {JSON} The list of products.
 */
product_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    let { status_id = null } = req.query;
    res
      .status(200)
      .json(await controller.listLimitOffset({ limit, offset, status_id }));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to search for a product by ID.
 * @name GET /search/:id
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.id - The ID of the product to search for.
 * @returns {JSON} The found product.
 */
product_router.get("/search/:id", async (req, res) => {
  try {
    let { id } = req.params;
    return res.status(200).json(await controller.search(id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to update a product by ID.
 * @name PUT /update/:id
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.id - The ID of the product to update.
 * @returns {JSON} The updated product.
 */
product_router.put("/update/:id", checkAdminPermission, async (req, res) => {
  try {
    res
      .status(200)
      .json(await controller.update({ id: req.params.id, ...req.body }));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to change the status of a product by ID.
 * @name PUT /status/change/
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.query.id - The ID of the product to update.
 * @param {string} req.query.estado_producto_id - The ID of the new status.
 * @returns {JSON} The updated product.
 *
 */
product_router.put(
  "/status/change/",
  checkAdminPermission,
  async (req, res) => {
    try {
      res.status(200).json(await controller.changeStatus(req.query));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Route to delete a product by ID.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:routes/domain/product/product.routes~product_router
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.id - The ID of the product to delete.
 * @returns {JSON} The deleted product.
 */
product_router.delete("/delete/:id", checkAdminPermission, async (req, res) => {
  try {
    res.status(200).json(await controller.delete(req.params.id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default product_router;
