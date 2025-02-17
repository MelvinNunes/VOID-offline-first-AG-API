import express from "express";
import HealthController from "../../interfaces/controllers/healthController";
import UserController from "../../interfaces/controllers/userController";
import AuthController from "../../interfaces/controllers/authController";
import ProductController from "../../../src/interfaces/controllers/productController";

import { authenticateToken } from "../middlewares/tokenAuthMiddleware";
import {
  LoginRequest,
  RegistrationRequest,
} from "../../interfaces/request/authenticationRequest";
import { validateData } from "../middlewares/requestValidationMiddleware";
import { ProductRequest } from "../../../src/interfaces/request/productRequest";
import { rateLimiter } from "../middlewares/rateLimiterMiddleware";

const router = express.Router();

router.get("/health", rateLimiter, HealthController.checkApiHealth);
router.post(
  "/login",
  rateLimiter,
  validateData(LoginRequest),
  AuthController.login
);
router.post(
  "/register",
  rateLimiter,
  validateData(RegistrationRequest),
  AuthController.register
);

router.get("/me", rateLimiter, authenticateToken, UserController.getOnlineUser);
router.get(
  "/users",
  rateLimiter,
  authenticateToken,
  UserController.getAllUsers
);

// Product Routes
router.post(
  "/products",
  rateLimiter,
  authenticateToken,
  validateData(ProductRequest),
  ProductController.create
);

module.exports = router;
