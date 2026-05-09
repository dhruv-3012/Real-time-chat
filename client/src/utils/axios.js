import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://real-time-chat-m227.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default instance;