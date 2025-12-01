import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Events API
export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

// Jobs API
export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  createJob: (jobData) => api.post('/jobs', jobData),
  applyForJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

// Alumni API
export const alumniAPI = {
  getAllAlumni: () => api.get('/alumni'),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (profileData) => api.put('/alumni/profile', profileData),
};

export default api;