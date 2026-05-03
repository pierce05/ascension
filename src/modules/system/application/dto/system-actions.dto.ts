import { QuestCategory, ThemeOption } from "../../domain/entities/system";

export type UpdateThemeDto = {
  theme: ThemeOption;
};

export type CreateQuestDto = {
  title: string;
  xpReward: number;
  coinReward: number;
  category: QuestCategory;
  difficultyMultiplier: number;
};

export type CreateBossDto = {
  name: string;
  totalHp: number;
  reward: string;
};

export type PurchaseShopItemDto = {
  itemId: string;
};
