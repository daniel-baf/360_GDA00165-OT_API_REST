import express from "express"; // import express
import domain_router from "./domain/domain.routes.js";

const bundled_router = express.Router(); // create a router

bundled_router.get("/", (req, res) => {
  res.send("API works!");
});

bundled_router.use(domain_router)

export default bundled_router;
