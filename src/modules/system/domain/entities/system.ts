export type ThemeOption = "crimson" | "violet";

export type QuestCategory = "CP" | "DEV" | "ML" | "HEALTH" | "GRIND" | "LIFE";

export type DifficultyTier = "easy" | "medium" | "hard" | "boss";

export type Vitals = {
  hp: number;
  mp: number;
  energy: number;
};

export type Attributes = {
  strength: number;
  intelligence: number;
  discipline: number;
};

export type Quest = {
  id: string;
  title: string;
  xpReward: number;
  coinReward: number;
  category: QuestCategory;
  difficultyMultiplier: number;
  difficulty: DifficultyTier;
  completed: boolean;
};

export type Boss = {
  id: string;
  name: string;
  totalHp: number;
  currentHp: number;
  reward: string;
};

export type Skill = {
  id: string;
  name: string;
  category: QuestCategory;
  level: number;
  maxLevel: number;
  unlocked: boolean;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: "booster" | "token" | "special" | "real";
};

export type InventoryItem = ShopItem & {
  purchasedAt: string;
};

export type EventState = {
  icon: string;
  title: string;
  description: string;
  multiplier: number;
};

export type LeaderboardEntry = {
  name: string;
  level: number;
  xp: number;
  isCurrentUser: boolean;
};

export type AscensionSystem = {
  id: string;
  profileName: string;
  title: string;
  className: string;
  level: number;
  rank: string;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  streakDays: number;
  totalXp: number;
  questsDone: number;
  todayScore: number;
  todayDone: number;
  theme: ThemeOption;
  vitals: Vitals;
  attributes: Attributes;
  quests: Quest[];
  skills: Skill[];
  bosses: Boss[];
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  leaderboard: LeaderboardEntry[];
  activeEvent: EventState | null;
};
