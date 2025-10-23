/**
 * Компонент для отображения иконок квестов
 * Использует кастомные иконки из /public
 */

import React from 'react';
import './QuestIcon.css';

// Типы иконок
export type QuestIconType = 
  // Типы квестов
  | 'main' | 'side' | 'romance'
  // Награды
  | 'gold' | 'xp' | 'item'
  // Локации
  | 'vermund' | 'battahl' | 'volcanic' | 'unmoored'
  // Флаги
  | 'required' | 'missable' | 'critical'
  // Секции
  | 'info' | 'target' | 'unlock' | 'note' | 'link'
  // Другое
  | 'level';

interface QuestIconProps {
  type: QuestIconType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Маппинг типов на файлы иконок
const iconMap: Record<QuestIconType, string> = {
  // Типы квестов
  main: '/main_quest_icon.png',
  side: '/side_quest.png',
  romance: '/rose_icon.png',
  
  // Награды
  gold: '/treasure_icon.png',
  xp: '/potion_icon.png',
  item: '/glass_ball_icon.png',
  
  // Локации
  vermund: '/home_icon.png',
  battahl: '/gate_icon.png',
  volcanic: '/cave_icon.png',
  unmoored: '/way_point_icon.png',
  
  // Флаги
  required: '/scar_icon.png',
  missable: '/exit_icon.png',
  critical: '/warrior_icon.png',
  
  // Секции
  info: '/notes_icon.png',
  target: '/way_point_icon.png',
  unlock: '/gate_icon.png',
  note: '/notes_icon.png',
  link: '/fast_travel_icon.png',
  
  // Другое
  level: '/level_1_icon.png'
};

const iconAlt: Record<QuestIconType, string> = {
  main: 'Основной квест',
  side: 'Побочный квест',
  romance: 'Романтический квест',
  gold: 'Золото',
  xp: 'Опыт',
  item: 'Предмет',
  vermund: 'Vermund',
  battahl: 'Battahl',
  volcanic: 'Volcanic Island',
  unmoored: 'Unmoored World',
  required: 'Обязательный',
  missable: 'Провальный',
  critical: 'Критический',
  info: 'Информация',
  target: 'Цель',
  unlock: 'Открывает',
  note: 'Заметка',
  link: 'Ссылка',
  level: 'Уровень'
};

export const QuestIcon: React.FC<QuestIconProps> = ({ 
  type, 
  size = 'medium',
  className = ''
}) => {
  return (
    <img 
      src={iconMap[type]}
      alt={iconAlt[type]}
      className={`quest-icon quest-icon-${size} ${className}`}
      title={iconAlt[type]}
    />
  );
};
