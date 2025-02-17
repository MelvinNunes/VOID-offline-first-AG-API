import { StatusCodes } from "http-status-codes";
import { HttpException } from "../config";

export class ProductNotFoundException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class CannotHaveActionInProductException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, message);
  }
}

export class BadRequestCreatingProductException extends HttpException<void> {
  constructor() {
    super(
      StatusCodes.BAD_REQUEST,
      "Please validate your request, something is missing."
    );
  }
}
