import axios from 'axios';
import { toast } from 'react-toastify';

import authToken from './authToken';

const apiUrl = 'http://localhost:5000';

const instance = axios.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use((config) => {
  config.headers = { 'x-auth-token': authToken.getToken() };
  return config;
});

instance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
    toast.error('An unexpected error occuered');
  }

  console.log(error);

  return Promise.reject(error);
});

const methods = {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
};

export default methods;
