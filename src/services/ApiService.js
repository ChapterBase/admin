import axios from 'axios';
// import SInfo from 'react-native-secure-storage';

// const secureStoreOptions = {
//   sharedPreferencesName: 'myAppPrefs',
//   keychainService: 'myAppKeychain'
// };

// const publicApiClient = axios.create({
//   baseURL: 'http://172.20.10.3:8082/api/app'
// });

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/admin',
});

// apiClient.interceptors.request.use(async (config) => {
//   try {
//     const token = await SInfo.getItem('accessToken', secureStoreOptions);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error('Error retrieving access token:', error);
//   }
//   return config;
// }, error => Promise.reject(error));


export { apiClient };
