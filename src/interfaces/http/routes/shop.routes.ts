import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { systemController } from "./shared";

export const shopRouter = Router();

shopRouter.get("/", asyncHandler(systemController.getCurrentShop));
shopRouter.post("/:itemId/purchase", asyncHandler(systemController.purchaseShopItem));
