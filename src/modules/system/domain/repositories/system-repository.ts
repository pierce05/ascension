import {
  AscensionSystem,
  Quest,
  QuestCategory,
  ThemeOption,
} from "../entities/system";

export type CreateQuestInput = {
  title: string;
  xpReward: number;
  coinReward: number;
  category: QuestCategory;
  difficultyMultiplier: number;
};

export type CreateBossInput = {
  name: string;
  totalHp: number;
  reward: string;
};

export interface SystemRepository {
  findCurrent(): Promise<AscensionSystem>;
  updateTheme(theme: ThemeOption): Promise<AscensionSystem>;
  createQuest(input: CreateQuestInput): Promise<AscensionSystem>;
  completeQuest(questId: string): Promise<AscensionSystem>;
  createBoss(input: CreateBossInput): Promise<AscensionSystem>;
  purchaseShopItem(itemId: string): Promise<AscensionSystem>;
  dismissActiveEvent(): Promise<AscensionSystem>;
  findQuestById(questId: string): Promise<Quest | null>;
  reset(): Promise<AscensionSystem>;
}
