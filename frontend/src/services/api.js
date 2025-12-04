import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${BASE.replace(/\/+$/, '')}/api`;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) delete config.headers['Content-Type'];
    else config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getParticipants: (id) => api.get(`/events/${id}/participants`),
};

export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  createJob: (data) => api.post('/jobs', data),
  applyForJob: (id) => api.post(`/jobs/${id}/apply`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
};

export const alumniAPI = {
  getAllAlumni: () => api.get('/alumni'),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (data) => api.put('/alumni/profile', data),
  uploadAvatar: (data) => api.post('/upload/avatar', data),
};

export const paymentAPI = {
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

export const adminAPI = {
  getUnverifiedUsers: () => api.get('/admin/unverified'),
  getPremiumMembers: () => api.get('/admin/members'),
  verifyUser: (id) => api.post(`/admin/verify/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`), // NEW FUNCTION
};

export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getMessages: () => api.get('/contact'),
};

export default api;