import { AscensionSystem, ThemeOption } from "../../domain/entities/system";
import { SystemRepository } from "../../domain/repositories/system-repository";

const baseSystem: AscensionSystem = {
  id: "main-system",
  profileName: "Lefnire",
  level: 27,
  rank: "E -> SSS",
  xp: 27450,
  xpToNextLevel: 40000,
  streakDays: 23,
  coins: 1245,
  theme: "crimson",
  stats: [
    { name: "coding", level: 42, xp: 8600 },
    { name: "startup", level: 38, xp: 7400 },
    { name: "learning", level: 31, xp: 5800 },
    { name: "money", level: 22, xp: 3300 },
    { name: "health", level: 29, xp: 4700 },
    { name: "discipline", level: 35, xp: 6900 },
  ],
  dailyQuests: [
    {
      id: "quest-cp-3",
      title: "Solve 3 hard CP problems",
      category: "coding",
      xpReward: 500,
      coinReward: 100,
      difficulty: "hard",
      completed: false,
    },
    {
      id: "quest-memora",
      title: "Build for Memora (2 hrs)",
      category: "startup",
      xpReward: 700,
      coinReward: 150,
      difficulty: "hard",
      completed: false,
    },
    {
      id: "quest-gym",
      title: "Workout",
      category: "health",
      xpReward: 300,
      coinReward: 75,
      difficulty: "medium",
      completed: false,
    },
  ],
  activeBoss: {
    name: "Launch Memora MVP",
    totalHp: 10000,
    currentHp: 7500,
    reward: "Unlock The Builder title",
  },
};

export class InMemorySystemRepository implements SystemRepository {
  private state: AscensionSystem = structuredClone(baseSystem);

  public async findCurrent(): Promise<AscensionSystem> {
    return structuredClone(this.state);
  }

  public async updateTheme(theme: ThemeOption): Promise<AscensionSystem> {
    this.state.theme = theme;
    return structuredClone(this.state);
  }
}
