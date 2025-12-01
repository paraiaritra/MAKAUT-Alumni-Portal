import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${BASE.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  createJob: (jobData) => api.post('/jobs', jobData),
  applyForJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

export const alumniAPI = {
  getAllAlumni: () => api.get('/alumni'),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (profileData) => api.put('/alumni/profile', profileData),
};

export default api;
