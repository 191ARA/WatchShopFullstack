import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import { logout } from '../store/authSlice';
import './Navbar.css';

function Navbar() {
  // Получаем пользователя из Redux store
  const user = useSelector((state) => state.auth.user);
  
  // Получаем функцию dispatch для отправки actions
  const dispatch = useDispatch();
  
  // Получаем тему и язык из контекстов (их пока оставляем как есть)
  const { theme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  // Обработчик выхода
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">{t.home}</Link>
        <Link to="/watches" className="navbar__link">{t.catalog}</Link>
        <Link to="/reviews" className="navbar__link">{t.reviews}</Link>
        {user && <Link to="/my-orders" className="navbar__link">{t.myOrders}</Link>}
        {user && <Link to="/profile" className="navbar__link">{t.profile}</Link>}
        {user?.role === "admin" && (
          <Link to="/admin" className="navbar__link">{t.adminPanel}</Link>
        )}
      </div>

      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__greeting">{t.hello}, {user.name}</span>
            <button onClick={handleLogout} className="navbar__logout">{t.logout}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">{t.login}</Link>
            <Link to="/register" className="navbar__link">{t.register}</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;