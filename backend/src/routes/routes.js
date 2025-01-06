import express from "express"; // import express
import domain_router from "./domain/domain.routes.js";
import model_status_router from "./model_states/model_status.routes.js";
import auth_router from "./auth/auth.routes.js";

import {
  verifyTokenTimeout,
  checkAdminPermission,
} from "@middlewares/auth/auth.middleware.js";

const bundled_router = express.Router(); // create a router

bundled_router.get("/", (req, res) => {
  res.send("API works!");
});

bundled_router.use("/auth", auth_router);
// all this api routes must be protected by the operarios/admin role
bundled_router.use(
  "/states",
  verifyTokenTimeout,
  checkAdminPermission,
  model_status_router
);
bundled_router.use(domain_router);

export default bundled_router;
