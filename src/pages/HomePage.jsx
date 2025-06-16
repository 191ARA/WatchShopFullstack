import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import bgImage from './sss.webp'; 
import './HomePage.css';

function HomePage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div
      className="homepage-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="homepage-content animate-fade-in">
        <h1 className="homepage-title">
          {t.homeTitleLine1}<br />{t.homeTitleLine2}
        </h1>
        <Link to="/watches">
          <button className="homepage-button">
            {t.viewWatches}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;