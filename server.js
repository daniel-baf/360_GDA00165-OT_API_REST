import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
// routes
import bundled_router from "./src/routes/routes.js";

// Load environment variables
const app = express(); // create express app
dotenv.config(); // load environment variables

app.set("port", process.env.SERVER_PORT || 3000); // set port to SERVER_PORT or default to 3000

// server attachments
app.use(morgan("dev")); // log requests to the console
app.use(cors()); // enable CORS for all requests
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
// sessions
// TODO? check if this is necessary and i need to use express session

// routes
app.use("/api", bundled_router); // use bundled router for all routes /api/<ENDPONIT_NAME>
const server = http.createServer(app); // create server
server
  .on("listening", () => {
    console.log(`Server is running on port ${app.get("port")}`); // use app.get("port") to log the correct port
  })
  .on("error", (err) => {
    console.error(err); // log error
    process.exit(1); // exit process
  });

server.listen(app.get("port")); // listen on port
