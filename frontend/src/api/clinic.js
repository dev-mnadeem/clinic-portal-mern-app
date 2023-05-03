import axios from 'axios';
import {API_BASE} from './session';

export const roleEndpoints = {patient:'Patients', doctor:'Doctors', lab:'Labs', pharmacy:'Pharmacies', admin:'Admin'};

// The API wraps every request body in {data: ...}; the access layer reads it there.
export async function send(path, data = {}) {
  return (await axios.post(`${API_BASE}/api/${path}`, {data})).data;
}

export async function fetchJson(path) {
  return (await axios.get(`${API_BASE}/api/${path}`)).data;
}

export function errorMessage(error, fallback) {
  const message = error?.response?.data?.error;
  return typeof message === 'string' ? message : fallback;
}
