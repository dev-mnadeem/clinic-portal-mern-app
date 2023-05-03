import axios from 'axios';
import {API_BASE, currentSession, clearSession} from './session';

jest.mock('axios', () => ({interceptors:{request:{use:jest.fn()}, response:{use:jest.fn()}}}));
const requestHandler = axios.interceptors.request.use.mock.calls[0][0];
const responseHandler = axios.interceptors.response.use.mock.calls[0][0];
beforeEach(() => sessionStorage.clear());

test('attaches authentication only to the configured clinic API', () => {
  sessionStorage.setItem('clinic-session', JSON.stringify({token:'local-test-token',role:'patient'}));
  const intercept=requestHandler;
  expect(intercept({url:`${API_BASE}/api/Patients/findbyID`,headers:{}}).headers.Authorization).toBe('Bearer local-test-token');
  expect(intercept({url:'https://example.test/api/Patients/findbyID',headers:{}}).headers.Authorization).toBeUndefined();
});
test('stores a successful login and clears the session on logout', () => {
  const success=responseHandler;
  success({config:{url:`${API_BASE}/api/Patients/login`},data:{token:'local-test-token',role:'patient'}});
  expect(currentSession().role).toBe('patient');
  clearSession();
  expect(currentSession()).toBeNull();
});
test('malformed browser session data is treated as signed out', () => {
  sessionStorage.setItem('clinic-session','invalid json');
  expect(currentSession()).toBeNull();
});
