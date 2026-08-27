import axios from 'axios';

export const api = axios.create({
  // Em desenvolvimento, o Vite encaminha /api para o back-end em :5080.
  // Em produção, configure VITE_API_URL com a URL pública da API.
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Mukies:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
