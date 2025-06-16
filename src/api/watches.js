import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const fetchWatches = async () => {
  const response = await axios.get(`${BASE_URL}/watches`);
  return response.data;
};

export const getWatchById = async (id) => {
    const response = await axios.get(`${BASE_URL}/watches/${id}`);
    return response.data;
  };
  