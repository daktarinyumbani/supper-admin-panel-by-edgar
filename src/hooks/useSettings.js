import { useState } from 'react';

export default function useSettings() {
  const getSettings = () => {
    const theUser = localStorage.getItem('user');
    const userObject = JSON.parse(theUser);
    return userObject;
  };

  const [settings, setSettings] = useState(getSettings());

  const saveSettings = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setSettings(user);
  };

  return {
    setSettings: saveSettings,
    settings
  };
}
