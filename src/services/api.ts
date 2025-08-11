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
        const { data } = await api.post('/auth/refresh');
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




