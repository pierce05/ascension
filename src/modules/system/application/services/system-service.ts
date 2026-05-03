import { AppError } from "../../../../core/errors/app-error";
import { AscensionSystem, QuestCategory } from "../../domain/entities/system";
import { SystemRepository } from "../../domain/repositories/system-repository";
import {
  CreateBossDto,
  CreateQuestDto,
  PurchaseShopItemDto,
  UpdateThemeDto,
} from "../dto/system-actions.dto";

const validCategories: QuestCategory[] = ["CP", "DEV", "ML", "HEALTH", "GRIND", "LIFE"];

export class SystemService {
  constructor(private readonly systemRepository: SystemRepository) {}

  public async getCurrentSystem(): Promise<AscensionSystem> {
    return this.systemRepository.findCurrent();
  }

  public async updateTheme(input: UpdateThemeDto): Promise<AscensionSystem> {
    if (input.theme !== "crimson" && input.theme !== "violet") {
      throw new AppError("Theme must be either crimson or violet.", 400, "INVALID_THEME");
    }

    return this.systemRepository.updateTheme(input.theme);
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
