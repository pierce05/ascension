import { NextFunction, Request, Response } from "express";

export type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;
