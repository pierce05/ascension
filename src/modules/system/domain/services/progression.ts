import {
  AscensionSystem,
  DifficultyTier,
  EventState,
  Quest,
  QuestCategory,
} from "../entities/system";

export const categoryToSkillFamily: Record<QuestCategory, QuestCategory> = {
  CP: "CP",
  DEV: "DEV",
  ML: "ML",
  HEALTH: "LIFE",
  GRIND: "LIFE",
  LIFE: "LIFE",
};

export const xpNeededForLevel = (level: number): number => level * 1000;

export const getDifficultyTier = (multiplier: number): DifficultyTier => {
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

export const getStreakMultiplier = (streakDays: number): number => {
  if (streakDays >= 7) {
    return 1.5;
  }

  if (streakDays >= 4) {
    return 1.2;
  }

  return 1;
};

export const applyLevelUps = (state: AscensionSystem): void => {
  while (state.xp >= xpNeededForLevel(state.level)) {
    state.xp -= xpNeededForLevel(state.level);
    state.level += 1;
    state.attributes.strength = Math.min(99, state.attributes.strength + 3);
    state.attributes.intelligence = Math.min(99, state.attributes.intelligence + 2);
    state.attributes.discipline = Math.min(99, state.attributes.discipline + 2);
  }

  state.xpToNextLevel = xpNeededForLevel(state.level);
};

export const damageBosses = (state: AscensionSystem, damage: number): void => {
  state.bosses = state.bosses.map((boss) => ({
    ...boss,
    currentHp: boss.currentHp > 0 ? Math.max(0, boss.currentHp - damage) : boss.currentHp,
  }));
};

export const upgradeSkillFromCategory = (
  state: AscensionSystem,
  category: QuestCategory
): void => {
  const skillFamily = categoryToSkillFamily[category];
  const skill = state.skills.find(
    (entry) => entry.category === skillFamily && entry.unlocked && entry.level < entry.maxLevel
  );

  if (skill) {
    skill.level += 1;
  }

  const strongestByCategory = new Map<QuestCategory, number>();

  for (const entry of state.skills.filter((item) => item.unlocked)) {
    const current = strongestByCategory.get(entry.category) ?? 0;
    strongestByCategory.set(entry.category, Math.max(current, entry.level));
  }

  state.skills = state.skills.map((entry) => {
    if (entry.unlocked) {
      return entry;
    }

    const threshold = strongestByCategory.get(entry.category) ?? 0;
    return threshold >= 10 ? { ...entry, unlocked: true } : entry;
  });
};

export const applyQuestCompletion = (
  state: AscensionSystem,
  quest: Quest
): { gainedXp: number; gainedCoins: number } => {
  quest.completed = true;
  state.streakDays += 1;

  const multiplier = getStreakMultiplier(state.streakDays) * (state.activeEvent?.multiplier ?? 1);
  const gainedXp = Math.round(quest.xpReward * quest.difficultyMultiplier * multiplier);
  const gainedCoins = Math.round(quest.coinReward * multiplier);

  state.xp += gainedXp;
  state.totalXp += gainedXp;
  state.coins += gainedCoins;
  state.todayScore += gainedXp;
  state.todayDone += 1;
  state.questsDone += 1;
  state.attributes.discipline = Math.min(99, state.attributes.discipline + 1);
  state.attributes.intelligence = Math.min(99, state.attributes.intelligence + 1);
  state.attributes.strength = Math.min(99, state.attributes.strength + (quest.category === "HEALTH" ? 2 : 1));
  state.vitals.hp = Math.max(0, 1000 - state.questsDone * 10);

  applyLevelUps(state);
  damageBosses(state, gainedXp * 2);
  upgradeSkillFromCategory(state, quest.category);

  return { gainedXp, gainedCoins };
};

export const rollEvent = (
  state: AscensionSystem,
  eventCatalog: EventState[]
): void => {
  if (state.activeEvent || Math.random() >= 0.3) {
    return;
  }

  const index = Math.floor(Math.random() * eventCatalog.length);
  state.activeEvent = eventCatalog[index];
};
