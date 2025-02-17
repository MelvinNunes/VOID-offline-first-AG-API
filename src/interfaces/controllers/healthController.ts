import { NextFunction, Response } from "express";
import { RequestWTranslation } from "../../infrastructure/types/index";
import { ApiResponse } from "../response/apiResponse";
import { StatusCodes } from "http-status-codes";

export default class HealthController {
  static async checkApiHealth(
    req: RequestWTranslation,
    res: Response,
    next: NextFunction
  ) {
    try {
      return res.json(
        new ApiResponse<void>(StatusCodes.OK, req.t("health"), null)
      );
    } catch (error) {
      next(error);
    }
  }
}
