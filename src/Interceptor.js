/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const isACMEDomain = (url) =>
  /^([^/]+:)?\/{2,3}[^/]+?(\.ACME\.com|\.acme)(:|\/|$)/i.test(url);

function Interceptor() {
  const [errorInterceptor, setErrorInterceptor] = useState(undefined);
  const [authInterceptor, setAuthInterceptor] = useState(undefined);

  const token = window.localStorage.getItem('token');

  const addAuthInterceptor = () => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          if (!config.headers) config.headers = {};
          if (!config.headers.Authorization)
            config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('No token found');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    setAuthInterceptor(interceptor);
  };

  const removeAuthInterceptor = () => {
    axios.interceptors.request.eject(authInterceptor);
    setAuthInterceptor(undefined);
  };

  const addErrorInterceptor = () => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const code = error.response.status;
          if (code === 401) {
            // handle logout or redirect to login
          }
        }
        return Promise.reject(error);
      }
    );
    setErrorInterceptor(interceptor);
  };

  const removeErrorInterceptor = () => {
    axios.interceptors.response.eject(errorInterceptor);
    setErrorInterceptor(undefined);
  };

  useEffect(() => {
    addAuthInterceptor();
    addErrorInterceptor();

    return () => {
      removeAuthInterceptor();
      removeErrorInterceptor();
    };
  }, []);

  return <></>;
}

export default Interceptor;
