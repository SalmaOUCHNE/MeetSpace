import axios from 'axios';

const API_BASE = 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
};

export const roomService = {
  getAll: () => api.get('/api/rooms'),
  getById: (id: number) => api.get(`/api/rooms/${id}`),
  create: (data: { name: string; capacity: number; equipment: string }) =>
    api.post('/api/rooms', data),
  update: (id: number, data: { name: string; capacity: number; equipment: string }) =>
    api.put(`/api/rooms/${id}`, data),
  delete: (id: number) => api.delete(`/api/rooms/${id}`),
  getAvailable: (date: string, startTime: string, endTime: string) =>
    api.get('/api/rooms/available', { params: { date, startTime, endTime } }),
};

export const reservationService = {
  create: (data: { roomId: number; date: string; startTime: string; endTime: string }) =>
    api.post('/api/reservations', data),
  getMyReservations: () => api.get('/api/reservations/my'),
  cancel: (id: number) => api.patch(`/api/reservations/${id}/cancel`),
  getAll: () => api.get('/api/reservations'),
  getStats: () => api.get('/api/reservations/stats'),
};

export default api;
