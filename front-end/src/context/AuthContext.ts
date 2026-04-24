import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);
