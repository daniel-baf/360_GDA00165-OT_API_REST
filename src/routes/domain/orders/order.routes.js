import express from "express";
import {
  listOrders,
  searchOrder,
  createOrder,
  deleteOrder,
} from "@models/oders/order.dao.js";

const order_router = express.Router();

order_router.get("/list", async (req, res) => {
  try {
    let detailed = req.query.detailed;
    return res.status(200).json(await listOrders(detailed));
  } catch (error) {
    res.status(500).send(`Unable to retrieve orders: ${error}`);
  }
});

order_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let detailed = req.query.detailed;
    let limit = parseInt(req.params.limit);
    let offset = parseInt(req.params.offset);
    return res.status(200).json(await listOrders(detailed, limit, offset));
  } catch (error) {
    res.status(500).send(`Unable to retrieve orders: ${error}`);
  }
});

order_router.get("/search/:id", async (req, res) => {
  try {
    let detailed = req.query.detailed;
    let id = parseInt(req.params.id);
    return res.status(200).json(await searchOrder(id, detailed));
  } catch (error) {
    res.status(500).send(`Unable to retrieve the order: ${error}`);
  }
});

order_router.post("/create", async (req, res) => {
  try {
    return res.status(201).json(await createOrder(req.body));
  } catch (error) {
    res.status(500).send(`Unable to create the order: ${error}`);
  }
});

order_router.delete("/delete/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    return res.status(200).json(await deleteOrder(id));
  } catch (error) {
    res.status(500).send(`Unable to delete the order: ${error}`);
  }
});

export default order_router;
