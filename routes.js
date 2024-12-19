import express from "express"; // import express
const bundled_router = express.Router(); // create a router

import { testConnection } from "./src/model/database/sequelize_orm.model.js";

testConnection();

export default bundled_router;
