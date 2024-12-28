import express from "express";

import { validateLogin } from "@controllers/auth/auth.controller.js";

const auth_router = express.Router();

/**
 * POST / -> /api/auth
 *
 * This route handles user login requests. It expects an email and password in the request body,
 * and uses the validateLogin function to authenticate the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user attempting to log in.
 * @param {string} req.body.password - The password of the user attempting to log in.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - Returns a JSON response with the result of the validateLogin function,
 * or an error message with a 500 status code if an error occurs.
 */
auth_router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    res.json(await validateLogin(email, password));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default auth_router;
