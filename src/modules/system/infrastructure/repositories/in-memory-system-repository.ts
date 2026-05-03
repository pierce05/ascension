import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  AscensionSystem,
  Boss,
  DifficultyTier,
  EventState,
  Quest,
  QuestCategory,
  Skill,
  ThemeOption,
} from "../../domain/entities/system";
import {
  CreateBossInput,
  CreateQuestInput,
  SystemRepository,
} from "../../domain/repositories/system-repository";
import { env } from "../../../../config/env";

const xpNeededForLevel = (level: number): number => level * 1000;

const getDifficultyTier = (multiplier: number): DifficultyTier => {
  if (multiplier >= 2) {
    return "boss";
  }

  if (multiplier >= 1.5) {
    return "hard";
  }

  if (multiplier >= 1.2) {
    return "medium";
  }

  return "easy";
};

const getStreakMultiplier = (streakDays: number): number => {
  if (streakDays >= 7) {
    return 1.5;
  }

  if (streakDays >= 4) {
    return 1.2;
  }

  return 1;
};

const eventCatalog: EventState[] = [
  {
    icon: "⚡",
    title: "DOUBLE XP HOUR",
    description: "2x XP on all quests for the next 60 minutes.",
    multiplier: 2,
  },
  {
    icon: "🎲",
    title: "LUCKY DROP ACTIVE",
    description: "Random bonus coins are more likely on quest completion.",
    multiplier: 1,
  },
  {
    icon: "☠",
    title: "CURSED SESSION",
    description: "XP reduced by 20 percent. Survive the grind.",
    multiplier: 0.8,
  },
];

const createId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const defaultStateFilePath = env.stateFilePath ?? path.resolve(process.cwd(), "data", "system-state.json");

const categoryToSkillFamily: Record<QuestCategory, QuestCategory> = {
  CP: "CP",
  DEV: "DEV",
  ML: "ML",
  HEALTH: "LIFE",
  GRIND: "LIFE",
  LIFE: "LIFE",
};

const baseSkills: Skill[] = [
  { id: "skill-arrays", name: "Arrays", category: "CP", level: 12, maxLevel: 20, unlocked: true },
  { id: "skill-bs", name: "Binary Search", category: "CP", level: 8, maxLevel: 15, unlocked: true },
  { id: "skill-dp", name: "Dynamic Prog", category: "CP", level: 4, maxLevel: 20, unlocked: true },
  { id: "skill-graphs", name: "Graph Theory", category: "CP", level: 1, maxLevel: 20, unlocked: false },
  { id: "skill-react", name: "React", category: "DEV", level: 15, maxLevel: 25, unlocked: true },
  { id: "skill-backend", name: "Backend", category: "DEV", level: 9, maxLevel: 20, unlocked: true },
  { id: "skill-ml", name: "ML Basics", category: "ML", level: 6, maxLevel: 15, unlocked: true },
  { id: "skill-dl", name: "Deep Learning", category: "ML", level: 2, maxLevel: 20, unlocked: true },
  { id: "skill-discipline", name: "Discipline", category: "LIFE", level: 7, maxLevel: 20, unlocked: true },
];

const baseQuests: Quest[] = [
  {
    id: "quest-1",
    title: "Solve 1 Hard CP Problem",
    xpReward: 20,
    coinReward: 10,
    category: "CP",
    difficultyMultiplier: 1.5,
    difficulty: "hard",
    completed: false,
  },
  {
    id: "quest-2",
    title: "Complete Codeforces Contest",
    xpReward: 100,
    coinReward: 50,
    category: "CP",
    difficultyMultiplier: 2,
    difficulty: "boss",
    completed: false,
  },
  {
    id: "quest-3",
    title: "Ship Feature in Memora",
    xpReward: 150,
    coinReward: 75,
    category: "DEV",
    difficultyMultiplier: 1.5,
    difficulty: "hard",
    completed: false,
  },
  {
    id: "quest-4",
    title: "Apply to 5 Internships",
    xpReward: 50,
    coinReward: 25,
    category: "GRIND",
    difficultyMultiplier: 1.2,
    difficulty: "medium",
    completed: false,
  },
  {
    id: "quest-5",
    title: "Workout Session",
    xpReward: 30,
    coinReward: 15,
    category: "HEALTH",
    difficultyMultiplier: 1,
    difficulty: "easy",
    completed: false,
  },
];

