import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${BASE.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // IMPORTANT: Let browser set Content-Type for FormData (File Uploads)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth API ---
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// --- Events API ---
export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

// --- Jobs API ---
export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  createJob: (jobData) => api.post('/jobs', jobData),
  applyForJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

// --- Alumni API ---
export const alumniAPI = {
  getAllAlumni: () => api.get('/alumni'),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (profileData) => api.put('/alumni/profile', profileData),
  uploadAvatar: (formData) => api.post('/upload/avatar', formData), // New
};

// --- Payment API ---
export const paymentAPI = {
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

// --- Admin API ---
export const adminAPI = {
  getUnverifiedUsers: () => api.get('/admin/unverified'), // You need to add this route in backend
  verifyUser: (userId) => api.post(`/admin/verify/${userId}`),
};

export default api;