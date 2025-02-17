import { StatusCodes } from "http-status-codes";
import { HttpException } from "./config";

export class InternalServerError extends HttpException<void> {
  constructor() {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong! Our team is working to solve this as soon as possible."
    );
  }
}
