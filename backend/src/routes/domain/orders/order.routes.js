import express from "express";
import { checkAdminPermission } from "@middlewares/auth/auth.middleware.js";
import orderController from "@controllers/domain/orders/order.controller.js";

const order_router = express.Router();

/**
 * Endpoint to list all orders. the path is /api/orders/list, and is accessed by an admin user.
 */
order_router.get("/list", checkAdminPermission, async (req, res) => {
  try {
    let detailed = req.query.detailed;
    return res
      .status(200)
      .json(await orderController.listAll(detailed, req.user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 *  * Endpoint to list all orders with limit and offset. the path is /api/orders/list, and is accessed by an admin user.
 */
order_router.get(
  "/list/:limit/:offset",
  checkAdminPermission,
  async (req, res) => {
    try {
      let detailed = req.query.detailed;
      let limit = parseInt(req.params.limit);
      let offset = parseInt(req.params.offset);
      return res
        .status(200)
        .json(
          await orderController.listAllLimitOffset(detailed, limit, offset)
        );
    } catch (error) {
      res.status(500).send(`Unable to retrieve orders: ${error}`);
    }
  }
);

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
order_router.delete("/delete/:id", checkAdminPermission, async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    return res.status(200).json(await orderController.delete(id));
  } catch (error) {
    res.status(500).send(`Unable to delete the order: ${error}`);
  }
});

export default order_router;
