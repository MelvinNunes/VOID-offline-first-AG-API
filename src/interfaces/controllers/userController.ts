import { NextFunction, Response, Request } from "express";
import { UserServices } from "../../application/services/userService";
import { RequestWithUser } from "../../infrastructure/types/index";
import { ApiResponse } from "../response/apiResponse";
import { UserVM } from "../response/user";
import { UserModel } from "../../../src/domain/models/user";

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const start = Number.isNaN(Number(req.query.start))
      ? 0
      : Number(req.query.start);
    const limit = Number.isNaN(Number(req.query.limit))
      ? 10
      : Number(req.query.limit);

    const data = await UserServices.getAllUsers(start, limit);
    return res
      .status(200)
      .json(new ApiResponse<UserModel[]>("All users", data));
  }

  static async getOnlineUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const authUser = req.user;

    try {
      const userVM = await UserServices.getOnlineUser(authUser);
      return res
        .status(200)
        .json(new ApiResponse<UserVM>(req.t("profile.success"), userVM));
    } catch (err) {
      next(err);
    }
  }
}
