import express from "express";
import product_category_router from "./category/product_category.routes.js";

const product_router = express.Router();



// category routes -> /api/product/category
product_router.use("/category", product_category_router);

export default product_router;
