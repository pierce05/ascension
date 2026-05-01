import { NextFunction, Request, Response } from "express";
import { AsyncRequestHandler } from "../../../core/types/http";

export const asyncHandler =
  (handler: AsyncRequestHandler) =>
  (request: Request, response: Response, next: NextFunction): void => {
    handler(request, response, next).catch(next);
  };
