/**
 * Express router for user-related routes.
 * This router handles the following routes:
 * - /rol: Routes related to user roles.
 * - /direction: Routes related to client directions.
 * - /create: Route to create a new user.
 * - /list: Route to list all users, excluding passwords.
 * - /list/:limit/:offset: Route to list users with pagination.
 * - /search: Route to search for a user by ID or email.
 * - /update/:id: Route to update an existing user by ID.
 * - /block/:id: Route to disable a user by ID.
 * - /unlock/:id: Route to unlock a user by ID.
 * - /delete/:id: Route to delete a user by ID.
 *
 * @module routes/domain/users/user.routes
 */

import { userController as controller } from "@controllers/domain/users/user.controller.js";
import client_direction_router from "./directions/client_direction.routes.js";
import rol_router from "./rol/rol.routes.js";
import {
  verifyTokenTimeout,
  checkAdminPermission,
} from "@middlewares/auth/auth.middleware.js";
import express from "express";

const user_router = express.Router();
const private_router_user = express.Router();

/**
 * routers to use rol routes.
 * @name /rol
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 */
private_router_user.use("/rol", checkAdminPermission, rol_router);

/**
 * Router to use rol routes.
 * @name /direction
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 */
private_router_user.use("/direction", client_direction_router);

/**
 * Route to list all users. exclude the passwords
 * @name /list
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.get("/list", checkAdminPermission, async (req, res) => {
  try {
    return res.status(200).json(await controller.list(req.query, req.user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to search for a user by ID. at least 1 parameter is required, if both are provided,
 * the search will be done by ID.
 * @name /search/
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.get("/search/", async (req, res) => {
  try {
    return res.status(200).json(await controller.search(req.query));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to update an existing user by ID.
 * @name /update/:id
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.put("/update/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.update(req.params.id, req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to disable a user by ID or email.
 * @name /disable
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.put(
  "/block/:id",
  checkAdminPermission,
  async (req, res) => {
    try {
      return res.json(await controller.block(req.params.id));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Route to unlock a user by ID.
 * @name /unlock/:id
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.put(
  "/unlock/:id",
  checkAdminPermission,
  async (req, res) => {
    try {
      return res.json(await controller.unlock(req.params.id));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Route to delete a user by ID.
 * @name /delete/:id
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
private_router_user.delete(
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

/**
 * Route to create a new user.
 * @name /create
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 * @param {Object} req - Express request object. must contain all the not null fields of the user model.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
user_router.post("/create", async (req, res) => {
  try {
    const token = req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : null;
    // req.user can be null if not logged in
    return res.status(201).json(await controller.create(req.body, token));
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

// TODO Implmente this
user_router.put("/verify", async (req, res) => {
  try {
    return res.status(200).json(await controller.verify(req.id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// custom filters
user_router.use(verifyTokenTimeout, private_router_user);

export default user_router;
