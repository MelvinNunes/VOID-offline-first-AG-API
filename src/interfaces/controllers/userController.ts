import { NextFunction, Response } from "express";
import { UserServices } from "../../application/services/userService";
import {
  RequestWithUser,
  RequestWTranslation,
} from "../../infrastructure/types/index";
import { ApiResponse } from "../response/apiResponse";
import { UserVM } from "../response/user";
import { UserModel } from "../../../src/domain/models/user";
import { StatusCodes } from "http-status-codes";

export default class UserController {
  static async getAllUsers(req: RequestWTranslation, res: Response) {
    const start = Number.isNaN(Number(req.query.start))
      ? 0
      : Number(req.query.start);
    const limit = Number.isNaN(Number(req.query.limit))
      ? 10
      : Number(req.query.limit);

    const data = await UserServices.getAllUsers(start, limit);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse<UserModel[]>(StatusCodes.OK, req.t("user.all"), data)
      );
  }

  static async getOnlineUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const authUser = req.user;

    try {
      const userVM = await UserServices.getOnlineUserProfile(authUser);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse<UserVM>(
            StatusCodes.OK,
            req.t("profile.success"),
            userVM
          )
        );
    } catch (err) {
      next(err);
    }
  }
}
