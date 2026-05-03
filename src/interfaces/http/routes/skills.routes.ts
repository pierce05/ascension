import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const skillsRouter = Router();

skillsRouter.get("/", asyncHandler(systemController.getCurrentSkills));
