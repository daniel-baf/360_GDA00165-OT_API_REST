import express from "express";
import { product_status_controller as controller } from "@controllers/model_states/states/product_status.controller.js";

const product_status_router = express.Router();

/**
 * Route to create a new product status.
 * @name POST /create
 * @function
 * @memberof module:product_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} 201 - The created product status.
 * @returns {Promise<void>} 400 - Error message if the request body is invalid.
 * @returns {Promise<void>} 500 - Error message if unable to create the product status.
 */
product_status_router.post("/create", async (req, res) => {
  try {
    return res.status(201).json(await controller.create(req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list all product statuses.
 * @name GET /list
 * @function
 * @memberof module:product_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} 200 - An array of product statuses.
 * @returns {Promise<void>} 500 - Error message if unable to retrieve product statuses.
 */
product_status_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await controller.list(req.query));
  } catch (error) {
    res.status(500).send(error.message);
  }
});


/**
 * Route to update an existing product status.
 * @name PUT /update/:id
 * @function
 * @memberof module:product_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {string} req.params.id - The ID of the product status to update.
 * @returns {Promise<void>} 200 - The updated product status.
 * @returns {Promise<void>} 400 - Error message if the request body is invalid.
 * @returns {Promise<void>} 404 - Error message if the product status is not found.
 * @returns {Promise<void>} 500 - Error message if unable to update the product status.
 */
product_status_router.put("/update/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.update(req.params.id, req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to delete a product status.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:product_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {string} req.params.id - The ID of the product status to delete.
 * @returns {Promise<void>} 200 - The deleted product status.
 * @returns {Promise<void>} 400 - Error message if the request body is invalid.
 * @returns {Promise<void>} 500 - Error message if unable to delete the product status.
 */
product_status_router.delete("/delete/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.delete(req.params.id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default product_status_router;
