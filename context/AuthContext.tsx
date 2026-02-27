
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    // SIMULATED AUTHENTICATION LOGIC
    // In a real app, this would verify credentials against a backend
    
    // 1. Superadmin
    if (email === 'admin@company.com') {
      setUser({
        id: 'admin-1',
        name: 'Alex Thompson',
        email,
        role: 'Superadmin',
        permissions: ['all_access']
      });
      return true;
    } 
    
    // 2. HR Admin (Broad access, except critical system config)
    else if (email === 'hradmin@company.com') {
      setUser({
        id: 'hr-1',
        name: 'Sarah Wilson',
        email,
        role: 'HR Admin',
        permissions: ['manage_employees', 'manage_payroll', 'manage_attendance', 'manage_approvals']
      });
      return true;
    }

    // 3. HR Payroll Personnel (Focused on Money)
    else if (email === 'payroll@company.com') {
      setUser({
        id: 'pay-1',
        name: 'Mike Brown',
        email,
        role: 'HR Payroll Personnel',
        permissions: ['manage_payroll', 'view_reports']
      });
      return true;
    }

    // 4. HR Attendance Personnel (Focused on Time)
    else if (email === 'attendance@company.com') {
      setUser({
        id: 'att-1',
        name: 'Emily Davis',
        email,
        role: 'HR Attendance Personnel',
        permissions: ['manage_attendance', 'manage_shifts']
      });
      return true;
    }

    // 5. Approver (Focused on Tasks)
    else if (email === 'approver@company.com') {
      setUser({
        id: 'app-1',
        name: 'Robert Chen',
        email,
        role: 'Approver',
        permissions: ['manage_approvals']
      });
      return true;
    }

    // 6. HR Recruiter (Focused on People)
    else if (email === 'recruiter@company.com') {
      setUser({
        id: 'rec-1',
        name: 'Alice Guo',
        email,
        role: 'HR Recruiter',
        permissions: ['manage_employees', 'view_org_structure']
      });
      return true;
    }

    // 7. Employee (Standard View)
    else if (email === 'jane@company.com' || email === 'jane@gmail.com') {
      setUser({
        id: 'emp-jane',
        name: 'Jane Doe',
        email,
        role: 'Employee',
        employeeId: '0192823', // Matches mock data ID
        permissions: ['view_own_profile']
      });
      return true;
    }

    // Fallback
    else {
      // Default to employee view for unknown emails for safety
      setUser({
        id: 'guest',
        name: 'Guest User',
        email,
        role: 'Employee',
        permissions: []
      });
      return true;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
