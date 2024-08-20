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

api.interceptors.request.use(function (config) {
  const token = store.getState().token;
  config.headers.Authorization =  token;
   
  return config;
});

export default api;
