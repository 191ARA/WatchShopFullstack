import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { logout } from '../store/authSlice';
import { changePassword } from '../api/auth';
import translations from '../context/translations.json';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Валидация
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ text: t.allFieldsRequired, type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: t.passwordsNotMatch, type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: t.passwordMinLength, type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(
        user.userId,
        currentPassword,
        newPassword
      );

      setMessage({
        text: result.message || t.passwordChangeSuccess,
        type: 'success',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Разлогин через 2 сек
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || t.passwordChangeError;
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`profile-container ${theme}`}>
        <p>{t.loginRequired2}</p>
      </div>
    );
  }

  return (
    <div className={`profile-container ${theme}`}>
      <h1 className="profile-title">{t.profileTitle}</h1>

      <div className={`user-info ${theme}`}>
        <div className="info-item">
          <span className="info-label">{t.name}:</span>
          <span className="info-value">{user.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">{t.role}:</span>
          <span className="info-value">
            {user.role === 'admin' ? t.admin : t.user}
          </span>
        </div>
      </div>

      <div className={`password-change-form ${theme}`}>
        <h2 className="form-title">{t.changePassword}</h2>

        {message.text && (
          <div className={`message ${message.type} ${theme}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              {t.currentPassword}:
            </label>
            <input
              type="password"
              id="currentPassword"
              className={`form-input ${theme}`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              {t.newPassword} ({t.min6chars}):
            </label>
            <input
              type="password"
              id="newPassword"
              className={`form-input ${theme}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t.confirmPassword}:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${theme}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${theme}`}
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.changePasswordButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
