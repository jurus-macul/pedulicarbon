import axios from 'axios';
import config from '../config';
import { getApiURL, getCorsHeaders } from '../utils/corsConfig';

const api = axios.create({
  baseURL: getApiURL(),
  timeout: config.api.timeout,
  headers: getCorsHeaders(),
  // CORS settings
  withCredentials: process.env.NODE_ENV === 'development',
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.response?.status === 0) {
      console.error('🌐 CORS/Network Error:', error);
      console.error('💡 Try running: npm run setup:proxy');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 