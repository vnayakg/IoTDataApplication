import http from './http';

const route = '/assign';

function assignDevice(data) {
  return http.post(`${route}/device`, data);
}

function removeDevices(data) {
  return http.delete(`${route}/device`, { data });
}

function assignParent(data) {
  return http.post(`${route}/parent`, data);
}

const methods = { assignDevice, removeDevices, assignParent };
export default methods;
