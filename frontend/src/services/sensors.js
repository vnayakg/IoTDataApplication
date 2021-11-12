import http from './http';

const route = '/sensors';

function getAllSensors() {
  return http.get(route);
}

function getSensor(sensorType) {
  return http.get(`${route}/${sensorType}`);
}

function addNewSensor(sensor) {
  return http.post(route, sensor);
}

function editSensor(sensorType, sensorDetails) {
  return http.put(`${route}/${sensorType}`, sensorDetails);
}

function deleteSensor(sensorType) {
  return http.delete(`${route}/${sensorType}`);
}

const methods = {
  getAllSensors,
  getSensor,
  addNewSensor,
  editSensor,
  deleteSensor,
};
export default methods;
