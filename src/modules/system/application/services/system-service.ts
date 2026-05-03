import { AppError } from "../../../../core/errors/app-error";
import { AscensionSystem, QuestCategory } from "../../domain/entities/system";
import { SystemRepository } from "../../domain/repositories/system-repository";
import {
  CreateBossDto,
  CreateQuestDto,
  PurchaseShopItemDto,
  UpdateThemeDto,
} from "../dto/system-actions.dto";
import { UpdateProfileDto, UpdateProjectDto } from "../dto/profile-project-actions.dto";

const validCategories: QuestCategory[] = ["CP", "DEV", "ML", "HEALTH", "GRIND", "LIFE"];

export class SystemService {
  constructor(private readonly systemRepository: SystemRepository) {}

  public async getCurrentSystem(): Promise<AscensionSystem> {
    return this.systemRepository.findCurrent();
  }

  public async getCurrentProfile() {
    const system = await this.systemRepository.findCurrent();
    return {
      profileName: system.profileName,
      title: system.title,
      className: system.className,
      level: system.level,
      rank: system.rank,
      theme: system.theme,
      profile: system.profile,
      vitals: system.vitals,
      attributes: system.attributes,
      xp: system.xp,
      xpToNextLevel: system.xpToNextLevel,
    };
  }

  public async getCurrentProjects() {
    const system = await this.systemRepository.findCurrent();
    return system.activeProjects;
  }

  public async getCurrentInventory() {
    const system = await this.systemRepository.findCurrent();
    return system.inventory;
  }

  public async getCurrentQuests() {
    const system = await this.systemRepository.findCurrent();
    return system.quests;
  }

  public async getCurrentBosses() {
    const system = await this.systemRepository.findCurrent();
    return system.bosses;
  }

  public async getCurrentShop() {
    const system = await this.systemRepository.findCurrent();
    return {
      coins: system.coins,
      shopItems: system.shopItems,
      inventory: system.inventory,
    };
  }

  public async getCurrentSkills() {
    const system = await this.systemRepository.findCurrent();
    return system.skills;
  }

  public async updateTheme(input: UpdateThemeDto): Promise<AscensionSystem> {
    if (input.theme !== "crimson" && input.theme !== "violet") {
      throw new AppError("Theme must be either crimson or violet.", 400, "INVALID_THEME");
    }

    return this.systemRepository.updateTheme(input.theme);
  }

  public async updateProfile(input: UpdateProfileDto): Promise<AscensionSystem> {
    if (!input.profileName.trim()) {
      throw new AppError("Profile name is required.", 400, "INVALID_PROFILE_NAME");
    }

    if (!input.username.trim()) {
      throw new AppError("Username is required.", 400, "INVALID_USERNAME");
    }

    if (!["ember", "void", "royal"].includes(input.avatarVariant)) {
      throw new AppError("Avatar variant is invalid.", 400, "INVALID_AVATAR_VARIANT");
    }

    return this.systemRepository.updateProfile({
      profileName: input.profileName.trim(),
      title: input.title.trim() || "The Relentless",
      className: input.className.trim() || "Shadow Monarch",
      username: input.username.trim(),
      quote: input.quote.trim() || "You have to get stronger if you want to survive.",
      bio: input.bio.trim(),
      guild: input.guild.trim() || "Memora Labs",
      bannerTitle: input.bannerTitle.trim() || "Solo Leveling System",
      evolutionStage: input.evolutionStage.trim() || "Shadow Monarch Candidate",
      presenceLabel: input.presenceLabel.trim() || "Awakened Vessel",
      avatarInitials: input.avatarInitials.trim().slice(0, 3).toUpperCase() || "LF",
      avatarVariant: input.avatarVariant,
      avatarSigil: input.avatarSigil.trim().slice(0, 12) || "III",
    });
  }

  public async createQuest(input: CreateQuestDto): Promise<AscensionSystem> {
    if (!input.title.trim()) {
      throw new AppError("Quest title is required.", 400, "INVALID_QUEST_TITLE");
    }

    if (!validCategories.includes(input.category)) {
      throw new AppError("Quest category is invalid.", 400, "INVALID_QUEST_CATEGORY");
    }

    if (input.xpReward <= 0 || input.coinReward < 0 || input.difficultyMultiplier <= 0) {
      throw new AppError("Quest rewards and difficulty must be positive.", 400, "INVALID_QUEST_VALUES");
    }

    return this.systemRepository.createQuest({
      title: input.title.trim(),
      xpReward: Math.round(input.xpReward),
      coinReward: Math.round(input.coinReward),
      category: input.category,
      difficultyMultiplier: input.difficultyMultiplier,
    });
  }

  public async completeQuest(questId: string): Promise<AscensionSystem> {
    const quest = await this.systemRepository.findQuestById(questId);

    if (!quest) {
      throw new AppError("Quest not found.", 404, "QUEST_NOT_FOUND");
    }

    return this.systemRepository.completeQuest(questId);
  }

  public async createBoss(input: CreateBossDto): Promise<AscensionSystem> {
    if (!input.name.trim()) {
      throw new AppError("Boss name is required.", 400, "INVALID_BOSS_NAME");
    }

    if (input.totalHp < 100) {
      throw new AppError("Boss HP must be at least 100.", 400, "INVALID_BOSS_HP");
    }

    return this.systemRepository.createBoss({
      name: input.name.trim(),
      totalHp: Math.round(input.totalHp),
      reward: input.reward.trim() || "Victory rewards",
    });
  }

  public async updateProject(input: UpdateProjectDto): Promise<AscensionSystem> {
    const system = await this.systemRepository.findCurrent();
    const project = system.activeProjects.find((entry) => entry.id === input.projectId);

    if (!project) {
      throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
    }

    if (Number.isNaN(input.progress) || input.progress < 0 || input.progress > 100) {
      throw new AppError("Project progress must be between 0 and 100.", 400, "INVALID_PROJECT_PROGRESS");
    }

    if (!["active", "paused", "completed"].includes(input.status)) {
      throw new AppError("Project status is invalid.", 400, "INVALID_PROJECT_STATUS");
    }

    return this.systemRepository.updateProject({
      projectId: input.projectId,
      progress: Math.round(input.progress),
      status: input.status,
    });
  }

  public async purchaseShopItem(input: PurchaseShopItemDto): Promise<AscensionSystem> {
    const system = await this.systemRepository.findCurrent();
    const item = system.shopItems.find((entry) => entry.id === input.itemId);

    if (!item) {
      throw new AppError("Shop item not found.", 404, "SHOP_ITEM_NOT_FOUND");
    }

    if (system.coins < item.price) {
      throw new AppError("Not enough coins.", 400, "INSUFFICIENT_COINS");
    }

    return this.systemRepository.purchaseShopItem(input.itemId);
  }

  public async dismissActiveEvent(): Promise<AscensionSystem> {
    return this.systemRepository.dismissActiveEvent();
  }

  public async resetSystem(): Promise<AscensionSystem> {
    return this.systemRepository.reset();
  }
}