const baseBosses: Boss[] = [
  {
    id: "boss-1",
    name: "Launch Memora App",
    totalHp: 5000,
    currentHp: 3200,
    reward: "+500 Coins, Title: Builder",
  },
  {
    id: "boss-2",
    name: "Reach CF Rating 1400",
    totalHp: 8000,
    currentHp: 6800,
    reward: "+1000 XP, Title: Code Knight",
  },
];

const baseSystem: AscensionSystem = {
  id: "main-system",
  profileName: "LEFNIRE",
  title: "The Relentless",
  className: "Shadow Monarch",
  level: 27,
  rank: "SSS",
  xp: 27450,
  xpToNextLevel: xpNeededForLevel(27),
  coins: 1245,
  gems: 250,
  streakDays: 23,
  totalXp: 15670,
  questsDone: 0,
  todayScore: 0,
  todayDone: 0,
  theme: "crimson",
  vitals: {
    hp: 1000,
    mp: 1000,
    energy: 100,
  },
  attributes: {
    strength: 50,
    intelligence: 60,
    discipline: 40,
  },
  quests: baseQuests,
  skills: baseSkills,
  bosses: baseBosses,
  shopItems: [
    { id: "shop-1", name: "XP Booster", description: "+50% XP for 1 day", price: 200, icon: "⚡", type: "booster" },
    { id: "shop-2", name: "Focus Potion", description: "+2 hrs Deep Work energy", price: 150, icon: "🧪", type: "booster" },
    { id: "shop-3", name: "Skip Token", description: "Skip 1 quest without penalty", price: 300, icon: "🎭", type: "token" },
    { id: "shop-4", name: "Double XP Day", description: "2x XP for all quests today", price: 500, icon: "🔥", type: "booster" },
    { id: "shop-5", name: "Skill Reset", description: "Redistribute skill points", price: 800, icon: "🔄", type: "special" },
    { id: "shop-6", name: "Movie Night Pass", description: "Guilt-free entertainment unlock", price: 100, icon: "🎬", type: "real" },
  ],
  inventory: [],
  leaderboard: [
    { name: "ShadowX", level: 45, xp: 23450, isCurrentUser: false },
    { name: "CodeMonarch", level: 42, xp: 21300, isCurrentUser: false },
    { name: "DevHunter", level: 26, xp: 14200, isCurrentUser: false },
    { name: "AlgoBeast", level: 24, xp: 12980, isCurrentUser: false },
  ],
  activeEvent: eventCatalog[0],
};

export class InMemorySystemRepository implements SystemRepository {
  private state: AscensionSystem = structuredClone(baseSystem);
  private hasLoaded = false;
  private saveChain: Promise<void> = Promise.resolve();

  public async findCurrent(): Promise<AscensionSystem> {
    await this.ensureLoaded();
    return this.getSnapshot();
  }

  public async updateTheme(theme: ThemeOption): Promise<AscensionSystem> {
    await this.ensureLoaded();
    this.state.theme = theme;
    return this.commit();
  }

  public async createQuest(input: CreateQuestInput): Promise<AscensionSystem> {
    await this.ensureLoaded();
    this.state.quests.unshift({
      id: createId("quest"),
      title: input.title,
      xpReward: input.xpReward,
      coinReward: input.coinReward,
      category: input.category,
      difficultyMultiplier: input.difficultyMultiplier,
      difficulty: getDifficultyTier(input.difficultyMultiplier),
      completed: false,
    });

    return this.commit();
  }

