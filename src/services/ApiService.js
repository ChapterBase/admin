import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7069'
  // baseURL: 'http://localhost:5261'
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');

    console.log('Access token retrieved from localStorage:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error retrieving access token:', error);
  }
  return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(
  response => response,
  error => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    window.location.href = '/login';
    return Promise.reject(error);
  }
);

export { apiClient };