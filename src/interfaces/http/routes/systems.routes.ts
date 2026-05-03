import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const systemsRouter = Router();

systemsRouter.get("/current", asyncHandler(systemController.getCurrentSystem));
systemsRouter.patch("/theme", asyncHandler(systemController.updateTheme));
systemsRouter.post("/reset", asyncHandler(systemController.resetSystem));
