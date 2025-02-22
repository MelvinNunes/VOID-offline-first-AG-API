import { NextFunction, Response } from "express";
import { UserServices } from "../../application/services/userService";
import AuthService from "../../application/services/authService";

import {
  RegisterRequest,
  RequestWTranslation,
} from "../../infrastructure/types/index";
import { Role } from "@prisma/client";
import { Login, Register } from "../dtos/authDTO";
import { ApiResponseWithToken } from "../response/apiResponse";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
  static async login(
    req: RequestWTranslation,
    res: Response,
    next: NextFunction
  ) {
    const data: Login = req.body;
    try {
      const token = await AuthService.login(data);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponseWithToken<void>(
            StatusCodes.OK,
            token,
            req.t("auth.success"),
            null
          )
        );
    } catch (err) {
      next(err);
    }
  }

  static async register(
    req: RegisterRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: Register = req.body;
      const role: Role = req.body.type;
      await UserServices.createUser(data, role);
      const token = AuthService.generateAccessToken(data.email);

      return res
        .status(StatusCodes.CREATED)
        .json(
          new ApiResponseWithToken<void>(
            StatusCodes.CREATED,
            token,
            req.t("user.created"),
            null
          )
        );
    } catch (error) {
      next(error);
    }
  }
}
