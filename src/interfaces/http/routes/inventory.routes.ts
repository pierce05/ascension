import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const inventoryRouter = Router();

inventoryRouter.get("/", asyncHandler(systemController.getCurrentInventory));
