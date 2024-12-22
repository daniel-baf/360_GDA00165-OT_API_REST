import express from "express";
import user_router from "./users/user.routes.js";
import product_router from "./product/product.routes.js";

const domain_router = express.Router();

// USER ROUTES
domain_router.use("/user", user_router);
// PRODUCT ROUTES
domain_router.use("/product", product_router);

export default domain_router;
