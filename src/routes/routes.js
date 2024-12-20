import express from "express"; // import express
import domain_router from "./domain/domain.routes.js";
import model_status_router from "./model_states/model_status.routes.js";

const bundled_router = express.Router(); // create a router

bundled_router.get("/", (req, res) => {
  res.send("API works!");
});

bundled_router.use(domain_router);
bundled_router.use("/states", model_status_router);

export default bundled_router;
