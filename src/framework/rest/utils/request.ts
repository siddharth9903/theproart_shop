import axios from 'axios';
import { getToken } from './get-token';
import Cookies from "js-cookie";
import Router from "next/router";
import { API_ENDPOINTS } from './endpoints';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT, // TODO: take this api URL from env
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Change request data/error here
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ''}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//imported from admin http interceptor

// Change response data/error here
// request.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (
//       (error.response && error.response.status === 401) ||
//       (error.response && error.response.status === 403) ||
//       (error.response &&
//         error.response.data.message === 'THEPROART_ERROR.NOT_AUTHORIZED')
//     ) {
//       Cookies.remove('auth_token');
//       Router.push('login');
//     }
//     return Promise.reject(error);
//   }
// );

export default request;
