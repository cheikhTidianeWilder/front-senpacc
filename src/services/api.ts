// import axios from 'axios';

// // Utilisation de la syntaxe Vite pour les variables d'environnement
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Intercepteur pour gérer les tokens d'authentification
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api; 

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur pour rafraîchir automatiquement le token
api.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 403 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await api.post('/auth/refreshToken');
        localStorage.setItem('token', data.accessToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(error.config);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
