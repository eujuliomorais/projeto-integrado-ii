import axios from 'axios';

export const api_base_url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: api_base_url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

console.info('Backend running on: ', api_base_url);

export default api;
