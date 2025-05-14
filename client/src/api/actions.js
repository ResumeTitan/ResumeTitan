import axios from 'axios';
import store from 'state';

// configuration
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create a function to get the current token
let getTokenFunction = null;
export const setTokenFunction = (fn) => {
  getTokenFunction = fn;
};

api.interceptors.request.use(async function (config) {
  if (getTokenFunction) {
    const token = await getTokenFunction();
    if (token) {
      // Ensure the token is properly formatted as a Bearer token
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
