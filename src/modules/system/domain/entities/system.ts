export type ThemeOption = "crimson" | "violet";

export type StatName =
  | "coding"
  | "startup"
  | "learning"
  | "money"
  | "health"
  | "discipline";

export type SystemStat = {
  name: StatName;
  level: number;
  xp: number;
};

export type Quest = {
  id: string;
  title: string;
  category: StatName;
  xpReward: number;
  coinReward: number;
  difficulty: "easy" | "medium" | "hard" | "boss";
  completed: boolean;
};

export type BossProgress = {
  name: string;
  totalHp: number;
  currentHp: number;
  reward: string;
};

export type AscensionSystem = {
  id: string;
  profileName: string;
  level: number;
  rank: string;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  coins: number;
  theme: ThemeOption;
  stats: SystemStat[];
  dailyQuests: Quest[];
  activeBoss: BossProgress;
};
