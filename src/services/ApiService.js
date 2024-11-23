import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5261',
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error retrieving access token:', error);
  }
  return config;
}, error => Promise.reject(error));

export { apiClient };