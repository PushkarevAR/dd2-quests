/**
 * Типы данных для квестов Dragon's Dogma 2
 */

export interface QuestRewards {
  gold: number;
  xp: number;
  items: string[];
}

export interface QuestRequirements {
  quests: string[];
  level: number | null;
  items: string[];
}

export interface QuestFlags {
  isMissable: boolean;
  isRequired: boolean;
  isRomance: boolean;
  isCritical: boolean;
}

export interface QuestLink {
  source: string;
  url: string;
  language: 'ru' | 'en';
}

export interface QuestNPC {
  name: string | null;
  location: string | null;
}

export type QuestType = 'main' | 'side';

export type QuestLocation = 
  | 'Королевство Вермунд'
  | 'Королевство Батталь'
  | 'Вулканический остров'
  | 'Изнанка мира'
  | 'Приграничный город'
  | 'Деревня Священного Дерева';

export interface Quest {
  id: string;
  type: QuestType;
  name: string;
  nameRu: string;
  location: QuestLocation;
  subLocation: string | null;
  order: number;
  availableAfter: string | null;
  rewards: QuestRewards;
  description: string;
  howToStart: string;
  requirements: QuestRequirements;
  unlocks: string[];
  flags: QuestFlags;
  tags: string[];
  links: QuestLink[];
  npc: QuestNPC | null;
  notes: string | null;
  isTimeSensitive?: boolean;
}

export interface QuestsData {
  version: string;
  lastUpdated: string;
  totalQuests: number;
  mainQuests: number;
  sideQuests: number;
  quests: Quest[];
}

// Типы для прогресса пользователя
export interface QuestProgress {
  [questId: string]: {
    completed: boolean;
    completedAt?: string;
  };
}

// Статистика прогресса
export interface ProgressStats {
  total: number;
  completed: number;
  percentage: number;
}

export interface CategoryProgress {
  main: ProgressStats;
  side: ProgressStats;
  vermund: ProgressStats;
  battahl: ProgressStats;
  volcanic: ProgressStats;
  unmoored: ProgressStats;
  total: ProgressStats;
}

