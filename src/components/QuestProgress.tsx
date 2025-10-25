/**
 * Компонент отображения прогресса прохождения квестов
 */

import React from 'react';
import { CategoryProgress } from '../types/quest';
import { QuestIcon } from './QuestIcon';
import './QuestProgress.css';

interface QuestProgressProps {
  progress: CategoryProgress;
}

export const QuestProgress: React.FC<QuestProgressProps> = ({ progress }) => {
  return (
    <div className="quest-progress">
      <div className="quest-progress-container">
        {/* Статистика в одну строку */}
        <div className="progress-stats-inline">
          {/* Всего */}
          <div className="progress-stat-item progress-stat-total">
            <span className="progress-label">Всего:</span>
            <span className="progress-value">
              <span className="progress-completed">{progress.total.completed}</span>
              <span className="progress-separator">/</span>
              <span className="progress-total">{progress.total.total}</span>
            </span>
            <span className="progress-percent">({progress.total.percentage}%)</span>
          </div>

          <div className="progress-divider">•</div>

          {/* Основные */}
          <div className="progress-stat-item">
            <span className="progress-label">Основные:</span>
            <span className="progress-value">
              {progress.main.completed}/{progress.main.total}
            </span>
          </div>

          <div className="progress-divider">•</div>

          {/* Побочные */}
          <div className="progress-stat-item">
            <span className="progress-label">Побочные:</span>
            <span className="progress-value">
              {progress.side.completed}/{progress.side.total}
            </span>
          </div>

          <div className="progress-divider">•</div>

          {/* Vermund */}
          <div className="progress-stat-item">
            <span className="progress-label">
              <QuestIcon type="vermund" size="small" /> Королевство Вермунд:
            </span>
            <span className="progress-value">
              {progress.vermund.completed}/{progress.vermund.total}
            </span>
          </div>

          <div className="progress-divider">•</div>

          {/* Battahl */}
          <div className="progress-stat-item">
            <span className="progress-label">
              <QuestIcon type="battahl" size="small" /> Королевство Батталь:
            </span>
            <span className="progress-value">
              {progress.battahl.completed}/{progress.battahl.total}
            </span>
          </div>

          <div className="progress-divider">•</div>

          {/* Volcanic Island */}
          <div className="progress-stat-item">
            <span className="progress-label">
              <QuestIcon type="volcanic" size="small" /> Вулканический остров:
            </span>
            <span className="progress-value">
              {progress.volcanic.completed}/{progress.volcanic.total}
            </span>
          </div>

          <div className="progress-divider">•</div>

          {/* Unmoored */}
          <div className="progress-stat-item">
            <span className="progress-label">
              <QuestIcon type="unmoored" size="small" /> Изнанка мира:
            </span>
            <span className="progress-value">
              {progress.unmoored.completed}/{progress.unmoored.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

