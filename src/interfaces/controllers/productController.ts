import { NextFunction, Response } from "express";
import { RequestWithUser } from "../../../src/infrastructure/types";
import { ApiResponse } from "../response/apiResponse";
import { StatusCodes } from "http-status-codes";
import ProductService from "../../../src/application/services/productService";
import { ProductRequestData } from "../dtos/productDTO";

export default class ProductController {
  static async create(req: RequestWithUser, res: Response, next: NextFunction) {
    const data: ProductRequestData = req.body;
    try {
      await ProductService.createProduct(req.user, data);
      return res
        .status(StatusCodes.CREATED)
        .json(new ApiResponse<void>(req.t("product.created"), null));
    } catch (error) {
      next(error);
    }
  }
}
