import express from "express";
import user_router from "./users/user.routes.js";

const domain_router = express.Router();

// USER ROUTES
domain_router.use("/user", user_router);

export default domain_router;
