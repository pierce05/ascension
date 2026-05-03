import { Request, Response } from "express";
import { SystemService } from "../../application/services/system-service";

export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  private getSingleParam(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
      return value[0] ?? "";
    }

    return value ?? "";
  }

  public getCurrentSystem = async (_request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.getCurrentSystem();
    response.status(200).json({ data: system });
  };

  public getCurrentProfile = async (_request: Request, response: Response): Promise<void> => {
    const profile = await this.systemService.getCurrentProfile();
    response.status(200).json({ data: profile });
  };

  public updateProfile = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.updateProfile({
      profileName: request.body.profileName,
      title: request.body.title,
      className: request.body.className,
      username: request.body.username,
      quote: request.body.quote,
      bio: request.body.bio,
      guild: request.body.guild,
      bannerTitle: request.body.bannerTitle,
      evolutionStage: request.body.evolutionStage,
      presenceLabel: request.body.presenceLabel,
      avatarInitials: request.body.avatarInitials,
      avatarVariant: request.body.avatarVariant,
      avatarSigil: request.body.avatarSigil,
    });
    response.status(200).json({ data: system });
  };

  public getCurrentQuests = async (_request: Request, response: Response): Promise<void> => {
    const quests = await this.systemService.getCurrentQuests();
    response.status(200).json({ data: quests });
  };

  public getCurrentBosses = async (_request: Request, response: Response): Promise<void> => {
    const bosses = await this.systemService.getCurrentBosses();
    response.status(200).json({ data: bosses });
  };

  public getCurrentShop = async (_request: Request, response: Response): Promise<void> => {
    const shop = await this.systemService.getCurrentShop();
    response.status(200).json({ data: shop });
  };

  public getCurrentSkills = async (_request: Request, response: Response): Promise<void> => {
    const skills = await this.systemService.getCurrentSkills();
    response.status(200).json({ data: skills });
  };

  public getCurrentProjects = async (_request: Request, response: Response): Promise<void> => {
    const projects = await this.systemService.getCurrentProjects();
    response.status(200).json({ data: projects });
  };

  public updateProject = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.updateProject({
      projectId: this.getSingleParam(request.params.projectId),
      progress: Number(request.body.progress),
      status: request.body.status,
    });
    response.status(200).json({ data: system });
  };

  public getCurrentInventory = async (_request: Request, response: Response): Promise<void> => {
    const inventory = await this.systemService.getCurrentInventory();
    response.status(200).json({ data: inventory });
  };

  public updateTheme = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.updateTheme({
      theme: request.body.theme,
    });

    response.status(200).json({ data: system });
  };

  public createQuest = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.createQuest({
      title: request.body.title,
      xpReward: Number(request.body.xpReward),
      coinReward: Number(request.body.coinReward),
      category: request.body.category,
      difficultyMultiplier: Number(request.body.difficultyMultiplier),
    });

    response.status(201).json({ data: system });
  };

  public completeQuest = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.completeQuest(
      this.getSingleParam(request.params.questId)
    );
    response.status(200).json({ data: system });
  };

  public createBoss = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.createBoss({
      name: request.body.name,
      totalHp: Number(request.body.totalHp),
      reward: request.body.reward,
    });

    response.status(201).json({ data: system });
  };

  public purchaseShopItem = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.purchaseShopItem({
      itemId: this.getSingleParam(request.params.itemId),
    });

    response.status(200).json({ data: system });
  };

  public dismissActiveEvent = async (_request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.dismissActiveEvent();
    response.status(200).json({ data: system });
  };

  public resetSystem = async (_request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.resetSystem();
    response.status(200).json({ data: system });
  };
}
