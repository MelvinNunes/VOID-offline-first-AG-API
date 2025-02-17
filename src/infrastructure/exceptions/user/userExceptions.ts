import { StatusCodes } from "http-status-codes";
import { HttpException } from "../config";

export class UserNotFoundException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class UserWithEmailNotFoundException extends HttpException<void> {
  constructor(email: string) {
    super(
      StatusCodes.NOT_FOUND,
      `User with the email ${email} was not found in our services!`
    );
  }
}

export class UserWithEmailAlreadyExistsException extends HttpException<void> {
  constructor(email: string) {
    super(
      StatusCodes.CONFLICT,
      `User with email ${email} already exists in our platform!`
    );
  }
}
