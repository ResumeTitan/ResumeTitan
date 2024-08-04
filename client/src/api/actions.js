import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

// configuration
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// const setupInterceptors = () => {
//   api.interceptors.request.use(
//     async (config) => {
//       const { getToken } = useUser();
//       const token = await getToken();

//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }

//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
// };

// setupInterceptors();

export default api