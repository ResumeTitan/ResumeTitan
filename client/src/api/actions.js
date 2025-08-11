import axios from 'axios';

// configuration
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  maxRedirects: 5,
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// Metrics API functions
export const fetchDateRangeMetrics = async (startDate, endDate) => {
  try {
    const response = await api.get(`/metrics/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};
