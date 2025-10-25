/**
 * Компонент Header - Шапка приложения
 */

import React from 'react';
import './Header.css';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <img 
            src="./header_logo.png" 
            alt="Dragon's Dogma 2" 
            className="header-logo"
          />
          <h1 className="header-title">Quest Tracker</h1>
        </div>

        {onReset && (
          <button 
            className="dd2-button header-reset"
            onClick={onReset}
            title="Сбросить весь прогресс"
          >
            Сброс прогресса
          </button>
        )}
      </div>
    </header>
  );
};

