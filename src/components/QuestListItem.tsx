/**
 * Компонент элемента списка квестов
 * Три состояния: обычный / выполнен / провален
 */

import React from 'react';
import type { Quest } from '../types/quest';
import { QuestIcon } from './QuestIcon';
import './QuestListItem.css';

interface QuestListItemProps {
  quest: Quest;
  isCompleted: boolean;
  isFailed: boolean;
  isSelected: boolean;
  onToggle: (questId: string) => void;
  onMarkFailed: (questId: string) => void;
  onSelect: (questId: string) => void;
}

export const QuestListItem: React.FC<QuestListItemProps> = ({
  quest,
  isCompleted,
  isFailed,
  isSelected,
  onToggle,
  onMarkFailed,
  onSelect
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(quest.id);
  };

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFailed) {
      onToggle(quest.id);
    }
  };

  const handleFailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkFailed(quest.id);
  };

  // Определяем класс состояния
  const stateClass = isFailed 
    ? 'quest-list-item-failed' 
    : isCompleted 
      ? 'quest-list-item-completed' 
      : '';

  return (
    <div 
      className={`quest-list-item ${stateClass} ${isSelected ? 'quest-list-item-selected' : ''}`}
      onClick={() => onSelect(quest.id)}
    >
      {/* Основная информация */}
      <div className="quest-item-content">
        {/* Названия с иконкой */}
        <div className="quest-item-header">
          <div className="quest-item-title-row">
            {quest.flags.isRomance ? (
              <QuestIcon type="romance" size="medium" className="quest-item-icon" />
            ) : (
              <QuestIcon type={quest.type} size="medium" className="quest-item-icon" />
            )}
            <div className="quest-item-titles">
              <h3 className="quest-item-name">{quest.name}</h3>
              <p className="quest-item-name-ru">{quest.nameRu}</p>
            </div>
          </div>
          
          {/* Кнопки контроля */}
          <div className="quest-item-controls">
            <button
              className={`quest-control-btn ${isCompleted ? 'quest-control-active' : ''}`}
              onClick={handleCompleteClick}
              disabled={isFailed}
              title={isCompleted ? 'Отменить выполнение' : 'Отметить выполненным'}
            >
              ✓
            </button>
            <button
              className={`quest-control-btn quest-control-fail ${isFailed ? 'quest-control-active' : ''}`}
              onClick={handleFailClick}
              title={isFailed ? 'Отменить провал' : 'Отметить проваленным'}
            >
              ✗
            </button>
          </div>
        </div>

        {/* Локация */}
        <div className="quest-item-location-info">
          <span className="quest-item-location">
            {quest.location === 'Vermund' && <QuestIcon type="vermund" size="small" />}
            {quest.location === 'Battahl' && <QuestIcon type="battahl" size="small" />}
            {quest.location === 'Volcanic Island' && <QuestIcon type="volcanic" size="small" />}
            {quest.location === 'Unmoored World' && <QuestIcon type="unmoored" size="small" />}
            {quest.location}
          </span>
          {quest.subLocation && (
            <span className="quest-item-sublocation">→ {quest.subLocation}</span>
          )}
        </div>

        {/* Описание */}
        <p className="quest-item-description">{quest.description}</p>

        {/* Флаги/Теги */}
        <div className="quest-item-flags">
          {quest.flags.isRequired && (
            <span className="dd2-badge dd2-badge-red" title="Обязателен для других квестов">
              <QuestIcon type="required" size="small" />
              Обязательный
            </span>
          )}
          
          {quest.flags.isRomance && (
            <span className="dd2-badge quest-romance-badge" title="Романтический квест">
              <QuestIcon type="romance" size="small" />
              Романтический
            </span>
          )}
          
          {quest.flags.isMissable && (
            <span className="dd2-badge dd2-badge-red" title="Можно пропустить навсегда">
              <QuestIcon type="missable" size="small" />
              Провальный
            </span>
          )}
          
          {quest.flags.isCritical && (
            <span className="dd2-badge dd2-badge-gold" title="Критичен для прохождения">
              <QuestIcon type="critical" size="small" />
              Критический
            </span>
          )}

          {isFailed && (
            <span className="dd2-badge quest-item-failed-badge">
              <QuestIcon type="missable" size="small" />
              Провален
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

