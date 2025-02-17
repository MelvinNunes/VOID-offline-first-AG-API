import { NextFunction, Response } from "express";
import { RequestWithUser } from "../../../src/infrastructure/types";
import { ApiResponse } from "../response/apiResponse";
import { StatusCodes } from "http-status-codes";
import ProductService from "../../../src/application/services/productService";
import {
  ProductCreateRequestData,
  ProductUpdateRequestData,
} from "../dtos/productDTO";
import { ProductModel } from "../../../src/domain/models/product";

export default class ProductController {
  static async create(req: RequestWithUser, res: Response, next: NextFunction) {
    const data: ProductCreateRequestData = req.body;
    try {
      await ProductService.createProduct(req.user, data);
      return res
        .status(StatusCodes.CREATED)
        .json(
          new ApiResponse<void>(
            StatusCodes.CREATED,
            req.t("product.created"),
            null
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req: RequestWithUser, res: Response, next: NextFunction) {
    const data: ProductUpdateRequestData = req.body;
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.user,
        data
      );
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse<ProductModel>(
            StatusCodes.OK,
            req.t("product.updated"),
            product
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
    const start = Number.isNaN(Number(req.query.start))
      ? 0
      : Number(req.query.start);
    const limit = Number.isNaN(Number(req.query.limit))
      ? 10
      : Number(req.query.limit);
    try {
      const data = await ProductService.getAllProducts(req.user, start, limit);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse<ProductModel[]>(
            StatusCodes.OK,
            req.t("product.all"),
            data
          )
        );
    } catch (err) {
      next(err);
    }
  }

  static async details(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const productId = req.params.id;
    try {
      const data = await ProductService.getProductDetails(req.user, productId);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse<ProductModel>(
            StatusCodes.OK,
            req.t("product.details"),
            data
          )
        );
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: RequestWithUser, res: Response, next: NextFunction) {
    const productId = req.params.id;
    try {
      await ProductService.deleteProduct(req.user, productId);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse<void>(StatusCodes.OK, req.t("product.deleted"), null)
        );
    } catch (err) {
      next(err);
    }
  }
}
