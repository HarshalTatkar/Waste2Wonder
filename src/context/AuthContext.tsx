import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  wasteTypes: string[];
  mainGoal: string;
  city?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticated for rich instant demo
  const [userEmail, setUserEmail] = useState<string | null>('alex.rivera@waste2wonder.org');
  const [userName, setUserName] = useState<string | null>('Alex Rivera');

  const login = async (email: string, _pass: string): Promise<boolean> => {
    setUserEmail(email);
    setUserName(email.split('@')[0]);
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setUserEmail(data.email);
    setUserName(data.name);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userName,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
