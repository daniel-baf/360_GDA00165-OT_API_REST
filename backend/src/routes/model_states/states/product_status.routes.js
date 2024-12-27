import express from "express";
import {
  createProductStatus,
  listProductStatus,
  updateProductStatus,
  deleteProductStatus,
} from "@models/model_states/product_status.dao.js";

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
    let { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");
   
    return res.status(201).json(await createProductStatus(nombre, descripcion));
  } catch (error) {
    res
      .status(500)
      .send(`No ha sido posible crear el estado de producto: ${error}`);
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
    res.status(200).json(await listProductStatus());
  } catch (error) {
    res
      .status(500)
      .send(`${error.message}`);
  }
});

/**
 * Route to list product statuses with pagination.
 * @name GET /list/:limit/:offset
 * @function
 * @memberof module:product_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {number} req.params.limit - The maximum number of product statuses to return.
 * @param {number} req.params.offset - The number of product statuses to skip before starting to collect the result set.
 * @returns {Promise<void>} 200 - An array of product statuses.
 * @returns {Promise<void>} 500 - Error message if unable to retrieve product statuses.
 */
product_status_router.get("/list/:limit/:offset", async (req, res) => {
  const { limit, offset } = req.params;
  try {
    res.status(200).json(await listProductStatus(limit, offset));
  } catch (error) {
    res
      .status(500)
      .send(`${error.message}`);
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
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    res.status(200).json(await updateProductStatus(id, nombre, descripcion));
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send(`Datos inválidos: ${error.message}`);
    } else {
      res
        .status(error)
        .send(`No ha sido posible actualizar el estado de producto: ${error}`);
    }
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
  const { id } = req.params;
  try {
    res.status(200).json(await deleteProductStatus(id));
  } catch (error) {
    res
      .status(error.name === "ValidationError" ? 400 : 500)
      .send(`${error.message}`);
  }
});

export default product_status_router;
