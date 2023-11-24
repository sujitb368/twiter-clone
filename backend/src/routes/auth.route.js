
// Import necessary modules and controllers for managing users
import express from "express";
import { login, register } from "../controllers/auth.controller.js";

//router object
const router = express.Router();

//user creation routes | signup
router.post("/register", register);

//login user routes
router.post("/login", login);

export default router;