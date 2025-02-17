import { NextFunction, Response, Request } from "express";
import { UserServices } from "../../application/services/userService";
import { RequestWithUser } from "../../infrastructure/types/index";
import { ApiResponse } from "../response/apiResponse";
import { UserVM } from "../response/user";
import { UserModel } from "../../../src/domain/models/user";

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const data = await UserServices.getAllUsers(
      Number(req.query.start),
      Number(req.query.limit)
    ); // we could handle this better, NaN may occur
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
