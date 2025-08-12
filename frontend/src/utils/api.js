import axios from 'axios';

// ✅ Use NEXT_PUBLIC_API_URL from environment (fallback to localhost in dev)
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;