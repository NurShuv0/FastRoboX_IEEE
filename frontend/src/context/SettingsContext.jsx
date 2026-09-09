import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '../services/api';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  const getSetting = (key, fallback = '') => {
    const val = settings[key];
    return (val !== undefined && val !== null && val !== '') ? val : fallback;
  };

  const hasSetting = (key) => {
    const val = settings[key];
    return val !== undefined && val !== null && val !== '';
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, getSetting, hasSetting, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
