/**
 * @fileoverview Routes for handling client directions.
 */

import express from "express";
import {
  createDirection,
  updateDirection,
  deleteDirection,
  listDirections,
} from "@models/user/direction/client_direction.dao.js";
const client_direction_router = express.Router();

/**
 * Route to create a new direction.
 * @name POST /create
 * @function
 * @memberof module:routes/domain/users/directions/client_direction.routes~client_direction_router
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves to sending the created direction.
 */
client_direction_router.post("/create", async (req, res) => {
  try {
    const directionData = req.body;
    res.status(201).json(await createDirection(directionData));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list all directions.
 * @name GET /list
 * @function
 * @memberof module:routes/domain/users/directions/client_direction.routes~client_direction_router
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves to sending the list of directions.
 */
client_direction_router.get("/list", async (req, res) => {
  try {
    const directions = await listDirections();
    res.status(200).json(directions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to list directions for a specific user.
 * @name GET /list/:usuario_id
 * @function
 * @memberof module:routes/domain/users/directions/client_direction.routes~client_direction_router
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves to sending the list of directions for the specified user.
 */
client_direction_router.get("/list/:user_id", async (req, res) => {
  try {
    let { user_id } = req.params;
    return res.status(200).json(await listDirections(user_id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to update a direction.
 * @name PUT /update/:id
 * @function
 * @memberof module:routes/domain/users/directions/client_direction.routes~client_direction_router
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves to sending the updated direction.
 */
client_direction_router.put("/update/:id", async (req, res) => {
  try {
    let update_form = req.body;
    update_form.id = parseInt(req.params.id);
    return res.status(200).json(await updateDirection(update_form));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to delete a direction.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:routes/domain/users/directions/client_direction.routes~client_direction_router
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves to sending a success message.
 */
client_direction_router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json(await deleteDirection(id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default client_direction_router;
