import express from "express";
import { validateLogin } from "@services/auth/auth.service.js";

const auth_router = express.Router();

auth_router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    res.json(await validateLogin(email, password));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default auth_router;
