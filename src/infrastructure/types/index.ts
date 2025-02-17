import { Request } from "express";
import { TFunction } from "i18next";

export type AuthUser = {
  name: string;
  iat: string;
  exp: string;
};

export class ApplicationException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = "ApplicationException";
  }
}

export type File = {
  fieldname: string;
  originalname: string;
  enconding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export interface RequestWithUser extends Request {
  user?: AuthUser;
  t?: TFunction;
}

export interface RegisterRequest extends Request {
  file: File;
  t?: TFunction;
}

export interface RegisterWithUserAndFile extends Request {
  file: File;
  user?: AuthUser;
  t?: TFunction;
}

export interface RequestWTranslation extends Request {
  t?: TFunction;
}
