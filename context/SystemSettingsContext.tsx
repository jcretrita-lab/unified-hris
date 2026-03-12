import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RankStructureConfig, defaultRankStructureConfig } from '../types';

// 1. Define what the context will hold
interface SystemSettingsContextType {
  rankConfig: RankStructureConfig;
  setRankConfig: (config: RankStructureConfig) => void;
}

// 2. Create the Context
const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

// 3. Create the Provider
export const SystemSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rankConfig, setRankConfig] = useState<RankStructureConfig>(defaultRankStructureConfig);

  return (
    <SystemSettingsContext.Provider value={{ rankConfig, setRankConfig }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

// 4. Create a custom hook for easy access
export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};