import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const eventsRouter = Router();

eventsRouter.post("/dismiss", asyncHandler(systemController.dismissActiveEvent));
