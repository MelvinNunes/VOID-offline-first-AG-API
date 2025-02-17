import express from "express";
import HealthController from "../../interfaces/controllers/healthController";
import UserController from "../../interfaces/controllers/userController";

import { authenticateToken } from "../middlewares/tokenAuthMiddleware";
import AuthController from "../../interfaces/controllers/authController";
import {
  LoginRequest,
  RegistrationRequest,
} from "../../interfaces/request/authenticationRequest";
import { validateData } from "../middlewares/requestValidationMiddleware";

const router = express.Router();

router.get("/health", HealthController.checkApiHealth);
router.post("/login", validateData(LoginRequest), AuthController.login);
router.post(
  "/register",
  validateData(RegistrationRequest),
  AuthController.register
);

router.get("/me", authenticateToken, UserController.getOnlineUser);
router.get("/users", authenticateToken, UserController.getAllUsers);

module.exports = router;
