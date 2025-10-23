import { useState, useEffect } from 'react';
import './styles/theme.css';
import './App.css';
import { Header } from './components/Header';
import { QuestProgress } from './components/QuestProgress';
import { QuestList } from './components/QuestList';
import { QuestDetails } from './components/QuestDetails';
import { useQuestProgress } from './hooks/useQuestProgress';
import type { QuestsData } from './types/quest';

const App = () => {
  const [questsData, setQuestsData] = useState<QuestsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // Загрузка данных квестов
  useEffect(() => {
    fetch('/quests.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load quests');
        return res.json();
      })
      .then((data: QuestsData) => {
        setQuestsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading quests:', err);
        setError('Не удалось загрузить данные квестов');
        setLoading(false);
      });
  }, []);

  // Хук для работы с прогрессом
  const {
    getCategoryProgress,
    toggleQuest,
    isQuestCompleted,
    isQuestFailed,
    markQuestFailed,
    resetProgress
  } = useQuestProgress(questsData?.quests || []);

  // Обработка сброса прогресса
  const handleResetProgress = () => {
    if (window.confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      resetProgress();
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка квестов Dragon's Dogma 2...</p>
      </div>
    );
  }

  if (error || !questsData) {
    return (
      <div className="app-error">
        <h2>Ошибка загрузки</h2>
        <p>{error || 'Неизвестная ошибка'}</p>
      </div>
    );
  }

  const categoryProgress = getCategoryProgress();

  return (
    <div className="app">
      {/* Header - шапка приложения */}
      <Header onReset={handleResetProgress} />

      {/* Блок прогресса */}
      <QuestProgress progress={categoryProgress} />

      {/* Основной контент: Блок 2 (список) + Блок 3 (детали) */}
      <div className="app-content">
        {/* Блок 2: Список квестов */}
        <QuestList
          quests={questsData.quests}
          isQuestCompleted={isQuestCompleted}
          isQuestFailed={isQuestFailed}
          onToggleQuest={toggleQuest}
          onMarkFailed={markQuestFailed}
          onSelectQuest={setSelectedQuestId}
          selectedQuestId={selectedQuestId}
        />

        {/* Блок 3: Детали квеста */}
        <QuestDetails
          quest={selectedQuestId ? questsData.quests.find(q => q.id === selectedQuestId) || null : null}
          allQuests={questsData.quests}
          isCompleted={selectedQuestId ? isQuestCompleted(selectedQuestId) : false}
          isFailed={selectedQuestId ? isQuestFailed(selectedQuestId) : false}
          onToggle={toggleQuest}
          onMarkFailed={markQuestFailed}
        />
      </div>
    </div>
  );
};

export default App;
