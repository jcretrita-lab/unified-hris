import { createContext, useContext, useState, ReactNode } from "react";
import { OrganizationStructureConfig, defaultOrgStructureConfig } from "../types";

interface OrganizationContextValue {
  orgLabels: OrganizationStructureConfig;
  updateOrgLabels: (labels: OrganizationStructureConfig) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [orgLabels, setOrgLabels] = useState<OrganizationStructureConfig>(defaultOrgStructureConfig);

  const updateOrgLabels = (labels: OrganizationStructureConfig) => {
    setOrgLabels(labels);
  };

  return (
    <OrganizationContext.Provider value={{ orgLabels, updateOrgLabels }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganization must be used within OrganizationProvider");
  return ctx;
};