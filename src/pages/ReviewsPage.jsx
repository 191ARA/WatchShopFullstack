import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { fetchReviews, postReview, fetchReviewStats } from "../api/reviews";
import "./ReviewsPage.css";

function ReviewsPage() {
  const user = useSelector((state) => state.auth.user); // Получаем пользователя из Redux
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const t = require("../context/translations.json")[language];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          fetchReviews(),
          fetchReviewStats()
        ]);
        setReviews(reviewsData);
        setStats(statsData);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
        setErrorMessage(t.failedToLoadReviews || "Не удалось загрузить отзывы");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!reviewText.trim()) {
      setErrorMessage(t.reviewTextRequired || "Текст отзыва не может быть пустым");
      return;
    }

    try {
      if (!user || !user.userId) {
        throw new Error(t.authRequiredMessage || "Для отправки отзыва требуется авторизация");
      }

      const newReview = {
        comment: reviewText,
        rating: rating
      };

      const response = await postReview(newReview, user.userId);

      if (response.success) {
        const [updatedReviews, updatedStats] = await Promise.all([
          fetchReviews(),
          fetchReviewStats()
        ]);
        setReviews(updatedReviews);
        setStats(updatedStats);
        setReviewText("");
        setRating(5);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Ошибка отправки отзыва:", error);
      setErrorMessage(error.message || t.submitError || "Ошибка при отправке отзыва");
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="loading">{t.loadingReviews || "Загрузка отзывов..."}</div>;
  }

  return (
    <div className={`reviews-container ${theme}`}>
      <h2>{t.reviewsTitle || "Отзывы о сайте"}</h2>

      {/* Статистика */}
      <div className="stats-container">
        <div className={`stat-card ${theme}`}>
          <h3>{t.averageRatingLabel || "Средняя оценка"}</h3>
          <div className="stat-value rating">
            {stats.averageRating?.toFixed(1) || 0}/5
          </div>
        </div>

        <div className={`stat-card ${theme}`}>
          <h3>{t.totalReviewsLabel || "Всего отзывов"}</h3>
          <div className="stat-value count">
            {stats.totalReviews || 0}
          </div>
        </div>
      </div>

      {/* Форма добавления отзыва */}
      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h3>{t.leaveReviewTitle || "Оставить отзыв"}</h3>

          <div className="rating-selector">
            <label>
              <span>{t.ratingLabel || "Оценка"}:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {t[`stars_${num}`] || `${num} звезд${num !== 1 ? 'ы' : 'а'}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t.reviewPlaceholder || "Напишите ваш отзыв..."}
            className={`review-textarea ${theme}`}
          />

          {errorMessage && (
            <div className={`error-message ${theme}`}>
              {errorMessage}
            </div>
          )}

          <button type="submit" className={`submit-button ${theme}`}>
            {t.submitReviewButton || "Отправить отзыв"}
          </button>
        </form>
      ) : (
        <div className="auth-required">
          <p>{t.authRequiredMessage || "Для оставления отзыва требуется авторизация"}</p>
        </div>
      )}

      {/* Список отзывов */}
      <div className="reviews-list">
        <h3>{t.latestReviews || "Последние отзывы"}</h3>

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>{t.noReviewsYet || "Отзывов пока нет"}</p>
          </div>
        ) : (
          <>
            <div className="reviews-grid">
              {currentReviews.map((review) => (
                <div key={review.id} className={`review-card ${theme}`}>
                  <div className="review-header">
                    <div className="review-user">
                      <span className="user-name">
                        {review.user?.name || t.anonymousUser || "Анонимный пользователь"}
                      </span>
                      <span className="user-rating">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <p className="review-content">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(reviews.length / reviewsPerPage) },
                (_, i) => i + 1
              ).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`page-button ${theme} ${currentPage === number ? "active" : ""}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
