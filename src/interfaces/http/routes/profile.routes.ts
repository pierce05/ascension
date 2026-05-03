import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const profileRouter = Router();

profileRouter.get("/current", asyncHandler(systemController.getCurrentProfile));
