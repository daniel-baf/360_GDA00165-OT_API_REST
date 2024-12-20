import express from "express";
import user_status_router from "./states/user_status.routes.js";
import order_status_router from "./states/order_status.routes.js";

const model_status_router = express.Router();

// Import the user_status routes -> /api/states/user
model_status_router.use("/user", user_status_router);
// order status routes -> /api/states/order
model_status_router.use("/order", order_status_router);

export default model_status_router;
