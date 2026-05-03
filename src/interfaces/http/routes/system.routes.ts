import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { SystemController } from "../../../modules/system/interfaces/http/system-controller";
import { SystemService } from "../../../modules/system/application/services/system-service";
import { InMemorySystemRepository } from "../../../modules/system/infrastructure/repositories/in-memory-system-repository";

const systemRepository = new InMemorySystemRepository();
const systemService = new SystemService(systemRepository);
const systemController = new SystemController(systemService);

export const systemRouter = Router();

systemRouter.get("/current", asyncHandler(systemController.getCurrentSystem));
systemRouter.patch("/theme", asyncHandler(systemController.updateTheme));
systemRouter.post("/quests", asyncHandler(systemController.createQuest));
systemRouter.post("/quests/:questId/complete", asyncHandler(systemController.completeQuest));
systemRouter.post("/bosses", asyncHandler(systemController.createBoss));
systemRouter.post("/shop/:itemId/purchase", asyncHandler(systemController.purchaseShopItem));
systemRouter.post("/events/dismiss", asyncHandler(systemController.dismissActiveEvent));
systemRouter.post("/reset", asyncHandler(systemController.resetSystem));
