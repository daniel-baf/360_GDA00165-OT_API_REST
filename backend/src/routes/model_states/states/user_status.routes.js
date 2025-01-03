import express from "express";
import { user_status_controller as controller } from "@controllers/model_states/states/user_status.controller.js";

const user_status_router = express.Router();

user_status_router.post("/create", async (req, res) => {
  try {
    res.status(201).json(await controller.create(req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * List all status for the user
 */
user_status_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await controller.list(req.query));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Call the process to update the user status dta
 */
user_status_router.put("/update/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.update(req.params.id, req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Call the process to delete a user status
 */
user_status_router.delete("/delete/:id", async (req, res) => {
  try {
    res.status(200).json(await controller.delete(req.params.id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default user_status_router;
