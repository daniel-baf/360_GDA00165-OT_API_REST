import express from "express";
import {
  createUserStatus,
  updateUserStatus,
  listUserStatuses,
  deleteUserStatus,
} from "@models/model_states/user_status.dao.js";

const user_status_router = express.Router();

user_status_router.post("/create", async (req, res) => {
  let { nombre, descripcion } = req.body;
  try {
    if (!nombre || !descripcion) {
      throw new Error("Nombre y descripción son requeridos.");
    }
    const user_status = await createUserStatus(nombre, descripcion);
    res.status(201).json(user_status);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * List all status for the user
 */
user_status_router.get("/list", async (req, res) => {
  try {
    const user_statuses = await listUserStatuses();
    res.status(200).json(user_statuses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * List all users status on DB by limit and offset
 */
user_status_router.get("/list/:limit/:offset", async (req, res) => {
  const { limit, offset } = req.params;
  try {
    const user_statuses = await listUserStatuses(limit, offset);
    res.status(200).json(user_statuses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Call the process to update the user status dta
 */
user_status_router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const user_status = await updateUserStatus(id, nombre, descripcion);
    res.status(200).json(user_status);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user_status_router.delete("/delete/:id", async (req, res) => {
  let { id } = req.params;
  try {
    res.status(200).json(await deleteUserStatus(id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default user_status_router;
