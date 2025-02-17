import { StatusCodes } from "http-status-codes";
import { HttpException } from "../config";

export class ProfileNotFoundException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
