import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice"; 
import { loginUser } from "../api/auth";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import './LoginPage.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const data = await loginUser(email, password);
      if (data.success) {
        dispatch(login(data)); // сохраняем пользователя в Redux
        navigate("/");
      } else {
        setMessage(data.message || t.loginError);
      }
    } catch (err) {
      setMessage(t.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-card">
        <h2 className="login-title">{t.login}</h2>

        {message && (
          <div className={`login-message ${theme}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">{t.email}</label>
            <input
              id="email"
              type="email"
              className={`form-input ${theme}`}
              placeholder={t.emailPlaceholder}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">{t.password}</label>
            <input
              id="password"
              type="password"
              className={`form-input ${theme}`}
              placeholder={t.passwordPlaceholder}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`login-button ${theme}`}
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.login}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            {t.noAccount} <Link to="/register" className="footer-link">{t.register}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
