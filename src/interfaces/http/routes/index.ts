import { Router } from "express";
import { bossesRouter } from "./bosses.routes";
import { eventsRouter } from "./events.routes";
import { inventoryRouter } from "./inventory.routes";
import { profileRouter } from "./profile.routes";
import { projectsRouter } from "./projects.routes";
import { questsRouter } from "./quests.routes";
import { shopRouter } from "./shop.routes";
import { skillsRouter } from "./skills.routes";
import { systemsRouter } from "./systems.routes";

export const apiRouter = Router();

apiRouter.use("/systems", systemsRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/quests", questsRouter);
apiRouter.use("/bosses", bossesRouter);
apiRouter.use("/shop", shopRouter);
apiRouter.use("/skills", skillsRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/inventory", inventoryRouter);
