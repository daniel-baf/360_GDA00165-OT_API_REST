/**
 * Express router for user-related routes.
 * @module routes/domain/users/user.routes
 */

import express from "express";
import rol_router from "./rol/rol.routes.js";
import {
  listUsers,
  createUser,
  deleteUser,
  updateUser,
  searchUser,
  blockUserAccess,
  grantUserAccess,
} from "@models/user/user.dao.js";

const user_router = express.Router();

/**
 * Middleware to use rol routes.
 * @name /rol
 * @function
 * @memberof module:routes/domain/users/user.routes
 * @inner
 */
user_router.use("/rol", rol_router);

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
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
user_router.get("/list", async (req, res) => {
  try {
    return res.status(200).json(await listUsers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

user_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    limit = parseInt(limit) || null;
    offset = parseInt(offset) || 0;
    return res.status(200).json(await listUsers(limit, offset));
  } catch (error) {
    res.status(500).json({ error: error.message });
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
user_router.get("/search/", async (req, res) => {
  let { id, mail } = req.query; // req.params.id is a string
  try {
    if (!id && !mail) {
      throw new Error("Se requiere al menos un parametro para buscar");
    }

    return res.status(200).json(await searchUser(id, mail));
  } catch (error) {
    res.status(500).json({ error: error.message });
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
user_router.put("/update/:id", async (req, res) => {
  try {
    let update_data = req.body;
    // try to cast date if it is a
    if (!!update_data.fecha_nacimiento) {
      try {
        update_data.fecha_nacimiento = new Date(update_data.fecha_nacimiento);
        // check if the date is valid
        if (isNaN(update_data.fecha_nacimiento.getTime())) {
          throw new Error("Fecha de nacimiento invalida");
        }
      } catch (error) {
        throw new Error(
          "Error al intentar convertir la fecha de nacimiento " + error.message
        );
      }
    }

    const updatedUser = await updateUser(req.params.id, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
user_router.put("/block/:id", async (req, res) => {
  let id = req.params.id;
  try {
    if (!id) {
      throw new Error("Se requiere al menos un parametro para inhabilitar");
    }
    return res.json(await blockUserAccess(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
user_router.put("/unlock/:id", async (req, res) => {
  let id = req.params.id;
  try {
    if (!id) {
      throw new Error("Se requiere al menos un parametro para desbloquear");
    }
    return res.json(await grantUserAccess(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
user_router.delete("/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;
    return res.status(200).json(await deleteUser(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default user_router;
