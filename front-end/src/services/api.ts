// src/services/api.ts
import axios from 'axios';

// cria uma instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base do seu backend
  timeout: 10000, // tempo máximo de espera
});

// interceptador para incluir token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ou outro storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptador para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // exemplo: redirecionar para login se token inválido
      console.error('Não autorizado, faça login novamente');
    }
    return Promise.reject(error);
  }
);

export default api;
