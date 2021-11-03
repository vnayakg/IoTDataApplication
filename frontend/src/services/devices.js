import http from './http';

const route = '/devices';

function getAllDevices() {
  return http.get(route);
}

function getDevice(deviceType) {
  return http.get(`${route}/${deviceType}`);
}

function addNewDevice(device) {
  return http.post(route, device);
}

function editDevice(deviceType, deviceDetails) {
  return http.put(`${route}/${deviceType}`, deviceDetails);
}

function deleteDevice(deviceType) {
  return http.delete(`${route}/${deviceType}`);
}

const methods = { getAllDevices };
export default methods;
