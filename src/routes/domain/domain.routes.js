import express from "express";
import rol_router from "./rol/rol.routes.js";

const domain_router = express.Router();

// ROL ROUTES
domain_router.use("/rol", rol_router);

export default domain_router;
