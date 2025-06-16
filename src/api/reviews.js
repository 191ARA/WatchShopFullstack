const API_BASE = 'http://localhost:8080';

export const fetchReviews = async () => {
  const response = await fetch(`${API_BASE}/api/site-reviews`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка загрузки отзывов: ${errorText}`);
  }
  
  return await response.json();
};

export const fetchReviewStats = async () => {
  const response = await fetch(`${API_BASE}/api/site-reviews/stats`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка загрузки статистики: ${errorText}`);
  }
  
  const data = await response.json();
  return {
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0
  };
};

export const postReview = async (review, userId) => {
  const response = await fetch(`${API_BASE}/api/site-reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userId.toString()
    },
    body: JSON.stringify(review)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Ошибка при отправке отзыва");
  }
  
  return await response.json();
};