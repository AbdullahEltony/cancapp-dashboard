
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  userName: string;
  name: string;
  address: string;
  image: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login for demo - replace with actual API call
      if (email === 'admin@cancapp.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: 'admin@cancapp.com',
          userName: 'admin',
          name: 'CancApp Administrator',
          address: 'Admin Office',
          image: '/placeholder.svg',
          userType: 'admin'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('adminToken', mockToken);
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
