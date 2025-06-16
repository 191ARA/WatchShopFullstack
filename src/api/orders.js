import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const createOrder = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/orders`, orderData);
  return response.data;
};
export const getOrdersByUser = async (userId) => {
    const response = await axios.get(`${BASE_URL}/orders/user/${userId}`);
    return response.data.bookings || []; // возвращает список заказов
  };