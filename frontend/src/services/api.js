import axios from 'axios';

// Use relative path /api for production (proxied by nginx)
// or environment variable for custom backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getAllUsers: (search = '') => api.get('/users', { params: { search } }),
  getUserById: (userId) => api.get(`/users/${userId}`),
};

// Project API
export const projectAPI = {
  getAllProjects: (params = {}) => api.get('/projects', { params }),
  getProjectById: (projectId) => api.get(`/projects/${projectId}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (projectId, data) => api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members/${userId}`),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
  getMyProjects: () => api.get('/projects/my-projects'),
};

export default api;
