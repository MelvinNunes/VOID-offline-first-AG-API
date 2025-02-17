import { Response } from "express";
import { AuthUser, RequestWithUser } from "../../infrastructure/types";
import { StatusCodes } from "http-status-codes";
const jwt = require("jsonwebtoken");

function authenticateToken(req: RequestWithUser, res: Response, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: req.t("auth.token_not_found"),
    });

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: AuthUser) => {
      if (err)
        return res.status(StatusCodes.FORBIDDEN).json({
          message: req.t("auth.token_not_valid"),
        });
      req.user = user;
      next();
    }
  );
}

export { authenticateToken };
