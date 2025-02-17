import { NextFunction, Response } from "express";
import { RequestWithUser } from "../../../src/infrastructure/types";
import { ApiResponse } from "../response/apiResponse";
import { StatusCodes } from "http-status-codes";

export default class ProductController {
  static async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(new ApiResponse<void>(req.t("product.created"), null));
    } catch (error) {
      next(error);
    }
  }
}
