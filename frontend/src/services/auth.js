import http from './http';

const route = '/auth';

function login({ username, password }) {
  return http.post(`${route}/login`, { username, password });
}

function logout() {
  return http.post(`${route}/logout`);
}

const methods = { login, logout };
export default methods;
