/**
 * Компонент списка квестов в хронологическом порядке
 */

import React, { useState, useMemo } from 'react';
import type { Quest } from '../types/quest';
import { QuestListItem } from './QuestListItem';
import './QuestList.css';

interface QuestListProps {
  quests: Quest[];
  isQuestCompleted: (questId: string) => boolean;
  isQuestFailed: (questId: string) => boolean;
  onToggleQuest: (questId: string) => void;
  onMarkFailed: (questId: string) => void;
  onSelectQuest: (questId: string) => void;
  selectedQuestId: string | null;
}

export const QuestList: React.FC<QuestListProps> = ({
  quests,
  isQuestCompleted,
  isQuestFailed,
  onToggleQuest,
  onMarkFailed,
  onSelectQuest,
  selectedQuestId
}) => {
  const [filter, setFilter] = useState<'all' | 'main' | 'side'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'chronological' | 'alphabetical' | 'status'>('chronological');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Сортировка и фильтрация квестов
  const filteredQuests = useMemo(() => {
    let result = [...quests];

    // Сортировка по выбранному критерию
    if (sortBy === 'chronological') {
      // По хронологии (order)
      result.sort((a, b) => a.order - b.order);
    } else if (sortBy === 'alphabetical') {
      // По алфавиту (название)
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'status') {
      // По статусу (невыполненные → выполненные → проваленные)
      result.sort((a, b) => {
        const aCompleted = isQuestCompleted(a.id);
        const bCompleted = isQuestCompleted(b.id);
        const aFailed = isQuestFailed(a.id);
        const bFailed = isQuestFailed(b.id);
        
        if (aFailed && !bFailed) return 1;
        if (!aFailed && bFailed) return -1;
        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;
        return a.order - b.order;
      });
    }

    // Фильтр по типу
    if (filter !== 'all') {
      result = result.filter(q => q.type === filter);
    }

    // Фильтр по локации
    if (locationFilter !== 'all') {
      result = result.filter(q => q.location === locationFilter);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.name.toLowerCase().includes(query) || 
        q.nameRu.toLowerCase().includes(query)
      );
    }

    // Фильтр по статусу выполнения
    if (!showCompleted) {
      result = result.filter(q => !isQuestCompleted(q.id));
    }

    return result;
  }, [quests, filter, locationFilter, showCompleted, sortBy, searchQuery, isQuestCompleted, isQuestFailed]);

  // Уникальные локации для фильтра
  const locations = useMemo(() => {
    const uniqueLocations = new Set(quests.map(q => q.location));
    return Array.from(uniqueLocations);
  }, [quests]);

  return (
    <div className="quest-list">
      {/* Панель фильтров - две строки */}
      <div className="quest-list-filters">
        {/* Первая строка - поиск */}
        <div className="filter-row filter-row-search">
          <input
            type="text"
            className="filter-search"
            placeholder="Поиск квеста..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Вторая строка - фильтры */}
        <div className="filter-row filter-row-controls">
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'side')}
          >
            <option value="all">Все квесты</option>
            <option value="main">Основные</option>
            <option value="side">Побочные</option>
          </select>

          <select 
            className="filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">Все локации</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'chronological' | 'alphabetical' | 'status')}
          >
            <option value="chronological">Хронология</option>
            <option value="alphabetical">Алфавит</option>
            <option value="status">Статус</option>
          </select>

          <label className="filter-checkbox">
            <input 
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            <span>Выполненные</span>
          </label>
        </div>
      </div>

      {/* Список квестов */}
      <div className="quest-list-scroll">
        <div className="quest-list-header">
          <span className="quest-list-count">
            {searchQuery ? (
              <>Найдено: {filteredQuests.length} из {quests.length}</>
            ) : (
              <>Найдено: {filteredQuests.length} {filter !== 'all' ? `(${filter === 'main' ? 'основных' : 'побочных'})` : 'квестов'}</>
            )}
          </span>
        </div>

        <div className="quest-list-items">
          {filteredQuests.length === 0 ? (
            <div className="quest-list-empty">
              <p>Квесты не найдены</p>
              <p className="text-muted">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            filteredQuests.map(quest => (
              <QuestListItem
                key={quest.id}
                quest={quest}
                isCompleted={isQuestCompleted(quest.id)}
                isFailed={isQuestFailed(quest.id)}
                isSelected={selectedQuestId === quest.id}
                onToggle={onToggleQuest}
                onMarkFailed={onMarkFailed}
                onSelect={onSelectQuest}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