  public async completeQuest(questId: string): Promise<AscensionSystem> {
    await this.ensureLoaded();
    const quest = this.state.quests.find((item) => item.id === questId);

    if (!quest || quest.completed) {
      return this.getSnapshot();
    }

    quest.completed = true;
    this.state.streakDays += 1;

    const multiplier = getStreakMultiplier(this.state.streakDays) * (this.state.activeEvent?.multiplier ?? 1);
    const gainedXp = Math.round(quest.xpReward * quest.difficultyMultiplier * multiplier);
    const gainedCoins = Math.round(quest.coinReward * multiplier);

    this.state.xp += gainedXp;
    this.state.totalXp += gainedXp;
    this.state.coins += gainedCoins;
    this.state.todayScore += gainedXp;
    this.state.todayDone += 1;
    this.state.questsDone += 1;
    this.state.attributes.discipline = Math.min(99, this.state.attributes.discipline + 1);
    this.state.attributes.intelligence = Math.min(99, this.state.attributes.intelligence + 1);
    this.state.attributes.strength = Math.min(99, this.state.attributes.strength + (quest.category === "HEALTH" ? 2 : 1));
    this.state.vitals.hp = Math.max(0, 1000 - this.state.questsDone * 10);

    this.applyLevelUps();
    this.damageBosses(gainedXp * 2);
    this.upgradeSkillFromCategory(quest.category);
    this.rollEvent();

    return this.commit();
  }

  public async createBoss(input: CreateBossInput): Promise<AscensionSystem> {
    await this.ensureLoaded();
    this.state.bosses.push({
      id: createId("boss"),
      name: input.name,
      totalHp: input.totalHp,
      currentHp: input.totalHp,
      reward: input.reward,
    });

    return this.commit();
  }

