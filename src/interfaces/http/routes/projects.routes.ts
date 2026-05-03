import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const projectsRouter = Router();

projectsRouter.get("/", asyncHandler(systemController.getCurrentProjects));
projectsRouter.patch("/:projectId", asyncHandler(systemController.updateProject));
