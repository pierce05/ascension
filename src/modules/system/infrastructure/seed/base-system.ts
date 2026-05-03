import path from "node:path";
import { env } from "../../../../config/env";
import { ActiveProject, AscensionSystem, Boss, EventState, Quest, Skill } from "../../domain/entities/system";
import { xpNeededForLevel } from "../../domain/services/progression";

export const defaultStateFilePath =
  env.stateFilePath ?? path.resolve(process.cwd(), "data", "system-state.json");

export const eventCatalog: EventState[] = [
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

const baseProjects: ActiveProject[] = [
  {
    id: "project-memora",
    name: "Memora App",
    summary: "Retention loop, core UX, and onboarding flow.",
    progress: 78,
    status: "active",
    category: "startup",
  },
  {
    id: "project-rag",
    name: "ML RAG System",
    summary: "Retriever tuning, eval set quality, and answer grounding.",
    progress: 52,
    status: "active",
    category: "learning",
  },
  {
    id: "project-portfolio",
    name: "Portfolio Website",
    summary: "Polish pass, recruiter copy, and case study cleanup.",
    progress: 90,
    status: "active",
    category: "career",
  },
];

const todayStamp = () => new Date().toISOString().slice(0, 10);

export const createBaseSystem = (): AscensionSystem => ({
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
  profile: {
    bannerTitle: "Solo Leveling System",
    username: "shadow.lefnire",
    quote: "You have to get stronger if you want to survive.",
    bio: "Builder, grinder, and system-breaker. Turning code, startup work, and discipline into combat power.",
    guild: "Memora Labs",
    combatPower: 15670,
    evolutionStage: "Shadow Monarch Candidate",
    presenceLabel: "Awakened Vessel",
    avatar: {
      initials: "LF",
      variant: "ember",
      sigil: "III",
    },
    badges: [
      { id: "badge-shadow", label: "Shadow Born", tone: "crimson" },
      { id: "badge-builder", label: "Builder", tone: "gold" },
      { id: "badge-memora", label: "Memora Core", tone: "violet" },
    ],
  },
  dailyState: {
    lastActiveOn: todayStamp(),
    lastResetOn: todayStamp(),
    resetCount: 0,
  },
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
  activeProjects: baseProjects,
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
});
