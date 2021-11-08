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

function getUserDevices(){
  return http.get(`${route}/userdevices`)
}

const methods = { getAllDevices, getUserDevices };
export default methods;
