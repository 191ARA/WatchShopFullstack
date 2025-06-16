import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import './Footer.css';

function Footer() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer__content">
        <p className="footer__text">© {currentYear} {t.watchStore}</p>

      </div>
    </footer>
  );
}

export default Footer;