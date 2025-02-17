import { StatusCodes } from "http-status-codes";
import { HttpException } from "../config";

export class BadCredentialsException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}
