/**
 * @fileoverview Routes for handling order status operations.
 */

import express from "express";
import {
  createOrderStatus,
  listOrderStatuses,
  updateOrderStatus,
  deleteOrderStatus,
} from "@models/model_states/order_status.dao.js";

const order_status_router = express.Router();

/**
 * Route to create a new order status.
 * @name POST /create
 * @function
 * @memberof module:order_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} 201 - The created order status.
 * @returns {Promise<void>} 400 - Error message if the request body is invalid.
 * @returns {Promise<void>} 500 - Error message if unable to create the order status.
 */
order_status_router.post("/create", async (req, res) => {
  try {
    let { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");

    res.status(201).json(await createOrderStatus(nombre, descripcion));
  } catch (error) {
    res
      .status(500)
      .send(`No ha sido posible crear el estado de orden: ${error}`);
  }
});

/**
 * Route to list all order statuses.
 * @name GET /list
 * @function
 * @memberof module:order_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} 200 - An array of order statuses.
 * @returns {Promise<void>} 500 - Error message if unable to retrieve order statuses.
 */
order_status_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await listOrderStatuses());
  } catch (error) {
    req
      .status(500)
      .send(`No ha sido posible recuperar los estados de ordenes: ${error}`);
  }
});

/**
 * Route to list order statuses with pagination.
 * @name GET /list/:limit/:offset
 * @function
 * @memberof module:order_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {number} req.params.limit - The maximum number of order statuses to return.
 * @param {number} req.params.offset - The number of order statuses to skip before starting to collect the result set.
 * @returns {Promise<void>} 200 - An array of order statuses.
 * @returns {Promise<void>} 500 - Error message if unable to retrieve order statuses.
 */
order_status_router.get("/list/:limit/:offset", async (req, res) => {
  const { limit, offset } = req.params;
  try {
    res.status(200).json(await listOrderStatuses(limit, offset));
  } catch (error) {
    res
      .status(500)
      .send(`No ha sido posible recuperar los estados de ordenes: ${error}`);
  }
});

/**
 * Route to update an existing order status.
 * @name PUT /update/:id
 * @function
 * @memberof module:order_status_router
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {string} req.params.id - The ID of the order status to update.
 * @returns {Promise<void>} 200 - The updated order status.
 * @returns {Promise<void>} 400 - Error message if the request body is invalid.
 * @returns {Promise<void>} 404 - Error message if the order status is not found.
 * @returns {Promise<void>} 500 - Error message if unable to update the order status.
 */
order_status_router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    res.status(200).json(await updateOrderStatus(id, nombre, descripcion));
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send(`Datos inválidos: ${error.message}`);
    } else {
      res
        .status(error)
        .send(`No ha sido posible actualizar el estado de orden: ${error}`);
    }
  }
});

order_status_router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.status(200).json(await deleteOrderStatus(id));
  } catch (error) {
    res
      .status(error.name === "ValidationError" ? 400 : 500)
      .send(`No ha sido posible eliminar el estado de orden: ${error}`);
  }
});

export default order_status_router;
