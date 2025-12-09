import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const signupUser = async (data: {
  name: string;
  phone: string;
  location: string;
  age: number;
  income: number;
  password: string;
}) => {
  const response = await api.post('/api/signup', data);
  return response.data;
};

export const loginUser = async (data: { phone: string; password: string }) => {
  const response = await api.post('/api/login', data);
  return response.data;
};

// Loans API
export const getLoans = async () => {
  const response = await api.get('/api/loans');
  return response.data;
};

// Reviews API
export const getReviews = async () => {
  const response = await api.get('/api/reviews');
  return response.data;
};

// Chat API
export const sendChatMessage = async (message: string, conversationId?: string) => {
  const response = await api.post('/api/chat', { message, conversationId });
  return response.data;
};

// Result API
export const getResult = async (userId: string) => {
  const response = await api.get(`/api/result?userId=${userId}`);
  return response.data;
};

export const downloadResultPDF = async (userId: string) => {
  const response = await api.get(`/api/result?userId=${userId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
