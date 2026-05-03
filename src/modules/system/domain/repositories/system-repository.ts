import {
  ActiveProject,
  AscensionSystem,
  AvatarVariant,
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

export type UpdateProfileInput = {
  profileName: string;
  title: string;
  className: string;
  username: string;
  quote: string;
  bio: string;
  guild: string;
  bannerTitle: string;
  evolutionStage: string;
  presenceLabel: string;
  avatarInitials: string;
  avatarVariant: AvatarVariant;
  avatarSigil: string;
};

export type UpdateProjectInput = {
  projectId: string;
  progress: number;
  status: ActiveProject["status"];
};

export interface SystemRepository {
  findCurrent(): Promise<AscensionSystem>;
  updateTheme(theme: ThemeOption): Promise<AscensionSystem>;
  updateProfile(input: UpdateProfileInput): Promise<AscensionSystem>;
  createQuest(input: CreateQuestInput): Promise<AscensionSystem>;
  completeQuest(questId: string): Promise<AscensionSystem>;
  createBoss(input: CreateBossInput): Promise<AscensionSystem>;
  updateProject(input: UpdateProjectInput): Promise<AscensionSystem>;
  purchaseShopItem(itemId: string): Promise<AscensionSystem>;
  dismissActiveEvent(): Promise<AscensionSystem>;
  findQuestById(questId: string): Promise<Quest | null>;
  reset(): Promise<AscensionSystem>;
}
