import express from "express";
import user_status_router from "./states/user_status.routes.js";

const model_status_router = express.Router();

// Import the user_status routes -> /api/states/user
model_status_router.use("/user", user_status_router);

export default model_status_router;
