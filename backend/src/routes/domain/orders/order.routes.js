import express from "express";
import orderController from "@controllers/domain/orders/order.controller.js";
import { checkAdminPermission } from "@middlewares/auth/auth.middleware.js";

const order_router = express.Router();

/**
 * Endpoint to list all orders. the path is /api/orders/list, and is accessed by an admin user.
 * Filters are passed as query parameters.
 */
order_router.get("/list", async (req, res) => {
  try {
    return res
      .status(200)
      .json(await orderController.listAll(req.query, req.user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Query parameter to determine if detailed information is requested.
 * This does not implement the middleware to check if the user is the owner of the order.
 * but internally the controller check if the person requesting the order is the owner.
 * or an admin user.
 * @type {string}
 */
/**
 * @description Retrieves the 'detailed' query parameter from the request.
 * @type {string}
 */
order_router.get("/search/:id", async (req, res) => {
  try {
    let detailed = req.query.detailed;
    let id = parseInt(req.params.id);
    return res
      .status(200)
      .json(await orderController.search(id, detailed, req.user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Endpoint to create an order. the path is /api/orders/create, and is accessed by an admin user.
 */
order_router.post("/create", async (req, res) => {
  try {
    return res.status(201).json(await orderController.create(req.body));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Endpoint to delete an order. the path is /api/orders/delete/:id, and is accessed by an admin user.
 */
order_router.delete("/delete/:id", async (req, res) => {
  try {
    return res
      .status(200)
      .json(await orderController.delete({ ...req.params, user: req.user }));
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

/**
 *
 * params must be id and status
 *  */
order_router.put("/swapState", checkAdminPermission, async (req, res) => {
  try {
    return res.status(200).json(await orderController.swapState(req.query));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

order_router.put("/update/:id", checkAdminPermission, async (req, res) => {
  try {
    return res.status(200).json(
      await orderController.update({
        ...req.params,
        products: req.body,
      })
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default order_router;
