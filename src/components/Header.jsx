import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import './Header.css'; 

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <header className={`header ${theme}`}>
      <h1 className="header__title">{t.title}</h1>
      
      <div className="header__controls">
        <div className="theme-switcher">

          <button 
            onClick={toggleTheme}
            className="theme-switcher__button"
          >
            {theme === 'dark' ? t.light : t.dark}
          </button>
        </div>

        <div className="language-selector">

          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-selector__select"
          >
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;