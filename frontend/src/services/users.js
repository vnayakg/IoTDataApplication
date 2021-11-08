import http from './http';

const route = '/users';

function register(data) {
  //console.log(data)
  return http.post(`${route}/register`, data);
}

function reset() {
  return http.post(`${route}/reset`);
}

function update() {
    return http.post(`${route}/update`);
}

function getChildren(){
  return http.get(`${route}/children`)
}

const methods = { register, reset, update, getChildren };
export default methods;
