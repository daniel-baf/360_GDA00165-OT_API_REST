import express from "express";
import { rolController as controller } from "@controllers/domain/users/rol/rol.controller.js";

const rol_router = express.Router();

/**
 * Create a new rol in the DB
 */
rol_router.post("/create", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    res.status(201).json(await controller.create(nombre, descripcion));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Get all roles
 */
rol_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await controller.list());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Get all roles with pagination, limit and offset can be null
 */
rol_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    res.status(200).json(await controller.listLimitOffset(limit, offset));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Update the value of a role
 */
rol_router.put("/update/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = { id, ...req.body }; // req.body contain multiple data to replacementes
    return res.status(200).json(await controller.update(data));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Delete a role from the DB
 */
rol_router.delete("/delete/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.delete(req.params.id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default rol_router;
