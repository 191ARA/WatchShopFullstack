import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translationsadmin.json';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div className={`not-found-container ${theme}`}>
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">{t.pageNotFound}</h2>
        <p className="not-found-text">{t.pageNotFoundMessage}</p>
        <Link to="/" className={`not-found-link ${theme}`}>
          {t.returnToHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;