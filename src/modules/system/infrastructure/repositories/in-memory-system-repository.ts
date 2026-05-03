import {
  AscensionSystem,
  Quest,
  ThemeOption,
} from "../../domain/entities/system";
import {
  CreateBossInput,
  CreateQuestInput,
  SystemRepository,
} from "../../domain/repositories/system-repository";
import {
  applyQuestCompletion,
  getDifficultyTier,
  rollEvent,
} from "../../domain/services/progression";
import {
  createBaseSystem,
  defaultStateFilePath,
  eventCatalog,
} from "../seed/base-system";
import { FileStateStore } from "../persistence/file-state-store";

const createId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export class InMemorySystemRepository implements SystemRepository {
  private state: AscensionSystem = createBaseSystem();
  private hasLoaded = false;
  private readonly stateStore = new FileStateStore<AscensionSystem>(defaultStateFilePath);

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

    applyQuestCompletion(this.state, quest);
    rollEvent(this.state, eventCatalog);

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
    this.state = createBaseSystem();
    this.hasLoaded = true;
    return this.commit();
  }

  private getSnapshot(): AscensionSystem {
    const snapshot = structuredClone(this.state);
    snapshot.leaderboard = [...snapshot.leaderboard, this.createUserEntry(snapshot)].sort(
      (left, right) => right.xp - left.xp
    );
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

    const storedState = await this.stateStore.read();

    if (storedState) {
      this.state = this.hydrateState(storedState);
    } else {
      this.state = createBaseSystem();
      await this.persist();
    }

    this.hasLoaded = true;
  }

  private hydrateState(value: unknown): AscensionSystem {
    const snapshot = createBaseSystem();

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
    await this.stateStore.write(this.state);
  }
}
