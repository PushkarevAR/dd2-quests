/**
 * Компонент списка квестов в хронологическом порядке
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const [filter, setFilter] = useState<'all' | 'main' | 'side' | 'available'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'chronological' | 'alphabetical' | 'status'>('chronological');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Структурированные результаты поиска
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    
    // Находим прямые совпадения
    const directMatches = quests.filter(q => 
      q.name.toLowerCase().includes(query) || 
      q.nameRu.toLowerCase().includes(query)
    );
    
    // Находим квесты-требования для прямых совпадений
    const requiredQuests = new Set<string>();
    directMatches.forEach(quest => {
      quest.requirements?.quests?.forEach(reqId => {
        const reqQuest = quests.find(q => q.id === reqId);
        if (reqQuest) requiredQuests.add(reqId);
      });
    });
    
    // Находим квесты, которые открываются прямыми совпадениями
    const unlockedQuests = new Set<string>();
    directMatches.forEach(quest => {
      quest.unlocks?.forEach(unlockId => {
        const unlockQuest = quests.find(q => q.id === unlockId);
        if (unlockQuest) unlockedQuests.add(unlockId);
      });
    });
    
    return {
      directMatches,
      requiredQuests: Array.from(requiredQuests).map(id => quests.find(q => q.id === id)).filter(Boolean),
      unlockedQuests: Array.from(unlockedQuests).map(id => quests.find(q => q.id === id)).filter(Boolean)
    };
  }, [quests, searchQuery]);

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
    if (filter === 'main' || filter === 'side') {
      result = result.filter(q => q.type === filter);
    } else if (filter === 'available') {
      // Фильтр "доступные" - показываем только те квесты, которые доступны с учетом выполненных
      result = result.filter(q => {
        // Проверяем требования из requirements.quests
        if (q.requirements.quests && q.requirements.quests.length > 0) {
          const allRequirementsMet = q.requirements.quests.every(reqId => isQuestCompleted(reqId));
          if (!allRequirementsMet) {
            return false;
          }
        }
        
        // Проверяем availableAfter
        if (q.availableAfter) {
          if (!isQuestCompleted(q.availableAfter)) {
            return false;
          }
        }
        
        return true;
      });
    }

    // Фильтр по локации
    if (locationFilter !== 'all') {
      result = result.filter(q => q.location === locationFilter);
    }

    // Фильтр по тегам
    if (tagFilter !== 'all') {
      result = result.filter(q => {
        switch (tagFilter) {
          case 'romance':
            return q.flags.isRomance;
          case 'required':
            return q.flags.isRequired;
          case 'missable':
            return q.flags.isMissable;
          case 'critical':
            return q.flags.isCritical;
          case 'time-sensitive':
            return q.isTimeSensitive;
          default:
            return true;
        }
      });
    }

    // Фильтр по статусу выполнения
    if (!showCompleted) {
      result = result.filter(q => !isQuestCompleted(q.id));
    }

    return result;
  }, [quests, filter, locationFilter, tagFilter, showCompleted, sortBy, isQuestCompleted, isQuestFailed]);

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
          <div className="search-input-container">
            <input
              type="text"
              className="filter-search"
              placeholder="Поиск квеста..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Вторая строка - фильтры */}
        <div className="filter-row filter-row-controls">
          <div className={`filters-dropdown ${isFiltersOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button 
              className="filters-toggle-btn"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              Фильтры
            </button>
            
            {isFiltersOpen && (
              <div className="filters-dropdown-content">
                {/* Тип квеста */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Тип квеста</h4>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="questType"
                        value="all"
                        checked={filter === 'all'}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'side' | 'available')}
                      />
                      <span>Все квесты</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="questType"
                        value="main"
                        checked={filter === 'main'}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'side' | 'available')}
                      />
                      <span>Основные</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="questType"
                        value="side"
                        checked={filter === 'side'}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'side' | 'available')}
                      />
                      <span>Побочные</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="questType"
                        value="available"
                        checked={filter === 'available'}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'main' | 'side' | 'available')}
                      />
                      <span>Доступные</span>
                    </label>
                  </div>
                </div>

                {/* Локация */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Локация</h4>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="location"
                        value="all"
                        checked={locationFilter === 'all'}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                      <span>Все локации</span>
                    </label>
                    {locations.map(loc => (
                      <label key={loc} className="radio-option">
                        <input 
                          type="radio"
                          name="location"
                          value={loc}
                          checked={locationFilter === loc}
                          onChange={(e) => setLocationFilter(e.target.value)}
                        />
                        <span>{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Теги */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Теги</h4>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="all"
                        checked={tagFilter === 'all'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Все теги</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="romance"
                        checked={tagFilter === 'romance'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Романтические</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="required"
                        checked={tagFilter === 'required'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Обязательные</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="missable"
                        checked={tagFilter === 'missable'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Пропускаемые</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="critical"
                        checked={tagFilter === 'critical'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Критичные</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio"
                        name="tagFilter"
                        value="time-sensitive"
                        checked={tagFilter === 'time-sensitive'}
                        onChange={(e) => setTagFilter(e.target.value)}
                      />
                      <span>Временные</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Третья строка - сортировка и показывать выполненные */}
        <div className="filter-row filter-row-sort">
          <div className="filter-sort-controls">
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'chronological' | 'alphabetical' | 'status')}
            >
              <option value="chronological">По хронологии</option>
              <option value="alphabetical">По алфавиту</option>
              <option value="status">По статусу</option>
            </select>
            
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              <span className="dd2-checkbox-mark"></span>
              <span className="filter-checkbox-label">Показывать выполненные</span>
            </label>
          </div>
        </div>
      </div>

      {/* Список квестов */}
      <div className="quest-list-scroll">
        <div className="quest-list-header">
          <span className="quest-list-count">
            {searchQuery ? (
              <>Найдено: {searchResults?.directMatches.length || 0} прямых совпадений</>
            ) : (
              <>Найдено: {filteredQuests.length} {filter === 'main' ? 'основных' : filter === 'side' ? 'побочных' : filter === 'available' ? 'доступных' : 'квестов'}</>
            )}
          </span>
        </div>

        <div className="quest-list-items">
          {searchQuery ? (
            // Структурированные результаты поиска
            <>
              {/* Прямые совпадения */}
              {searchResults && searchResults.directMatches.length > 0 && (
                <>
                  <div className="search-section-header">
                    Прямые совпадения
                  </div>
                  {searchResults.directMatches.map(quest => (
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
                  ))}
                </>
              )}

              {/* Требования */}
              {searchResults && searchResults.requiredQuests.length > 0 && (
                <>
                  <div className="search-section-header">
                    Требует
                  </div>
                  {searchResults.requiredQuests.filter(quest => quest).map(quest => (
                    <QuestListItem
                      key={quest!.id}
                      quest={quest!}
                      isCompleted={isQuestCompleted(quest!.id)}
                      isFailed={isQuestFailed(quest!.id)}
                      isSelected={selectedQuestId === quest!.id}
                      onToggle={onToggleQuest}
                      onMarkFailed={onMarkFailed}
                      onSelect={onSelectQuest}
                    />
                  ))}
                </>
              )}

              {/* Открываемые квесты */}
              {searchResults && searchResults.unlockedQuests.length > 0 && (
                <>
                  <div className="search-section-header">
                    Необходим для
                  </div>
                  {searchResults.unlockedQuests.filter(quest => quest).map(quest => (
                    <QuestListItem
                      key={quest!.id}
                      quest={quest!}
                      isCompleted={isQuestCompleted(quest!.id)}
                      isFailed={isQuestFailed(quest!.id)}
                      isSelected={selectedQuestId === quest!.id}
                      onToggle={onToggleQuest}
                      onMarkFailed={onMarkFailed}
                      onSelect={onSelectQuest}
                    />
                  ))}
                </>
              )}

              {/* Если ничего не найдено */}
              {(!searchResults?.directMatches.length && !searchResults?.requiredQuests.length && !searchResults?.unlockedQuests.length) && (
                <div className="quest-list-empty">
                  <p>Квесты не найдены</p>
                  <p className="text-muted">Попробуйте изменить поисковый запрос</p>
                </div>
              )}
            </>
          ) : (
            // Обычный список квестов
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

