/**
 * Хук для управления прогрессом квестов через localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Quest, QuestProgress, CategoryProgress, ProgressStats } from '../types/quest';

const STORAGE_KEY = 'dd2-quest-progress';

export function useQuestProgress(quests: Quest[]) {
  const [progress, setProgress] = useState<QuestProgress>(() => {
    // Инициализация из localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Переключить статус квеста
  const toggleQuest = useCallback((questId: string) => {
    setProgress(prev => {
      const isCompleted = prev[questId]?.completed || false;
      
      if (isCompleted) {
        // Снять отметку
        const newProgress = { ...prev };
        delete newProgress[questId];
        return newProgress;
      } else {
        // Отметить как выполненный
        return {
          ...prev,
          [questId]: {
            completed: true,
            completedAt: new Date().toISOString()
          }
        };
      }
    });
  }, []);

  // Отметить квест как выполненный
  const completeQuest = useCallback((questId: string) => {
    setProgress(prev => ({
      ...prev,
      [questId]: {
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));
  }, []);

  // Снять отметку с квеста
  const uncompleteQuest = useCallback((questId: string) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[questId];
      return newProgress;
    });
  }, []);

  // Проверить, выполнен ли квест
  const isQuestCompleted = useCallback((questId: string): boolean => {
    return progress[questId]?.completed || false;
  }, [progress]);

  // Проверить, провален ли квест
  const isQuestFailed = useCallback((questId: string): boolean => {
    return progress[questId]?.failed || false;
  }, [progress]);

  // Отметить квест как проваленный
  const markQuestFailed = useCallback((questId: string) => {
    setProgress(prev => {
      const currentState = prev[questId];
      
      if (currentState?.failed) {
        // Снять отметку провала
        const newProgress = { ...prev };
        delete newProgress[questId];
        return newProgress;
      } else {
        // Отметить как проваленный
        return {
          ...prev,
          [questId]: {
            completed: false,
            failed: true,
            completedAt: new Date().toISOString()
          }
        };
      }
    });
  }, []);

  // Сбросить весь прогресс
  const resetProgress = useCallback(() => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Подсчёт статистики для категории
  const calculateStats = useCallback((questList: Quest[]): ProgressStats => {
    const total = questList.length;
    const completed = questList.filter(q => isQuestCompleted(q.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [isQuestCompleted]);

  // Полная статистика прогресса
  const getCategoryProgress = useCallback((): CategoryProgress => {
    const mainQuests = quests.filter(q => q.type === 'main');
    const sideQuests = quests.filter(q => q.type === 'side');
    
    // По типу
    const main = calculateStats(mainQuests);
    const side = calculateStats(sideQuests);
    
    // По локациям
    const vermund = calculateStats(quests.filter(q => q.location === 'Королевство Вермунд'));
    const battahl = calculateStats(quests.filter(q => q.location === 'Королевство Батталь'));
    const volcanic = calculateStats(quests.filter(q => q.location === 'Вулканический остров'));
    const unmoored = calculateStats(quests.filter(q => q.location === 'Изнанка мира'));
    
    // Всего
    const total = calculateStats(quests);
    
    return {
      main,
      side,
      vermund,
      battahl,
      volcanic,
      unmoored,
      total
    };
  }, [quests, calculateStats]);

  return {
    progress,
    toggleQuest,
    completeQuest,
    uncompleteQuest,
    isQuestCompleted,
    isQuestFailed,
    markQuestFailed,
    resetProgress,
    getCategoryProgress
  };
}

