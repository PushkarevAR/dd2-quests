/**
 * Компонент детального описания квеста
 */

import React from 'react';
import type { Quest } from '../types/quest';
import { QuestIcon } from './QuestIcon';
import './QuestDetails.css';

interface QuestDetailsProps {
  quest: Quest | null;
  allQuests: Quest[];
  isCompleted: boolean;
  isFailed: boolean;
  onToggle: (questId: string) => void;
  onMarkFailed: (questId: string) => void;
  onSelectQuest: (questId: string | null) => void;
}

export const QuestDetails: React.FC<QuestDetailsProps> = ({
  quest,
  allQuests,
  isCompleted,
  isFailed,
  onToggle,
  onMarkFailed,
  onSelectQuest,
}) => {
  if (!quest) {
    return (
      <div className="quest-details quest-details-empty">
        <div className="quest-details-empty-content">
          <img 
            src="./DD2_title_logo_GL.png" 
            alt="Dragon's Dogma 2" 
            className="empty-logo"
          />
          <h2>Детали квеста</h2>
          <p>Выберите квест из списка для просмотра подробной информации</p>
        </div>
      </div>
    );
  }

  // Получить объект квеста по ID
  const getQuestById = (id: string) => allQuests.find(q => q.id === id);

  // Определяем класс состояния
  const stateClass = isFailed 
    ? 'quest-details-failed' 
    : isCompleted 
      ? 'quest-details-completed' 
      : '';

  return (
    <div className={`quest-details ${stateClass}`}>
      <div className="quest-details-scroll">
        {/* Заголовок с иконкой */}
        <div className="quest-details-header">
          <div className="quest-details-title-with-icon">
            {quest.flags.isRomance ? (
              <QuestIcon type="romance" size="large" className="quest-title-icon" />
            ) : (
              <QuestIcon type={quest.type} size="large" className="quest-title-icon" />
            )}
            <div className="quest-title-text">
              <h1 className="quest-details-name">{quest.nameRu}</h1>
              <h2 className="quest-details-name-ru">{quest.name}</h2>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
            <button 
              className="quest-details-close"
              onClick={() => onSelectQuest(null)}
              title="Закрыть детали квеста"
            >
              ✕
            </button>

            {/* Badges с особенностями */}
            <div className="quest-details-badges-row">
              {quest.flags.isRequired && (
                <span className="dd2-badge dd2-badge-blue">
                  <QuestIcon type="required" size="small" /> Обязательный
                </span>
              )}
              {quest.flags.isRomance && (
                <span className="dd2-badge dd2-badge-pink">
                  <QuestIcon type="romance" size="small" /> Романтический
                </span>
              )}
              {quest.flags.isMissable && (
                <span className="dd2-badge dd2-badge-orange">
                  <QuestIcon type="missable" size="small" /> Пропускаемый
                </span>
              )}
              {quest.flags.isCritical && (
                <span className="dd2-badge dd2-badge-red">
                  <QuestIcon type="critical" size="small" /> Критичный
                </span>
              )}
              {isCompleted && (
                <span className="dd2-badge dd2-badge-green">✓ Выполнен</span>
              )}
              {isFailed && (
                <span className="dd2-badge dd2-badge-red">✗ Провален</span>
              )}
            </div>
          </div>
        </div>

        {/* Основная информация - объединённая секция */}
        <div className="quest-details-section">
          <h3 className="quest-details-section-title">
            <QuestIcon type="info" size="small" /> Информация
          </h3>
          
          {/* Локация */}
          <div className="quest-details-location">
            {quest.location === 'Королевство Вермунд' && <QuestIcon type="vermund" size="small" />}
            {quest.location === 'Королевство Батталь' && <QuestIcon type="battahl" size="small" />}
            {quest.location === 'Вулканический остров' && <QuestIcon type="volcanic" size="small" />}
            {quest.location === 'Изнанка мира' && <QuestIcon type="unmoored" size="small" />}
            <span className="location-primary">{quest.location}</span>
            {quest.subLocation && (
              <>
                <span className="location-arrow">→</span>
                <span className="location-sub">{quest.subLocation}</span>
              </>
            )}
          </div>

          {/* Описание */}
          <p className="quest-details-description">{quest.description}</p>

          {/* Как начать - в одну строку */}
          <div className="quest-info-row">
            <span className="info-label">
              <QuestIcon type="target" size="small" /> Как начать: 
            </span>
            <span className="info-value">{quest.howToStart}</span>
          </div>
          
          {/* NPC */}
          {quest.npc?.name && (
            <div className="quest-details-npc">
              <span className="npc-label">NPC:</span>
              <span className="npc-name">{quest.npc.name}</span>
              {quest.npc.location && (
                <span className="npc-location">({quest.npc.location})</span>
              )}
            </div>
          )}
        </div>

        {/* Требования */}
        {((quest.requirements?.quests?.length > 0) || quest.requirements?.level || (quest.requirements?.items?.length > 0)) && (
          <div className="quest-details-section">
            <h3 className="quest-details-section-title">
              <QuestIcon type="required" size="small" /> Требования
            </h3>
            
            {quest.requirements?.quests?.length > 0 && (
              <div className="quest-details-requirements">
                <span className="req-label">Необходимые квесты:</span>
                <ul className="req-list">
                  {quest.requirements?.quests?.map(reqId => {
                    const reqQuest = getQuestById(reqId);
                    return (
                      <li key={reqId} className="req-list-item">
                        {reqQuest ? (
                          <>
                            <QuestIcon type={reqQuest.type} size="small" />
                            <span>{reqQuest.name} ({reqQuest.nameRu})</span>
                          </>
                        ) : (
                          <span>{reqId}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {quest.requirements?.level && (
              <div className="quest-details-requirements">
                <span className="req-label">Рекомендуемый уровень:</span>
                <span className="req-value">{quest.requirements.level}</span>
              </div>
            )}

            {quest.requirements?.items?.length > 0 && (
              <div className="quest-details-requirements">
                <span className="req-label">Необходимые предметы:</span>
                <ul className="req-list">
                  {quest.requirements?.items?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Награды и Открывает квесты - в одной строке */}
        <div className="quest-details-row">
          {/* Награды */}
          <div className="quest-details-section quest-details-section-half">
            <h3 className="quest-details-section-title">
              <QuestIcon type="item" size="small" /> Награды
            </h3>
            <ul className="quest-rewards-list">
              {quest.rewards.gold > 0 && (
                <li className="reward-list-item">
                  <QuestIcon type="gold" size="small" />
                  <span>{quest.rewards.gold.toLocaleString('ru-RU')} золота</span>
                </li>
              )}
              
              {quest.rewards.xp > 0 && (
                <li className="reward-list-item">
                  <QuestIcon type="xp" size="small" />
                  <span>{quest.rewards.xp.toLocaleString('ru-RU')} XP</span>
                </li>
              )}

              {quest.rewards.items.length > 0 && (
                quest.rewards.items.map((item, idx) => (
                  <li key={idx} className="reward-list-item">
                    <QuestIcon type="item" size="small" />
                    <span>{item}</span>
                  </li>
                ))
              )}

              {quest.rewards.gold === 0 && quest.rewards.xp === 0 && quest.rewards.items.length === 0 && (
                <li className="text-muted">Нет наград</li>
              )}
            </ul>
          </div>

          {/* Открывает квесты */}
          {quest.unlocks?.length > 0 && (
            <div className="quest-details-section quest-details-section-half">
              <h3 className="quest-details-section-title">
                <QuestIcon type="unlock" size="small" /> Открывает квесты
              </h3>
              <ul className="quest-unlocks-list">
                {quest.unlocks?.map(unlockId => {
                  const unlockQuest = getQuestById(unlockId);
                  return (
                    <li key={unlockId} className="unlock-list-item">
                      {unlockQuest ? (
                        <>
                          <QuestIcon type={unlockQuest.type} size="small" />
                          <span>{unlockQuest.name} ({unlockQuest.nameRu})</span>
                        </>
                      ) : (
                        <span>{unlockId}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>


        {/* Ссылки на гайды */}
        {quest.links?.length > 0 && (
          <div className="quest-details-section">
            <h3 className="quest-details-section-title">
              <QuestIcon type="link" size="small" /> Гайды и прохождения
            </h3>
            <div className="quest-details-links">
              {quest.links.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quest-link"
                >
                  <span className="link-source">{link.source || 'Ссылка'}</span>
                  <span className="link-lang">({link.language?.toUpperCase() || 'RU'})</span>
                  <span className="link-icon">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Заметки */}
        {quest.notes && (
          <div className="quest-details-section quest-details-notes">
            <h3 className="quest-details-section-title">
              <QuestIcon type="note" size="small" /> Важно
            </h3>
            <p className="quest-notes-text">{quest.notes}</p>
          </div>
        )}

        {/* Кнопки управления - в конце */}
        <div className="quest-details-controls">
          <button 
            className="dd2-button quest-details-toggle"
            onClick={() => onToggle(quest.id)}
            disabled={isFailed}
          >
            {isCompleted ? 'Отменить выполнение' : 'Отметить выполненным'}
          </button>
          <button 
            className="dd2-button quest-details-fail"
            onClick={() => onMarkFailed(quest.id)}
          >
            {isFailed ? 'Отменить провал' : 'Отметить проваленным'}
          </button>
        </div>
      </div>
    </div>
  );
};

