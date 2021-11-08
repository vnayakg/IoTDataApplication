import http from './http';

const route = '/assign';

function assignDevice(data) {
  return http.post(`${route}/device`, data);
}


const methods = { assignDevice };
export default methods;
