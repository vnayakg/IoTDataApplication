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

  if (!expectedError) toast.error('An unexpected error occuered!');

  if (error.response.status === 401)
    toast.error('Invalid credentials! Please login again.');

  if (error.response.status === 403)
    toast.error('You do not have access to this resource');

  console.log(error.response);

  return Promise.reject(error);
});

const methods = {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
};

export default methods;
