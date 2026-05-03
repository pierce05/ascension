import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const questsRouter = Router();

questsRouter.get("/", asyncHandler(systemController.getCurrentQuests));
questsRouter.post("/", asyncHandler(systemController.createQuest));
questsRouter.post("/:questId/complete", asyncHandler(systemController.completeQuest));
