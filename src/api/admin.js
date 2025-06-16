import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const adminFetchWatches = async () => {
  const response = await axios.get(`${BASE_URL}/watches`);
  return response.data;
};

export const adminCreateWatch = async (watchData) => {
  const response = await axios.post(`${BASE_URL}/watches`, watchData);
  return response.data;
};

export const adminUpdateWatch = async (id, watchData) => {
  const response = await axios.put(`${BASE_URL}/watches/${id}`, watchData);
  return response.data;
};

export const adminDeleteWatch = async (id) => {
  const response = await axios.delete(`${BASE_URL}/watches/${id}`);
  return response.data;
};

export const adminFetchOrders = async () => {
  const response = await axios.get(`${BASE_URL}/orders`);
  return response.data;
};

export const adminDeleteOrder = async (id) => {
  const response = await axios.delete(`${BASE_URL}/orders/${id}`);
  return response.data;
};


// Управление пользователями
export const adminFetchUsers = async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  };
  
  export const adminUpdateUser = async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/users/${id}`, userData);
    return response.data;
  };
  
  export const adminDeleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`);
    return response.data;
  };
  
  // Управление заказами
  export const adminUpdateOrder = async (id, orderData) => {
    const response = await axios.put(`${BASE_URL}/orders/${id}`, orderData);
    return response.data;
  };