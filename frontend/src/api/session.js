import axios from 'axios';

export const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const key = 'clinic-session';
export function currentSession() {
  try {return JSON.parse(sessionStorage.getItem(key) || 'null');} catch {return null;}
}
export function clearSession() {sessionStorage.removeItem(key);}

axios.interceptors.request.use(config => {
  const session = currentSession();
  if (session?.token && String(config.url).startsWith(`${API_BASE}/api/`)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});
axios.interceptors.response.use(response => {
  if (response.data?.token && String(response.config.url).startsWith(`${API_BASE}/api/`) && String(response.config.url).endsWith('/login')) {
    sessionStorage.setItem(key, JSON.stringify({token:response.data.token, role:response.data.role, user:{...response.data,token:undefined}}));
  }
  return response;
}, error => {
  if (error.response?.status === 401 && !String(error.config?.url).endsWith('/login')) clearSession();
  return Promise.reject(error);
});