  public async purchaseShopItem(itemId: string): Promise<AscensionSystem> {
    await this.ensureLoaded();
    const item = this.state.shopItems.find((entry) => entry.id === itemId);

    if (!item) {
      return this.getSnapshot();
    }

    this.state.coins -= item.price;
    this.state.inventory.unshift({
      ...item,
      purchasedAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    return this.commit();
  }

  public async dismissActiveEvent(): Promise<AscensionSystem> {
    await this.ensureLoaded();
    this.state.activeEvent = null;
    return this.commit();
  }

  public async findQuestById(questId: string): Promise<Quest | null> {
    await this.ensureLoaded();
    return structuredClone(this.state.quests.find((quest) => quest.id === questId) ?? null);
  }

  public async reset(): Promise<AscensionSystem> {
    this.state = structuredClone(baseSystem);
    this.hasLoaded = true;
    return this.commit();
  }

  private applyLevelUps(): void {
    while (this.state.xp >= xpNeededForLevel(this.state.level)) {
      this.state.xp -= xpNeededForLevel(this.state.level);
      this.state.level += 1;
      this.state.attributes.strength = Math.min(99, this.state.attributes.strength + 3);
      this.state.attributes.intelligence = Math.min(99, this.state.attributes.intelligence + 2);
      this.state.attributes.discipline = Math.min(99, this.state.attributes.discipline + 2);
    }

    this.state.xpToNextLevel = xpNeededForLevel(this.state.level);
  }

  private damageBosses(damage: number): void {
    this.state.bosses = this.state.bosses.map((boss) => ({
      ...boss,
      currentHp: boss.currentHp > 0 ? Math.max(0, boss.currentHp - damage) : boss.currentHp,
    }));
  }

  private upgradeSkillFromCategory(category: QuestCategory): void {
    const skillFamily = categoryToSkillFamily[category];
    const skill = this.state.skills.find(
      (entry) => entry.category === skillFamily && entry.unlocked && entry.level < entry.maxLevel
    );

    if (skill) {
      skill.level += 1;
    }

    const strongestByCategory = new Map<QuestCategory, number>();

    for (const entry of this.state.skills.filter((item) => item.unlocked)) {
      const current = strongestByCategory.get(entry.category) ?? 0;
      strongestByCategory.set(entry.category, Math.max(current, entry.level));
    }

    this.state.skills = this.state.skills.map((entry) => {
      if (entry.unlocked) {
        return entry;
      }

      const threshold = strongestByCategory.get(entry.category) ?? 0;
      return threshold >= 10 ? { ...entry, unlocked: true } : entry;
    });
  }

  private rollEvent(): void {
    if (this.state.activeEvent || Math.random() >= 0.3) {
      return;
    }

    const index = Math.floor(Math.random() * eventCatalog.length);
    this.state.activeEvent = eventCatalog[index];
  }

  private getSnapshot(): AscensionSystem {
    const snapshot = structuredClone(this.state);
    snapshot.leaderboard = [...snapshot.leaderboard, this.createUserEntry(snapshot)].sort((left, right) => right.xp - left.xp);
    return snapshot;
  }

  private createUserEntry(system: AscensionSystem) {
    return {
      name: `${system.profileName} (YOU)`,
      level: system.level,
      xp: system.totalXp,
      isCurrentUser: true,
    };
  }

  private async ensureLoaded(): Promise<void> {
    if (this.hasLoaded) {
      return;
    }

    try {
      const raw = await readFile(defaultStateFilePath, "utf-8");
      this.state = this.hydrateState(JSON.parse(raw));
    } catch {
      this.state = structuredClone(baseSystem);
      await this.persist();
    }

    this.hasLoaded = true;
  }

  private hydrateState(value: unknown): AscensionSystem {
    const snapshot = structuredClone(baseSystem);

    if (!value || typeof value !== "object") {
      return snapshot;
    }

    return {
      ...snapshot,
      ...(value as Partial<AscensionSystem>),
      vitals: {
        ...snapshot.vitals,
        ...((value as Partial<AscensionSystem>).vitals ?? {}),
      },
      attributes: {
        ...snapshot.attributes,
        ...((value as Partial<AscensionSystem>).attributes ?? {}),
      },
      quests: Array.isArray((value as Partial<AscensionSystem>).quests)
        ? ((value as Partial<AscensionSystem>).quests as AscensionSystem["quests"])
        : snapshot.quests,
      skills: Array.isArray((value as Partial<AscensionSystem>).skills)
        ? ((value as Partial<AscensionSystem>).skills as AscensionSystem["skills"])
        : snapshot.skills,
      bosses: Array.isArray((value as Partial<AscensionSystem>).bosses)
        ? ((value as Partial<AscensionSystem>).bosses as AscensionSystem["bosses"])
        : snapshot.bosses,
      shopItems: Array.isArray((value as Partial<AscensionSystem>).shopItems)
        ? ((value as Partial<AscensionSystem>).shopItems as AscensionSystem["shopItems"])
        : snapshot.shopItems,
      inventory: Array.isArray((value as Partial<AscensionSystem>).inventory)
        ? ((value as Partial<AscensionSystem>).inventory as AscensionSystem["inventory"])
        : snapshot.inventory,
      leaderboard: Array.isArray((value as Partial<AscensionSystem>).leaderboard)
        ? ((value as Partial<AscensionSystem>).leaderboard as AscensionSystem["leaderboard"])
        : snapshot.leaderboard,
      activeEvent:
        (value as Partial<AscensionSystem>).activeEvent === null
          ? null
          : (((value as Partial<AscensionSystem>).activeEvent as AscensionSystem["activeEvent"]) ?? snapshot.activeEvent),
    };
  }

  private async commit(): Promise<AscensionSystem> {
    await this.persist();
    return this.getSnapshot();
  }

  private async persist(): Promise<void> {
    this.saveChain = this.saveChain.then(async () => {
      await mkdir(path.dirname(defaultStateFilePath), { recursive: true });
      await writeFile(defaultStateFilePath, JSON.stringify(this.state, null, 2), "utf-8");
    });

    await this.saveChain;
  }
}
