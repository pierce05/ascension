import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const bossesRouter = Router();

bossesRouter.get("/", asyncHandler(systemController.getCurrentBosses));
bossesRouter.post("/", asyncHandler(systemController.createBoss));
