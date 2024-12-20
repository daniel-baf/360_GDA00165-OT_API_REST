import express from "express";
import {
  createRol,
  listRol,
  updateRol,
  deleteRol,
} from "@models/rol/rol.dao.js";

const rol_router = express.Router();
async function listRolManager(limit = null, offset = 0) {
  return await listRol(limit, offset);
}

/**
 * Create a new rol in the DB
 */
rol_router.post("/create", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    res.status(200).json(await createRol({ nombre, descripcion }));
  } catch (error) {
    res.status(500).send("Error creando rol: " + error.message);
  }
});

/**
 * Get all roles
 */
rol_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await listRol());
  } catch (error) {
    res.status(500).send("Error listando roles: " + error.message);
  }
});

/**
 * Get all roles with pagination, limit and offset can be null
 */
rol_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    offset = Number(offset) || 0; // manage possible null parameter
    limit = Number(limit) || null; // manage possible null parameter
    res.status(200).json(await listRolManager(limit, offset));
  } catch (error) {
    res.status(500).send("Error listando roles: " + error.message);
  }
});

/**
 * Update the value of a role
 */
rol_router.put("/update/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = { id, ...req.body }; // req.body contain multiple data to replacementes
    return res.status(200).json(await updateRol(data));
  } catch (error) {
    res.status(500).send("Error actualizando rol: " + error.message);
  }
});

/**
 * Delete a role from the DB
 */
rol_router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json(await deleteRol(id));
  } catch (error) {
    res.status(500).send("Error eliminando rol: " + error.message);
  }
});

export default rol_router;
