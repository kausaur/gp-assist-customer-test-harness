import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_PHOENIX_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("phoenixAuthToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const api = {
  get: (url, config) => apiInstance.get(url, config),
  post: (url, data, config) => apiInstance.post(url, data, config),
};

export default api;
