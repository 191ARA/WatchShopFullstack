import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const data = await registerUser(form);
      if (data.success) {
        navigate("/login");
      } else {
        setMessage(data.message || t.registerError);
      }
    } catch (err) {
      setMessage(t.registerError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`register-container ${theme}`}>
      <div className="register-card">
        <h2 className="register-title">{t.register}</h2>
        
        {message && (
          <div className={`register-message ${theme}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">{t.name}</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-input ${theme}`}
              placeholder={t.namePlaceholder}
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">{t.email}</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input ${theme}`}
              placeholder={t.emailPlaceholder}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">{t.password}</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-input ${theme}`}
              placeholder={t.passwordPlaceholder}
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className={`register-button ${theme}`}
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.register}
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            {t.haveAccount} <Link to="/login" className="footer-link">{t.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;