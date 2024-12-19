import express from "express"; // import express
const bundled_router = express.Router(); // create a router

bundled_router.get("/", (req, res) => {
  res.send("API WORKNIG!"); // TODO: CHANGE THIS FOR USABLE DATA
});

export default bundled_router;
