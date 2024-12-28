/**
 * @fileoverview Routes for handling client directions.
 */

import express from "express";
import { checkAdminPermission } from "@middlewares/auth/auth.middleware.js";
import { client_direction_controller as controller } from "@controllers/domain/users/directions/client_direction.controller.js";

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
    res.status(201).json(await controller.create(req.body, req.user));
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
client_direction_router.get("/list", checkAdminPermission, async (req, res) => {
  try {
    res.status(200).json(await controller.list());
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
    return res
      .status(200)
      .json(await controller.listByUser(req.params.user_id, req.user));
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
    return res
      .status(200)
      .json(
        await controller.update(
          { ...update_form, id: parseInt(req.params.id) },
          req.user
        )
      );
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
    return res
      .status(200)
      .json(await controller.delete(req.params.id, req.user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default client_direction_router;
