import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (user) => {
  const response = await axios.post(`${BASE_URL}/register`, user);
  return response.data;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/${userId}/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};