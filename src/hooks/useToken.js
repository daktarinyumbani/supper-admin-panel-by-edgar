import { useState } from 'react';

export default function useToken() {
  const getToken = () => localStorage.getItem('token') || null;

  const [token, setToken] = useState(getToken());

  const saveToken = (tokenString) => {
    console.log('Setting the token here:', tokenString);
    localStorage.setItem('token', tokenString);
    setToken(tokenString);
  };

  return {
    setToken: saveToken,
    token
  };
}
