import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.API_URL || 'https://atelier-jesmarite-production.up.railway.app';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'https://atelier-jesmarite.vercel.app'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  const sessionId = localStorage.getItem('sessionId');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }

  return config;
});

export default axiosInstance;