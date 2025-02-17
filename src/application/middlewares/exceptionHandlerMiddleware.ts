import { HttpException } from "../../infrastructure/exceptions/config";
import { logger } from "../../infrastructure/config/logger";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function exceptionHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error caught by middleware:", error);

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      data: error.data,
    });
  }

  return res.status(500).json({
    status: "error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message:
      "Something went wrong! Our team is working to solve this as soon as possible.",
  });
}
