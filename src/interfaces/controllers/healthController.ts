import { NextFunction, Response } from "express";
import { RequestWTranslation } from "../../infrastructure/types/index";
import { ApiResponse } from "../response/apiResponse";

export default class HealthController {
  static async checkApiHealth(
    req: RequestWTranslation,
    res: Response,
    next: NextFunction
  ) {
    try {
      return res.json(new ApiResponse<void>(req.t("health"), null));
    } catch (error) {
      next(error);
    }
  }
}
