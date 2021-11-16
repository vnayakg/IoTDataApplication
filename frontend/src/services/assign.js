import http from './http';

const route = '/assign';

function assignDevice(data) {
  return http.post(`${route}/device`, data);
}

function removeDevices(data){
  console.log("this is data", data)
  return http.delete(`${route}/device`, {data})
}

const methods = { assignDevice, removeDevices};
export default methods;
