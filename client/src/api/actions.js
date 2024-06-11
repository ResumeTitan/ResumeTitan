import axios from 'axios';
import store from '../state';

store.subscribe(listener)

function select(state) {
  return state.token;
}

function listener() {
  let token = select(store.getState())
  axios.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null;
}

axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

// configuration
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api